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

// Injected into the page before screenshot — removes common consent overlays
// and re-enables scrolling so the real content is visible.
const CLEANUP_SCRIPT = `(() => {
  try {
    const sels = [
      '#BorlabsCookieBox','.brlbs-cmpnt-container','#cookie-notice','.cookie-banner',
      '.cmplz-cookiebanner','#usercentrics-root','#uc-banner','.cc-window',
      '.iubenda-cs-container','#CybotCookiebotDialog','#onetrust-banner-sdk',
      '#onetrust-consent-sdk','.osano-cm-window','#klaro','.klaro',
      '[id*="cookie" i][class*="banner" i]','[class*="cookie" i][class*="banner" i]',
      '[id*="consent" i]','[class*="consent" i]','[class*="overlay" i][class*="cookie" i]'
    ];
    document.querySelectorAll(sels.join(',')).forEach(el => el.remove());
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.position = 'static';
  } catch (e) {}
})();`;

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
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD || typeof body?.password !== "string" || body.password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
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
        : 4500;
    const viewportHeight =
      typeof body?.viewportHeight === "number" &&
      body.viewportHeight >= 600 &&
      body.viewportHeight <= 4000
        ? Math.floor(body.viewportHeight)
        : 900;
    const fullPage = body?.fullPage === false ? false : true; // default true
    const scrollBefore = body?.scrollBefore === true;
    const retina = body?.retina !== false; // default true
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
    const path = `auto/v5/${key}.jpg`;

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
        .list("auto/v5", { search: `${key}.jpg`, limit: 1 });
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
      "#onetrust-banner-sdk",
      "#onetrust-consent-sdk",
      ".osano-cm-window",
    ].join(",");
    const hideParam = extraHide ? `${defaultHide},${extraHide}` : defaultHide;

    // Fetch screenshot via Microlink (with a lighter retry on timeout)
    const buildApiUrl = (opts: {
      waitUntil: string;
      waitForTimeout: number;
      height: number;
      scale: number;
      full: boolean;
      scroll: boolean;
    }) => {
      let u =
        `https://api.microlink.io/?screenshot=true&meta=false&type=jpeg&fullPage=${opts.full}` +
        `&waitUntil=${opts.waitUntil}&waitForTimeout=${opts.waitForTimeout}` +
        `&viewport.width=1440&viewport.height=${opts.height}&viewport.deviceScaleFactor=${opts.scale}` +
        (opts.scroll ? `&scroll=true` : ``) +
        `&hide=${encodeURIComponent(hideParam)}` +
        `&embed=screenshot.url&url=${encodeURIComponent(url)}`;
      if (clickSelector) u += `&click=${encodeURIComponent(clickSelector)}`;
      return u;
    };

    let shotRes = await fetch(
      buildApiUrl({
        waitUntil: "networkidle0",
        waitForTimeout: waitMs,
        height: viewportHeight,
        scale: retina ? 2 : 1,
        full: fullPage,
        scroll: scrollBefore,
      }),
      { headers: { Accept: "image/jpeg" } },
    );
    // Retry once with MORE patience (not less) if upstream timed out
    if (!shotRes.ok && (shotRes.status === 504 || shotRes.status === 408 || shotRes.status === 502)) {
      shotRes = await fetch(
        buildApiUrl({
          waitUntil: "load",
          waitForTimeout: Math.min(waitMs + 4000, 15000),
          height: viewportHeight,
          scale: 1,
          full: true,
          scroll: scrollBefore,
        }),
        { headers: { Accept: "image/jpeg" } },
      );
    }
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