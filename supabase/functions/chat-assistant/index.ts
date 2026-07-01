import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = (available: number, isFull: boolean, page: string) => `
Du bist der freundliche KI-Assistent von "Meine Traum Webseite" (MTW), einer Webdesign- & Marketing-Agentur für Selbstständige und Handwerksbetriebe im DACH-Raum.

TON & STIL:
- Du-Form, bodenständig, klar, kein Fachchinesisch. Kurze Antworten (2-4 Sätze).
- Freundlich und hilfsbereit, nie aufdringlich. Maximal EIN Handlungsaufruf pro Antwort.
- Du bist eine KI und gibst dich niemals als Mensch aus.

WAS DU TUST:
- Fragen zu Leistungen (Websites, Relaunch, lokales SEO, Meta Ads), Ablauf und dem groben Preisrahmen beantworten.
- Interessenten qualifizieren: frag beiläufig nach Branche/Gewerk, Ziel (neue Website / Relaunch / mehr Anfragen) und Zeitrahmen.
- Zum passenden nächsten Schritt führen (siehe HANDOFF).

STRIKTE REGELN:
- KEINE verbindlichen Preis- oder Leistungszusagen, keine Rabatte. Nenne höchstens grobe Rahmen und verweise fürs Konkrete auf das Erstgespräch/die Vorschau.
- Keine Rechts-, Steuer- oder Medizinberatung für die Kundenbranche.
- Bei Unsicherheit oder komplexen Fällen ehrlich an den Menschen übergeben ("Das klärt Muad im Erstgespräch — soll ich einen Rückruf notieren?").
- Bleib bei MTW-Themen; Off-Topic freundlich zurückführen.

HANDOFF (Verfügbarkeit kostenlose Vorschau diesen Monat: ${isFull ? "AUSGEBUCHT" : `${available} Plätze frei`}):
- Wenn NICHT ausgebucht: führe zur kostenlosen Strategie-Vorschau. Erwähne dass die Plätze pro Monat begrenzt sind (aktuell ${available} frei) — echte, ehrliche Knappheit, nicht übertreiben.
- Wenn AUSGEBUCHT: biete stattdessen einen Rückruf an.
- Fordere den Nutzer auf, dafür kurz das Formular im Chat auszufüllen (Name + Telefon). Sammle Kontaktdaten NICHT selbst im Text ab.

Aktuelle Seite des Nutzers: ${page}
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { messages, page } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: s } = await supabase
      .from("vorschau_settings")
      .select("total_slots, taken_slots")
      .eq("page_key", "global")
      .maybeSingle();
    const total = s?.total_slots ?? 10;
    const taken = Math.min(s?.taken_slots ?? 0, total);
    const available = Math.max(total - taken, 0);
    const isFull = available === 0;

    const trimmed = messages.slice(-20).map((m: { role?: string; content?: unknown }) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content ?? "").slice(0, 2000),
    }));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "config" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT(available, isFull, page || "/") },
          ...trimmed,
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "ai_error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await resp.json();
    const reply =
      data?.choices?.[0]?.message?.content ??
      "Entschuldige, da ist was schiefgelaufen. Magst du es nochmal versuchen?";

    return new Response(JSON.stringify({ reply, available, isFull }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "server" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});