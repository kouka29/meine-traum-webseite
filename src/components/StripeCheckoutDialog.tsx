import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";

interface StripeCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  priceId: string | null;
  packageName: string;
  customerEmail?: string;
  kind?: "deposit" | "rent";
}

export default function StripeCheckoutDialog({
  open,
  onClose,
  priceId,
  packageName,
  customerEmail,
  kind = "deposit",
}: StripeCheckoutDialogProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !priceId) {
      setClientSecret(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const returnUrl = `${window.location.origin}/kauf-erfolgreich?session_id={CHECKOUT_SESSION_ID}&kind=${kind}`;

    supabase.functions
      .invoke("create-checkout", {
        body: {
          priceId,
          environment: getStripeEnvironment(),
          returnUrl,
          customerEmail,
        },
      })
      .then(({ data, error: invokeError }) => {
        if (cancelled) return;
        if (invokeError || !data?.clientSecret) {
          setError(invokeError?.message || "Checkout konnte nicht geladen werden.");
          setLoading(false);
          return;
        }
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unbekannter Fehler");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, priceId, customerEmail, kind]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-heading">
            {packageName}{kind === "rent" ? " – Mietmodell" : " – 50 % Anzahlung"}
          </DialogTitle>
          <DialogDescription>
            {kind === "rent"
              ? "Sicher bezahlen mit Karte, SEPA-Lastschrift oder Klarna. Die erste Monatsmiete wird sofort fällig, danach automatisch monatlich. Mindestlaufzeit 12 Monate."
              : "Sicher bezahlen mit Karte, SEPA-Lastschrift oder Klarna. Die restlichen 50 % werden nach Go-Live per Rechnung fällig."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-2 pb-4 min-h-[400px]">
          {loading && (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="animate-spin mr-2" size={20} />
              Checkout wird geladen…
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3 mx-6 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm">
              <AlertCircle size={18} className="text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Fehler</p>
                <p className="text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          )}
          {clientSecret && !error && (
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
