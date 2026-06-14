import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "info@qkmarketing.de";

interface Position { titel: string; preis: number }

function genAuftragsNr(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AB-${year}-${rand}`;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || "unknown";
}

function safeStr(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function safeNum(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const kunde_vorname = safeStr(body.kunde_vorname, 100);
  const kunde_nachname = safeStr(body.kunde_nachname, 100);
  const kunde_firma = safeStr(body.kunde_firma, 200);
  const kunde_email = safeStr(body.kunde_email, 200);
  const kunde_telefon = safeStr(body.kunde_telefon, 50);
  const angebots_id = safeStr(body.angebots_id, 200) || null;
  const agb_akzeptiert = !!body.agb_akzeptiert;
  const kostenpflichtig_bestaetigt = !!body.kostenpflichtig_bestaetigt;
  const send_copy = body.send_copy === false ? false : true;

  if (!kunde_vorname || !kunde_nachname || !kunde_firma || !kunde_email) {
    return new Response(JSON.stringify({ error: "Pflichtfelder fehlen" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(kunde_email)) {
    return new Response(JSON.stringify({ error: "Ungültige E-Mail" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!agb_akzeptiert || !kostenpflichtig_bestaetigt) {
    return new Response(JSON.stringify({ error: "AGB und kostenpflichtige Bestätigung erforderlich" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const positionsRaw = Array.isArray(body.positions) ? body.positions : [];
  const positions: Position[] = positionsRaw
    .map((p: any) => ({ titel: safeStr(p?.titel, 200), preis: safeNum(p?.preis) }))
    .filter((p) => p.titel && p.preis > 0)
    .slice(0, 30);

  if (positions.length === 0) {
    return new Response(JSON.stringify({ error: "Keine Auftragspositionen" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const netto = positions.reduce((s, p) => s + p.preis, 0);
  const mwst = Math.round(netto * 19) / 100;
  const brutto = Math.round((netto + mwst) * 100) / 100;

  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent")?.slice(0, 500) || "unknown";

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Auftragsnummer (mit kleinem Retry bei Kollision)
  let auftrags_nr = genAuftragsNr();
  let inserted: any = null;
  let lastErr: any = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase.from("buchungen").insert({
      angebots_id,
      angebots_nr: auftrags_nr,
      payment_method: safeStr(body.payment_method, 30) || "rechnung",
      kunde_vorname, kunde_nachname, kunde_firma, kunde_email,
      kunde_telefon: kunde_telefon || null,
      pakete: body.pakete ?? null,
      addons: body.addons ?? null,
      leistungen: positions as unknown as Record<string, unknown>,
      gesamtbetrag_netto: netto,
      mwst, gesamtbetrag_brutto: brutto,
      agb_akzeptiert: true, agb_version: "1.0",
      kostenpflichtig_bestaetigt: true,
      ip_adresse: ip, user_agent: ua,
      status: "neu",
    }).select().single();
    if (!error) { inserted = data; break; }
    lastErr = error;
    if (String(error.message || "").toLowerCase().includes("unique")) {
      auftrags_nr = genAuftragsNr();
      continue;
    }
    break;
  }
  if (!inserted) {
    return new Response(JSON.stringify({ error: lastErr?.message || "Speichern fehlgeschlagen" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // E-Mails — Fehler nicht an Kunden weitergeben
  const gebuchtAm = new Date(inserted.gebucht_am).toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
  const kundeName = `${kunde_vorname} ${kunde_nachname}`.trim();

  const sendMail = async (templateName: string, recipient: string, data: Record<string, unknown>, idemSuffix: string) => {
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName, recipientEmail: recipient,
          idempotencyKey: `${inserted.id}-${idemSuffix}`,
          templateData: data,
        },
      });
      if (error) console.error(`Email ${templateName} -> ${recipient} fehlgeschlagen:`, error);
    } catch (e) {
      console.error(`Email ${templateName} exception:`, e);
    }
  };

  await sendMail("buchung-admin-notification", ADMIN_EMAIL, {
    auftragsNr: auftrags_nr, kundeName, kundeFirma: kunde_firma,
    kundeEmail: kunde_email, kundeTelefon: kunde_telefon,
    positions, netto, mwst, brutto,
    ipAdresse: ip, gebuchtAm, agbVersion: "1.0",
  }, "admin");

  if (send_copy) {
    await sendMail("buchung-kunde-bestaetigung", kunde_email, {
      auftragsNr: auftrags_nr,
      kundeVorname: kunde_vorname, kundeNachname: kunde_nachname,
      positions, netto, mwst, brutto, gebuchtAm,
      buchungId: inserted.id,
    }, "kunde");
  }

  return new Response(JSON.stringify({
    success: true, auftrags_nr, buchung_id: inserted.id,
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});