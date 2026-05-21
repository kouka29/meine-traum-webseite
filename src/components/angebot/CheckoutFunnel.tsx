import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, Check, Loader2, Shield, ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BRAND = "#4F3FF0";
const BRAND_GRADIENT = "linear-gradient(135deg, #4F3FF0, #7B5EF8)";
const TEXT_DARK = "#1E1B4B";
const TEXT_MUTED = "#6B7280";

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
}

interface Props {
  open: boolean;
  onClose: () => void;
  paket: FunnelPaket;
  addons: FunnelAddon[];
  paymentConfig: PaymentConfig;
  angebots_id?: string;
  leadEmail?: string;
  leadName?: string;
  stripeLink?: string | null; // optional fallback for stripe payment
}

type PaymentMode = "kauf" | "miete";
type Step = 0 | 1 | 2 | 3;

function fmtEUR(n: number) {
  return n.toLocaleString("de-DE") + " €";
}

export default function CheckoutFunnel({
  open, onClose, paket, addons, paymentConfig, angebots_id, leadEmail, leadName, stripeLink,
}: Props) {
  const kaufEnabled = paymentConfig.kauf?.enabled !== false;
  const mieteEnabled = !!paymentConfig.miete?.enabled && !!paket.miete_monatlich;

  const [step, setStep] = useState<Step>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(mieteEnabled ? "miete" : "kauf");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    () => addons.filter((a) => a.default_selected).map((a) => a.id),
  );
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ auftrags_nr: string } | null>(null);

  // Kontaktdaten
  const initialName = (leadName || "").split(" ");
  const [vorname, setVorname] = useState(initialName[0] || "");
  const [nachname, setNachname] = useState(initialName.slice(1).join(" ") || "");
  const [firma, setFirma] = useState("");
  const [email, setEmail] = useState(leadEmail || "");
  const [telefon, setTelefon] = useState("");
  const [agb, setAgb] = useState(false);
  const [kostenpflichtig, setKostenpflichtig] = useState(false);

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep(0);
      setSuccess(null);
      setPaymentMode(mieteEnabled ? "miete" : "kauf");
      setSelectedAddonIds(addons.filter((a) => a.default_selected).map((a) => a.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, paket.id]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const selectedAddons = useMemo(
    () => addons.filter((a) => selectedAddonIds.includes(a.id)),
    [addons, selectedAddonIds],
  );

  // Preisberechnung
  const basisEinmalig = paymentMode === "kauf" ? paket.preis : 0;
  const basisMonatlich = paymentMode === "miete" ? Number(paket.miete_monatlich || 0) : 0;
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
    if (cfg.mode === "deposit" && cfg.deposit_percent) {
      heuteZuZahlen = Math.round((basisEinmalig * cfg.deposit_percent) / 100) + addonsEinmalig;
      heuteLabel = `Anzahlung ${cfg.deposit_percent}% heute · Rest nach Lieferung`;
    } else {
      heuteZuZahlen = gesamtEinmalig;
      heuteLabel = "Einmalig heute fällig";
    }
  } else {
    heuteZuZahlen = gesamtMonatlich + addonsEinmalig;
    heuteLabel = addonsEinmalig > 0
      ? "Erster Monat + einmalige Zusätze heute fällig"
      : "Erster Monat heute · monatlich kündbar nach Mindestlaufzeit";
  }

  const toggleAddon = (id: string) =>
    setSelectedAddonIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const canProceedFromStep = (s: Step): boolean => {
    if (s === 0) return (paymentMode === "kauf" && kaufEnabled) || (paymentMode === "miete" && mieteEnabled);
    if (s === 1) return true;
    if (s === 2) {
      return vorname.trim().length >= 1
        && nachname.trim().length >= 1
        && firma.trim().length >= 1
        && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())
        && agb && kostenpflichtig;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const positions: { titel: string; preis: number }[] = [];
      if (paymentMode === "kauf") {
        positions.push({ titel: `Paket: ${paket.name} (Einmalkauf)`, preis: paket.preis });
      } else {
        positions.push({ titel: `Paket: ${paket.name} (Miete, erster Monat)`, preis: Number(paket.miete_monatlich || 0) });
      }
      for (const a of selectedAddons) {
        const preis = a.price_type === "monthly"
          ? a.price_cents / 100
          : a.price_cents / 100;
        const titelSuffix = a.price_type === "monthly" ? " (monatlich, erster Monat)" : "";
        positions.push({ titel: `${a.name}${titelSuffix}`, preis });
      }

      const { data, error } = await supabase.functions.invoke("buchung-erstellen", {
        body: {
          angebots_id,
          kunde_vorname: vorname.trim(),
          kunde_nachname: nachname.trim(),
          kunde_firma: firma.trim(),
          kunde_email: email.trim(),
          kunde_telefon: telefon.trim(),
          payment_method: stripeLink ? "stripe" : "rechnung",
          positions,
          pakete: [{
            id: paket.id, name: paket.name,
            preis: paket.preis,
            miete_monatlich: paket.miete_monatlich || null,
            payment_mode: paymentMode,
          }],
          addons: selectedAddons.map((a) => ({
            id: a.id, name: a.name,
            price_cents: a.price_cents, price_type: a.price_type,
          })),
          agb_akzeptiert: true,
          kostenpflichtig_bestaetigt: true,
        },
      });
      if (error || data?.error) {
        throw new Error(data?.error || error?.message || "Speichern fehlgeschlagen");
      }
      setSuccess({ auftrags_nr: data.auftrags_nr });
      setStep(3);

      // Falls Stripe Payment Link gewünscht → kurz Bestätigung zeigen, dann redirect
      if (stripeLink) {
        setTimeout(() => {
          window.location.href = stripeLink;
        }, 1500);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Fehler beim Abschicken";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const stepLabels = ["Zahlung", "Extras", "Kontakt", "Fertig"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: "rgba(15, 12, 41, 0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
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
        .funnel-panel { animation: funnelSlideIn 0.32s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @media (max-width: 767px) {
          .funnel-panel { animation: funnelSlideUp 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) !important; }
        }
        .funnel-addon-card:hover { border-color: ${BRAND}80 !important; }
        .funnel-paymode-card:hover { border-color: ${BRAND}80 !important; }
        .funnel-input:focus { outline: none; border-color: ${BRAND} !important; box-shadow: 0 0 0 3px ${BRAND}22 !important; }
      `}</style>

      <div
        className="funnel-panel"
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: 520,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(15,12,41,0.25)",
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
          {step > 0 && step < 3 && !submitting ? (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 4,
                color: TEXT_MUTED, fontSize: 14, fontWeight: 600, padding: "6px 8px",
                borderRadius: 8, fontFamily: "inherit",
              }}
              aria-label="Zurück"
            >
              <ChevronLeft size={18} /> Zurück
            </button>
          ) : <span />}
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, letterSpacing: "-0.01em" }}>
            {paket.name}
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
            <X size={20} />
          </button>
        </div>

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
                    {done ? <Check size={12} strokeWidth={3} /> : i + 1}
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
            Schritt {step + 1} von 4 · {stepLabels[step]}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "20px",
        }}>
          {step === 0 && (
            <StepZahlung
              paket={paket}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              paymentConfig={paymentConfig}
              kaufEnabled={kaufEnabled}
              mieteEnabled={mieteEnabled}
            />
          )}
          {step === 1 && (
            <StepAddOns
              addons={addons}
              selectedIds={selectedAddonIds}
              toggle={toggleAddon}
            />
          )}
          {step === 2 && (
            <StepKontakt
              vorname={vorname} setVorname={setVorname}
              nachname={nachname} setNachname={setNachname}
              firma={firma} setFirma={setFirma}
              email={email} setEmail={setEmail}
              telefon={telefon} setTelefon={setTelefon}
              agb={agb} setAgb={setAgb}
              kostenpflichtig={kostenpflichtig} setKostenpflichtig={setKostenpflichtig}
              summary={{ heuteZuZahlen, heuteLabel, paymentMode, gesamtMonatlich, gesamtEinmalig }}
            />
          )}
          {step === 3 && success && (
            <StepFertig auftragsNr={success.auftrags_nr} stripeRedirect={!!stripeLink} email={email} />
          )}
        </div>

        {/* FOOTER (Summary + CTA) */}
        {step < 3 && (
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
              <div>
                <div style={{ fontSize: 11, color: TEXT_MUTED, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {step === 2 ? "Heute zu zahlen" : "Ihre Auswahl"}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {paymentMode === "miete" && step !== 2 ? (
                    <>
                      {fmtEUR(gesamtMonatlich)} <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED }}>/Monat</span>
                      {addonsEinmalig > 0 && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_MUTED }}> · +{fmtEUR(addonsEinmalig)} einmalig</span>
                      )}
                    </>
                  ) : step === 2 ? (
                    fmtEUR(heuteZuZahlen)
                  ) : (
                    fmtEUR(gesamtEinmalig)
                  )}
                </div>
                {step === 2 && (
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{heuteLabel}</div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: TEXT_MUTED }}>
                <Shield size={12} /> Sicher
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!canProceedFromStep(step)) return;
                if (step === 2) {
                  handleSubmit();
                } else {
                  setStep((s) => (s + 1) as Step);
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
                <><Loader2 size={18} className="animate-spin" /> Wird abgeschickt…</>
              ) : step === 2 ? (
                <>Verbindlich beauftragen <ArrowRight size={18} /></>
              ) : (
                <>Weiter <ArrowRight size={18} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 0: ZAHLUNGSMODELL ────────────────────────────
function StepZahlung({
  paket, paymentMode, setPaymentMode, paymentConfig, kaufEnabled, mieteEnabled,
}: {
  paket: FunnelPaket;
  paymentMode: PaymentMode;
  setPaymentMode: (m: PaymentMode) => void;
  paymentConfig: PaymentConfig;
  kaufEnabled: boolean;
  mieteEnabled: boolean;
}) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Wie möchten Sie zahlen?
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Beide Wege — gleiches Ergebnis. Sie entscheiden.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {mieteEnabled && (
          <PaymentCard
            active={paymentMode === "miete"}
            onClick={() => setPaymentMode("miete")}
            badge="EMPFOHLEN"
            title="Monatliche Miete"
            price={`${fmtEUR(Number(paket.miete_monatlich))} /Monat`}
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
            subtitle={
              paymentConfig.kauf?.mode === "deposit" && paymentConfig.kauf.deposit_percent
                ? `${paymentConfig.kauf.deposit_percent}% Anzahlung heute · Rest nach Lieferung`
                : "Komplett heute fällig"
            }
            benefits={[
              "Die Website gehört Ihnen",
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
  active, onClick, badge, title, price, subtitle, benefits, emoji,
}: {
  active: boolean;
  onClick: () => void;
  badge?: string;
  title: string;
  price: string;
  subtitle: string;
  benefits: string[];
  emoji: string;
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
      <div style={{ fontSize: 26, fontWeight: 800, color: BRAND, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4 }}>
        {price}
      </div>
      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 10 }}>{subtitle}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
        {benefits.map((b, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 13, color: TEXT_DARK }}>
            <Check size={14} color="#059669" style={{ marginTop: 2, flexShrink: 0 }} strokeWidth={3} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

// ─── STEP 1: ADD-ONS ───────────────────────────────────
function StepAddOns({
  addons, selectedIds, toggle,
}: {
  addons: FunnelAddon[];
  selectedIds: string[];
  toggle: (id: string) => void;
}) {
  if (addons.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <Sparkles size={32} color={BRAND} style={{ margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: 18, fontWeight: 800, color: TEXT_DARK, marginBottom: 6 }}>Alles drin!</h2>
        <p style={{ fontSize: 14, color: TEXT_MUTED }}>
          Ihr Paket enthält bereits alles, was Sie brauchen. Weiter zum nächsten Schritt.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: TEXT_DARK, marginBottom: 6, letterSpacing: "-0.02em" }}>
        Möchten Sie etwas hinzufügen?
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Optional — Sie können einzelne Extras dazubuchen oder direkt weiter.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {addons.map((a) => {
          const sel = selectedIds.includes(a.id);
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
                {sel && <Check size={14} color="#fff" strokeWidth={3} />}
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
function StepKontakt({
  vorname, setVorname, nachname, setNachname, firma, setFirma,
  email, setEmail, telefon, setTelefon,
  agb, setAgb, kostenpflichtig, setKostenpflichtig,
  summary,
}: {
  vorname: string; setVorname: (v: string) => void;
  nachname: string; setNachname: (v: string) => void;
  firma: string; setFirma: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  telefon: string; setTelefon: (v: string) => void;
  agb: boolean; setAgb: (v: boolean) => void;
  kostenpflichtig: boolean; setKostenpflichtig: (v: boolean) => void;
  summary: { heuteZuZahlen: number; heuteLabel: string; paymentMode: PaymentMode; gesamtMonatlich: number; gesamtEinmalig: number };
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
        Ihre Kontaktdaten
      </h2>
      <p style={{ fontSize: 14, color: TEXT_MUTED, marginBottom: 20 }}>
        Damit wir Ihre Auftragsbestätigung und Rechnung senden können.
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
        <div style={{ fontWeight: 700, marginBottom: 4 }}>Zusammenfassung</div>
        {summary.paymentMode === "miete" ? (
          <div>
            Monatliche Miete: <strong>{fmtEUR(summary.gesamtMonatlich)}</strong>/Monat
          </div>
        ) : (
          <div>
            Einmalkauf: <strong>{fmtEUR(summary.gesamtEinmalig)}</strong>
          </div>
        )}
        <div style={{ marginTop: 4, fontSize: 12, color: TEXT_MUTED }}>
          {summary.heuteLabel}: <strong style={{ color: TEXT_DARK }}>{fmtEUR(summary.heuteZuZahlen)}</strong>
        </div>
      </div>

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
      </div>
    </div>
  );
}

// ─── STEP 3: FERTIG ────────────────────────────────────
function StepFertig({ auftragsNr, stripeRedirect, email }: { auftragsNr: string; stripeRedirect: boolean; email: string }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 10px" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "#10B98115", color: "#10B981",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <Check size={32} strokeWidth={3} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT_DARK, marginBottom: 8, letterSpacing: "-0.02em" }}>
        Vielen Dank!
      </h2>
      <p style={{ fontSize: 15, color: TEXT_MUTED, marginBottom: 16, lineHeight: 1.5 }}>
        Ihr Auftrag <strong style={{ color: TEXT_DARK }}>{auftragsNr}</strong> wurde verbindlich angenommen.
      </p>
      <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 20 }}>
        Eine Bestätigung wurde an <strong style={{ color: TEXT_DARK }}>{email}</strong> versendet.
      </p>
      {stripeRedirect && (
        <div style={{
          padding: "12px 14px", background: "#F5F4FF",
          borderRadius: 12, border: `1px solid ${BRAND}22`,
          fontSize: 13, color: TEXT_DARK,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          <Loader2 size={14} className="animate-spin" color={BRAND} />
          Sie werden zur sicheren Bezahlung weitergeleitet…
        </div>
      )}
    </div>
  );
}