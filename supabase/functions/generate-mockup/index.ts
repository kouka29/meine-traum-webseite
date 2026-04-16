import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// In-memory brute-force protection per isolate.
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
    const backoff = WINDOW_MS * Math.pow(2, entry.count - MAX_ATTEMPTS);
    entry.lockedUntil = now + backoff;
  }
  failedAttempts.set(ip, entry);
}

function recordSuccess(ip: string) {
  failedAttempts.delete(ip);
}

async function fetchScreenshot(url: string, viewport: { width: number; height: number }): Promise<ArrayBuffer> {
  const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=${viewport.width}&viewport.height=${viewport.height}&viewport.deviceScaleFactor=1`;

  const res = await fetch(apiUrl, {
    headers: { "Accept": "image/png" },
  });

  if (!res.ok) {
    // Try without embed to get JSON response
    const fallbackUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=${viewport.width}&viewport.height=${viewport.height}&viewport.deviceScaleFactor=1`;
    const fallbackRes = await fetch(fallbackUrl);
    if (!fallbackRes.ok) {
      throw new Error(`Screenshot API error: ${fallbackRes.status} ${fallbackRes.statusText}`);
    }
    const data = await fallbackRes.json();
    const screenshotUrl = data?.data?.screenshot?.url;
    if (!screenshotUrl) {
      throw new Error("No screenshot URL in API response");
    }
    const imgRes = await fetch(screenshotUrl);
    if (!imgRes.ok) {
      throw new Error(`Failed to fetch screenshot image: ${imgRes.status}`);
    }
    return imgRes.arrayBuffer();
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.startsWith("image/")) {
    return res.arrayBuffer();
  }

  const data = await res.json();
  const screenshotUrl = data?.data?.screenshot?.url;
  if (!screenshotUrl) {
    throw new Error("No screenshot URL in API response");
  }
  const imgRes = await fetch(screenshotUrl);
  if (!imgRes.ok) {
    throw new Error(`Failed to fetch screenshot image: ${imgRes.status}`);
  }
  return imgRes.arrayBuffer();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
  if (!ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "ADMIN_PASSWORD not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    const { password, url, projectId } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      recordFailure(ip);
      return new Response(JSON.stringify({ error: "Ungültiges Passwort" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recordSuccess(ip);

    if (!url || !projectId) {
      return new Response(JSON.stringify({ error: "URL und Projekt-ID erforderlich" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch desktop and mobile screenshots in parallel
    const [desktopBlob, mobileBlob] = await Promise.all([
      fetchScreenshot(url, { width: 1280, height: 800 }),
      fetchScreenshot(url, { width: 375, height: 812 }),
    ]);

    const desktopPath = `${projectId}/desktop-${Date.now()}.png`;
    const mobilePath = `${projectId}/mobile-${Date.now()}.png`;

    const [desktopUpload, mobileUpload] = await Promise.all([
      supabase.storage.from("mockups").upload(desktopPath, new Uint8Array(desktopBlob), {
        contentType: "image/png", upsert: true,
      }),
      supabase.storage.from("mockups").upload(mobilePath, new Uint8Array(mobileBlob), {
        contentType: "image/png", upsert: true,
      }),
    ]);

    if (desktopUpload.error) throw desktopUpload.error;
    if (mobileUpload.error) throw mobileUpload.error;

    const { data: desktopUrlData } = supabase.storage.from("mockups").getPublicUrl(desktopPath);
    const { data: mobileUrlData } = supabase.storage.from("mockups").getPublicUrl(mobilePath);

    const { error: updateError } = await supabase
      .from("portfolio_projects")
      .update({
        mockup_desktop_url: desktopUrlData.publicUrl,
        mockup_mobile_url: mobileUrlData.publicUrl,
      })
      .eq("id", projectId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({
      mockup_desktop_url: desktopUrlData.publicUrl,
      mockup_mobile_url: mobileUrlData.publicUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
