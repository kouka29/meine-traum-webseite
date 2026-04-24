import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory brute-force protection (per isolate). Tracks failed admin password
// attempts per IP and applies exponential back-off after repeated failures.
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (entry && entry.lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  }
  return { allowed: true };
}

function recordFailure(ip: string) {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.lockedUntil < now - WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, lockedUntil: 0 });
    return;
  }
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    // Exponential back-off: 60s, 120s, 240s, ...
    const backoff = WINDOW_MS * Math.pow(2, entry.count - MAX_ATTEMPTS);
    entry.lockedUntil = now + backoff;
  }
  failedAttempts.set(ip, entry);
}

function recordSuccess(ip: string) {
  failedAttempts.delete(ip);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
  if (!ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "ADMIN_PASSWORD not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({ error: "Zu viele Fehlversuche. Bitte später erneut versuchen." }),
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Retry-After": String(rate.retryAfter ?? 60),
        },
      },
    );
  }

  try {
    const body = await req.json();
    const { password, action, leadId } = body;

    if (!password || password !== ADMIN_PASSWORD) {
      recordFailure(ip);
      return new Response(JSON.stringify({ error: "Ungültiges Passwort" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recordSuccess(ip);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // =================== SIGNED UPLOAD URL ===================
    // Liefert eine signierte URL, mit der der Browser direkt in den
    // Storage-Bucket hochladen kann. Das vermeidet, dass große Bilder
    // als Base64 durch die Edge Function laufen (Memory-Limit / 546).
    if (action === "get-upload-url") {
      const { bucket, fileName } = body as { bucket?: string; fileName?: string };
      const allowedBuckets = ["portfolio-images", "vorschau-demos"];
      if (!bucket || !allowedBuckets.includes(bucket)) {
        return new Response(JSON.stringify({ error: "Ungültiger Bucket" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const safeName = (fileName || "upload").replace(/[^a-zA-Z0-9._-]/g, "_");
      const ext = safeName.includes(".") ? safeName.split(".").pop() : "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { data: signed, error: signErr } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(path);
      if (signErr || !signed) {
        return new Response(JSON.stringify({ error: signErr?.message || "Upload-URL konnte nicht erstellt werden" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
      return new Response(JSON.stringify({
        path,
        token: signed.token,
        signedUrl: signed.signedUrl,
        publicUrl: publicData.publicUrl,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // =================== LEADS ===================
    if (action === "list") {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return new Response(JSON.stringify({ leads: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete" && leadId) {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Lead-Status setzen / Platz reservieren / freigeben + optionale Bestätigungsmail
    if (action === "update-lead-status" && leadId) {
      const { newStatus, sendEmail } = body as {
        newStatus?: "new" | "qualified" | "rejected" | "customer";
        sendEmail?: boolean;
      };
      if (!newStatus || !["new", "qualified", "rejected", "customer"].includes(newStatus)) {
        return new Response(JSON.stringify({ error: "Ungültiger Status" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existing, error: fetchErr } = await supabase
        .from("leads")
        .select("id, first_name, email, status, slot_reserved")
        .eq("id", leadId)
        .maybeSingle();
      if (fetchErr || !existing) {
        return new Response(JSON.stringify({ error: "Lead nicht gefunden" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = { status: newStatus };
      const wasReserved = !!existing.slot_reserved;
      const shouldReserve = newStatus === "qualified" || newStatus === "customer";

      if (shouldReserve && !wasReserved) {
        updates.slot_reserved = true;
        await supabase.rpc("increment_taken_slot");
      } else if (!shouldReserve && wasReserved) {
        updates.slot_reserved = false;
        await supabase.rpc("decrement_taken_slot");
      }

      const { data: updated, error: updateErr } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", leadId)
        .select()
        .single();
      if (updateErr) throw updateErr;

      // Optionale Bestätigungsmail bei Qualifizierung
      if (sendEmail && newStatus === "qualified" && existing.email) {
        try {
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "lead-qualified",
              recipientEmail: existing.email,
              idempotencyKey: `lead-qualified-${leadId}`,
              templateData: { firstName: existing.first_name },
            },
          });
        } catch (e) {
          console.error("Fehler beim Versand der Qualifizierungs-Mail", e);
        }
      }

      return new Response(JSON.stringify({ lead: updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "analytics") {
      // Nur die wirklich benötigten Spalten laden – user_agent (bis 1KB pro Zeile)
      // wird hier nicht ausgewertet und kann den Worker-Speicher sprengen.
      // Hartes Limit zusätzlich als Sicherheitsnetz.
      const { data: pageViews, error: pvError } = await supabase
        .from("page_views")
        .select("page_path, referrer, device_type, timezone, created_at")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (pvError) throw pvError;

      const { count: leadsCount, error: lcError } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });
      if (lcError) throw lcError;

      const views = pageViews || [];
      const totalViews = views.length;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const viewsToday = views.filter(v => new Date(v.created_at) >= today).length;

      const devices: Record<string, number> = {};
      views.forEach(v => {
        const d = v.device_type || "desktop";
        devices[d] = (devices[d] || 0) + 1;
      });

      const pages: Record<string, number> = {};
      views.forEach(v => {
        pages[v.page_path] = (pages[v.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }));

      const sources: Record<string, number> = {};
      views.forEach(v => {
        let source = "Direkt";
        if (v.referrer) {
          try {
            const url = new URL(v.referrer);
            source = url.hostname;
          } catch {
            source = v.referrer.substring(0, 50);
          }
        }
        sources[source] = (sources[source] || 0) + 1;
      });
      const topSources = Object.entries(sources)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([source, count]) => ({ source, count }));

      const hourly = new Array(24).fill(0);
      views.forEach(v => {
        const h = new Date(v.created_at).getHours();
        hourly[h]++;
      });

      const regions: Record<string, number> = {};
      views.forEach(v => {
        const tz = v.timezone || "Unbekannt";
        regions[tz] = (regions[tz] || 0) + 1;
      });
      const topRegions = Object.entries(regions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([region, count]) => ({ region, count }));

      const dailyViews: Record<string, number> = {};
      views.forEach(v => {
        const day = new Date(v.created_at).toISOString().split("T")[0];
        dailyViews[day] = (dailyViews[day] || 0) + 1;
      });
      const dailyData = Object.entries(dailyViews)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-30)
        .map(([date, count]) => ({ date, count }));

      const conversionRate = totalViews > 0 ? ((leadsCount || 0) / totalViews * 100).toFixed(1) : "0";

      return new Response(JSON.stringify({
        analytics: {
          totalViews, viewsToday, leadsCount: leadsCount || 0, conversionRate,
          devices, topPages, topSources, hourly, topRegions, dailyData,
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =================== PORTFOLIO ===================
    if (action === "portfolio-list") {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ projects: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "portfolio-create") {
      const { title, category, description, result, is_visible, image_base64, image_name, external_url, image_url: providedImageUrl } = body;
      if (!title) {
        return new Response(JSON.stringify({ error: "Titel ist erforderlich" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existing } = await supabase
        .from("portfolio_projects")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      let image_url = typeof providedImageUrl === "string" ? providedImageUrl : "";
      if (!image_url && image_base64 && image_name) {
        const bytes = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
        const ext = image_name.split(".").pop() || "jpg";
        const filePath = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(filePath, bytes, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);
        image_url = urlData.publicUrl;
      }

      const { data, error } = await supabase.from("portfolio_projects").insert({
        title, category: category || "", description: description || "",
        result: result || "", image_url, sort_order: nextOrder,
        is_visible: is_visible !== false, external_url: external_url || "",
      }).select().single();
      if (error) throw error;

      return new Response(JSON.stringify({ project: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "portfolio-update") {
      const { projectId, title, category, description, result, is_visible, image_base64, image_name, external_url, image_url: providedImageUrl } = body;
      if (!projectId) {
        return new Response(JSON.stringify({ error: "Projekt-ID fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {};
      if (title !== undefined) updates.title = title;
      if (category !== undefined) updates.category = category;
      if (description !== undefined) updates.description = description;
      if (result !== undefined) updates.result = result;
      if (is_visible !== undefined) updates.is_visible = is_visible;
      if (external_url !== undefined) updates.external_url = external_url;

      if (typeof providedImageUrl === "string" && providedImageUrl) {
        updates.image_url = providedImageUrl;
      } else if (image_base64 && image_name) {
        const bytes = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
        const ext = image_name.split(".").pop() || "jpg";
        const filePath = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(filePath, bytes, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("portfolio-images").getPublicUrl(filePath);
        updates.image_url = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("portfolio_projects")
        .update(updates)
        .eq("id", projectId)
        .select()
        .single();
      if (error) throw error;

      return new Response(JSON.stringify({ project: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "portfolio-delete") {
      const { projectId } = body;
      if (!projectId) {
        return new Response(JSON.stringify({ error: "Projekt-ID fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("portfolio_projects").delete().eq("id", projectId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "portfolio-reorder") {
      const { projects } = body;
      if (!Array.isArray(projects)) {
        return new Response(JSON.stringify({ error: "Projekte-Array fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      for (const p of projects) {
        await supabase.from("portfolio_projects").update({ sort_order: p.sort_order }).eq("id", p.id);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =================== TESTIMONIALS ===================
    if (action === "testimonials-list") {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify({ testimonials: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "testimonials-create") {
      const { name: tName, role: tRole, text: tText, result: tResult, is_visible: tVisible } = body;
      if (!tName || !tText) {
        return new Response(JSON.stringify({ error: "Name und Text sind erforderlich" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: existing } = await supabase
        .from("testimonials")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      const { data, error } = await supabase.from("testimonials").insert({
        name: tName, role: tRole || "", text: tText,
        result: tResult || "", sort_order: nextOrder,
        is_visible: tVisible !== false,
      }).select().single();
      if (error) throw error;

      return new Response(JSON.stringify({ testimonial: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "testimonials-update") {
      const { testimonialId } = body;
      if (!testimonialId) {
        return new Response(JSON.stringify({ error: "Testimonial-ID fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {};
      if (body.name !== undefined) updates.name = body.name;
      if (body.role !== undefined) updates.role = body.role;
      if (body.text !== undefined) updates.text = body.text;
      if (body.result !== undefined) updates.result = body.result;
      if (body.is_visible !== undefined) updates.is_visible = body.is_visible;

      const { data, error } = await supabase
        .from("testimonials")
        .update(updates)
        .eq("id", testimonialId)
        .select()
        .single();
      if (error) throw error;

      return new Response(JSON.stringify({ testimonial: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "testimonials-delete") {
      const { testimonialId } = body;
      if (!testimonialId) {
        return new Response(JSON.stringify({ error: "Testimonial-ID fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("testimonials").delete().eq("id", testimonialId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "testimonials-reorder") {
      const { testimonials } = body;
      if (!Array.isArray(testimonials)) {
        return new Response(JSON.stringify({ error: "Testimonials-Array fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      for (const t of testimonials) {
        await supabase.from("testimonials").update({ sort_order: t.sort_order }).eq("id", t.id);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =================== VORSCHAU SETTINGS ===================
    if (action === "vorschau-get") {
      const [{ data: settings }, { data: demos }, { data: faqs }, { data: portfolio }] = await Promise.all([
        supabase.from("vorschau_settings").select("*").eq("id", 1).single(),
        supabase.from("vorschau_demos").select("*").order("sort_order", { ascending: true }),
        supabase.from("vorschau_faqs").select("*").order("sort_order", { ascending: true }),
        supabase.from("portfolio_projects").select("id,title,category,description,image_url,mockup_desktop_url,external_url,is_visible,sort_order").order("sort_order", { ascending: true }),
      ]);
      return new Response(JSON.stringify({ settings, demos: demos || [], faqs: faqs || [], portfolio: portfolio || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-update-settings") {
      const { settings } = body;
      if (!settings || typeof settings !== "object") {
        return new Response(JSON.stringify({ error: "settings fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Whitelist erlaubter Felder
      const allowed = [
        "total_slots", "taken_slots", "countdown_target", "countdown_mode",
        "hero_badge_text", "hero_h1_line1", "hero_h1_line2", "hero_h1_line3",
        "hero_subheadline", "hero_cta_label", "countdown_label",
        "final_cta_headline", "final_cta_subtext", "final_cta_button",
        "phone_number", "show_countdown", "show_slots", "show_testimonials",
        "show_demos", "show_faq", "show_pain_points", "show_process",
      ];
      const updates: Record<string, unknown> = {};
      for (const k of allowed) {
        if (settings[k] !== undefined) updates[k] = settings[k];
      }
      const { data, error } = await supabase
        .from("vorschau_settings")
        .update(updates)
        .eq("id", 1)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ settings: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-demo-create") {
      const { trade, company, description, is_visible, image_base64, image_name, portfolio_project_id, image_url: providedImageUrl } = body;
      if (!company) {
        return new Response(JSON.stringify({ error: "company ist erforderlich" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: existing } = await supabase
        .from("vorschau_demos").select("sort_order")
        .order("sort_order", { ascending: false }).limit(1);
      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

      let image_url = typeof providedImageUrl === "string" ? providedImageUrl : "";
      if (!image_url && image_base64 && image_name) {
        const bytes = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
        const ext = image_name.split(".").pop() || "jpg";
        const filePath = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("vorschau-demos")
          .upload(filePath, bytes, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("vorschau-demos").getPublicUrl(filePath);
        image_url = urlData.publicUrl;
      }

      const { data, error } = await supabase.from("vorschau_demos").insert({
        trade: trade || "", company, description: description || "",
        image_url, sort_order: nextOrder, is_visible: is_visible !== false,
        portfolio_project_id: portfolio_project_id || null,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ demo: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-demo-update") {
      const { demoId, trade, company, description, is_visible, image_base64, image_name, portfolio_project_id, image_url: providedImageUrl } = body;
      if (!demoId) {
        return new Response(JSON.stringify({ error: "demoId fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updates: Record<string, unknown> = {};
      if (trade !== undefined) updates.trade = trade;
      if (company !== undefined) updates.company = company;
      if (description !== undefined) updates.description = description;
      if (is_visible !== undefined) updates.is_visible = is_visible;
      if (portfolio_project_id !== undefined) updates.portfolio_project_id = portfolio_project_id || null;
      if (typeof providedImageUrl === "string" && providedImageUrl) {
        updates.image_url = providedImageUrl;
      } else if (image_base64 && image_name) {
        const bytes = Uint8Array.from(atob(image_base64), c => c.charCodeAt(0));
        const ext = image_name.split(".").pop() || "jpg";
        const filePath = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("vorschau-demos")
          .upload(filePath, bytes, { contentType: `image/${ext === "jpg" ? "jpeg" : ext}` });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("vorschau-demos").getPublicUrl(filePath);
        updates.image_url = urlData.publicUrl;
      }
      const { data, error } = await supabase.from("vorschau_demos")
        .update(updates).eq("id", demoId).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ demo: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-demo-delete") {
      const { demoId } = body;
      if (!demoId) {
        return new Response(JSON.stringify({ error: "demoId fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("vorschau_demos").delete().eq("id", demoId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-demo-reorder") {
      const { demos } = body;
      if (!Array.isArray(demos)) {
        return new Response(JSON.stringify({ error: "demos-Array fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      for (const d of demos) {
        await supabase.from("vorschau_demos").update({ sort_order: d.sort_order }).eq("id", d.id);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-faq-create") {
      const { question, answer, is_visible } = body;
      if (!question || !answer) {
        return new Response(JSON.stringify({ error: "question und answer erforderlich" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: existing } = await supabase
        .from("vorschau_faqs").select("sort_order")
        .order("sort_order", { ascending: false }).limit(1);
      const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
      const { data, error } = await supabase.from("vorschau_faqs").insert({
        question, answer, sort_order: nextOrder, is_visible: is_visible !== false,
      }).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ faq: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-faq-update") {
      const { faqId, question, answer, is_visible } = body;
      if (!faqId) {
        return new Response(JSON.stringify({ error: "faqId fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updates: Record<string, unknown> = {};
      if (question !== undefined) updates.question = question;
      if (answer !== undefined) updates.answer = answer;
      if (is_visible !== undefined) updates.is_visible = is_visible;
      const { data, error } = await supabase.from("vorschau_faqs")
        .update(updates).eq("id", faqId).select().single();
      if (error) throw error;
      return new Response(JSON.stringify({ faq: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-faq-delete") {
      const { faqId } = body;
      if (!faqId) {
        return new Response(JSON.stringify({ error: "faqId fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("vorschau_faqs").delete().eq("id", faqId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "vorschau-faq-reorder") {
      const { faqs } = body;
      if (!Array.isArray(faqs)) {
        return new Response(JSON.stringify({ error: "faqs-Array fehlt" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      for (const f of faqs) {
        await supabase.from("vorschau_faqs").update({ sort_order: f.sort_order }).eq("id", f.id);
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ungültige Aktion" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
