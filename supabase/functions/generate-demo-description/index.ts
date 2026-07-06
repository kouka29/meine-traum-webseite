import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    if (!ADMIN_PASSWORD || typeof body?.password !== "string" || body.password !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { trade, company, existing } = body;
    if (!company || typeof company !== 'string') {
      return new Response(JSON.stringify({ error: 'company required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Verschiedene Stilrichtungen, damit die Demo-Beschreibungen abwechslungsreich klingen
    const angles = [
      { focus: "Mobile-First & Geschwindigkeit", tone: "technisch-präzise", hook: "Ladezeit, Mobiloptimierung, klare Conversion-Pfade" },
      { focus: "Vertrauen & Regionalität", tone: "warm und bodenständig", hook: "lokale Sichtbarkeit, Erfahrung sichtbar machen, Anfragen über Google" },
      { focus: "Conversion-Psychologie", tone: "selbstbewusst und ergebnisorientiert", hook: "starke Call-to-Actions, Social Proof, weniger Reibung" },
      { focus: "Markenwirkung & Premium-Look", tone: "modern und designorientiert", hook: "hochwertige Bildsprache, klare Hierarchie, Premium-Auftritt" },
      { focus: "Storytelling & Leistungsvielfalt", tone: "narrativ-strukturiert", hook: "Leistungen verständlich erklären, Schritt-für-Schritt-Führung" },
      { focus: "Lead-Maschine & Funnel", tone: "pragmatisch-strategisch", hook: "Anfrage-Funnel, qualifizierte Leads, klare Abschlüsse" },
      { focus: "SEO & lokale Auffindbarkeit", tone: "fachlich-kompetent", hook: "Google-Sichtbarkeit, Keywords, regionale Reichweite" },
      { focus: "Kundenerlebnis & UX", tone: "nutzerzentriert", hook: "intuitive Navigation, schnelle Antworten, weniger Absprünge" },
    ];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const openers = ["Modernes Redesign", "Strategischer Relaunch", "Hochwertige Landingpage", "Conversion-fokussierte Website", "Klar strukturierter Webauftritt", "Performance-optimierte Website", "Vertrauensvoller Markenauftritt", "Mobil-optimierte Präsenz"];
    const opener = openers[Math.floor(Math.random() * openers.length)];

    const system = `Du bist Senior Conversion-Copywriter und Webstrategie-Experte für lokale Dienstleister. Schreibe GENAU EINEN deutschen Satz (18–28 Wörter), der eine neu gestaltete Website kurz, präzise und verkaufsstark beschreibt – wie eine Top-Webdesign-Agentur ihr eigenes Projekt vorstellen würde.

ZWINGEND VARIIEREN gegenüber typischen KI-Antworten:
- Beginne NICHT immer mit "Modernes Redesign". Nutze diesen Satzanfang oder eine sinnvolle Variante: "${opener}".
- Inhaltlicher Schwerpunkt dieses Satzes: ${angle.focus}.
- Tonalität: ${angle.tone}.
- Verknüpfe mindestens ein konkretes Branchen-Detail mit einem konkreten Nutzen-Aspekt aus: ${angle.hook}.
- Variiere Satzbau und Wortwahl bewusst – jede Beschreibung soll unverwechselbar klingen.

VERBOTEN:
- Anführungszeichen, Emojis, Firmenname, Anrede ("Sie/Ihr"), Floskeln wie "auf Augenhöhe", "in die digitale Zukunft", "rundum gelungen".
- Doppelte Verwendung der Floskel "klare Struktur, Vertrauen und Conversion-Optimierung" – das ist verbrannt.
- Keine generischen Listen aus drei Substantiven am Satzende.

Liefere NUR den fertigen Satz, ohne Einleitung, ohne Erklärung.`;

    const user = `Branche: ${trade || 'Lokaler Dienstleister'}\nFirma: ${company}${existing ? `\n\nBereits existierende Beschreibungen anderer Demos (Stil/Wortwahl NICHT wiederholen):\n- ${(Array.isArray(existing) ? existing : [existing]).slice(0, 8).join('\n- ')}` : ''}`;

    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        temperature: 1.0,
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: 'Zu viele Anfragen, bitte kurz warten.' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (r.status === 402) return new Response(JSON.stringify({ error: 'AI-Guthaben aufgebraucht.' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      const t = await r.text();
      console.error('AI gateway error', r.status, t);
      return new Response(JSON.stringify({ error: 'AI Fehler' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await r.json();
    let text: string = data?.choices?.[0]?.message?.content?.trim() || '';
    text = text.replace(/^["„»]+|["“«]+$/g, '').trim();
    return new Response(JSON.stringify({ description: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-demo-description error', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});