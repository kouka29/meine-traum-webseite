import { useState, useEffect } from "react";
import { X, CheckCircle, Sparkles, TrendingUp, Zap, Gift, ShieldCheck, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "lead-modal-dismissed";
const DELAY_MS = 8000;

const LeadCaptureModal = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dsgvoAccepted, setDsgvoAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; companyName?: string; email?: string; phone?: string; dsgvo?: string }>({});

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

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

    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      first_name: firstName.trim(),
      company_name: companyName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setLoading(false);

    if (error) {
      toast.error("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      return;
    }

    setSubmitted(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  if (!open) return null;

  const bullets = [
    { icon: Zap, text: "Die 3 größten Fehler, die dich aktuell blockieren" },
    { icon: TrendingUp, text: "Eine einfache Schritt-für-Schritt Methode" },
    { icon: Sparkles, text: "Sofort umsetzbare Strategien ohne Vorkenntnisse" },
    { icon: ShieldCheck, text: "Insider-Tipps, die sonst nur Experten kennen" },
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
          <X size={16} className="text-muted-foreground" />
        </button>

        <div className="h-1.5 w-full gradient-bg" />

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3 text-foreground">
                Fast geschafft! 🎉
              </h3>
              <p className="text-muted-foreground mb-2">
                Prüfe jetzt dein E-Mail-Postfach und bestätige deine Adresse.
              </p>
              <p className="text-sm text-muted-foreground">
                Dein kostenloser Leitfaden wartet auf dich.
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
                Warum 90 % scheitern – und wie du es mit dieser einfachen Methode vermeidest
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                Entdecke die bewährte Strategie, mit der du mehr Kunden über deine Website gewinnst
                – selbst wenn du bei null startest.
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
                „Stell dir vor, wie es sich anfühlt, endlich planbar Kundenanfragen zu erhalten –
                ohne Stress und ohne Zeitverschwendung."
              </p>

              <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 mb-5">
                <Gift size={16} className="text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  Bonus: Die 5 besten Tools, die dir alles deutlich einfacher machen
                </span>
              </div>

              <p className="text-center text-sm font-semibold text-destructive mb-5">
                ⚠️ Nur für kurze Zeit kostenlos verfügbar
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    placeholder="Dein Vorname *"
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
                    placeholder="Dein Firmenname *"
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
                    placeholder="Deine E-Mail-Adresse *"
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
                    placeholder="Deine Telefonnummer *"
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
                      <Loader2 size={18} className="animate-spin" /> Wird gesendet...
                    </>
                  ) : (
                    "Jetzt kostenlos herunterladen"
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} />
                100 % kostenlos. Kein Spam.
              </p>

              <button
                onClick={close}
                className="w-full text-center text-xs text-muted-foreground/60 hover:text-muted-foreground mt-4 transition-colors"
              >
                Nein danke, ich verzichte auf meinen Vorteil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;
