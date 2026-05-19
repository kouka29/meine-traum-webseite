import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return json({ error: "Server nicht konfiguriert" }, 500);

    const body = await req.json().catch(() => null) as { id?: string; pin?: string } | null;
    if (!body?.id || !body?.pin) return json({ error: "id und pin erforderlich" }, 400);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from("angebote")
      .select("pin, pdf_path, ablauf_datum")
      .eq("id", body.id)
      .maybeSingle();

    if (error || !data) return json({ error: "Angebot nicht gefunden" }, 404);
    if (data.pin !== body.pin) return json({ error: "Falscher PIN" }, 401);
    if (!data.pdf_path) return json({ error: "Kein PDF hinterlegt" }, 404);

    if (data.ablauf_datum && new Date(data.ablauf_datum).getTime() < Date.now()) {
      return json({ error: "Angebot ist abgelaufen" }, 410);
    }

    const { data: signed, error: signErr } = await supabase.storage
      .from("angebot-uploads")
      .createSignedUrl(data.pdf_path, 60 * 5); // 5 Minuten
    if (signErr || !signed) return json({ error: "PDF konnte nicht bereitgestellt werden" }, 500);

    return json({ url: signed.signedUrl });
  } catch (e) {
    console.error("angebot-pdf error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}