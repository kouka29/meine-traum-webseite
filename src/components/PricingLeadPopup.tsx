import { useEffect, useRef, useState } from "react";
import { X, Check, ShieldCheck, Loader2, ArrowRight, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submitLead";

interface PricingLeadPopupProps {
  open: boolean;
  badge: string;
  onClose: () => void;
}

// Map badge to CTA button label
const getCtaLabel = (badge: string) => {
  const b = badge.toLowerCase();
  if (b.includes("enterprise")) return "Beratung anfragen";
  return "Jetzt kostenlos Termin sichern";
};

type FloatingFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  inputRef?: React.RefObject<HTMLInputElement>;
};

const FloatingField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  autoComplete,
  maxLength,
  inputRef,
}: FloatingFieldProps) => {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          maxLength={maxLength}
          placeholder=" "
          className={cn(
            "peer w-full h-12 sm:h-14 rounded-lg border-[1.5px] bg-background px-3 pt-4 sm:pt-5 pb-1 sm:pb-1.5 text-base text-foreground placeholder-transparent",
            "focus:outline-none focus:ring-0 transition-colors",
            error
              ? "border-2 border-[#EF4444] focus:border-[#EF4444]"
              : "border-input focus:border-primary",
          )}
        />
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-3 transition-all duration-150",
            floated
              ? "top-1.5 text-[11px] text-muted-foreground"
              : "top-1/2 -translate-y-1/2 text-base text-muted-foreground/80",
            floated && !error && "text-primary",
            error && floated && "text-[#EF4444]",
          )}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="text-xs text-[#EF4444] mt-1 ml-1">{error}</p>
      )}
    </div>
  );
};

const PricingLeadPopup = ({ open, badge, onClose }: PricingLeadPopupProps) => {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  // Snapshot of submitted data for the success view (form state gets reset)
  const [successData, setSuccessData] = useState<{ firstName: string; emailProvided: boolean }>({
    firstName: "",
    emailProvided: false,
  });
  const [errors, setErrors] = useState<{
    firstName?: string;
    phone?: string;
  }>({});

  const firstNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const ctaLabel = getCtaLabel(badge);

  // Reset on open
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
      setSubmitError(null);
      setHoneypot("");
    }
  }, [open]);

  // ESC + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Auto-close after success (6s) + smooth scroll to top
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => {
      onClose();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 9000);
    return () => clearTimeout(t);
  }, [submitted, onClose]);

  // Show scroll-hint only when content is actually scrollable and user is not at the bottom
  useEffect(() => {
    if (!open || submitted) return;
    const el = scrollAreaRef.current;
    if (!el) return;

    const update = () => {
      const scrollable = el.scrollHeight - el.clientHeight > 8;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
      setShowScrollHint(scrollable && !atBottom);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [open, submitted]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!firstName.trim()) errs.firstName = "Bitte fülle dieses Feld aus.";
    if (!phone.trim() || phone.trim().length < 6)
      errs.phone = "Bitte fülle dieses Feld aus.";
    setErrors(errs);

    // Scroll to first invalid
    if (errs.firstName) {
      firstNameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstNameRef.current?.focus();
    } else if (errs.phone) {
      phoneRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      phoneRef.current?.focus();
    }

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Honeypot: Bots füllen das unsichtbare Feld aus → still verwerfen.
    if (honeypot) return;
    setLoading(true);
    setSubmitError(null);

    const ok = await submitLead({
      name: firstName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: `Paket: ${badge}`,
      source_cta: `preise_${badge}`,
      company: honeypot,
    });
    if (!ok) {
      setLoading(false);
      setSubmitError(
        "Etwas ist schiefgelaufen. Bitte ruf mich direkt an: 06131 3076498",
      );
      return;
    }

    setLoading(false);
    setSuccessData({
      firstName: firstName.trim(),
      emailProvided: email.trim().length > 0,
    });
    setSubmitted(true);
    setFirstName("");
    setPhone("");
    setEmail("");
  };

  const handleManualClose = () => {
    onClose();
    if (submitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/75" />

      <div
        className={cn(
          "relative bg-background shadow-elevated overflow-hidden",
          "animate-in fade-in duration-200",
          // Mobile: bottom sheet, fast 95vh, slide-up
          "w-full max-h-[95vh] rounded-t-2xl slide-in-from-bottom-4",
          // Desktop: centered card, fade+zoom
          "sm:max-w-[480px] sm:w-[95vw] sm:max-h-[90vh] sm:rounded-2xl sm:zoom-in-95 sm:slide-in-from-bottom-0",
          // Mobile uses flex column so the CTA can be pinned to the bottom
          "flex flex-col",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleManualClose}
          className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Schließen"
        >
          <X size={20} className="text-muted-foreground" aria-hidden={true} focusable={false} />
        </button>

        {submitted ? (
          <>
            <style>{`
              @keyframes pricing-popup-success-pop {
                0%   { transform: scale(0.5); opacity: 0; }
                60%  { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1);   opacity: 1; }
              }
              @keyframes pricing-popup-progress {
                from { transform: scaleX(0); }
                to   { transform: scaleX(1); }
              }
            `}</style>
            <div className="relative flex-1 overflow-y-auto px-6 pt-8 pb-6 sm:p-8 sm:pb-8 text-center animate-in fade-in duration-200">
              <div
                className="mx-auto mb-5 flex items-center justify-center"
                style={{
                  width: 64,
                  height: 64,
                  animation: "pricing-popup-success-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
                }}
              >
                <Check size={24} strokeWidth={2.2} style={{ color: "#22C55E" }} aria-hidden={true} focusable={false} />
              </div>

              <h3 className="font-heading text-xl sm:text-3xl font-bold leading-tight mb-3 text-foreground">
                Danke{successData.firstName ? `, ${successData.firstName}` : ""}!
              </h3>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
                deine Anfrage ist angekommen.<br />
                Ich melde mich innerhalb von 2 Stunden persönlich bei dir.
              </p>

              <div className="my-4 rounded-xl bg-[#F9FAFB] p-4 text-left space-y-2">
                {[
                  "Schritt 1: Ich rufe Dich kurz an",
                  "Schritt 2: Wir klären was Du brauchst",
                  "Schritt 3: Deine Demo ist in 48 h fertig",
                ].map((step) => (
                  <div key={step} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/75">
                    <Check size={16} style={{ color: "#22C55E" }} className="shrink-0 mt-0.5" aria-hidden={true} focusable={false} />
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {successData.emailProvided && (
                <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3">
                  Schau auch kurz in deinen Spam-Ordner — manchmal landet unsere Mail dort.
                </p>
              )}

              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Oder ruf mich direkt an:</p>
                <a
                  href="tel:+4961313076498"
                  className="inline-flex items-center gap-1.5 text-primary font-bold text-sm sm:text-base hover:underline"
                >
                  <Phone size={16} aria-hidden={true} focusable={false} />
                  06131 3076498
                </a>
              </div>
            </div>

            {/* Auto-close progress bar */}
            <div className="relative h-1 w-full bg-muted/50 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 w-full bg-primary origin-left"
                style={{
                  animation: "pricing-popup-progress 9000ms linear forwards",
                }}
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable content */}
            <div ref={scrollAreaRef} className="relative flex-1 overflow-y-auto px-5 pt-5 pb-3 sm:p-8 sm:pb-6">
              <span className="inline-block badge-label bg-primary/10 text-primary mb-3 sm:mb-4 mt-1">
                {badge}
              </span>

              <h2 className="font-heading text-xl sm:text-3xl font-bold leading-tight mb-1 sm:mb-2 text-foreground">
                Fast geschafft!
              </h2>
              <p className="text-muted-foreground text-[13px] sm:text-base mb-1.5 sm:mb-2 leading-relaxed">
                Ich melde mich innerhalb von 2 Stunden bei dir.
              </p>
              <p className="text-[11px] sm:text-xs text-center text-green-600 font-medium mb-3 sm:mb-5 inline-flex items-center justify-center gap-1.5">
                <Check size={14} className="inline" aria-hidden focusable={false} />
                Du bekommst deine kostenlose Design-Demo innerhalb von 48 Stunden.
              </p>

              <div className="space-y-2 sm:space-y-3">
                <FloatingField
                  id="popup-firstname"
                  label="Dein Vorname"
                  value={firstName}
                  onChange={(v) => {
                    setFirstName(v);
                    if (errors.firstName) setErrors((p) => ({ ...p, firstName: undefined }));
                  }}
                  error={errors.firstName}
                  required
                  autoComplete="given-name"
                  maxLength={100}
                  inputRef={firstNameRef}
                />
                <FloatingField
                  id="popup-phone"
                  label="Telefonnummer"
                  type="tel"
                  value={phone}
                  onChange={(v) => {
                    setPhone(v);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  error={errors.phone}
                  required
                  autoComplete="tel"
                  maxLength={30}
                  inputRef={phoneRef}
                />
                <FloatingField
                  id="popup-email"
                  label="E-Mail (optional)"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  maxLength={255}
                />
                {/* Honeypot – unsichtbar für Nutzer, fängt Spam-Bots */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: "none" }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Mobile-only scroll indicator — appears when fields overflow */}
            {showScrollHint && (
              <div className="sm:hidden pointer-events-none absolute left-0 right-0 bottom-[88px] flex flex-col items-center gap-0.5 animate-in fade-in duration-200">
                <span className="text-[11px] text-muted-foreground/80">Noch ein Feld</span>
                <ChevronDown size={16} className="text-muted-foreground/70 animate-bounce" aria-hidden={true} focusable={false} />
              </div>
            )}

            {/* CTA footer — sticky on mobile, inline on desktop */}
            <div className="sticky bottom-0 sm:static shrink-0 px-4 sm:px-8 py-4 sm:pt-3 sm:pb-7 bg-background border-t border-border/40 sm:border-t-0 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:shadow-none">
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                disabled={loading}
                className="w-full text-base py-6 font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" aria-hidden={true} focusable={false} /> Wird gesendet...
                  </>
                ) : (
                  <>{ctaLabel} <ArrowRight size={20} aria-hidden={true} focusable={false} /></>
                )}
              </Button>

              {submitError && (
                <p className="text-center text-sm text-destructive mt-2">
                  Etwas ist schiefgelaufen. Bitte ruf mich direkt an:{" "}
                  <a href="tel:+4961313076498" className="font-semibold underline">
                    06131 3076498
                  </a>
                </p>
              )}

              <p className="text-center text-xs sm:text-sm text-foreground/80 mt-3">
                ⏱ Ich melde mich innerhalb von 2 Stunden bei dir — Mo–Fr 9–18 Uhr
              </p>
              <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck size={16} aria-hidden={true} focusable={false} />
                Kostenlos & unverbindlich – kein Spam, keine Verpflichtung
              </p>
              <p className="text-center text-xs text-muted-foreground/80 mt-1.5">
                ⭐ +150 Betriebe aus der Region vertrauen uns
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PricingLeadPopup;
