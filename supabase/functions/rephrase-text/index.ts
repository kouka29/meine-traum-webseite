import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Kontext = "nachricht" | "leistung" | "wachstumspaket" | "paket" | "allgemein";
type Ton = "professionell" | "locker" | "knapp" | "verkaufsstark";

function buildSystemPrompt(kontext: Kontext, ton: Ton) {
  const base = `Sie sind ein deutscher Werbetexter für ein hochwertiges Webdesign-Studio. Formulieren Sie den folgenden Text neu — klar, konkret, kundenorientiert. KEINE Anführungszeichen, KEINE Floskeln, KEINE Hashtags. Nur den überarbeiteten Text zurückgeben.`;
  const tonHints: Record<Ton, string> = {
    professionell: "Förmliches Sie. Sachlich. Kompetenter Premium-Ton.",
    locker: "Sie-Form, aber zugänglich und sympathisch. Klingt menschlich.",
    knapp: "So kurz wie möglich. Maximal 1-2 Sätze. Direkt auf den Punkt.",
    verkaufsstark: "Nutzen-orientiert, Benefits voranstellen, leichte Verkaufsspannung.",
  };
  const kontextHints: Record<Kontext, string> = {
    nachricht: "Es ist eine persönliche Anrede an den Kunden im Angebot. Max 200 Zeichen.",
    leistung: "Es ist eine Leistungs-Beschreibung. Was bekommt der Kunde konkret? Max 200 Zeichen.",
    wachstumspaket: "Es ist die Beschreibung eines optionalen Upsell-Pakets. Max 250 Zeichen.",
    paket: "Es ist die Beschreibung eines Angebots-Pakets (z.B. Starter, Pro). Max 200 Zeichen.",
    allgemein: "Max 250 Zeichen.",
  };
  return `${base}\nTon: ${tonHints[ton]}\nKontext: ${kontextHints[kontext]}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!ADMIN_PASSWORD || !LOVABLE_API_KEY) {
      return json({ error: "Server nicht konfiguriert" }, 500);
    }

    const body = await req.json().catch(() => null) as {
      password?: string; text?: string; kontext?: Kontext; ton?: Ton;
    } | null;

    if (!body || body.password !== ADMIN_PASSWORD) return json({ error: "Unauthorized" }, 401);
    const text = (body.text || "").trim();
    if (!text) return json({ error: "text fehlt" }, 400);
    if (text.length > 2000) return json({ error: "text zu lang (max 2000 Zeichen)" }, 400);

    const kontext: Kontext = body.kontext ?? "allgemein";
    const ton: Ton = body.ton ?? "professionell";

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: buildSystemPrompt(kontext, ton) },
          { role: "user", content: `Originaltext:\n${text}\n\nGeben Sie NUR den überarbeiteten Text zurück.` },
        ],
      }),
    });

    if (resp.status === 429) return json({ error: "Rate Limit. Bitte kurz warten." }, 429);
    if (resp.status === 402) return json({ error: "Lovable AI Guthaben erschöpft." }, 402);
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return json({ error: "KI konnte den Text nicht überarbeiten." }, 500);
    }
    const data = await resp.json();
    const result: string = (data?.choices?.[0]?.message?.content || "").trim().replace(/^["„'»]+|["„'«»]+$/g, "");
    if (!result) return json({ error: "Keine Antwort erhalten." }, 422);
    return json({ text: result });
  } catch (e) {
    console.error("rephrase-text error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}