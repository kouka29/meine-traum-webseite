import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!ADMIN_PASSWORD || !LOVABLE_API_KEY) return json({ error: "Server nicht konfiguriert" }, 500);

    const body = await req.json().catch(() => null) as {
      password?: string; title?: string; category?: string; result?: string; current?: string;
    } | null;
    if (!body || body.password !== ADMIN_PASSWORD) return json({ error: "Ungültiges Passwort" }, 401);

    const title = (body.title || "").trim();
    const category = (body.category || "").trim();
    const result = (body.result || "").trim();
    const current = (body.current || "").trim();
    if (!title) return json({ error: "Titel fehlt" }, 400);

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

    const user = `Projekt-Titel: ${title}
Kategorie/Branche: ${category || "—"}
Ergebnis/Kennzahl: ${result || "—"}${current ? `\n\nBisheriger Text (Stil/Wortwahl NICHT wiederholen):\n${current}` : ""}`;

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