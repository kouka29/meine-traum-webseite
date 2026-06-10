import { useEffect, useState } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export interface StripeItem {
  name: string;
  description?: string;
  amount_cents: number;
  recurring?: "month" | "year" | null;
  quantity?: number;
}

interface Props {
  items: StripeItem[];
  mode: "payment" | "subscription";
  description: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  returnUrl: string;
}

export default function StripeEmbeddedCheckoutBox({
  items, mode, description, customerEmail, metadata, returnUrl,
}: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("create-checkout", {
          body: {
            items, mode, description, customerEmail, metadata, returnUrl,
            environment: getStripeEnvironment(),
          },
        });
        if (error || !data?.clientSecret) {
          throw new Error(data?.error || error?.message || "Stripe konnte nicht initialisiert werden.");
        }
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Stripe-Fehler");
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20, color: "#B91C1C", fontSize: 14, textAlign: "center" }}>
        {error}
      </div>
    );
  }
  if (!clientSecret) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
        <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 8px" }} aria-hidden={true} focusable={false} />
        <div style={{ fontSize: 13 }}>Bezahlung wird vorbereitet…</div>
      </div>
    );
  }

  return (
    <div id="stripe-checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}