import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!ADMIN_PASSWORD || !LOVABLE_API_KEY) return json({ error: "Server nicht konfiguriert" }, 500);

    const body = await req.json().catch(() => null) as {
      password?: string; title?: string; category?: string; result?: string; current?: string; url?: string;
    } | null;
    if (!body || body.password !== ADMIN_PASSWORD) return json({ error: "Ungültiges Passwort" }, 401);

    const title = (body.title || "").trim();
    const category = (body.category || "").trim();
    const result = (body.result || "").trim();
    const current = (body.current || "").trim();
    const url = (body.url || "").trim();
    if (!title) return json({ error: "Titel fehlt" }, 400);

    // Optional: Echte Website-Inhalte holen, um die KI zu fundieren
    let siteTitle = "";
    let siteMeta = "";
    let siteText = "";
    if (url && /^https?:\/\//i.test(url)) {
      try {
        const res = await fetch(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(8000),
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; LovableBot/1.0; +https://lovable.dev)",
            "Accept": "text/html,application/xhtml+xml",
          },
        });
        if (res.ok) {
          const html = await res.text();
          const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          siteTitle = (titleMatch?.[1] || "").replace(/\s+/g, " ").trim().slice(0, 200);
          const metaMatch = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*name=["']description["']/i);
          siteMeta = (metaMatch?.[1] || "").replace(/\s+/g, " ").trim().slice(0, 400);
          const cleaned = html
            .replace(/<script[\s\S]*?<\/script>/gi, " ")
            .replace(/<style[\s\S]*?<\/style>/gi, " ")
            .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
            .replace(/<!--[\s\S]*?-->/g, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/&[a-z#0-9]+;/gi, " ")
            .replace(/\s+/g, " ")
            .trim();
          siteText = cleaned.slice(0, 4000);
        }
      } catch (e) {
        console.warn("site fetch failed", url, e instanceof Error ? e.message : e);
      }
    }
    const hasSite = Boolean(siteTitle || siteMeta || siteText);

    const angles = [
      { focus: "Conversion-Psychologie", tone: "selbstbewusst und ergebnisorientiert", hook: "klare Call-to-Actions, Social Proof, weniger Reibung" },
      { focus: "Markenwirkung & Premium-Look", tone: "modern und designorientiert", hook: "hochwertige Bildsprache, klare Hierarchie, Premium-Auftritt" },
      { focus: "Mobile-First & Geschwindigkeit", tone: "technisch-präzise", hook: "Ladezeit, Mobiloptimierung, klare Conversion-Pfade" },
      { focus: "Vertrauen & Regionalität", tone: "warm und bodenständig", hook: "lokale Sichtbarkeit, Erfahrung sichtbar machen, Anfragen über Google" },
      { focus: "Lead-Maschine & Funnel", tone: "pragmatisch-strategisch", hook: "Anfrage-Funnel, qualifizierte Leads, klare Abschlüsse" },
      { focus: "Storytelling & Leistungsvielfalt", tone: "narrativ-strukturiert", hook: "Leistungen verständlich erklären, Schritt-für-Schritt-Führung" },
      { focus: "SEO & lokale Auffindbarkeit", tone: "fachlich-kompetent", hook: "Google-Sichtbarkeit, Keywords, regionale Reichweite" },
      { focus: "Kundenerlebnis & UX", tone: "nutzerzentriert", hook: "intuitive Navigation, schnelle Antworten, weniger Absprünge" },
    ];
    const angle = angles[Math.floor(Math.random() * angles.length)];

    const system = `Sie sind Senior Conversion-Copywriter und Webdesign-Stratege einer Premium-Agentur. Schreiben Sie GENAU EINEN deutschen Satz (18–28 Wörter), der dieses umgesetzte Webdesign-Projekt für eine Portfolio-Karte beschreibt – so, wie eine Top-Agentur ihr eigenes Referenzprojekt vorstellt.

ZWINGEND:
- Inhaltlicher Schwerpunkt: ${angle.focus}.
- Tonalität: ${angle.tone}.
- Verknüpfe ein konkretes Branchen-Detail mit einem Nutzen aus: ${angle.hook}.
- Variiere Satzbau und Wortwahl; klinge unverwechselbar, nicht nach KI-Floskel.

VERBOTEN:
- Anführungszeichen, Emojis, Hashtags, Anrede ("Sie/Ihr"), Firmenname/Titel wörtlich wiederholen.
- Floskeln wie "auf Augenhöhe", "in die digitale Zukunft", "rundum gelungen", "klare Struktur, Vertrauen und Conversion-Optimierung".
- Generische Drei-Substantiv-Aufzählungen am Satzende.

Liefere NUR den fertigen Satz, ohne Einleitung, ohne Erklärung.`;

    const siteBlock = hasSite
      ? `\n\nEchte Website-Inhalte (Faktenbasis, NICHT wörtlich zitieren, keine Markennamen wiederholen):
Titel: ${siteTitle || "—"}
Meta: ${siteMeta || "—"}
Text: ${siteText || "—"}

Beziehe dich auf konkrete dort genannte Leistungen, Branche und Region statt allgemeiner Floskeln.`
      : "";

    const user = `Projekt-Titel: ${title}
Kategorie/Branche: ${category || "—"}
Ergebnis/Kennzahl: ${result || "—"}${current ? `\n\nBisheriger Text (Stil/Wortwahl NICHT wiederholen):\n${current}` : ""}${siteBlock}`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 1.0,
      }),
    });

    if (r.status === 429) return json({ error: "Rate Limit. Bitte kurz warten." }, 429);
    if (r.status === 402) return json({ error: "AI-Guthaben aufgebraucht." }, 402);
    if (!r.ok) {
      const t = await r.text();
      console.error("AI gateway error", r.status, t);
      return json({ error: "KI konnte keine Beschreibung erzeugen." }, 500);
    }
    const data = await r.json();
    let text: string = (data?.choices?.[0]?.message?.content || "").trim();
    text = text.replace(/^["„'»]+|["„'«»]+$/g, "").trim();
    if (!text) return json({ error: "Keine Antwort erhalten." }, 422);
    return json({ description: text });
  } catch (e) {
    console.error("generate-portfolio-description error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}