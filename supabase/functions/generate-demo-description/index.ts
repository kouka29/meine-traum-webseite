import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { trade, company } = await req.json();
    if (!company || typeof company !== 'string') {
      return new Response(JSON.stringify({ error: 'company required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const system = `Du bist Senior Conversion-Copywriter für lokale Dienstleister-Websites. Schreibe GENAU EINEN deutschen Satz (15–25 Wörter), der eine neu gestaltete Website kurz und verkaufsstark beschreibt. Stil: sachlich-professionell, mit Branchenbezug, Vertrauen und Conversion-Nutzen (z.B. mehr Anfragen, Sichtbarkeit, klare Struktur). KEINE Anführungszeichen, KEINE Emojis, KEIN Firmenname, KEINE Anrede. Beispielstil: "Modernes Redesign für einen Malerbetrieb mit Fokus auf klare Struktur, Vertrauen und Conversion-Optimierung zur Steigerung von Kundenanfragen."`;
    const user = `Branche: ${trade || 'Lokaler Dienstleister'}\nFirma: ${company}`;

    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
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