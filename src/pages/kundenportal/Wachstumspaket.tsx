import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Rocket, CreditCard, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import StripeEmbeddedCheckoutBox from "@/components/angebot/StripeEmbeddedCheckout";
import { getStripeEnvironment } from "@/lib/stripe";

const PACKAGE_LABELS: Record<string, string> = {
  basic: "Wachstumspaket Basic",
  plus: "Wachstumspaket Plus",
  premium: "Wachstumspaket Premium",
};

const PACKAGE_PRICE_IDS: Record<string, string> = {
  basic: "growth_basic_monthly",
  plus: "growth_plus_monthly",
  premium: "growth_premium_monthly",
};

export default function KundenportalWachstumspaket() {
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const reload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserEmail(user?.email || "");
    const { data } = await supabase.from("growth_subscriptions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setRow(data);
    setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" aria-hidden={true} focusable={false} /></div>;

  if (!row) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Wachstumspaket</h1>
          <p className="text-muted-foreground mt-1">Du hast aktuell kein Wachstumspaket gebucht.</p>
        </div>
        <Card><CardContent className="py-10 text-center text-muted-foreground text-sm">
 Wenn du beim Kauf deiner Webseite ein Wachstumspaket dazugebucht hast, erscheint es hier nach der ersten Bestätigung.
 </CardContent></Card>
      </div>
    );
  }

  const isStripeAuto = row.billing_mode === "stripe_auto";
  const isPending = row.status === "pending_golive";
  const isCancelled = row.status === "cancelled" || row.billing_mode === "cancelled";
  const priceId = PACKAGE_PRICE_IDS[row.package];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Wachstumspaket</h1>
        <p className="text-muted-foreground mt-1">Verwalte dein Wachstumspaket und die Abrechnung.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket size={20} className="text-primary" aria-hidden={true} focusable={false} />
            {PACKAGE_LABELS[row.package] || row.package}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Monatsbeitrag</div>
              <div className="text-xl font-bold">{(row.monthly_amount_cents / 100).toLocaleString("de-DE")} € <span className="text-sm font-normal text-muted-foreground">/Monat netto</span></div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="text-sm font-semibold">
                {isCancelled ? <span className="text-red-600">Gekündigt</span>
 : isPending ? <span className="text-amber-600">Wartet auf Go-Live</span>
 : row.status === "past_due" ? <span className="text-orange-600">Zahlung überfällig</span>
 : <span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 size={14} aria-hidden={true} focusable={false} /> Aktiv</span>}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Abrechnung</div>
              <div className="text-sm font-semibold inline-flex items-center gap-1">
                {isStripeAuto
                  ? <><CreditCard size={14} className="text-primary" aria-hidden={true} focusable={false} /> Automatisch (Stripe)</>
 : <><FileText size={14} className="text-muted-foreground" aria-hidden={true} focusable={false} /> Per Rechnung</>}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Mindestlaufzeit</div>
              <div className="text-sm font-semibold">{row.min_term_months} Monate</div>
            </div>
          </div>

          {isPending && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
 Dein Wachstumspaket startet automatisch, sobald deine Website live geht. Erst danach werden Rechnungen erstellt.
 </div>
          )}

          {!isStripeAuto && !isCancelled && (
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
              <div className="font-semibold text-sm mb-1 inline-flex items-center gap-2">
                <CreditCard size={16} className="text-primary" aria-hidden={true} focusable={false} />
 Auf automatische Stripe-Zahlung umstellen
 </div>
              <p className="text-xs text-muted-foreground mb-3">
 Spare dir den manuellen Klick. Karte oder SEPA wird automatisch monatlich abgebucht, du erhältst weiterhin eine Rechnung per Mail.
 </p>
              {!showCheckout ? (
                <Button size="sm" onClick={() => setShowCheckout(true)} disabled={isPending}>
 Jetzt umstellen
 </Button>
 ) : priceId ? (
 <div className="mt-3">
                  <StripeEmbeddedCheckoutBox
                    items={[{
                      name: PACKAGE_LABELS[row.package],
                      amount_cents: row.monthly_amount_cents,
                      recurring: "month",
                    }]}
                    mode="subscription"
                    description={`Umstellung ${PACKAGE_LABELS[row.package]} auf Auto-Abo`}
                    customerEmail={userEmail}
                    metadata={{ growth_subscription_id: row.id }}
                    returnUrl={`${window.location.origin}/kundenportal/wachstumspaket?migrated=1`}
                  />
                </div>
              ) : null}
            </div>
          )}

          {isStripeAuto && !isCancelled && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
 Du zahlst automatisch per Stripe. Karte/SEPA ändern oder kündigen: Über „Einstellungen → Stripe-Kundenportal".
 </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}