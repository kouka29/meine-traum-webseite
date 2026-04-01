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

  try {
    const { password, url, projectId } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Ungültiges Passwort" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!url || !projectId) {
      return new Response(JSON.stringify({ error: "URL und Projekt-ID erforderlich" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch desktop screenshot (1280px wide)
    const desktopScreenshotUrl = `https://image.thum.io/get/width/1280/crop/800/noanimate/${url}`;
    const mobileScreenshotUrl = `https://image.thum.io/get/width/375/crop/667/noanimate/${url}`;

    const [desktopRes, mobileRes] = await Promise.all([
      fetch(desktopScreenshotUrl),
      fetch(mobileScreenshotUrl),
    ]);

    if (!desktopRes.ok || !mobileRes.ok) {
      return new Response(JSON.stringify({ error: "Screenshot-Dienst nicht erreichbar" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [desktopBlob, mobileBlob] = await Promise.all([
      desktopRes.arrayBuffer(),
      mobileRes.arrayBuffer(),
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

    // Update portfolio project with mockup URLs
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
