import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "portfolio-images";

function sanitizeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 100);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Supabase not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    let url = typeof body?.url === "string" ? body.url.trim() : "";
    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url.replace(/^\/+/, "")}`;
    }
    const rawKey = typeof body?.key === "string" ? body.key.trim() : "";
    const projectId =
      typeof body?.projectId === "string" ? body.projectId.trim() : "";
    const force = body?.force === true;
    const waitMs =
      typeof body?.waitMs === "number" && body.waitMs >= 0 && body.waitMs <= 20000
        ? Math.floor(body.waitMs)
        : 3500;
    const extraHide =
      typeof body?.hideSelectors === "string" ? body.hideSelectors.trim() : "";
    const clickSelector =
      typeof body?.clickSelector === "string" ? body.clickSelector.trim() : "";

    if (!url || !rawKey) {
      return new Response(JSON.stringify({ error: "url and key required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return new Response(JSON.stringify({ error: "invalid url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return new Response(JSON.stringify({ error: "only http/https allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = sanitizeKey(rawKey);
    const path = `auto/v3/${key}.jpg`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const writeScreenshotUrl = async (publicUrl: string, touch: boolean) => {
      if (!projectId) return null;
      const updates: Record<string, string> = { screenshot_url: publicUrl };
      if (touch) updates.screenshot_updated_at = new Date().toISOString();
      const { data } = await supabase
        .from("portfolio_projects")
        .update(updates)
        .eq("id", projectId)
        .select("screenshot_updated_at")
        .maybeSingle();
      return data?.screenshot_updated_at ?? null;
    };

    // Cache check — skipped when force=true
    if (!force) {
      const { data: existing } = await supabase.storage
        .from(BUCKET)
        .list("auto/v3", { search: `${key}.jpg`, limit: 1 });
      if (existing && existing.some((f) => f.name === `${key}.jpg`)) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        const ts = await writeScreenshotUrl(data.publicUrl, false);
        return new Response(
          JSON.stringify({
            url: data.publicUrl,
            cached: true,
            screenshot_updated_at: ts,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Default cookie-banner selectors to hide
    const defaultHide = [
      "#BorlabsCookieBox",
      ".brlbs-cmpnt-container",
      "#cookie-notice",
      ".cookie-banner",
      ".cmplz-cookiebanner",
      "#usercentrics-root",
      ".cc-window",
      ".iubenda-cs-container",
      "#CybotCookiebotDialog",
    ].join(",");
    const hideParam = extraHide ? `${defaultHide},${extraHide}` : defaultHide;

    // Fetch screenshot via Microlink
    let apiUrl =
      `https://api.microlink.io/?screenshot=true&meta=false&type=jpeg&fullPage=false` +
      `&waitUntil=networkidle0&waitForTimeout=${waitMs}` +
      `&viewport.width=1000&viewport.height=2400&viewport.deviceScaleFactor=1` +
      `&hide=${encodeURIComponent(hideParam)}` +
      `&embed=screenshot.url&url=${encodeURIComponent(url)}`;
    if (clickSelector) {
      apiUrl += `&click=${encodeURIComponent(clickSelector)}`;
    }
    const shotRes = await fetch(apiUrl, { headers: { Accept: "image/jpeg" } });
    if (!shotRes.ok) {
      return new Response(
        JSON.stringify({ error: `screenshot failed: ${shotRes.status}` }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let imgBuf: ArrayBuffer;
    const ct = shotRes.headers.get("content-type") || "";
    if (ct.startsWith("image/")) {
      imgBuf = await shotRes.arrayBuffer();
    } else {
      const j = await shotRes.json();
      const shotUrl = j?.data?.screenshot?.url || j?.data?.url;
      if (!shotUrl) {
        return new Response(
          JSON.stringify({ error: "no screenshot url in response" }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const imgRes = await fetch(shotUrl);
      if (!imgRes.ok) {
        return new Response(
          JSON.stringify({ error: `image fetch failed: ${imgRes.status}` }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      imgBuf = await imgRes.arrayBuffer();
    }

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, new Uint8Array(imgBuf), {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "31536000",
      });
    if (uploadErr) throw uploadErr;

    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const ts = await writeScreenshotUrl(pub.publicUrl, true);
    return new Response(
      JSON.stringify({
        url: pub.publicUrl,
        cached: false,
        screenshot_updated_at: ts,
        forced: force,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});