import { useState, useEffect } from "react";
import { X, CheckCircle, Sparkles, TrendingUp, Zap, Gift, ShieldCheck, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "lead-modal-dismissed";
const DELAY_MS = 8000;

// Routen, auf denen das Pop-up NICHT erscheinen soll (eigener Funnel/Lead-Magnet vorhanden)
const EXCLUDED_PATHS = ["/kostenlose-vorschau", "/kostenlose-vorschau-2"];

const LeadCaptureModal = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dsgvoAccepted, setDsgvoAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; companyName?: string; email?: string; phone?: string; dsgvo?: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    // Auf ausgeschlossenen Routen niemals anzeigen
    if (EXCLUDED_PATHS.some((p) => location.pathname.startsWith(p))) {
      setOpen(false);
      return;
    }
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Globales Event: jeder Button kann das Pop-up auslösen.
  // Nach Klick wird die Session-Sperre ignoriert, damit es trotz „dismissed" öffnet.
  useEffect(() => {
    const handler = () => {
      setSubmitted(false);
      setOpen(true);
    };
    window.addEventListener("open-lead-modal", handler);
    return () => window.removeEventListener("open-lead-modal", handler);
  }, []);

  // Globaler Click-Interceptor: jeder <a href="#termin-buchen"> öffnet
  // den GlobalCtaPopup (PricingLeadPopup) — siehe src/components/GlobalCtaPopup.tsx.
  // Hier NICHT abfangen, damit die CTAs den richtigen Popup öffnen.

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!firstName.trim()) errs.firstName = "Bitte Vornamen eingeben";
    if (!companyName.trim()) errs.companyName = "Bitte Firmennamen eingeben";
    if (!email.trim()) errs.email = "Bitte E-Mail eingeben";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Ungültige E-Mail-Adresse";
    if (!phone.trim()) errs.phone = "Bitte Telefonnummer eingeben";
    else if (phone.trim().length < 6) errs.phone = "Bitte gültige Telefonnummer eingeben";
    if (!dsgvoAccepted) errs.dsgvo = "Bitte Datenschutzbestimmungen akzeptieren";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (honeypot) return;

    setLoading(true);
    setSubmitError(null);
    const leadId = crypto.randomUUID();

    // Primär: an Formspree senden
    let formspreeOk = false;
    try {
      const res = await fetch("https://formspree.io/f/xojrerqe", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: firstName.trim(),
          phone: phone.trim(),
          company: companyName.trim(),
          email: email.trim(),
          _subject: `🔔 Neuer Lead (Pop-up Leitfaden): ${companyName.trim()}`,
          _replyto: email.trim(),
          _gotcha: honeypot,
          quelle: "Pop-up Lead-Magnet (7 Schritte Leitfaden)",
          seite: location.pathname,
        }),
      });
      formspreeOk = res.ok;
    } catch {
      formspreeOk = false;
    }

    if (!formspreeOk) {
      setLoading(false);
      setSubmitError(
        "Etwas ist schiefgelaufen. Bitte ruf mich direkt an: 06131 30 764 98",
      );
      return;
    }

    // Backup für Admin-Backend – Fehler hier blockieren die Erfolgs-Ansicht nicht.
    const { error } = await supabase.from("leads").insert({
      id: leadId,
      first_name: firstName.trim(),
      company_name: companyName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setLoading(false);
    if (error) {
      console.warn("Lead konnte nicht in der DB gespeichert werden", error);
    }

    // Fire-and-forget: notify admin of new lead
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "lead-notification",
        idempotencyKey: `lead-modal-${leadId}`,
        templateData: {
          source: "Pop-up Lead-Magnet (7 Schritte Leitfaden)",
          firstName: firstName.trim(),
          companyName: companyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          submittedAt: new Date().toLocaleString("de-DE"),
        },
      },
    });

    setSubmitted(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!open) return null;

  const bullets = [
    { icon: Zap, text: "7 erprobte Schritte zur Webseite, die Kunden gewinnt" },
    { icon: TrendingUp, text: "Warum die meisten Webseiten scheitern – und wie du es besser machen" },
    { icon: Sparkles, text: "Sofort umsetzbar – auch ohne Technikkenntnisse" },
    { icon: ShieldCheck, text: "Bonus: Die perfekte Webseiten-Checkliste zum Abhaken" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={close}
    >
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-background rounded-2xl shadow-elevated overflow-hidden animate-in zoom-in-95 fade-in duration-400 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Schließen"
        >
          <X size={16} className="text-muted-foreground" aria-hidden={true} focusable={false} />
        </button>

        <div className="h-1.5 w-full gradient-bg" />

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-primary" aria-hidden={true} focusable={false} />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3 text-foreground">
                Fast geschafft! 🎉
              </h3>
              <p className="text-muted-foreground mb-2">
                Prüfen du jetzt dein E-Mail-Postfach und bestätigen du deine Adresse.
              </p>
              <p className="text-sm text-muted-foreground">
                dein kostenloser Leitfaden wartet auf du.
              </p>
              <Button variant="gradient" className="mt-6" onClick={close}>
                Fenster schließen
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1">
                  <div className="w-8 h-1.5 rounded-full gradient-bg" />
                  <div className="w-8 h-1.5 rounded-full bg-muted" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  Nur noch ein Schritt
                </span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold leading-tight mb-3 text-foreground">
                Die 7 geheimen Schritte zu deiner Traum-Webseite, die Kunden gewinnt
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                Warum die meisten Webseiten keine Kunden bringen – und wie du es in wenigen Tagen besser machen. Auch ohne Technikkenntnisse.
              </p>

              <div className="space-y-2.5 mb-5">
                {bullets.map((b) => (
                  <div key={b.text} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <b.icon size={14} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground/90">{b.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-4 mb-5">
                „Stell dir vor, deine Webseite bringt dir täglich Anfragen – automatisch und ohne Stress."
              </p>

              <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 mb-5">
                <Gift size={16} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                <span className="text-sm font-medium text-foreground">
                  Bonus: Die perfekte Webseiten-Checkliste (sofort umsetzbar)
                </span>
              </div>

              <p className="text-center text-sm font-semibold text-destructive mb-5">
                ⚠️ Nur für kurze Zeit kostenlos verfügbar
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    placeholder="dein Vorname *"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors((p) => ({ ...p, firstName: undefined }));
                    }}
                    className={errors.firstName ? "border-destructive" : ""}
                    maxLength={100}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="dein Firmenname *"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors((p) => ({ ...p, companyName: undefined }));
                    }}
                    className={errors.companyName ? "border-destructive" : ""}
                    maxLength={200}
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive mt-1">{errors.companyName}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="deine E-Mail-Adresse *"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    className={errors.email ? "border-destructive" : ""}
                    maxLength={255}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="deine Telefonnummer *"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    className={errors.phone ? "border-destructive" : ""}
                    maxLength={30}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="dsgvo"
                    checked={dsgvoAccepted}
                    onCheckedChange={(v) => {
                      setDsgvoAccepted(v === true);
                      if (errors.dsgvo) setErrors((p) => ({ ...p, dsgvo: undefined }));
                    }}
                    className="mt-0.5"
                  />
                  <label htmlFor="dsgvo" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    Ich akzeptiere die{" "}
                    <Link to="/datenschutz" className="underline hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                      Datenschutzbestimmungen
                    </Link>
                  </label>
                </div>
                {errors.dsgvo && (
                  <p className="text-xs text-destructive">{errors.dsgvo}</p>
                )}

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={loading}
                  className="w-full text-base py-6 font-bold shadow-glow hover:shadow-elevated hover:scale-[1.02] transition-all duration-200 animate-cta-pulse"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden={true} focusable={false} /> Wird gesendet...
                    </>
                  ) : (
                    "Jetzt kostenlos herunterladen und direkt starten"
                  )}
                </Button>
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
                {submitError && (
                  <p className="text-center text-sm text-destructive">
                    Etwas ist schiefgelaufen. Bitte ruf mich direkt an:{" "}
                    <a href="tel:+4961313076498" className="font-semibold underline">
                      06131 30 764 98
                    </a>
                  </p>
                )}
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} aria-hidden={true} focusable={false} />
                100 % kostenlos. Kein Spam.
              </p>

              <button
                onClick={close}
                className="w-full text-center text-xs text-muted-foreground/60 hover:text-muted-foreground mt-4 transition-colors"
              >
                Nein danke, ich brauche keine neuen Kunden über meine Webseite
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
