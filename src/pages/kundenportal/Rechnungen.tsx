import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ExternalLink, Receipt } from "lucide-react";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";

interface Invoice {
  id: string;
  number: string | null;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  created: number;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

export default function KundenportalRechnungen() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { action: "invoices", env: getStripeEnvironment() },
      });
      if (error || data?.error) {
        toast.error(data?.error || "Rechnungen konnten nicht geladen werden");
      } else {
        setInvoices(data.invoices || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Rechnungen</h1>
        <p className="text-muted-foreground mt-1">Alle deine Zahlungen und Rechnungen als PDF.</p>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Receipt size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Noch keine Rechnungen vorhanden.</p>
            <p className="text-xs text-muted-foreground mt-2">Sobald eine Zahlung erfolgt ist, findest du hier alle Rechnungen.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {invoices.map((inv) => (
                <li key={inv.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-medium">
                      {inv.number || inv.id.slice(0, 12)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(inv.created * 1000).toLocaleDateString("de-DE")} ·{" "}
                      {(inv.amount_paid / 100).toLocaleString("de-DE", { style: "currency", currency: inv.currency.toUpperCase() })} ·{" "}
                      <span className={inv.status === "paid" ? "text-emerald-600" : "text-amber-600"}>{inv.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {inv.invoice_pdf && (
                      <Button asChild size="sm" variant="outline">
                        <a href={inv.invoice_pdf} target="_blank" rel="noreferrer"><Download size={14} className="mr-1" /> PDF</a>
                      </Button>
                    )}
                    {inv.hosted_invoice_url && (
                      <Button asChild size="sm" variant="ghost">
                        <a href={inv.hosted_invoice_url} target="_blank" rel="noreferrer"><ExternalLink size={14} /></a>
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}