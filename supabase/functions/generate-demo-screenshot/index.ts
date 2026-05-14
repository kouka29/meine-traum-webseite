import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 60_000;

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
}
function checkRateLimit(ip: string) {
  const now = Date.now();
  const e = failedAttempts.get(ip);
  if (e && e.lockedUntil > now) return { allowed: false, retryAfter: Math.ceil((e.lockedUntil - now) / 1000) };
  return { allowed: true as const };
}
function recordFailure(ip: string) {
  const now = Date.now();
  const e = failedAttempts.get(ip);
  if (!e || e.lockedUntil < now - WINDOW_MS) { failedAttempts.set(ip, { count: 1, lockedUntil: 0 }); return; }
  e.count += 1;
  if (e.count >= MAX_ATTEMPTS) e.lockedUntil = now + WINDOW_MS * Math.pow(2, e.count - MAX_ATTEMPTS);
  failedAttempts.set(ip, e);
}
function recordSuccess(ip: string) { failedAttempts.delete(ip); }

// CSS, das alle gängigen Cookie-/Consent-Banner ausblendet
const HIDE_CSS = `
[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],
[id*="cmp" i],[class*="cmp" i],[id*="gdpr" i],[class*="gdpr" i],
#usercentrics-root,#uc-banner-modal,.CybotCookiebotDialog,#CybotCookiebotDialog,
#onetrust-banner-sdk,#onetrust-consent-sdk,.cc-window,.cookiefirst-root,
#klaro,.klaro,.cookie-notice,.cky-consent-container,#hs-eu-cookie-confirmation,
div[aria-label*="cookie" i],div[role="dialog"][aria-modal="true"]
{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}
html,body{overflow:auto!important;}
`.trim();

async function fetchScreenshot(url: string): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    "viewport.width": "1280",
    "viewport.height": "800",
    "viewport.deviceScaleFactor": "1",
    waitUntil: "networkidle0",
    "screenshot.styles": HIDE_CSS,
    "screenshot.type": "png",
  });
  const apiUrl = `https://api.microlink.io?${params.toString()}`;
  const res = await fetch(apiUrl, { headers: { Accept: "image/png" } });

  if (res.ok) {
    const ct = res.headers.get("content-type") || "";
    if (ct.startsWith("image/")) return await res.arrayBuffer();
    const data = await res.json();
    const u = data?.data?.screenshot?.url;
    if (!u) throw new Error("Kein Screenshot in API-Antwort");
    const r = await fetch(u);
    if (!r.ok) throw new Error(`Screenshot-Download fehlgeschlagen (${r.status})`);
    return r.arrayBuffer();
  }

  // Fallback ohne embed
  params.delete("embed");
  const fb = await fetch(`https://api.microlink.io?${params.toString()}`);
  if (!fb.ok) throw new Error(`Screenshot-API Fehler: ${fb.status}`);
  const data = await fb.json();
  const u = data?.data?.screenshot?.url;
  if (!u) throw new Error("Kein Screenshot in API-Antwort");
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Screenshot-Download fehlgeschlagen (${r.status})`);
  return r.arrayBuffer();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!ADMIN_PASSWORD || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Server nicht konfiguriert" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return new Response(JSON.stringify({ error: "Zu viele Versuche, bitte später erneut." }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(rate.retryAfter ?? 60) },
    });
  }

  try {
    const { password, url } = await req.json();
    if (!password || password !== ADMIN_PASSWORD) {
      recordFailure(ip);
      return new Response(JSON.stringify({ error: "Ungültiges Passwort" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recordSuccess(ip);

    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "URL erforderlich" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    const buffer = await fetchScreenshot(normalized);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const path = `screenshots/demo-${Date.now()}.png`;
    const up = await supabase.storage.from("vorschau-demos").upload(path, new Uint8Array(buffer), {
      contentType: "image/png", upsert: true,
    });
    if (up.error) throw up.error;
    const { data: pub } = supabase.storage.from("vorschau-demos").getPublicUrl(path);

    return new Response(JSON.stringify({ image_url: pub.publicUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unbekannter Fehler";
    console.error("generate-demo-screenshot:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});