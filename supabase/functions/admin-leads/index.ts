import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

  try {
    const body = await req.json();
    const { password, action, leadId } = body;

    if (!password || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Ungültiges Passwort" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // =================== LEADS ===================
    if (action === "list") {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
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

    if (action === "analytics") {
      const { data: pageViews, error: pvError } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false });
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
      const { title, category, description, result, is_visible, image_base64, image_name, external_url } = body;
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

      let image_url = "";
      if (image_base64 && image_name) {
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
      const { projectId, title, category, description, result, is_visible, image_base64, image_name } = body;
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

      if (image_base64 && image_name) {
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
