import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "QK Marketing Group <info@meine-traum-webseite.de>";
const ADMIN_EMAIL = "info@meine-traum-webseite.de";

interface Paket {
  name: string;
  preis?: number;
  typ?: "einmalkauf" | "miete";
  mietpreis?: number;
  anzahlung?: number;
  payment_mode?: "kauf" | "miete";
  miete_monatlich?: number | null;
}
interface Addon {
  name: string;
  preis?: number;
  typ?: "monatlich" | "einmalig";
  price_cents?: number;
  price_type?: "monthly" | "one_time";
}

const safeStr = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";
const safeNum = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};
const eur = (n: number) =>
  n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const genAuftragsNr = () =>
  `AB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
const getClientIp = (req: Request) =>
  (req.headers.get("x-forwarded-for")?.split(",")[0].trim()) ||
  req.headers.get("x-real-ip") ||
  req.headers.get("cf-connecting-ip") ||
  "unknown";

// Normalisiert die beiden möglichen Frontend-Formate (Funnel & Upload-Spec)
function normalize(pakete: Paket[], addons: Addon[]) {
  const np = pakete.map((p) => {
    const typ = (p.typ || (p.payment_mode === "miete" ? "miete" : "einmalkauf")) as "einmalkauf" | "miete";
    const mietpreis = safeNum(p.mietpreis ?? p.miete_monatlich ?? 0);
    return {
      name: safeStr(p.name, 200),
      typ,
      preis: safeNum(p.preis),
      mietpreis,
      anzahlung: safeNum(p.anzahlung),
    };
  });
  const na = addons.map((a) => {
    const typ = (a.typ || (a.price_type === "monthly" ? "monatlich" : "einmalig")) as "monatlich" | "einmalig";
    const preis = a.preis != null ? safeNum(a.preis) : safeNum(a.price_cents) / 100;
    return { name: safeStr(a.name, 200), preis, typ };
  });
  return { pakete: np, addons: na };
}

function buildKundenMail(d: {
  vorname: string; nachname: string; auftrags_nr: string;
  pakete: ReturnType<typeof normalize>["pakete"];
  addons: ReturnType<typeof normalize>["addons"];
  netto: number; mwst: number; brutto: number;
}) {
  const rows = [
    ...d.pakete.map((p) => `<tr><td>${p.name} ${p.typ === "miete" ? "(Mietmodell)" : ""}</td><td style="text-align:right">${p.typ === "miete" ? `${eur(p.mietpreis)} €/Monat${p.anzahlung ? ` + ${eur(p.anzahlung)} € Anzahlung` : ""}` : `${eur(p.preis)} €`}</td></tr>`),
    ...d.addons.map((a) => `<tr><td>${a.name}</td><td style="text-align:right">+ ${eur(a.preis)} €${a.typ === "monatlich" ? "/Monat" : ""}</td></tr>`),
  ].join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;background:#F5F4FF}
.container{max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(79,63,240,0.08)}
.header{background:linear-gradient(135deg,#4F3FF0,#7B5EF8);padding:40px;text-align:center}
.header h1{color:#fff;font-size:24px;font-weight:800;margin:0 0 8px}.header p{color:rgba(255,255,255,0.85);font-size:15px;margin:0}
.body{padding:40px}.greeting{font-size:18px;font-weight:600;color:#1E1B4B;margin-bottom:16px}
.text{font-size:15px;color:#6B7280;line-height:1.7;margin-bottom:24px}
.auftrags-nr{background:#F5F4FF;border:1px solid rgba(79,63,240,0.15);border-radius:12px;padding:16px 20px;margin-bottom:32px}
.auftrags-nr span{font-size:13px;color:#6B7280;display:block;margin-bottom:4px}
.auftrags-nr strong{font-size:20px;color:#4F3FF0;font-weight:800}
.table{width:100%;border-collapse:collapse;margin-bottom:24px}
.table th{text-align:left;padding:10px 12px;background:#F5F4FF;color:#6B7280;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase}
.table td{padding:12px;border-bottom:1px solid rgba(79,63,240,0.06);font-size:14px;color:#1E1B4B}
.total-row td{font-weight:700;color:#4F3FF0;font-size:16px;border-top:2px solid rgba(79,63,240,0.15);border-bottom:none;padding-top:16px}
.info-box{background:#F5F4FF;border-radius:12px;padding:20px;margin-bottom:24px}
.info-box p{margin:0 0 8px;font-size:14px;color:#6B7280;line-height:1.6}.info-box p:last-child{margin:0}
.footer{background:#1E1B4B;padding:32px 40px;text-align:center}
.footer p{color:rgba(255,255,255,0.5);font-size:13px;margin:0 0 4px}
.footer a{color:rgba(255,255,255,0.7);text-decoration:none}
</style></head><body><div class="container">
<div class="header"><h1>Auftragsbestätigung</h1><p>QK Marketing Group</p></div>
<div class="body">
<p class="greeting">Sehr geehrte/r ${d.vorname} ${d.nachname},</p>
<p class="text">vielen Dank für Ihren Auftrag. Wir bestätigen den Eingang Ihrer verbindlichen Auftragserteilung und freuen uns auf die Zusammenarbeit.</p>
<div class="auftrags-nr"><span>Ihre Auftrags-Nr.</span><strong>${d.auftrags_nr}</strong></div>
<table class="table"><thead><tr><th>Leistung</th><th style="text-align:right">Betrag</th></tr></thead>
<tbody>${rows}</tbody>
<tfoot>
<tr><td>Nettobetrag</td><td style="text-align:right">${eur(d.netto)} €</td></tr>
<tr><td>zzgl. 19% MwSt.</td><td style="text-align:right">${eur(d.mwst)} €</td></tr>
<tr class="total-row"><td>Gesamtbetrag</td><td style="text-align:right">${eur(d.brutto)} €</td></tr>
</tfoot></table>
<div class="info-box">
<p>📋 <strong>Zahlungsart:</strong> Zahlung per Rechnung</p>
<p>⏱ <strong>Zahlungsziel:</strong> 14 Tage nach Rechnungseingang</p>
<p>🚀 <strong>Nächster Schritt:</strong> Die Rechnung erhalten Sie in Kürze per E-Mail. Die Umsetzung startet nach Zahlungseingang.</p>
<p>📞 <strong>Fragen?</strong> Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
</div>
<p class="text" style="font-size:13px;color:#9CA3AF">
Mit dieser Auftragserteilung haben Sie die AGB der QK Marketing Group (Version 2.0) akzeptiert.
Diese Buchung ist verbindlich und kostenpflichtig. Im B2B-Bereich besteht kein Widerrufsrecht.<br>
Auftrags-Nr: ${d.auftrags_nr} · Datum: ${new Date().toLocaleDateString("de-DE")}
</p></div>
<div class="footer">
<p><strong style="color:#fff">QK Marketing Group</strong></p>
<p>Rheinallee 88 · Gebäude 23 · 55120 Mainz</p>
<p><a href="mailto:info@meine-traum-webseite.de">info@meine-traum-webseite.de</a> · Tel.: 06131 30 765 96</p>
</div></div></body></html>`;
}

function buildAnbieterMail(d: {
  vorname: string; nachname: string; firma: string; email: string; telefon: string;
  auftrags_nr: string;
  pakete: ReturnType<typeof normalize>["pakete"];
  addons: ReturnType<typeof normalize>["addons"];
  netto: number; brutto: number; ip: string; ua: string;
}) {
  const items = [
    ...d.pakete.map((p) => `<li>${p.name} — ${p.typ === "miete" ? `${eur(p.mietpreis)} €/Monat${p.anzahlung ? ` + ${eur(p.anzahlung)} € Anzahlung` : ""}` : `${eur(p.preis)} €`}</li>`),
    ...d.addons.map((a) => `<li>Add-on: ${a.name} — ${eur(a.preis)} €${a.typ === "monatlich" ? "/Monat" : ""}</li>`),
  ].join("");
  const now = new Date().toLocaleString("de-DE");
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#111;padding:20px;max-width:640px;margin:0 auto">
<h2 style="color:#4F3FF0;margin:0 0 16px">🔔 Neue Buchung — ${d.auftrags_nr}</h2>
<p style="color:#6B7280;margin:0 0 24px">${now}</p>
<h3 style="margin:0 0 8px">Kunde</h3>
<p style="margin:0 0 16px">
<strong>${d.vorname} ${d.nachname}</strong><br>
${d.firma}<br>
<a href="mailto:${d.email}">${d.email}</a>${d.telefon ? `<br>Tel.: ${d.telefon}` : ""}
</p>
<h3 style="margin:0 0 8px">Leistungen</h3>
<ul style="margin:0 0 16px;padding-left:20px">${items}</ul>
<p style="margin:0 0 4px"><strong>Netto:</strong> ${eur(d.netto)} €</p>
<p style="margin:0 0 16px"><strong>Brutto:</strong> ${eur(d.brutto)} €</p>
<hr style="border:none;border-top:1px solid #eee;margin:24px 0">
<p style="font-size:12px;color:#6B7280;margin:0">
AGB akzeptiert: <strong>Ja</strong> | Version: 2.0<br>
Kostenpflichtig bestätigt: <strong>Ja</strong><br>
IP-Adresse: ${d.ip}<br>
User-Agent: ${d.ua}
</p></body></html>`;
}

async function sendResend(to: string, subject: string, html: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY not configured");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Resend ${r.status}: ${JSON.stringify(data)}`);
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch {
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

  const paketeRaw = Array.isArray(body.pakete) ? (body.pakete as Paket[]) : [];
  const addonsRaw = Array.isArray(body.addons) ? (body.addons as Addon[]) : [];
  const { pakete, addons } = normalize(paketeRaw, addonsRaw);

  // Verbindliche Wachstumspaket-Bestellung (nur bei Kauf-Modus, ohne Stripe-Zahlung)
  const gc = body.growth_commitment as
    | { package?: string; monthly_amount_cents?: number; min_term_months?: number }
    | undefined;
  const growthCommitment = gc && typeof gc === "object"
    && ["basic", "plus", "premium"].includes(String(gc.package))
    && Number(gc.monthly_amount_cents) > 0
    ? {
        package: String(gc.package) as "basic" | "plus" | "premium",
        monthly_amount_cents: Math.round(Number(gc.monthly_amount_cents)),
        min_term_months: Math.max(1, Math.round(Number(gc.min_term_months) || 12)),
      }
    : null;

  // Netto-Berechnung: erster Monat bei Miete, sonst einmaliger Betrag
  let netto = 0;
  for (const p of pakete) netto += p.typ === "miete" ? (p.mietpreis + (p.anzahlung || 0)) : p.preis;
  for (const a of addons) netto += a.preis;
  netto = Math.round(netto * 100) / 100;
  if (netto <= 0) {
    return new Response(JSON.stringify({ error: "Keine Auftragspositionen" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const mwst = Math.round(netto * 19) / 100;
  const brutto = Math.round((netto + mwst) * 100) / 100;

  const ip = getClientIp(req);
  const ua = req.headers.get("user-agent")?.slice(0, 500) || "unknown";
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Buchung speichern (mit Retry bei Kollision der Auftragsnummer)
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
      pakete, addons,
      leistungen: null,
      gesamtbetrag_netto: netto, mwst, gesamtbetrag_brutto: brutto,
      agb_akzeptiert: true, agb_version: "2.0",
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

  // Wachstumspaket vormerken (status=pending_golive bis Admin auf Go-Live klickt)
  if (growthCommitment) {
    try {
      await supabase.from("growth_subscriptions").insert({
        customer_email: kunde_email,
        package: growthCommitment.package,
        monthly_amount_cents: growthCommitment.monthly_amount_cents,
        min_term_months: growthCommitment.min_term_months,
        billing_mode: "manual_invoice",
        status: "pending_golive",
        environment: "sandbox",
      });
    } catch (e) {
      console.error("growth_subscriptions insert fehlgeschlagen:", e);
    }

    // Bestätigungsmail "vorgemerkt"
    try {
      const pkgLabel = growthCommitment.package === "premium" ? "Premium"
        : growthCommitment.package === "plus" ? "Plus" : "Basic";
      const monthly = (growthCommitment.monthly_amount_cents / 100).toLocaleString("de-DE");
      await sendResend(
        kunde_email,
        `Wachstumspaket ${pkgLabel} vorgemerkt – startet mit Go-Live`,
        `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#F5F4FF;padding:24px">
<div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(79,63,240,0.08)">
<div style="background:linear-gradient(135deg,#4F3FF0,#7B5EF8);padding:32px;text-align:center;color:#fff">
<h1 style="margin:0;font-size:22px">Wachstumspaket ${pkgLabel} ist vorgemerkt</h1></div>
<div style="padding:32px;color:#1E1B4B;font-size:15px;line-height:1.6">
<p>Hallo ${kunde_vorname},</p>
<p>du hast verbindlich das <strong>Wachstumspaket ${pkgLabel}</strong> (${monthly} €/Monat netto, Mindestlaufzeit ${growthCommitment.min_term_months} Monate) zu deiner Webseite dazugebucht.</p>
<p><strong>Wann startet die Abrechnung?</strong> Sobald deine Webseite live geht. Erst dann erhältst du die erste Monatsrechnung per E‑Mail (zahlbar per Karte, SEPA oder Überweisung).</p>
<p>Im <a href="https://meine-traum-webseite.de/kundenportal/wachstumspaket" style="color:#4F3FF0">Kundenportal</a> kannst du jederzeit auf automatische Stripe-Abbuchung umstellen.</p>
<p style="color:#6B7280;font-size:13px">Auftrag: ${auftrags_nr}</p>
</div></div></body></html>`,
      );
    } catch (e) {
      console.error("Growth-Bestätigungsmail fehlgeschlagen:", e);
    }
  }

  // E-Mails — Fehler nicht an Kunden weitergeben
  let email_gesendet = true;
  try {
    await sendResend(
      kunde_email,
      `Ihre Auftragsbestätigung – QK Marketing Group ${auftrags_nr}`,
      buildKundenMail({ vorname: kunde_vorname, nachname: kunde_nachname, auftrags_nr, pakete, addons, netto, mwst, brutto }),
    );
  } catch (e) {
    console.error("Kunden-Mail fehlgeschlagen:", e);
    email_gesendet = false;
  }
  try {
    await sendResend(
      ADMIN_EMAIL,
      `🔔 Neue Buchung: ${kunde_vorname} ${kunde_nachname} — ${auftrags_nr}`,
      buildAnbieterMail({ vorname: kunde_vorname, nachname: kunde_nachname, firma: kunde_firma, email: kunde_email, telefon: kunde_telefon, auftrags_nr, pakete, addons, netto, brutto, ip, ua }),
    );
  } catch (e) {
    console.error("Admin-Mail fehlgeschlagen:", e);
  }

  // Kundenportal-Account anlegen (idempotent, nicht-blockierend)
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/customer-create-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email: kunde_email,
        first_name: kunde_vorname,
        company_name: kunde_firma,
        phone: kunde_telefon || null,
        buchung_id: inserted.id,
        send_welcome: true,
      }),
    });
  } catch (e) {
    console.error("Kundenportal-Anlage fehlgeschlagen:", e);
  }

  return new Response(JSON.stringify({
    success: true, auftrags_nr, buchung_id: inserted.id, email_gesendet,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});