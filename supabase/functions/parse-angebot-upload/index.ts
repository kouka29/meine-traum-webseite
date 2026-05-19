import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `Sie sind ein Experte für das Auslesen von Angeboten und Kostenvoranschlägen.
Extrahieren Sie aus dem hochgeladenen Dokument alle relevanten Informationen für ein Web-Angebot.
Antworten Sie ausschließlich über das bereitgestellte Tool. Wenn ein Feld nicht eindeutig vorhanden ist, lassen Sie es weg / null.
Beträge immer in EUR als reine Zahl (kein Währungssymbol, kein Tausenderpunkt).

WICHTIG zu PAKETEN:
- Wenn das Dokument MEHRERE Pakete als Alternativen vorschlägt (z.B. "Starter", "Pro", "Premium", "Basis vs Erweitert", "Variante A vs Variante B"), fülle das Feld 'pakete' mit den einzelnen Paketen — jedes mit eigenem Preis, eigenen Leistungen und ggf. eigener Beschreibung. Lasse in diesem Fall das flache 'preis'-Feld und 'leistungen' leer.
- Wenn das Dokument NUR EIN Angebot beschreibt (auch mit Add-ons), fülle 'preis', 'leistungen' und ggf. 'optionen' wie bisher und lasse 'pakete' leer.`;

const TOOL = {
  type: "function",
  function: {
    name: "extract_angebot",
    description: "Extrahiert strukturierte Angebotsdaten aus einem Dokument.",
    parameters: {
      type: "object",
      properties: {
        nachricht: { type: "string", description: "Kurze persönliche Zusammenfassung / Anschreiben (max 200 Zeichen)." },
        preis: { type: "number", description: "Einmaliger Gesamtpreis bzw. Investitionsvolumen in EUR." },
        normalpreis: { type: "number", description: "Optional: ursprünglicher / Normal-Preis falls Rabatt vorhanden." },
        miete_monatlich: { type: "number", description: "Optional: monatliche Miete / Abo in EUR." },
        anzahlung: { type: "number", description: "Optional: Anzahlung in EUR." },
        wachstumspaket_preis: { type: "number", description: "Optional: Preis Wachstumspaket / Upsell in EUR." },
        wachstumspaket_beschreibung: { type: "string", description: "Optional: Kurzbeschreibung Wachstumspaket." },
        pakete: {
          type: "array",
          description: "Mehrere Paket-Alternativen (z.B. Starter/Pro/Premium). NUR setzen, wenn das Dokument explizit Alternativen anbietet zwischen denen der Kunde wählt. Max 3.",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Paket-Name, z.B. 'Starter', 'Pro'." },
              badge: { type: "string", description: "Optional: 'Empfohlen', 'Beliebt', etc." },
              beschreibung: { type: "string", description: "Kurzer Subtext zum Paket." },
              preis: { type: "number" },
              normalpreis: { type: "number" },
              miete_monatlich: { type: "number" },
              anzahlung: { type: "number" },
              leistungen: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    emoji: { type: "string" },
                    titel: { type: "string" },
                    beschreibung: { type: "string" },
                  },
                  required: ["titel"],
                  additionalProperties: false,
                },
              },
              optionen: {
                type: "array",
                description: "Add-ons NUR für dieses Paket.",
                items: {
                  type: "object",
                  properties: {
                    emoji: { type: "string" },
                    titel: { type: "string" },
                    beschreibung: { type: "string" },
                    preis: { type: "number" },
                    preis_typ: { type: "string", enum: ["einmalig", "monatlich"] },
                  },
                  required: ["titel", "preis"],
                  additionalProperties: false,
                },
              },
            },
            required: ["name", "preis"],
            additionalProperties: false,
          },
        },
        optionen: {
          type: "array",
          description: "Optionale Zusatzpositionen / Add-ons (max 4). Positionen, die mit 'optional', 'auf Wunsch', 'Zusatz', 'Add-on' o.ä. markiert sind — NICHT in 'leistungen'.",
          items: {
            type: "object",
            properties: {
              emoji: { type: "string", description: "Passendes Emoji (1 Zeichen)." },
              titel: { type: "string" },
              beschreibung: { type: "string" },
              preis: { type: "number", description: "Preis dieser Option in EUR." },
              preis_typ: { type: "string", enum: ["einmalig", "monatlich"], description: "Standard: einmalig." },
            },
            required: ["titel", "preis"],
            additionalProperties: false,
          },
        },
        leistungen: {
          type: "array",
          description: "Liste der Leistungen / Module (max 6).",
          items: {
            type: "object",
            properties: {
              emoji: { type: "string", description: "Passendes Emoji (1 Zeichen, z.B. 🚀)." },
              titel: { type: "string" },
              beschreibung: { type: "string" },
            },
            required: ["titel"],
            additionalProperties: false,
          },
        },
        faqs: {
          type: "array",
          description: "Optional: häufige Fragen (max 5).",
          items: {
            type: "object",
            properties: {
              frage: { type: "string" },
              antwort: { type: "string" },
            },
            required: ["frage", "antwort"],
            additionalProperties: false,
          },
        },
      },
      additionalProperties: false,
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!ADMIN_PASSWORD || !LOVABLE_API_KEY) {
      return json({ error: "Server nicht konfiguriert" }, 500);
    }

    const body = await req.json().catch(() => null) as {
      password?: string; file_base64?: string; mime_type?: string; extra_text?: string;
    } | null;

    if (!body || body.password !== ADMIN_PASSWORD) {
      return json({ error: "Unauthorized" }, 401);
    }
    if (!body.file_base64 || !body.mime_type) {
      return json({ error: "file_base64 und mime_type erforderlich" }, 400);
    }

    const dataUrl = `data:${body.mime_type};base64,${body.file_base64}`;

    const userContent: Array<Record<string, unknown>> = [
      { type: "text", text: "Bitte lesen Sie das folgende Angebots-Dokument aus und rufen Sie das Tool auf." },
      { type: "image_url", image_url: { url: dataUrl } },
    ];
    if (body.extra_text) {
      userContent.push({ type: "text", text: `Zusätzlicher Kontext: ${body.extra_text}` });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "extract_angebot" } },
      }),
    });

    if (resp.status === 429) return json({ error: "Rate limit erreicht. Bitte kurz warten." }, 429);
    if (resp.status === 402) return json({ error: "Lovable AI Guthaben erschöpft." }, 402);
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return json({ error: "KI konnte das Dokument nicht auslesen." }, 500);
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return json({ error: "Keine Daten extrahiert." }, 422);
    }
    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(call.function.arguments);
    } catch {
      return json({ error: "Konnte KI-Antwort nicht lesen." }, 500);
    }

    return json({ extracted });
  } catch (e) {
    console.error("parse-angebot-upload error", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}