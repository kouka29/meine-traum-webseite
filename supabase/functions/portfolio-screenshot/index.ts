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
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    const rawKey = typeof body?.key === "string" ? body.key.trim() : "";

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
    const path = `auto/${key}.jpg`;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Cache check
    const { data: existing } = await supabase.storage
      .from(BUCKET)
      .list("auto", { search: `${key}.jpg`, limit: 1 });
    if (existing && existing.some((f) => f.name === `${key}.jpg`)) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return new Response(
        JSON.stringify({ url: data.publicUrl, cached: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch screenshot via Microlink
    const apiUrl = `https://api.microlink.io/?screenshot=true&meta=false&type=jpeg&fullPage=true&waitUntil=networkidle2&viewport.width=1200&viewport.deviceScaleFactor=1&embed=screenshot.url&url=${encodeURIComponent(url)}`;
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
    return new Response(
      JSON.stringify({ url: pub.publicUrl, cached: false }),
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