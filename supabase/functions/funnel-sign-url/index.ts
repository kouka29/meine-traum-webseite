import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Validates that `path` looks like `<uuid>/(logo|fotos)/<timestamp>-<safe-name>`
// so callers can only sign objects that follow the funnel upload convention.
const PATH_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(logo|fotos)\/\d+-[\w.\-]{1,120}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const path = (body as { path?: unknown })?.path;
  if (typeof path !== "string" || !PATH_RE.test(path)) {
    return new Response(JSON.stringify({ error: "invalid path" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "server misconfigured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data, error } = await supabase.storage
    .from("funnel-uploads")
    .createSignedUrl(path, 60 * 60 * 24 * 365);

  if (error || !data) {
    return new Response(JSON.stringify({ error: error?.message ?? "sign failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ url: data.signedUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});