import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, Check, Loader2, Shield, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StripeEmbeddedCheckoutBox, { type StripeItem } from "./StripeEmbeddedCheckout";
import { isStripeConfigured, getStripeEnvironment } from "@/lib/stripe";

const BRAND = "#4F3FF0";
const BRAND_GRADIENT = "linear-gradient(135deg, #4F3FF0, #7B5EF8)";
const TEXT_DARK = "#1E1B4B";
const TEXT_MUTED = "#6B7280";

// Feature-Flag: Auf "true" setzen, falls die Online-Zahlung ausfällt und
// Rechnungszahlung im Checkout wieder erlaubt werden soll.
const RECHNUNG_ENABLED = false;

// Angebots-Codes (Whitelist NUR für die UI-Anzeige des reduzierten Preises).
// Der abgerechnete Rabatt kommt weiterhin ausschließlich aus dem serverseitig
// validierten Stripe-Coupon in `create-checkout` — hier wird NUR angezeigt.
const OFFER_DISPLAY: Record<string, {
  requiredPaketId: "pro";
  requiredMode: PaymentMode;
  compute: (base: number) => { discounted: number; label: string; note?: string };
}> = {
  "cbi-y1": {
    requiredPaketId: "pro",
    requiredMode: "miete",
    compute: (base) => ({
      discounted: Math.max(0, base - 40),
      label: "1. Jahr, danach regulärer Preis",
      note: "Angebotspreis für 12 Monate (CBI-Y1)",
    }),
  },
  "cbi-kauf25": {
    requiredPaketId: "pro",
    requiredMode: "kauf",
    compute: (base) => ({
      discounted: Math.round(base * 0.75 * 100) / 100,
      label: "−25 % Angebotspreis",
      note: "Rabatt CBI-KAUF25",
    }),
  },
};

type PaymentMode = "kauf" | "miete";

export interface ActiveOfferOverride {
  plan: "pro" | "starter" | "premium";
  miete?: { regular: number; discounted: number; note?: string; label: string };
  kauf?: { regular: number; discounted: number; note?: string; label: string };
}

export interface FunnelAddon {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  price_cents: number;
  price_type: "one_time" | "monthly";
  recommended?: boolean;
  default_selected?: boolean;
  social_proof?: string; // e.g. "78% wählen das"
}

export interface PaymentConfig {
  kauf?: {
    enabled: boolean;
    mode: "full" | "deposit";
    deposit_percent?: number;
  };
  miete?: {
    enabled: boolean;
    monthly_cents: number;
    min_months?: number;
  };
}

export interface FunnelPaket {
  id: string;
  name: string;
  preis: number;             // einmalig (EUR)
  miete_monatlich?: number | null; // monatlich (EUR)
  addons?: FunnelAddon[];    // paket-spezifische Add-ons
}

interface Props {
  open: boolean;
  onClose: () => void;
  paket: FunnelPaket;
  pakete?: FunnelPaket[];
  addons: FunnelAddon[];
  paymentConfig: PaymentConfig;
  angebots_id?: string;
  leadEmail?: string;
  leadName?: string;
  stripeLink?: string | null; // optional fallback for stripe payment
  defaultPaymentMode?: PaymentMode;
  /** Herkunft aus Demo-Deeplink (?demo=...) — wird an Buchung & Stripe-Metadata durchgereicht */
  sourceDemo?: string;
  /** Angebots-Code aus Deeplink (?offer=...) — löst serverseitig einen Stripe-Coupon aus */
  offerCode?: string;
  /** Optional: von /preise?demo=... übergebene Anzeigepreise pro Modus.
   *  Wenn gesetzt, wird die Anzeige daraus abgeleitet — hat Vorrang vor der
   *  internen OFFER_DISPLAY-Fallback-Logik. Betrifft nur die UI; der echte
   *  Rabatt kommt weiterhin aus dem serverseitigen Stripe-Coupon. */
  activeOfferOverride?: ActiveOfferOverride;
  /** Layout-Variante:
   *  - "sidebar" (default): rechte Seitenleiste wie bisher.
   *  - "centered": zentriertes Modal (für Demo-/Angebots-Kontext).
   *  Mobile bleibt in beiden Varianten Vollbild-Slide-Up. */
  layout?: "sidebar" | "centered";
}

type PayMethod = "online" | "rechnung";
type StepKey = "paket" | "zahlung" | "extras" | "kontakt" | "bezahlen" | "fertig";

function fmtEUR(n: number) {
  return n.toLocaleString("de-DE") + " €";
}

// MwSt-Helper (wiederverwendbar, falls andere Pakete später Aufschlüsselung
// mit Brutto/Netto brauchen).
const MWST_RATE = 0.19;
const nettoToBrutto = (netto: number) =>
  Math.round(netto * (1 + MWST_RATE) * 100) / 100;
const mwstAmount = (netto: number) =>
  Math.round(netto * MWST_RATE * 100) / 100;
function fmtEUR2(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function TrustBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{
      marginTop: 16,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      textAlign: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.7 }}>
        <svg viewBox="0 0 48 16" style={{ height: 16 }} fill={TEXT_MUTED} aria-label="Visa">
          <text x="0" y="13" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="900" fontStyle="italic">VISA</text>
        </svg>
        <svg viewBox="0 0 36 22" style={{ height: 16 }} aria-label="Mastercard">
          <circle cx="13" cy="11" r="9" fill={TEXT_MUTED} opacity="0.7" />
          <circle cx="23" cy="11" r="9" fill={TEXT_MUTED} opacity="0.4" />
        </svg>
        <svg viewBox="0 0 48 16" style={{ height: 16 }} fill={TEXT_MUTED} aria-label="SEPA">
          <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">SEPA</text>
        </svg>
        <svg viewBox="0 0 56 16" style={{ height: 16 }} fill={TEXT_MUTED} aria-label="Klarna">
          <text x="0" y="13" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700">Klarna</text>
        </svg>
      </div>
      <div style={{ fontSize: 11, color: TEXT_MUTED, lineHeight: 1.3 }}>
        Erste Monatsmiete jetzt · danach automatisch monatlich
      </div>
      <div style={{ fontSize: 10, color: TEXT_MUTED, lineHeight: 1.3 }}>
        * 12 Monate Startzeitraum – danach monatlich kündbar.{compact ? "" : " Alle Preise netto zzgl. 19% MwSt."}
      </div>
      <div style={{
        marginTop: 2, fontSize: 12, fontWeight: 600,
        color: BRAND, lineHeight: 1.35,
        padding: "6px 10px", background: `${BRAND}10`, borderRadius: 10,
      }}>
        🛡️ Website in 7 Tagen live — oder wir arbeiten kostenlos weiter bis sie steht.
      </div>
    </div>
  );
}

export default function CheckoutFunnel({
  open, onClose, paket, pakete, addons, paymentConfig, angebots_id, leadEmail, leadName, stripeLink, defaultPaymentMode, sourceDemo, offerCode, activeOfferOverride, layout = "sidebar",
}: Props) {
  const allPakete = pakete && pakete.length > 0 ? pakete : [paket];
  const hasPaketStep = allPakete.length > 1;

  const stepKeys: StepKey[] = hasPaketStep
    ? ["paket", "zahlung", "extras", "kontakt", "bezahlen", "fertig"]
    : ["zahlung", "extras", "kontakt", "bezahlen", "fertig"];
  const stepLabelMap: Record<StepKey, string> = {
    paket: "Paket", zahlung: "Zahlung", extras: "Extras",
    kontakt: "Kontakt", bezahlen: "Bezahlen", fertig: "Fertig",
  };
  const stepLabels = stepKeys.map((k) => stepLabelMap[k]);
  const goTo = (k: StepKey) => setStep(stepKeys.indexOf(k));

  const [selectedPaketId, setSelectedPaketId] = useState<string>(paket.id);
  const currentPaket = allPakete.find((p) => p.id === selectedPaketId) ?? paket;

  // Add-ons: bevorzugt paket-spezifisch, sonst globale Liste vom Angebot
  const currentAddons: FunnelAddon[] = (currentPaket.addons && currentPaket.addons.length > 0)
    ? currentPaket.addons
    : addons;

  const kaufEnabled = paymentConfig.kauf?.enabled !== false;
  const mieteEnabled = !!paymentConfig.miete?.enabled && !!currentPaket.miete_monatlich;

  const [step, setStep] = useState<number>(0);
  const currentKey = stepKeys[step] ?? "zahlung";
  const initialPaymentMode: PaymentMode =
    defaultPaymentMode && ((defaultPaymentMode === "miete" && mieteEnabled) || (defaultPaymentMode === "kauf" && kaufEnabled))
      ? defaultPaymentMode
      : (mieteEnabled ? "miete" : "kauf");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(initialPaymentMode);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    () => (currentPaket.addons ?? addons).filter((a) => a.default_selected).map((a) => a.id),
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ auftrags_nr: string } | null>(null);
  const stripeAvailable = isStripeConfigured();
  const [payMethod, setPayMethod] = useState<PayMethod>(
    stripeAvailable || !RECHNUNG_ENABLED ? "online" : "rechnung",
  );
  // Ob der eingeloggte Kunde „Auf Rechnung" freigeschaltet hat.
  const [invoiceAllowed, setInvoiceAllowed] = useState<boolean>(false);
  // State für den Rechnungs-Bestätigungscode-Flow (2 Popups).
  const [invoiceConfirmStage, setInvoiceConfirmStage] =
    useState<null | "intro" | "code">(null);
  const [invoiceCodeSending, setInvoiceCodeSending] = useState(false);
  const [invoiceCodeInput, setInvoiceCodeInput] = useState("");
  const [invoiceCodeVerifying, setInvoiceCodeVerifying] = useState(false);
  const [invoiceCheckoutSessionId, setInvoiceCheckoutSessionId] = useState<string | null>(null);
  const [stripeItems, setStripeItems] = useState<StripeItem[] | null>(null);

  // Multi-Code-System: serverseitige Checkout-Session. Alle eingelösten Codes
  // (Rabatt + Freischaltung) leben ausschließlich hinter dieser Session-ID
  // in der DB. Der Client hält nur die Anzeigedaten aus den Function-Responses.
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [appliedCodes, setAppliedCodes] = useState<Array<{ code: string; label: string; type: 'discount' | 'unlock'; discount_amount_cents: number }>>([]);
  const [sessionInvoiceAllowed, setSessionInvoiceAllowed] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeSubmitting, setCodeSubmitting] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeNotice, setCodeNotice] = useState<string | null>(null);
  const [serverPricing, setServerPricing] = useState<{ netto: number; mwst: number; brutto: number; discount_cents: number } | null>(null);

  // Kontaktdaten
  const initialName = (leadName || "").split(" ");
  const [vorname, setVorname] = useState(initialName[0] || "");
  const [nachname, setNachname] = useState(initialName.slice(1).join(" ") || "");
  const [firma, setFirma] = useState("");
  const [email, setEmail] = useState(leadEmail || "");
  const [telefon, setTelefon] = useState("");
  const [agb, setAgb] = useState(false);
  const [kostenpflichtig, setKostenpflichtig] = useState(false);
  const [growthBindend, setGrowthBindend] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setSuccess(null);
      setSelectedPaketId(paket.id);
      setPaymentMode(initialPaymentMode);
      setSelectedAddonIds((paket.addons ?? addons).filter((a) => a.default_selected).map((a) => a.id));
      setPayMethod(stripeAvailable || !RECHNUNG_ENABLED ? "online" : "rechnung");
      setStripeItems(null);
      setGrowthBindend(false);
      setInvoiceConfirmStage(null);
      setInvoiceCodeInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paket.id]);

  // Kundenkonto-Flag „invoice_allowed" laden, sobald das Modal öffnet.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!cancelled) setInvoiceAllowed(false); return; }
        const { data } = await supabase
          .from("customer_accounts")
          .select("invoice_allowed")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!cancelled) setInvoiceAllowed(!!data?.invoice_allowed);
      } catch {
        if (!cancelled) setInvoiceAllowed(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open]);

  // Multi-Code-System: beim Öffnen serverseitig eine checkout_sessions-Zeile
  // anlegen. Ohne diese ID kann kein Code eingelöst werden.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const storageKey = `checkout_session_id:${angebots_id || "default"}`;
        const cached = (() => {
          try { return sessionStorage.getItem(storageKey); } catch { return null; }
        })();
        const { data, error } = await supabase.functions.invoke("checkout-session-create", {
          body: {
            angebots_nr: angebots_id || null,
            email: (leadEmail || email || "").trim().toLowerCase() || null,
            session_id: cached || undefined,
            environment: getStripeEnvironment(),
          },
        });
        if (cancelled) return;
        if (!error && data?.session_id) {
          setCheckoutSessionId(data.session_id);
          setAppliedCodes(data.applied_codes || []);
          setSessionInvoiceAllowed(!!data.invoice_allowed);
          setServerPricing(data.pricing || null);
          try { sessionStorage.setItem(storageKey, data.session_id); } catch { /* ignore */ }

          // URL-getriebenen Angebots-Code (?offer=...) einmalig automatisch
          // einlösen. Ersetzt den bisherigen frontend-only OFFER_DISPLAY-Pfad.
          if (offerCode && !(data.applied_codes || []).some((c: any) => c.code === offerCode.trim().toUpperCase())) {
            try {
              const r = await supabase.functions.invoke("redeem-code", {
                body: { session_id: data.session_id, code: offerCode.trim().toUpperCase(), base_net_cents: Math.round(effHeuteZuZahlen * 100) },
              });
              if (!cancelled && r.data?.ok) {
                setAppliedCodes(r.data.applied_codes || []);
                setSessionInvoiceAllowed(!!r.data.invoice_allowed);
                setServerPricing(r.data.pricing || null);
              }
            } catch { /* still fine — user can enter manually */ }
          }
        }
      } catch (e) {
        console.error("checkout-session-create failed:", e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const effectiveInvoiceAllowed = invoiceAllowed || sessionInvoiceAllowed;

  const submitCode = async () => {
    const raw = codeInput.trim().toUpperCase();
    if (!raw || !checkoutSessionId || codeSubmitting) return;
    setCodeSubmitting(true);
    setCodeError(null);
    setCodeNotice(null);
    try {
      const { data, error } = await supabase.functions.invoke("redeem-code", {
        body: { session_id: checkoutSessionId, code: raw, base_net_cents: Math.round(effHeuteZuZahlen * 100) },
      });
      if (error || !data?.ok) {
        setCodeError(data?.reason || error?.message || "Code konnte nicht eingelöst werden.");
        return;
      }
      setAppliedCodes(data.applied_codes || []);
      setSessionInvoiceAllowed(!!data.invoice_allowed);
      setServerPricing(data.pricing || null);
      setCodeInput("");
      if (data.replaced) {
        setCodeNotice(`${data.replaced} wurde durch ${raw} ersetzt.`);
      } else {
        setCodeNotice(`Code ${raw} aktiviert.`);
      }
    } finally {
      setCodeSubmitting(false);
    }
  };

  const removeCode = async (code: string) => {
    if (!checkoutSessionId) return;
    setCodeError(null);
    setCodeNotice(null);
    try {
      const { data, error } = await supabase.functions.invoke("remove-code", {
        body: { session_id: checkoutSessionId, code, base_net_cents: Math.round(effHeuteZuZahlen * 100) },
      });
      if (error || !data?.ok) {
        setCodeError(data?.reason || "Konnte Code nicht entfernen.");
        return;
      }
      setAppliedCodes(data.applied_codes || []);
      setSessionInvoiceAllowed(!!data.invoice_allowed);
      setServerPricing(data.pricing || null);
      setCodeNotice(`Code ${code} entfernt.`);
    } catch (e) {
      console.error(e);
    }
  };

  // Wenn Paket im Funnel gewechselt wird → Zahlmodus auf passenden Default zurücksetzen
  useEffect(() => {
    if (!open) return;
    setPaymentMode(mieteEnabled ? "miete" : "kauf");
    setSelectedAddonIds(currentAddons.filter((a) => a.default_selected).map((a) => a.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPaketId]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const selectedAddons = useMemo(
    () => currentAddons.filter((a) => selectedAddonIds.includes(a.id)),
    [currentAddons, selectedAddonIds],
  );

  // Aktiver Angebots-Code für die UI-Anzeige. Case-insensitiv, restriktiv:
  // greift nur für Pro-Paket und den passenden Zahlungsmodus. Keine Rabatt-
  // Berechnung im Payment-Flow — nur visuell.
  const activeOffer = useMemo(() => {
    // 1) Explizites Override von /preise?demo=... hat Vorrang
    if (activeOfferOverride) {
      const paketOk = currentPaket.id.toLowerCase().startsWith(activeOfferOverride.plan);
      if (!paketOk) return null;
      const side = paymentMode === "miete" ? activeOfferOverride.miete : activeOfferOverride.kauf;
      if (!side) return null;
      return {
        base: side.regular,
        discounted: side.discounted,
        label: side.label,
        note: side.note,
        mode: paymentMode,
      };
    }
    const key = offerCode?.trim().toLowerCase();
    if (!key) return null;
    const cfg = OFFER_DISPLAY[key];
    if (!cfg) return null;
    const paketOk = currentPaket.id.toLowerCase().startsWith(cfg.requiredPaketId);
    if (!paketOk || paymentMode !== cfg.requiredMode) return null;
    const base = cfg.requiredMode === "miete"
      ? Number(currentPaket.miete_monatlich || 0)
      : Number(currentPaket.preis || 0);
    if (!base) return null;
    const { discounted, label, note } = cfg.compute(base);
    return { base, discounted, label, note, mode: cfg.requiredMode };
  }, [offerCode, currentPaket, paymentMode, activeOfferOverride]);

  /**
   * Angebots-Anzeigewerte pro Modus (unabhängig vom aktuell gewählten). Wird im
   * Paket- und Zahlungs-Schritt benutzt, um beide Optionen mit durchgestrichenem
   * Regulärpreis darzustellen.
   */
  const offersByMode = useMemo(() => {
    const out: { miete?: { regular: number; discounted: number; note?: string }; kauf?: { regular: number; discounted: number; note?: string } } = {};
    if (activeOfferOverride) {
      const paketOk = currentPaket.id.toLowerCase().startsWith(activeOfferOverride.plan);
      if (!paketOk) return out;
      if (activeOfferOverride.miete) out.miete = { ...activeOfferOverride.miete };
      if (activeOfferOverride.kauf) out.kauf = { ...activeOfferOverride.kauf };
      return out;
    }
    const key = offerCode?.trim().toLowerCase();
    if (!key) return out;
    const cfg = OFFER_DISPLAY[key];
    if (!cfg) return out;
    const paketOk = currentPaket.id.toLowerCase().startsWith(cfg.requiredPaketId);
    if (!paketOk) return out;
    if (cfg.requiredMode === "miete") {
      const base = Number(currentPaket.miete_monatlich || 0);
      if (base) {
        const { discounted, note } = cfg.compute(base);
        out.miete = { regular: base, discounted, note };
      }
    } else {
      const base = Number(currentPaket.preis || 0);
      if (base) {
        const { discounted, note } = cfg.compute(base);
        out.kauf = { regular: base, discounted, note };
      }
    }
    return out;
  }, [offerCode, currentPaket, activeOfferOverride]);

  // Erkennung „Wachstumspaket im Kauf-Modus" → verbindlich gebucht, separat abgerechnet
  const growthAddon = useMemo(
    () => selectedAddons.find((a) => a.price_type === "monthly" && /wachstum/i.test(a.name)),
    [selectedAddons],
  );
  const hasGrowthCommitment = paymentMode === "kauf" && !!growthAddon;
  const growthPackageKey: "basic" | "plus" | "premium" | null = useMemo(() => {
    if (!hasGrowthCommitment) return null;
    const cents = growthAddon!.price_cents;
    if (cents <= 4000) return "basic";   // ≤ 40 €  → Starter
    if (cents <= 6500) return "plus";    // ≤ 65 €  → Pro
    return "premium";                    //         → Premium
  }, [hasGrowthCommitment, growthAddon]);

  // Preisberechnung
  const basisEinmalig = paymentMode === "kauf" ? currentPaket.preis : 0;
  const basisMonatlich = paymentMode === "miete" ? Number(currentPaket.miete_monatlich || 0) : 0;
  const addonsEinmalig = selectedAddons
    .filter((a) => a.price_type === "one_time")
    .reduce((s, a) => s + a.price_cents / 100, 0);
  const addonsMonatlich = selectedAddons
    .filter((a) => a.price_type === "monthly")
    .reduce((s, a) => s + a.price_cents / 100, 0);

  const gesamtEinmalig = basisEinmalig + addonsEinmalig;
  const gesamtMonatlich = basisMonatlich + addonsMonatlich;

  // Heute zu zahlen
  let heuteZuZahlen = 0;
  let heuteLabel = "";
  if (paymentMode === "kauf") {
    const cfg = paymentConfig.kauf || { mode: "full" as const, enabled: true };
    // Im Kauf-Modus werden monatliche Add-ons (z. B. Wachstumspaket) NICHT mit
    // bezahlt – sie werden verbindlich bestellt und ab Go-Live separat abgerechnet.
    const einmaligOhneMonatlich = basisEinmalig + selectedAddons
      .filter((a) => a.price_type === "one_time")
      .reduce((s, a) => s + a.price_cents / 100, 0);
    if (cfg.mode === "deposit" && cfg.deposit_percent) {
      heuteZuZahlen = Math.round((basisEinmalig * cfg.deposit_percent) / 100)
        + selectedAddons.filter((a) => a.price_type === "one_time").reduce((s, a) => s + a.price_cents / 100, 0);
      heuteLabel = `Anzahlung ${cfg.deposit_percent}% heute · Rest nach Lieferung`;
    } else {
      heuteZuZahlen = einmaligOhneMonatlich;
      heuteLabel = "Einmalig heute fällig";
    }
  } else {
    heuteZuZahlen = gesamtMonatlich + addonsEinmalig;
    heuteLabel = addonsEinmalig > 0
      ? "Erster Monat + einmalige Zusätze heute fällig"
      : "Erster Monat heute · monatlich kündbar nach Mindestlaufzeit";
  }

  // ---- Effektive Preise unter Berücksichtigung des aktiven Angebots (nur UI).
  // Der echte Rabatt kommt weiterhin serverseitig aus dem Stripe-Coupon.
  const offerDelta = activeOffer ? (activeOffer.base - activeOffer.discounted) : 0;
  const effBasisMonatlich = activeOffer?.mode === "miete" ? activeOffer.discounted : basisMonatlich;
  const effBasisEinmalig  = activeOffer?.mode === "kauf"  ? activeOffer.discounted : basisEinmalig;
  const effGesamtMonatlich = Math.max(0, gesamtMonatlich - (activeOffer?.mode === "miete" ? offerDelta : 0));
  const effGesamtEinmalig  = Math.max(0, gesamtEinmalig  - (activeOffer?.mode === "kauf"  ? offerDelta : 0));
  const effHeuteZuZahlen   = Math.max(0, heuteZuZahlen - (activeOffer ? offerDelta : 0));

  // Halte das Netto-Basis-Feld der Server-Session bei jeder Auswahländerung
  // aktuell. Der Server ist die einzige Preisquelle für die Bestellübersicht
  // und die Sticky-Zahlenleiste — er muss also wissen, worauf ein Rabatt
  // angewendet werden soll.
  useEffect(() => {
    if (!open || !checkoutSessionId) return;
    const baseCents = Math.round(effHeuteZuZahlen * 100);
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("checkout-session-create", {
          body: {
            angebots_nr: angebots_id || null,
            email: (leadEmail || email || "").trim().toLowerCase() || null,
            session_id: checkoutSessionId,
            base_net_cents: baseCents,
            environment: getStripeEnvironment(),
          },
        });
        if (cancelled || !data?.session_id) return;
        setAppliedCodes(data.applied_codes || []);
        setServerPricing(data.pricing || null);
      } catch (e) {
        console.warn("base sync failed", e);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effHeuteZuZahlen, checkoutSessionId, open]);

  const toggleAddon = (id: string) =>
    setSelectedAddonIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const canProceedFromStep = (s: number): boolean => {
    const key = stepKeys[s];
    if (key === "paket") return !!selectedPaketId;
    if (key === "zahlung") return (paymentMode === "kauf" && kaufEnabled) || (paymentMode === "miete" && mieteEnabled);
    if (key === "extras") return true;
    if (key === "kontakt") {
      const baseOk = vorname.trim().length >= 1
        && nachname.trim().length >= 1
        && firma.trim().length >= 1
        && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())
        && agb && kostenpflichtig;
      return baseOk && (!hasGrowthCommitment || growthBindend);
    }
    return true;
  };

  const buildStripeItems = (): { items: StripeItem[]; mode: "payment" | "subscription"; description: string } => {
    const subItems: StripeItem[] = [];
    if (paymentMode === "miete") {
      // Stripe subscription: base + monthly addons in einem Abo
      subItems.push({
        name: `${currentPaket.name} – Miete`,
        amount_cents: Math.round(Number(currentPaket.miete_monatlich || 0) * 100),
        recurring: "month",
      });
      for (const a of selectedAddons.filter((a) => a.price_type === "monthly")) {
        subItems.push({ name: a.name, amount_cents: a.price_cents, recurring: "month" });
      }
      // Einmalige Add-ons in Miet-Modus: in Stripe Subscriptions nicht möglich → werden im Funnel zur Rechnung
      // Wir fügen sie als separate "Setup-Fee" nicht hinzu (Limitation); zeigen Hinweis im UI.
      return { items: subItems, mode: "subscription", description: `Mietmodell – ${currentPaket.name}` };
    }
    // Kauf
    const items: StripeItem[] = [];
    const cfg = paymentConfig.kauf || { mode: "full" as const, enabled: true };
    if (cfg.mode === "deposit" && cfg.deposit_percent) {
      const depCents = Math.round((basisEinmalig * cfg.deposit_percent) / 100 * 100);
      items.push({ name: `${currentPaket.name} – Anzahlung ${cfg.deposit_percent}%`, amount_cents: depCents });
    } else {
      items.push({ name: currentPaket.name, amount_cents: Math.round(basisEinmalig * 100) });
    }
    // Im Kauf-Modus: nur einmalige Add-ons in Stripe abrechnen. Monatliche
    // Add-ons (Wachstumspaket) werden verbindlich gebucht und ab Go-Live
    // separat per Rechnung abgerechnet (siehe Webhook / growth_subscriptions).
    for (const a of selectedAddons.filter((a) => a.price_type === "one_time")) {
      items.push({ name: a.name, amount_cents: a.price_cents });
    }
    return { items, mode: "payment", description: `Auftrag ${currentPaket.name}` };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const positions: { titel: string; preis: number }[] = [];
      if (paymentMode === "kauf") {
        positions.push({ titel: `Paket: ${currentPaket.name} (Einmalkauf)`, preis: currentPaket.preis });
      } else {
        positions.push({ titel: `Paket: ${currentPaket.name} (Miete, erster Monat)`, preis: Number(currentPaket.miete_monatlich || 0) });
      }
      for (const a of selectedAddons) {
        const preis = a.price_type === "monthly"
          ? a.price_cents / 100
          : a.price_cents / 100;
        const titelSuffix = a.price_type === "monthly" ? " (monatlich, erster Monat)" : "";
        positions.push({ titel: `${a.name}${titelSuffix}`, preis });
      }

      const { data, error } = await supabase.functions.invoke("buchung-bestaetigen", {
        body: {
          angebots_id,
          kunde_vorname: vorname.trim(),
          kunde_nachname: nachname.trim(),
          kunde_firma: firma.trim(),
          kunde_email: email.trim(),
          kunde_telefon: telefon.trim(),
          payment_method: payMethod === "online" ? "stripe" : "rechnung",
          positions,
          pakete: [{
            id: currentPaket.id, name: currentPaket.name,
            preis: currentPaket.preis,
            miete_monatlich: currentPaket.miete_monatlich || null,
            payment_mode: paymentMode,
          }],
          addons: selectedAddons.map((a) => ({
            id: a.id, name: a.name,
            price_cents: a.price_cents, price_type: a.price_type,
          })),
          ...(hasGrowthCommitment && growthPackageKey ? {
            growth_commitment: {
              package: growthPackageKey,
              monthly_amount_cents: growthAddon!.price_cents,
              min_term_months: 12,
            },
          } : {}),
          ...(sourceDemo ? { source_demo: sourceDemo, source_cta: `demo:${sourceDemo}` } : {}),
          ...(offerCode ? { offer_code: offerCode } : {}),
          ...(checkoutSessionId ? { checkout_session_id: checkoutSessionId } : {}),
          agb_akzeptiert: true,
          kostenpflichtig_bestaetigt: true,
        },
      });
      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Speichern fehlgeschlagen");
      }
      setSuccess({ auftrags_nr: data.auftrags_nr });

      if (payMethod === "online" && stripeAvailable) {
        // Stripe Embedded Checkout vorbereiten
        const built = buildStripeItems();
        setStripeItems(built.items);
        goTo("bezahlen");
      } else {
        // Klassisch: direkt zu Fertig
        goTo("fertig");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Fehler beim Abschicken";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const isCentered = layout === "centered";

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(15, 12, 41, 0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: isCentered ? "center" : "stretch",
        justifyContent: isCentered ? "center" : "flex-end",
        padding: isCentered ? 24 : 0,
        animation: "funnelFadeIn 0.25s ease-out",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <style>{`
        @keyframes funnelFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes funnelSlideIn {
          from { transform: translateX(100%) }
          to { transform: translateX(0) }
        }
        @keyframes funnelSlideUp {
          from { transform: translateY(100%) }
          to { transform: translateY(0) }
        }
        @keyframes funnelZoomIn {
          from { opacity: 0; transform: scale(0.96) }
          to { opacity: 1; transform: scale(1) }
        }
        .funnel-panel { animation: funnelSlideIn 0.32s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .funnel-panel-centered { animation: funnelZoomIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @media (max-width: 767px) {
          .funnel-panel { animation: funnelSlideUp 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) !important; }
          .funnel-panel-centered { animation: funnelSlideUp 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) !important; }
        }
        .funnel-addon-card:hover { border-color: ${BRAND}80 !important; }
        .funnel-paymode-card:hover { border-color: ${BRAND}80 !important; }
        .funnel-input:focus { outline: none; border-color: ${BRAND} !important; box-shadow: 0 0 0 3px ${BRAND}22 !important; }
      `}</style>

      <div
        className={isCentered ? "funnel-panel-centered" : "funnel-panel"}
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: isCentered ? 680 : 520,
          height: isCentered ? "auto" : "100%",
          maxHeight: isCentered ? "calc(100vh - 48px)" : "100%",
          borderRadius: isCentered ? 20 : 0,
          display: "flex",
          flexDirection: "column",
          boxShadow: isCentered
            ? "0 30px 80px rgba(15,12,41,0.35)"
            : "-20px 0 60px rgba(15,12,41,0.25)",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(79,63,240,0.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12,
          flexShrink: 0,
        }}>
          {step > 0 && currentKey !== "bezahlen" && currentKey !== "fertig" && !submitting ? (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 4,
                color: TEXT_MUTED, fontSize: 14, fontWeight: 600, padding: "6px 8px",
                borderRadius: 8, fontFamily: "inherit",
              }}
              aria-label="Zurück"
            >
              <ChevronLeft size={20} aria-hidden={true} focusable={false} /> Zurück
            </button>
          ) : <span />}
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, letterSpacing: "-0.01em" }}>
            {currentPaket.name}
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Schließen"
            style={{
              background: "transparent", border: "none", cursor: submitting ? "not-allowed" : "pointer",
              padding: 6, borderRadius: 8, color: TEXT_MUTED,
            }}
          >
            <X size={20} aria-hidden={true} focusable={false} />
          </button>
        </div>

        {activeOffer && currentKey !== "bezahlen" && currentKey !== "fertig" && (
          <div style={{
            margin: "10px 20px 0",
            padding: "8px 12px",
            background: `${BRAND}12`,
            border: `1px solid ${BRAND}33`,
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            color: BRAND,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            🎁 <span>Angebot aktiv: <strong>{fmtEUR(activeOffer.discounted)}</strong>{activeOffer.mode === "miete" ? " /Monat" : ""} <span style={{ textDecoration: "line-through", fontWeight: 500, opacity: 0.7, marginLeft: 4 }}>{fmtEUR(activeOffer.base)}</span> · {activeOffer.note ?? activeOffer.label}</span>
          </div>
        )}

        {/* PROGRESS */}
        <div style={{
          padding: "12px 20px 0",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {stepLabels.map((label, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: done ? BRAND : current ? "#fff" : "#F1F0FF",
                    border: current ? `2px solid ${BRAND}` : done ? `2px solid ${BRAND}` : "2px solid #E5E3FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: done ? "#fff" : current ? BRAND : "#A8A2D9",
                    fontSize: 12, fontWeight: 800, flexShrink: 0,
                    transition: "all 0.2s",
                  }}>
                    {done ? <Check size={16} strokeWidth={3} aria-hidden={true} focusable={false} /> : i + 1}
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div style={{
                      flex: 1, height: 2,
                      background: done ? BRAND : "#E5E3FF",
                      borderRadius: 2,
                      transition: "background 0.2s",
                    }} />
                  )}
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop: 8, fontSize: 12, fontWeight: 700,
            color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            Schritt {step + 1} von {stepLabels.length - 1} · {stepLabels[step]}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "20px",
        }}>
          {currentKey === "paket" && (
            <StepPaket
              pakete={allPakete}
              selectedId={selectedPaketId}
              onSelect={setSelectedPaketId}
              paymentConfig={paymentConfig}
              offersByMode={offersByMode}
              offerPlan={activeOfferOverride?.plan}
            />
          )}
          {currentKey === "zahlung" && (
            <StepZahlung
              paket={currentPaket}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              paymentConfig={paymentConfig}
              kaufEnabled={kaufEnabled}
              mieteEnabled={mieteEnabled}
              offersByMode={offersByMode}
            />
          )}
          {currentKey === "extras" && (
            <StepAddOns
              addons={currentAddons}
              selectedIds={selectedAddonIds}
              toggle={toggleAddon}
              growthHint={hasGrowthCommitment}
            />
          )}
          {currentKey === "kontakt" && (
            <StepKontakt
              vorname={vorname} setVorname={setVorname}
              nachname={nachname} setNachname={setNachname}
              firma={firma} setFirma={setFirma}
              email={email} setEmail={setEmail}
              telefon={telefon} setTelefon={setTelefon}
              agb={agb} setAgb={setAgb}
              kostenpflichtig={kostenpflichtig} setKostenpflichtig={setKostenpflichtig}
              summary={{ heuteZuZahlen, heuteLabel, paymentMode, gesamtMonatlich, gesamtEinmalig }}
              paketName={currentPaket.name}
              basisEinmalig={effBasisEinmalig}
              basisMonatlich={effBasisMonatlich}
              regularBasisEinmalig={basisEinmalig}
              regularBasisMonatlich={basisMonatlich}
              effHeuteZuZahlen={effHeuteZuZahlen}
              activeOffer={activeOffer}
              selectedAddons={selectedAddons}
              payMethod={payMethod}
              setPayMethod={setPayMethod}
              stripeAvailable={stripeAvailable}
              invoiceAllowed={effectiveInvoiceAllowed}
              growthCommitment={hasGrowthCommitment ? {
                amountCents: growthAddon!.price_cents,
                checked: growthBindend,
                setChecked: setGrowthBindend,
              } : null}
              codeUi={{
                appliedCodes,
                codeInput,
                setCodeInput,
                submitCode,
                removeCode,
                codeSubmitting,
                codeError,
                codeNotice,
                serverPricing,
              }}
            />
          )}
          {currentKey === "bezahlen" && success && (
            <StepBezahlen
              items={stripeItems || []}
              mode={paymentMode === "miete" ? "subscription" : "payment"}
              description={`Auftrag ${success.auftrags_nr} – ${currentPaket.name}`}
              customerEmail={email}
              metadata={{
                auftrags_nr: success.auftrags_nr,
                angebots_id: angebots_id || "",
                paket: currentPaket.id,
                payment_mode: paymentMode,
                ...(hasGrowthCommitment && growthPackageKey ? {
                  growth_package: growthPackageKey,
                  growth_amount_cents: String(growthAddon!.price_cents),
                  growth_min_term: "12",
                } : {}),
                ...(offerCode ? { offer_code: offerCode } : {}),
                ...(checkoutSessionId ? { checkout_session_id: checkoutSessionId } : {}),
                ...(sourceDemo ? { demo_source: sourceDemo } : {}),
              }}
              returnUrl={`${window.location.origin}/zahlung-erfolgreich?auftrag=${encodeURIComponent(success.auftrags_nr)}&session_id={CHECKOUT_SESSION_ID}`}
            />
          )}
          {currentKey === "fertig" && success && (
            <StepFertig auftragsNr={success.auftrags_nr} email={email} />
          )}
        </div>

        {/* FOOTER (Summary + CTA) */}
        {currentKey !== "bezahlen" && currentKey !== "fertig" && (
          <div style={{
            padding: "14px 20px 18px",
            borderTop: "1px solid rgba(79,63,240,0.1)",
            background: "linear-gradient(180deg, #FAFAFF 0%, #F5F4FF 100%)",
            flexShrink: 0,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 10, gap: 8, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {currentKey === "kontakt" ? "Heute zu zahlen" : "deine Auswahl"}
                </div>
                {paymentMode === "miete" && currentKey !== "kontakt" && currentPaket.id.toLowerCase().startsWith("pro") ? (
                  (() => {
                    const netto = effGesamtMonatlich;
                    const mwst = mwstAmount(netto);
                    const brutto = nettoToBrutto(netto);
                    const nettoReg = gesamtMonatlich;
                    const bruttoReg = nettoToBrutto(nettoReg);
                    const showStrike = activeOffer && activeOffer.mode === "miete";
                    return (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, lineHeight: 1.4 }}>
                          {showStrike && (
                            <span style={{ textDecoration: "line-through", color: TEXT_MUTED, marginRight: 6, fontWeight: 500 }}>
                              {fmtEUR2(nettoReg)}
                            </span>
                          )}
                          {fmtEUR2(netto)} <span style={{ color: TEXT_MUTED, fontWeight: 500 }}>netto/Monat</span>
                        </div>
                        <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.4 }}>
                          + {fmtEUR2(mwst)} MwSt. (19%)
                        </div>
                        <div style={{
                          marginTop: 6, paddingTop: 6,
                          borderTop: "1px solid rgba(79,63,240,0.15)",
                          fontSize: 20, fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.02em", lineHeight: 1.15,
                        }}>
                          {fmtEUR2(brutto)} <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED }}>brutto/Monat</span>
                        </div>
                        {showStrike && (
                          <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 4, lineHeight: 1.4 }}>
                            1. Jahr, danach {fmtEUR2(bruttoReg)} brutto/Monat ({fmtEUR(nettoReg)} netto)
                          </div>
                        )}
                        {addonsEinmalig > 0 && (
                          <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                            + {fmtEUR(addonsEinmalig)} einmalig
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {paymentMode === "miete" && currentKey !== "kontakt" ? (
                    <>
                      {activeOffer && activeOffer.mode === "miete" ? (
                        <>
                          <span style={{ textDecoration: "line-through", fontSize: 14, fontWeight: 600, color: TEXT_MUTED, marginRight: 6 }}>{fmtEUR(gesamtMonatlich)}</span>
                          {fmtEUR(effGesamtMonatlich)}
                        </>
                      ) : (
                        fmtEUR(gesamtMonatlich)
                      )} <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED }}>/Monat</span>
                      {addonsEinmalig > 0 && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED }}> · +{fmtEUR(addonsEinmalig)} einmalig</span>
                      )}
                    </>
                  ) : currentKey === "kontakt" ? (
                    activeOffer ? (
                      <>
                        <span style={{ textDecoration: "line-through", fontSize: 14, fontWeight: 600, color: TEXT_MUTED, marginRight: 6 }}>{fmtEUR(heuteZuZahlen)}</span>
                        {fmtEUR(effHeuteZuZahlen)}
                      </>
                    ) : (
                      fmtEUR(heuteZuZahlen)
                    )
                  ) : (
                    activeOffer && activeOffer.mode === "kauf" ? (
                      <>
                        <span style={{ textDecoration: "line-through", fontSize: 14, fontWeight: 600, color: TEXT_MUTED, marginRight: 6 }}>{fmtEUR(gesamtEinmalig)}</span>
                        {fmtEUR(effGesamtEinmalig)}
                      </>
                    ) : (
                      fmtEUR(gesamtEinmalig)
                    )
                  )}
                </div>
                )}
                {currentKey === "kontakt" && (
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{heuteLabel}</div>
                )}
                {activeOffer && !(paymentMode === "miete" && currentKey !== "kontakt" && currentPaket.id.toLowerCase().startsWith("pro")) && (
                  <div style={{ fontSize: 11, color: BRAND, fontWeight: 600, marginTop: 4 }}>
                    {activeOffer.label}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: TEXT_MUTED }}>
                <Shield size={16} aria-hidden={true} focusable={false} /> Sicher
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!canProceedFromStep(step)) return;
                if (currentKey === "kontakt") {
                  if (payMethod === "rechnung") {
                    // Rechnungs-Bestätigungsflow starten (E-Mail-Code)
                    setInvoiceConfirmStage("intro");
                  } else {
                    handleSubmit();
                  }
                } else {
                  setStep((s) => s + 1);
                }
              }}
              disabled={!canProceedFromStep(step) || submitting}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: canProceedFromStep(step) && !submitting ? BRAND_GRADIENT : "#D1CFEF",
                color: "#fff",
                fontSize: 16, fontWeight: 700,
                border: "none", borderRadius: 14,
                cursor: canProceedFromStep(step) && !submitting ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: canProceedFromStep(step) && !submitting ? "0 8px 24px rgba(79,63,240,0.3)" : "none",
                transition: "all 0.15s",
              }}
            >
              {submitting ? (
                <><Loader2 size={20} className="animate-spin" aria-hidden={true} focusable={false} /> Wird abgeschickt…</>
              ) : currentKey === "kontakt" ? (
                <>{payMethod === "online" && stripeAvailable ? "Weiter zur Zahlung" : "Verbindlich beauftragen"} <ArrowRight size={20} aria-hidden={true} focusable={false} /></>
              ) : (
                <>Weiter <ArrowRight size={20} aria-hidden={true} focusable={false} /></>
              )}
            </button>
            <TrustBlock />
          </div>
        )}
      </div>

      {/* Popup 1: Bestellung verbindlich aufgeben (Intro + Code senden) */}
      {invoiceConfirmStage && (
        <InvoiceConfirmModal
          stage={invoiceConfirmStage}
          email={email}
          firstName={vorname}
          angebotsId={angebots_id}
          sending={invoiceCodeSending}
          verifying={invoiceCodeVerifying}
          codeInput={invoiceCodeInput}
          setCodeInput={setInvoiceCodeInput}
          onClose={() => setInvoiceConfirmStage(null)}
          onSendCode={async () => {
            setInvoiceCodeSending(true);
            try {
              const { data, error } = await supabase.functions.invoke(
                "send-verification-code",
                { body: { angebots_id } },
              );
              if (error || data?.error) {
                throw new Error(data?.error || error?.message || "Konnte Code nicht senden");
              }
              setInvoiceCheckoutSessionId(data?.checkoutSessionId ?? null);
              toast.success("Bestätigungscode an deine E-Mail gesendet");
              setInvoiceConfirmStage("code");
            } catch (e: unknown) {
              toast.error(e instanceof Error ? e.message : "Fehler beim Senden");
            } finally {
              setInvoiceCodeSending(false);
            }
          }}
          onVerify={async () => {
            setInvoiceCodeVerifying(true);
            try {
              if (!invoiceCheckoutSessionId) {
                throw new Error("Sitzung abgelaufen. Bitte Code neu anfordern.");
              }
              const { data, error } = await supabase.functions.invoke(
                "verify-verification-code",
                { body: { code: invoiceCodeInput.trim(), checkoutSessionId: invoiceCheckoutSessionId } },
              );
              if (error || data?.error) {
                throw new Error(data?.error || error?.message || "Code ungültig");
              }
              setInvoiceConfirmStage(null);
              setInvoiceCodeInput("");
              setInvoiceCheckoutSessionId(null);
              // Bestätigung erfolgreich → Bestellung anlegen
              await handleSubmit();
            } catch (e: unknown) {
              toast.error(e instanceof Error ? e.message : "Verifikation fehlgeschlagen");
            } finally {
              setInvoiceCodeVerifying(false);
            }
          }}
        />
      )}
    </div>
  );
}

type OfferSide = { regular: number; discounted: number; note?: string };
type OffersByMode = { miete?: OfferSide; kauf?: OfferSide };

// ─── STEP 0: ZAHLUNGSMODELL ────────────────────────────
function StepPaket({
  pakete, selectedId, onSelect, paymentConfig, offersByMode, offerPlan,
}: {
  pakete: FunnelPaket[];
  selectedId: string;
  onSelect: (id: string) => void;
  paymentConfig: PaymentConfig;
  offersByMode?: OffersByMode;
  offerPlan?: "pro" | "starter" | "premium";
}) {
  const mieteGloballyEnabled = !!paymentConfig.miete?.enabled;
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Welches Paket darf es sein?
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Wähle das Paket, das am besten zu Dir passt.
      </p>
      <div style={{ display: "grid", gap: 12 }}>
        {pakete.map((p, idx) => {
          const active = p.id === selectedId;
          const recommended = pakete.length >= 3 ? idx === 1 : (idx === pakete.length - 1 && pakete.length > 1);
          const showMiete = mieteGloballyEnabled && p.miete_monatlich && Number(p.miete_monatlich) > 0;
          const paketMatchesOffer = offerPlan
            ? p.id.toLowerCase().startsWith(offerPlan)
            : false;
          const mieteOffer = paketMatchesOffer ? offersByMode?.miete : undefined;
          const kaufOffer = paketMatchesOffer ? offersByMode?.kauf : undefined;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className="funnel-paymode-card"
              style={{
                textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                background: active ? "linear-gradient(135deg, #F5F4FF 0%, #FFFFFF 100%)" : "#fff",
                border: active ? `2px solid ${BRAND}` : "2px solid #E5E3FF",
                borderRadius: 16, padding: "16px",
                position: "relative",
                boxShadow: active ? "0 8px 24px rgba(79,63,240,0.15)" : "0 1px 4px rgba(0,0,0,0.03)",
                transition: "all 0.15s",
              }}
            >
              {(() => {
                const hasOffer = paketMatchesOffer && (mieteOffer || kaufOffer);
                if (hasOffer) {
                  return (
                    <>
                      <span style={{
                        position: "absolute", top: -12, right: 14,
                        background: "linear-gradient(135deg, #F59E0B, #F97316)",
                        color: "#fff",
                        fontSize: 11, fontWeight: 800, letterSpacing: "0.04em",
                        padding: "5px 12px", borderRadius: 20,
                        boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
                        whiteSpace: "nowrap",
                      }}>🎁 Freundschaftsrabatt</span>
                      {recommended && (
                        <span style={{
                          position: "absolute", top: 18, right: 14,
                          background: "#fff", color: BRAND,
                          border: `1px solid ${BRAND}`,
                          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                          padding: "2px 8px", borderRadius: 20,
                        }}>EMPFOHLEN</span>
                      )}
                    </>
                  );
                }
                if (recommended) {
                  return (
                    <span style={{
                      position: "absolute", top: -10, right: 14,
                      background: BRAND_GRADIENT, color: "#fff",
                      fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                      padding: "4px 10px", borderRadius: 20,
                    }}>EMPFOHLEN</span>
                  );
                }
                return null;
              })()}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: TEXT_DARK, marginBottom: 6 }}>
                    {p.name}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 10 }}>
                    {showMiete && (
                      <div style={{ fontSize: 20, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                        {mieteOffer ? (
                          <>
                            <span style={{ textDecoration: "line-through", fontSize: 13, fontWeight: 600, color: TEXT_MUTED, marginRight: 6 }}>{fmtEUR(mieteOffer.regular)}</span>
                            {fmtEUR(mieteOffer.discounted)}
                          </>
                        ) : (
                          fmtEUR(Number(p.miete_monatlich))
                        )}
                        <span style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 600 }}> /Monat</span>
                      </div>
                    )}
                    <div style={{ fontSize: showMiete ? 13 : 20, fontWeight: showMiete ? 600 : 800, color: showMiete ? TEXT_MUTED : BRAND, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                      {kaufOffer ? (
                        showMiete ? (
                          <>
                            oder <span style={{ textDecoration: "line-through", marginRight: 4 }}>{fmtEUR(kaufOffer.regular)}</span>
                            <strong style={{ color: BRAND }}>{fmtEUR(kaufOffer.discounted)}</strong> einmalig
                          </>
                        ) : (
                          <>
                            <span style={{ textDecoration: "line-through", fontSize: 14, marginRight: 6, color: TEXT_MUTED }}>{fmtEUR(kaufOffer.regular)}</span>
                            {fmtEUR(kaufOffer.discounted)}
                          </>
                        )
                      ) : (
                        showMiete ? `oder ${fmtEUR(p.preis)} einmalig` : fmtEUR(p.preis)
                      )}
                    </div>
                  </div>
                  {(mieteOffer || kaufOffer) && (
                    <div style={{ fontSize: 11, color: BRAND, fontWeight: 600, marginTop: 6, lineHeight: 1.4 }}>
                      🎁 {mieteOffer?.note ?? kaufOffer?.note ?? "Angebotspreis aktiv"}
                    </div>
                  )}
                  {showMiete && (
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6, lineHeight: 1.4 }}>
                      zzgl. 19% MwSt. · 12 Monate Laufzeit, danach monatlich kündbar
                    </div>
                  )}
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  border: active ? `6px solid ${BRAND}` : "2px solid #D1CFEF",
                  background: "#fff",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }} />
              </div>
            </button>
          );
        })}
      </div>
      <TrustBlock compact />
    </div>
  );
}

// ─── STEP 1: ZAHLUNGSMODELL ────────────────────────────
function StepZahlung({
  paket, paymentMode, setPaymentMode, paymentConfig, kaufEnabled, mieteEnabled, offersByMode,
}: {
  paket: FunnelPaket;
  paymentMode: PaymentMode;
  setPaymentMode: (m: PaymentMode) => void;
  paymentConfig: PaymentConfig;
  kaufEnabled: boolean;
  mieteEnabled: boolean;
  offersByMode?: OffersByMode;
}) {
  // marker
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Wie möchtest Du zahlst?
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Beide Wege — gleiches Ergebnis. Du entscheidest.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {mieteEnabled && (
          <PaymentCard
            active={paymentMode === "miete"}
            onClick={() => setPaymentMode("miete")}
            badge="EMPFOHLEN"
            title="Monatliche Miete"
            price={`${fmtEUR(Number(paket.miete_monatlich))} /Monat`}
            offerPrice={offersByMode?.miete ? {
              regular: `${fmtEUR(offersByMode.miete.regular)} /Monat`,
              discounted: `${fmtEUR(offersByMode.miete.discounted)} /Monat`,
              note: offersByMode.miete.note,
            } : undefined}
            subtitle={`Mindestlaufzeit ${paymentConfig.miete?.min_months ?? 12} Monate · danach jederzeit kündbar`}
            benefits={[
              "Niedrigere Einstiegshürde",
              "Hosting, Wartung, Support inklusive",
              "Sofort verfügbar — kein großes Budget nötig",
            ]}
            emoji="📅"
          />
        )}
        {kaufEnabled && (
          <PaymentCard
            active={paymentMode === "kauf"}
            onClick={() => setPaymentMode("kauf")}
            title="Einmalkauf"
            price={fmtEUR(paket.preis)}
            offerPrice={offersByMode?.kauf ? {
              regular: fmtEUR(offersByMode.kauf.regular),
              discounted: fmtEUR(offersByMode.kauf.discounted),
              note: offersByMode.kauf.note,
            } : undefined}
            subtitle={
              paymentConfig.kauf?.mode === "deposit" && paymentConfig.kauf.deposit_percent
                ? `${paymentConfig.kauf.deposit_percent}% Anzahlung heute · Rest nach Lieferung`
                : "Komplett heute fällig"
            }
            benefits={[
              "Die Website gehört Dir",
              "Keine laufenden Kosten",
              "Einmaliges Investment",
            ]}
            emoji="💳"
          />
        )}
      </div>
    </div>
  );
}

function PaymentCard({
  active, onClick, badge, title, price, subtitle, benefits, emoji, offerPrice,
}: {
  active: boolean;
  onClick: () => void;
  badge?: string;
  title: string;
  price: string;
  subtitle: string;
  benefits: string[];
  emoji: string;
  offerPrice?: { regular: string; discounted: string; note?: string };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="funnel-paymode-card"
      style={{
        textAlign: "left", cursor: "pointer", fontFamily: "inherit",
        background: active ? "linear-gradient(135deg, #F5F4FF 0%, #FFFFFF 100%)" : "#fff",
        border: active ? `2px solid ${BRAND}` : "2px solid #E5E3FF",
        borderRadius: 16, padding: "16px 16px 14px",
        position: "relative",
        boxShadow: active ? "0 8px 24px rgba(79,63,240,0.15)" : "0 1px 4px rgba(0,0,0,0.03)",
        transition: "all 0.15s",
      }}
    >
      {badge && (
        <span style={{
          position: "absolute", top: -10, right: 14,
          background: BRAND_GRADIENT, color: "#fff",
          fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
          padding: "4px 10px", borderRadius: 20,
        }}>{badge}</span>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }} aria-hidden="true">{emoji}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: TEXT_DARK }}>{title}</span>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: "50%",
          border: active ? `6px solid ${BRAND}` : "2px solid #D1CFEF",
          background: "#fff",
          flexShrink: 0,
          transition: "all 0.15s",
        }} />
      </div>
      {offerPrice ? (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED, textDecoration: "line-through", lineHeight: 1.1, marginBottom: 2 }}>
            {offerPrice.regular}
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4 }}>
            {offerPrice.discounted}
          </div>
          {offerPrice.note && (
            <div style={{ fontSize: 11, color: BRAND, fontWeight: 600, marginBottom: 6 }}>🎁 {offerPrice.note}</div>
          )}
        </>
      ) : (
        <div style={{ fontSize: 26, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4 }}>
          {price}
        </div>
      )}
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>{subtitle}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
        {benefits.map((b, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: TEXT_DARK }}>
            <Check size={16} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} strokeWidth={3} aria-hidden={true} focusable={false} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

// ─── STEP 1: ADD-ONS ───────────────────────────────────
function StepAddOns({
  addons, selectedIds, toggle, growthHint,
}: {
  addons: FunnelAddon[];
  selectedIds: string[];
  toggle: (id: string) => void;
  growthHint?: boolean;
}) {
  if (addons.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <Sparkles size={24} color={BRAND} style={{ margin: "0 auto 12px" }} aria-hidden={true} focusable={false} />
        <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT_DARK, marginBottom: 6 }}>Alles drin!</h2>
        <p style={{ fontSize: 14, color: TEXT_MUTED }}>
          Dein Paket enthält bereits alles, was Du brauchst. Weiter zum nächsten Schritt.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Möchtest Du noch etwas dazunehmen?
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Optional — direkt weiter oder Wachstumspaket dazunehmen.
      </p>
      {growthHint && (
        <div style={{
          marginBottom: 14, padding: "12px 14px",
          background: "#FFF7ED", border: "1px solid #FED7AA",
          borderRadius: 12, fontSize: 12.5, color: "#9A3412", lineHeight: 1.5,
        }}>
          <strong>🚀 Wachstumspaket gewählt:</strong> Wird heute <strong>nicht</strong> mit
          eingezogen. Du erhältst Deine erste Rechnung erst ab Website-Go-Live –
          monatlich per E-Mail mit Bezahllink (Karte, SEPA, Überweisung). Im Kundenportal
          kannst Du jederzeit auf automatisches Stripe-Abo umstellen.
        </div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {addons.map((a) => {
          const sel = selectedIds.includes(a.id);
          const isGrowth = a.price_type === "monthly" && /wachstum/i.test(a.name);
          if (isGrowth) {
            return <GrowthAddonCard key={a.id} addon={a} selected={sel} onToggle={() => toggle(a.id)} />;
          }
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggle(a.id)}
              className="funnel-addon-card"
              style={{
                textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                background: sel ? `${BRAND}08` : "#fff",
                border: sel ? `2px solid ${BRAND}` : "2px solid #E5E3FF",
                borderRadius: 14, padding: "14px",
                position: "relative",
                display: "flex", alignItems: "flex-start", gap: 12,
                transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: sel ? BRAND : "#fff",
                border: sel ? `2px solid ${BRAND}` : "2px solid #D1CFEF",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 2,
                transition: "all 0.15s",
              }}>
                {sel && <Check size={16} color="#fff" strokeWidth={3} aria-hidden={true} focusable={false} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                  {a.emoji && <span style={{ fontSize: 16 }} aria-hidden="true">{a.emoji}</span>}
                  <span style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>{a.name}</span>
                  {a.recommended && (
                    <span style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
                      color: BRAND, background: `${BRAND}15`,
                      padding: "2px 8px", borderRadius: 10,
                    }}>EMPFOHLEN</span>
                  )}
                </div>
                {a.description && (
                  <div style={{ fontSize: 13, color: TEXT_MUTED, lineHeight: 1.4, marginBottom: 4 }}>{a.description}</div>
                )}
                {a.social_proof && (
                  <div style={{ fontSize: 11, color: BRAND, fontWeight: 600, fontStyle: "italic" }}>{a.social_proof}</div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: TEXT_DARK }}>
                  +{fmtEUR(a.price_cents / 100)}
                </div>
                <div style={{ fontSize: 11, color: TEXT_MUTED }}>
                  {a.price_type === "monthly" ? "/Monat" : "einmalig"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP 2: KONTAKT ───────────────────────────────────
function GrowthAddonCard({
  addon, selected, onToggle,
}: {
  addon: FunnelAddon;
  selected: boolean;
  onToggle: () => void;
}) {
  const euro = addon.price_cents / 100;
  const aenderungen = euro <= 35 ? 1 : euro <= 60 ? 3 : 5;
  const isPremium = aenderungen === 5;
  const isStarter = aenderungen === 1;
  const features = [
    isStarter
      ? "1 Änderung pro Monat inklusive"
      : `Bis zu ${aenderungen} Änderungen pro Monat`,
    "Updates & Wartung",
    isStarter ? "Support per WhatsApp" : "Priority Support per WhatsApp",
    ...(isPremium ? ["Monatlicher Performance-Check"] : []),
  ];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
      style={{
        background: "#fff",
        border: selected ? `2px solid ${BRAND}` : "2px solid #E5E3FF",
        borderRadius: 16,
        padding: 18,
        boxShadow: selected ? "0 8px 24px rgba(79,63,240,0.18)" : "0 2px 10px rgba(15,12,41,0.06)",
        cursor: "pointer",
        transition: "all 0.15s",
        fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 22 }} aria-hidden="true">🚀</span>
          <span style={{ fontSize: 17, fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.01em" }}>
            Wachstumspaket
          </span>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            +{fmtEUR(euro)}
          </div>
          <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 600 }}>/Monat</div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <span style={{
          display: "inline-block",
          fontSize: 11, fontWeight: 800, letterSpacing: "0.06em",
          color: BRAND, background: `${BRAND}15`,
          padding: "4px 10px", borderRadius: 20,
        }}>
          BELIEBT BEI AKTIVEN BETRIEBEN
        </span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 8 }}>
        {features.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: TEXT_DARK }}>
            <Check size={16} color="#059669" strokeWidth={3} style={{ marginTop: 2, flexShrink: 0 }} aria-hidden={true} focusable={false} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div style={{
        marginTop: 14, paddingTop: 12,
        borderTop: "1px solid #F1F0FF",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div style={{ fontSize: 12, color: TEXT_MUTED }}>
          Monatlich kündbar — jederzeit
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: TEXT_MUTED }}>Zum Paket hinzufügen</span>
          <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          aria-pressed={selected}
          aria-label="Wachstumspaket aktivieren"
          style={{
            position: "relative",
            width: 52, height: 30, borderRadius: 999,
            border: "none", cursor: "pointer",
            background: selected ? BRAND : "#D1CFEF",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
        >
          <span style={{
            position: "absolute", top: 3, left: selected ? 25 : 3,
            width: 24, height: 24, borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            transition: "left 0.15s",
          }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepKontakt({
  vorname, setVorname, nachname, setNachname, firma, setFirma,
  email, setEmail, telefon, setTelefon,
  agb, setAgb, kostenpflichtig, setKostenpflichtig,
  summary,
  paketName,
  basisEinmalig,
  basisMonatlich,
  regularBasisEinmalig,
  regularBasisMonatlich,
  effHeuteZuZahlen,
  activeOffer,
  selectedAddons,
  payMethod, setPayMethod, stripeAvailable,
  invoiceAllowed,
  growthCommitment,
  codeUi,
}: {
  vorname: string; setVorname: (v: string) => void;
  nachname: string; setNachname: (v: string) => void;
  firma: string; setFirma: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  telefon: string; setTelefon: (v: string) => void;
  agb: boolean; setAgb: (v: boolean) => void;
  kostenpflichtig: boolean; setKostenpflichtig: (v: boolean) => void;
  summary: { heuteZuZahlen: number; heuteLabel: string; paymentMode: PaymentMode; gesamtMonatlich: number; gesamtEinmalig: number };
  paketName: string;
  basisEinmalig: number;
  basisMonatlich: number;
  regularBasisEinmalig: number;
  regularBasisMonatlich: number;
  effHeuteZuZahlen: number;
  activeOffer: { base: number; discounted: number; label: string; note?: string; mode: PaymentMode } | null;
  selectedAddons: FunnelAddon[];
  payMethod: PayMethod; setPayMethod: (m: PayMethod) => void;
  stripeAvailable: boolean;
  invoiceAllowed: boolean;
  growthCommitment: { amountCents: number; checked: boolean; setChecked: (v: boolean) => void } | null;
  codeUi: {
    appliedCodes: Array<{ code: string; label: string; type: 'discount' | 'unlock'; discount_amount_cents: number }>;
    codeInput: string;
    setCodeInput: (v: string) => void;
    submitCode: () => void | Promise<void>;
    removeCode: (code: string) => void | Promise<void>;
    codeSubmitting: boolean;
    codeError: string | null;
    codeNotice: string | null;
    serverPricing: { netto: number; mwst: number; brutto: number; discount_cents: number } | null;
  };
}) {
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px",
    fontSize: 15, fontFamily: "inherit",
    border: "2px solid #E5E3FF", borderRadius: 10,
    color: TEXT_DARK, background: "#fff",
    transition: "all 0.15s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700,
    color: TEXT_MUTED, marginBottom: 4,
    textTransform: "uppercase", letterSpacing: "0.06em",
  };
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Deine Kontaktdaten
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Damit wir Dir Auftragsbestätigung und Rechnung zusenden können.
      </p>

      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Vorname *</label>
            <input className="funnel-input" style={inputStyle} value={vorname} onChange={(e) => setVorname(e.target.value)} autoComplete="given-name" />
          </div>
          <div>
            <label style={labelStyle}>Nachname *</label>
            <input className="funnel-input" style={inputStyle} value={nachname} onChange={(e) => setNachname(e.target.value)} autoComplete="family-name" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Firma *</label>
          <input className="funnel-input" style={inputStyle} value={firma} onChange={(e) => setFirma(e.target.value)} autoComplete="organization" />
        </div>
        <div>
          <label style={labelStyle}>E-Mail *</label>
          <input className="funnel-input" type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <label style={labelStyle}>Telefon (optional)</label>
          <input className="funnel-input" type="tel" style={inputStyle} value={telefon} onChange={(e) => setTelefon(e.target.value)} autoComplete="tel" />
        </div>
      </div>

      <div style={{
        marginTop: 18, padding: "12px 14px",
        background: "#F5F4FF", borderRadius: 12,
        border: `1px solid ${BRAND}22`,
        fontSize: 13, color: TEXT_DARK, lineHeight: 1.5,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Deine Bestellung</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <strong style={{ fontWeight: 700 }}>{paketName}-Paket</strong>
          <span style={{ fontWeight: 600, color: TEXT_DARK, whiteSpace: "nowrap" }}>
            {summary.paymentMode === "miete" ? (
              activeOffer?.mode === "miete" ? (
                <>
                  <span style={{ textDecoration: "line-through", color: TEXT_MUTED, marginRight: 6, fontWeight: 500 }}>{fmtEUR(regularBasisMonatlich)}</span>
                  {fmtEUR(basisMonatlich)}/Monat
                </>
              ) : `${fmtEUR(basisMonatlich)}/Monat`
            ) : (
              activeOffer?.mode === "kauf" ? (
                <>
                  <span style={{ textDecoration: "line-through", color: TEXT_MUTED, marginRight: 6, fontWeight: 500 }}>{fmtEUR(regularBasisEinmalig)}</span>
                  {fmtEUR(basisEinmalig)} einmalig
                </>
              ) : `${fmtEUR(basisEinmalig)} einmalig`
            )}
          </span>
        </div>
        {activeOffer && (
          <div style={{ fontSize: 11, color: BRAND, fontWeight: 600, marginTop: 4 }}>
            {activeOffer.label}
          </div>
        )}
        {selectedAddons.length > 0 && (
          <div style={{ marginTop: 6, display: "grid", gap: 4 }}>
            {selectedAddons.map((a) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, fontSize: 12 }}>
                <span style={{ color: TEXT_DARK }}>+ {a.name}</span>
                <span style={{ color: TEXT_DARK, whiteSpace: "nowrap" }}>
                  {a.price_type === "monthly"
                    ? `${fmtEUR(a.price_cents / 100)}/Monat`
                    : `${fmtEUR(a.price_cents / 100)} einmalig`}
                </span>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 1, background: `${BRAND}22`, margin: "10px 0" }} />
        {(() => {
          const featuresByName: Record<string, string[]> = {
            Starter: [
              "1 Seite vollständig ausgebaut",
              "Individuelle Texte & Inhalte",
              "Mobil optimiert",
              "Hosting, Domain & SSL",
            ],
            Pro: [
              "Alles aus Starter inklusive",
              "Bis zu 5 Seiten",
              "Google Maps & Google Business",
              "SEO-Grundlagen",
              "Fertig in ca. 2 Wochen",
            ],
            Premium: [
              "Alles aus Pro inklusive",
              "Bis zu 10 Seiten – Deine komplette Online-Präsenz",
              "Google-Optimierung beim Launch",
              "Smarte Extras möglich – Terminbuchung, Rechner oder Anfrage-Tool",
              "Feinschliff nach Launch inklusive",
              "Angebotsanfrage-Formular",
              "Bis zu 3 zusätzliche Landingpages inklusive",
              "Persönlicher Ansprechpartner",
            ],
          };
          const feats = featuresByName[paketName] ?? [];
          if (feats.length === 0) return null;
          return (
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: TEXT_MUTED,
                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
              }}>
                Was inklusive ist:
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 4 }}>
                {feats.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 6, fontSize: 12, color: TEXT_DARK, lineHeight: 1.45 }}>
                    <span style={{ color: BRAND, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
        <div style={{ height: 1, background: `${BRAND}22`, margin: "10px 0" }} />
        {/* AKTIVE CODES (Multi-Code-System) */}
        {codeUi.appliedCodes.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: TEXT_MUTED,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6,
            }}>
              Aktive Codes
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {codeUi.appliedCodes.map((c) => {
                const suffix = c.type === "discount"
                  ? `−${fmtEUR(c.discount_amount_cents / 100)}`
                  : "Rechnung freigeschaltet";
                return (
                  <span key={c.code} style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "4px 4px 4px 10px", borderRadius: 999,
                    background: c.type === "discount" ? `${BRAND}18` : "rgba(34,197,94,0.14)",
                    color: c.type === "discount" ? BRAND : "#166534",
                    fontSize: 12, fontWeight: 600,
                  }}>
                    <span>{c.code} · {suffix}</span>
                    <button
                      type="button"
                      onClick={() => codeUi.removeCode(c.code)}
                      aria-label={`Code ${c.code} entfernen`}
                      style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        width: 20, height: 20, borderRadius: 999, border: "none",
                        background: "rgba(255,255,255,0.6)", color: "inherit",
                        cursor: "pointer", padding: 0,
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Code eingeben */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
            <input
              type="text"
              value={codeUi.codeInput}
              onChange={(e) => codeUi.setCodeInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); codeUi.submitCode(); } }}
              placeholder="Code eingeben"
              aria-label="Rabatt- oder Freischaltcode"
              maxLength={64}
              disabled={codeUi.codeSubmitting}
              style={{
                flex: 1, minWidth: 0, padding: "8px 10px",
                borderRadius: 8, border: `1px solid ${BRAND}40`,
                fontSize: 13, background: "#fff", color: TEXT_DARK,
                textTransform: "uppercase", letterSpacing: "0.04em",
                fontFamily: "inherit",
              }}
            />
            <button
              type="button"
              onClick={() => codeUi.submitCode()}
              disabled={!codeUi.codeInput.trim() || codeUi.codeSubmitting}
              style={{
                padding: "8px 14px", borderRadius: 8, border: "none",
                background: BRAND_GRADIENT, color: "#fff", fontWeight: 700,
                fontSize: 13, cursor: codeUi.codeSubmitting ? "wait" : "pointer",
                opacity: (!codeUi.codeInput.trim() || codeUi.codeSubmitting) ? 0.55 : 1,
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "inherit",
              }}
            >
              {codeUi.codeSubmitting && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
              Einlösen
            </button>
          </div>
          <div aria-live="polite" style={{ minHeight: 16, marginTop: 4 }}>
            {codeUi.codeError && (
              <div style={{ fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>{codeUi.codeError}</div>
            )}
            {!codeUi.codeError && codeUi.codeNotice && (
              <div style={{ fontSize: 12, color: BRAND, fontWeight: 600 }}>{codeUi.codeNotice}</div>
            )}
          </div>
        </div>

        {(() => {
          // Preise: bevorzugt aus Server-Antwort, sonst lokaler Fallback.
          const useServer = codeUi.serverPricing != null && (codeUi.appliedCodes.length > 0 || codeUi.serverPricing.discount_cents > 0);
          const netto = useServer ? codeUi.serverPricing!.netto : effHeuteZuZahlen;
          const mwst = useServer ? codeUi.serverPricing!.mwst : Math.round(effHeuteZuZahlen * 19) / 100;
          const brutto = useServer ? codeUi.serverPricing!.brutto : Math.round(effHeuteZuZahlen * 119) / 100;
          return (
            <>
              <div style={{ fontSize: 12, color: TEXT_MUTED }}>
                {summary.heuteLabel}: <strong style={{ color: TEXT_DARK }}>{fmtEUR(netto)}</strong>
              </div>
              <div style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>
                MwSt. 19%: <strong style={{ color: TEXT_DARK }}>{fmtEUR(mwst)}</strong>
              </div>
              <div style={{ fontSize: 13, color: TEXT_DARK, marginTop: 6, fontWeight: 700 }}>
                Gesamtpreis brutto: {fmtEUR(brutto)}
              </div>
            </>
          );
        })()}
      </div>

      {stripeAvailable && (
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Zahlungsart
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(["online", "rechnung"] as const).map((m) => {
              const disabled = m === "rechnung" && !invoiceAllowed;
              const active = payMethod === m && !disabled;
              const tooltipText = "Rechnungszahlung ist nur für freigeschaltete Kundenkonten verfügbar. Bitte kontaktiere uns telefonisch unter 06131 3076498 oder per Mail an info@meine-traum-webseite.de.";
              return (
                <div key={m} style={{ position: "relative" }} className={disabled ? "rechnung-disabled-wrap" : undefined}>
                  <button
                    type="button"
                    onClick={() => { if (!disabled) setPayMethod(m); }}
                    disabled={disabled}
                    title={disabled ? tooltipText : undefined}
                    aria-disabled={disabled || undefined}
                    style={{
                      width: "100%",
                      padding: "12px 10px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      background: active ? `${BRAND}10` : "#fff",
                      border: active ? `2px solid ${BRAND}` : "2px solid #E5E3FF",
                      borderRadius: 12, textAlign: "center",
                      transition: "all 0.15s",
                      opacity: disabled ? 0.5 : 1,
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }} aria-hidden="true">
                      {m === "online" ? "💳" : "📄"}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK }}>
                      {m === "online" ? "Online zahlen" : "Auf Rechnung"}
                    </div>
                    <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                      {m === "online"
                        ? "Karte, Apple/Google Pay"
                        : disabled ? "Aktuell nicht verfügbar" : "Zahlungsziel 14 Tage"}
                    </div>
                  </button>
                  {disabled && (
                    <div
                      role="tooltip"
                      className="rechnung-tooltip"
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#111827",
                        color: "#fff",
                        padding: "10px 12px",
                        borderRadius: 8,
                        fontSize: 12,
                        lineHeight: 1.4,
                        width: 260,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                        opacity: 0,
                        pointerEvents: "none",
                        transition: "opacity 0.15s",
                        zIndex: 20,
                      }}
                    >
                      Diese Bezahlmethode ist aktuell nicht verfügbar. Für weitere Infos bitte Kontakt aufnehmen:
                      <div style={{ marginTop: 6 }}>
                        📞 <a href="tel:+4961313076498" style={{ color: "#93C5FD", fontWeight: 700 }}>06131 3076498</a>
                      </div>
                      <div style={{ marginTop: 2 }}>
                        ✉ <a href="mailto:info@meine-traum-webseite.de" style={{ color: "#93C5FD", fontWeight: 700 }}>info@meine-traum-webseite.de</a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <style>{`
            .rechnung-disabled-wrap:hover .rechnung-tooltip,
            .rechnung-disabled-wrap:focus-within .rechnung-tooltip {
              opacity: 1 !important;
              pointer-events: auto !important;
            }
          `}</style>
        </div>
      )}

      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: TEXT_DARK, cursor: "pointer", lineHeight: 1.4 }}>
          <input type="checkbox" checked={agb} onChange={(e) => setAgb(e.target.checked)} style={{ marginTop: 3, accentColor: BRAND, width: 16, height: 16, flexShrink: 0 }} />
          <span>
            Ich akzeptiere die <a href="/agb" target="_blank" rel="noopener noreferrer" style={{ color: BRAND, fontWeight: 700 }}>AGB</a> und die <a href="/datenschutz" target="_blank" rel="noopener noreferrer" style={{ color: BRAND, fontWeight: 700 }}>Datenschutzerklärung</a>.
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: TEXT_DARK, cursor: "pointer", lineHeight: 1.4 }}>
          <input type="checkbox" checked={kostenpflichtig} onChange={(e) => setKostenpflichtig(e.target.checked)} style={{ marginTop: 3, accentColor: BRAND, width: 16, height: 16, flexShrink: 0 }} />
          <span>
            Mir ist bewusst, dass mit Bestätigung ein <strong>kostenpflichtiger Auftrag</strong> zustande kommt.
          </span>
        </label>
        {growthCommitment && (
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13,
            color: TEXT_DARK, cursor: "pointer", lineHeight: 1.4,
            padding: "10px 12px", background: "#FFF7ED",
            border: "1px solid #FED7AA", borderRadius: 10,
          }}>
            <input type="checkbox" checked={growthCommitment.checked}
              onChange={(e) => growthCommitment.setChecked(e.target.checked)}
              style={{ marginTop: 3, accentColor: "#EA580C", width: 16, height: 16, flexShrink: 0 }} />
            <span>
              Ich bestelle das <strong>Wachstumspaket</strong> verbindlich für
              <strong> {fmtEUR(growthCommitment.amountCents / 100)}/Monat netto</strong>.
              Mindestlaufzeit 12 Monate ab Website-Go-Live, danach monatlich kündbar.
              Abrechnung zunächst per Rechnung – Umstellung auf automatische Stripe-Zahlung
              jederzeit im Kundenportal möglich.
            </span>
          </label>
        )}
      </div>
    </div>
  );
}

// ─── STEP 3: FERTIG ────────────────────────────────────
function StepBezahlen(props: React.ComponentProps<typeof StripeEmbeddedCheckoutBox>) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Sichere Bezahlung
      </h2>
      <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 16 }}>
        Deine Buchung ist registriert. Schließen Du nun die Zahlung ab — sicher über Stripe.
      </p>
      <StripeEmbeddedCheckoutBox {...props} />
    </div>
  );
}

function StepFertig({ auftragsNr, email }: { auftragsNr: string; email: string }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 10px" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "#10B98115", color: "#10B981",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <Check size={24} strokeWidth={3} aria-hidden={true} focusable={false} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT_DARK, marginBottom: 8, letterSpacing: "-0.02em" }}>
        Vielen Dank!
      </h2>
      <p style={{ fontSize: 15, color: TEXT_MUTED, marginBottom: 16, lineHeight: 1.5 }}>
        Dein Auftrag <strong style={{ color: TEXT_DARK }}>{auftragsNr}</strong> wurde verbindlich angenommen.
      </p>
      <p style={{ fontSize: 13, color: TEXT_MUTED }}>
        Eine Bestätigung wurde an <strong style={{ color: TEXT_DARK }}>{email}</strong> versendet.
      </p>
    </div>
  );
}
// ─── INVOICE CONFIRM MODAL ─────────────────────────────
// Zweistufiges Popup, das nach Klick auf "Weiter zur Zahlung" bei payMethod=rechnung
// erscheint: Stage 1 = Info + "Code senden", Stage 2 = Code-Eingabe.
function InvoiceConfirmModal({
  stage, email, firstName, angebotsId,
  sending, verifying, codeInput, setCodeInput,
  onClose, onSendCode, onVerify,
}: {
  stage: "intro" | "code";
  email: string;
  firstName: string;
  angebotsId?: string;
  sending: boolean;
  verifying: boolean;
  codeInput: string;
  setCodeInput: (v: string) => void;
  onClose: () => void;
  onSendCode: () => void;
  onVerify: () => void;
}) {
  const cleanCode = codeInput.replace(/\D/g, "").slice(0, 6);
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget && !sending && !verifying) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 10100,
        background: "rgba(15,12,41,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%", maxWidth: 460,
          background: "#fff", borderRadius: 20,
          padding: "28px 26px 24px",
          boxShadow: "0 30px 80px rgba(15,12,41,0.35)",
          fontFamily: "inherit",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={sending || verifying}
          aria-label="Schließen"
          style={{
            position: "absolute", top: 16, right: 16,
            background: "transparent", border: "none",
            color: TEXT_MUTED, cursor: "pointer",
            display: "none",
          }}
        >
          <X size={18} aria-hidden={true} focusable={false} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#F5F4FF", color: BRAND,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Shield size={18} aria-hidden={true} focusable={false} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: TEXT_DARK, margin: 0, letterSpacing: "-0.02em" }}>
            Bestellung verbindlich aufgeben
          </h3>
        </div>

        {stage === "intro" ? (
          <>
            <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, margin: "10px 0 4px" }}>
              Du bestätigst hiermit eine <strong style={{ color: TEXT_DARK }}>verbindliche, kostenpflichtige Bestellung</strong> auf
              Rechnungsbasis. Zur Sicherheit senden wir dir einen Bestätigungscode an deine hinterlegte
              Geschäfts-E-Mail-Adresse.
            </p>
            <div style={{
              marginTop: 14, padding: "10px 12px",
              background: "#F5F4FF", border: "1px solid #E5E3FF",
              borderRadius: 10, fontSize: 13, color: TEXT_DARK,
              wordBreak: "break-all",
            }}>
              📧 {email || "—"}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                style={{
                  flex: "0 0 auto", padding: "12px 16px",
                  background: "#fff", border: `2px solid #E5E3FF`,
                  color: TEXT_DARK, borderRadius: 12, fontWeight: 700, fontSize: 14,
                  cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit",
                }}
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={onSendCode}
                disabled={sending || !email}
                style={{
                  flex: 1, padding: "12px 16px",
                  background: sending || !email ? "#D1CFEF" : BRAND_GRADIENT,
                  color: "#fff", border: "none", borderRadius: 12,
                  fontWeight: 700, fontSize: 14, fontFamily: "inherit",
                  cursor: sending || !email ? "not-allowed" : "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: sending || !email ? "none" : "0 8px 24px rgba(79,63,240,0.3)",
                }}
              >
                {sending ? (
                  <><Loader2 size={16} className="animate-spin" aria-hidden={true} focusable={false} /> Sende…</>
                ) : (
                  <>Code senden <ArrowRight size={16} aria-hidden={true} focusable={false} /></>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6, margin: "10px 0 4px" }}>
              Wir haben einen 6-stelligen Bestätigungscode an <strong style={{ color: TEXT_DARK }}>{email}</strong> gesendet.
              Bitte trage ihn hier ein, um die Bestellung verbindlich auszulösen.
            </p>
            <input
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={cleanCode}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="123456"
              aria-label="6-stelliger Bestätigungscode"
              style={{
                width: "100%", marginTop: 16, padding: "14px 16px",
                textAlign: "center", fontSize: 26, fontWeight: 800,
                letterSpacing: "0.4em", fontFamily: "ui-monospace, monospace",
                border: `2px solid #E5E3FF`, borderRadius: 12,
                color: TEXT_DARK, background: "#fff",
              }}
            />
            <button
              type="button"
              onClick={onSendCode}
              disabled={sending}
              style={{
                marginTop: 8, background: "transparent", border: "none",
                color: BRAND, fontWeight: 600, fontSize: 12,
                cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit",
                padding: "4px 0",
              }}
            >
              {sending ? "Sende neuen Code…" : "Code erneut senden"}
            </button>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                type="button"
                onClick={onClose}
                disabled={verifying}
                style={{
                  flex: "0 0 auto", padding: "12px 16px",
                  background: "#fff", border: `2px solid #E5E3FF`,
                  color: TEXT_DARK, borderRadius: 12, fontWeight: 700, fontSize: 14,
                  cursor: verifying ? "not-allowed" : "pointer", fontFamily: "inherit",
                }}
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={onVerify}
                disabled={verifying || cleanCode.length !== 6}
                style={{
                  flex: 1, padding: "12px 16px",
                  background: verifying || cleanCode.length !== 6 ? "#D1CFEF" : BRAND_GRADIENT,
                  color: "#fff", border: "none", borderRadius: 12,
                  fontWeight: 700, fontSize: 14, fontFamily: "inherit",
                  cursor: verifying || cleanCode.length !== 6 ? "not-allowed" : "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: verifying || cleanCode.length !== 6 ? "none" : "0 8px 24px rgba(79,63,240,0.3)",
                }}
              >
                {verifying ? (
                  <><Loader2 size={16} className="animate-spin" aria-hidden={true} focusable={false} /> Prüfe…</>
                ) : (
                  <>Verbindlich bestellen <ArrowRight size={16} aria-hidden={true} focusable={false} /></>
                )}
              </button>
            </div>
          </>
        )}
        <p style={{ fontSize: 11, color: TEXT_MUTED, textAlign: "center", marginTop: 14, lineHeight: 1.4 }}>
          Mit dem Absenden bestätigst du eine kostenpflichtige Bestellung. Die Rechnung erhältst du per E-Mail.
        </p>
      </div>
    </div>
  );
}
