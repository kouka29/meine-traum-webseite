import { useEffect, useState } from "react";
import { X, CheckCircle2, ShieldCheck, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PricingLeadPopupProps {
  open: boolean;
  badge: string;
  onClose: () => void;
}

const PricingLeadPopup = ({ open, badge, onClose }: PricingLeadPopupProps) => {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; phone?: string; companyName?: string }>({});

  // Reset on open
  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setErrors({});
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Auto-close after success
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(t);
  }, [submitted, onClose]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!firstName.trim()) errs.firstName = "Bitte Vornamen eingeben";
    if (!phone.trim() || phone.trim().length < 6) errs.phone = "Bitte gültige Telefonnummer eingeben";
    if (!companyName.trim()) errs.companyName = "Bitte Betriebsnamen eingeben";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const leadId = crypto.randomUUID();
    const placeholderEmail = `noemail+${leadId}@popup.local`;

    const { error } = await supabase.from("leads").insert({
      id: leadId,
      first_name: firstName.trim(),
      company_name: companyName.trim(),
      phone: phone.trim(),
      email: placeholderEmail,
      notes: `Pop-up Anfrage von Preisseite – Paket: ${badge}`,
    });

    if (error) {
      setLoading(false);
      toast.error("Es ist ein Fehler aufgetreten. Bitte versuche es erneut.");
      return;
    }

    // Fire-and-forget admin notification
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "lead-notification",
        idempotencyKey: `pricing-popup-${leadId}`,
        templateData: {
          source: `Preisseite Pop-up (${badge})`,
          firstName: firstName.trim(),
          companyName: companyName.trim(),
          email: "(keine E-Mail – nur Telefon)",
          phone: phone.trim(),
          submittedAt: new Date().toLocaleString("de-DE"),
        },
      },
    });

    setLoading(false);
    setSubmitted(true);
    setFirstName("");
    setPhone("");
    setCompanyName("");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div
        className="relative w-full sm:max-w-[480px] sm:w-[95vw] bg-background rounded-t-2xl sm:rounded-2xl shadow-elevated overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 fade-in duration-200 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Schließen"
        >
          <X size={20} className="text-muted-foreground" />
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-3 text-foreground">
                Danke{firstName ? `, ${firstName}` : ""}!
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Ich habe deine Anfrage erhalten.<br />
                Du bekommst in Kürze deine kostenlose Design-Demo.<br />
                Ich melde mich innerhalb von 2 Stunden bei dir.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Schau auch in deinen Spam-Ordner.
              </p>
            </div>
          ) : (
            <>
              <span className="inline-block badge-label bg-primary/10 text-primary mb-4 mt-1">
                {badge}
              </span>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold leading-tight mb-2 text-foreground">
                🚀 Fast geschafft!
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">
                Ich melde mich innerhalb von 2 Stunden bei dir.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Input
                    placeholder="Max"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors((p) => ({ ...p, firstName: undefined }));
                    }}
                    className={`h-12 text-base rounded-lg border-[1.5px] ${errors.firstName ? "border-destructive" : ""}`}
                    maxLength={100}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="+49 ..."
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    className={`h-12 text-base rounded-lg border-[1.5px] ${errors.phone ? "border-destructive" : ""}`}
                    maxLength={30}
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Mustermann GmbH"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors((p) => ({ ...p, companyName: undefined }));
                    }}
                    className={`h-12 text-base rounded-lg border-[1.5px] ${errors.companyName ? "border-destructive" : ""}`}
                    maxLength={200}
                    autoComplete="organization"
                  />
                  {errors.companyName && (
                    <p className="text-xs text-destructive mt-1">{errors.companyName}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  disabled={loading}
                  className="w-full text-base py-6 font-bold mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Wird gesendet...
                    </>
                  ) : (
                    <>Kostenlose Demo anfordern <ArrowRight size={18} /></>
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck size={13} />
                Kostenlos & unverbindlich – kein Spam, keine Verpflichtung
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricingLeadPopup;
