import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Rocket, Play, Receipt, XCircle } from "lucide-react";

interface GrowthSub {
  id: string;
  customer_email: string;
  package: string;
  monthly_amount_cents: number;
  billing_mode: string;
  status: string;
  environment: string;
  min_term_months: number;
  started_at: string | null;
  next_invoice_at: string | null;
  last_invoice_at: string | null;
  last_invoice_status: string | null;
  created_at: string;
}

const PACKAGE_LABEL: Record<string, string> = {
  basic: "Basic",
  plus: "Plus",
  premium: "Premium",
};

export default function AdminWachstumTab({ password }: { password: string }) {
  const [rows, setRows] = useState<GrowthSub[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "growth-list" },
    });
    setLoading(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Fehler beim Laden");
      return;
    }
    setRows(data.subscriptions || []);
  }, [password]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const goLive = async (row: GrowthSub) => {
    if (!confirm(`Go-Live für ${row.customer_email}? Es wird sofort die erste Rechnung erstellt und per E‑Mail versendet.`)) return;
    setBusy(row.id);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "growth-golive", id: row.id, env: row.environment },
    });
    setBusy(null);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Go-Live fehlgeschlagen");
      return;
    }
    toast.success("Go-Live aktiviert · Erste Rechnung wird erstellt");
    fetchRows();
  };

  const triggerInvoice = async (row: GrowthSub) => {
    if (!confirm(`Jetzt manuell eine Rechnung für ${row.customer_email} erstellen?`)) return;
    setBusy(row.id);
    const { data, error } = await supabase.functions.invoke("growth-invoice-create", {
      body: { env: row.environment === "live" ? "live" : "sandbox", growth_subscription_id: row.id },
    });
    setBusy(null);
    if (error) { toast.error(error.message); return; }
    toast.success(`Rechnung erstellt (${data?.results?.[0]?.invoice_id || "ok"})`);
    fetchRows();
  };

  const cancel = async (row: GrowthSub) => {
    if (!confirm(`Wachstumspaket von ${row.customer_email} kündigen?`)) return;
    setBusy(row.id);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "growth-cancel", id: row.id },
    });
    setBusy(null);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Kündigung fehlgeschlagen");
      return;
    }
    toast.success("Gekündigt");
    fetchRows();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Rocket size={22} className="text-primary" aria-hidden={true} focusable={false} /> Wachstumspakete
          </h2>
          <p className="text-sm text-muted-foreground">Verwalte vorgemerkte und aktive Wachstumspaket-Abos. Klicke „Go-Live" um die monatliche Rechnungsstellung zu starten.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRows} disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" aria-hidden={true} focusable={false} /> : "Neu laden"}
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Kunde</th>
                <th className="px-4 py-3 text-left">Paket</th>
                <th className="px-4 py-3 text-right">€/Monat</th>
                <th className="px-4 py-3 text-left">Modus</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Nächste Rechnung</th>
                <th className="px-4 py-3 text-left">Letzte Rechnung</th>
                <th className="px-4 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.length === 0 && !loading && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">Keine Einträge.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3"><div className="font-medium truncate max-w-[200px]">{r.customer_email}</div><div className="text-xs text-muted-foreground">{r.environment}</div></td>
                  <td className="px-4 py-3">{PACKAGE_LABEL[r.package] || r.package}</td>
                  <td className="px-4 py-3 text-right">{(r.monthly_amount_cents / 100).toLocaleString("de-DE")} €</td>
                  <td className="px-4 py-3">{r.billing_mode === "stripe_auto" ? "Stripe Auto" : "Rechnung"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.status === "active" ? "bg-emerald-100 text-emerald-700"
                      : r.status === "pending_golive" ? "bg-amber-100 text-amber-700"
                      : r.status === "cancelled" ? "bg-red-100 text-red-700"
                      : "bg-muted text-muted-foreground"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.next_invoice_at ? new Date(r.next_invoice_at).toLocaleDateString("de-DE") : "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {r.last_invoice_at ? `${new Date(r.last_invoice_at).toLocaleDateString("de-DE")} (${r.last_invoice_status || "?"})` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {r.status === "pending_golive" && (
                        <Button size="sm" onClick={() => goLive(r)} disabled={busy === r.id}>
                          {busy === r.id ? <Loader2 size={14} className="animate-spin" aria-hidden={true} focusable={false} /> : <Play size={14} aria-hidden={true} focusable={false} />}
                          <span className="ml-1">Go-Live</span>
                        </Button>
                      )}
                      {r.status === "active" && r.billing_mode === "manual_invoice" && (
                        <Button size="sm" variant="outline" onClick={() => triggerInvoice(r)} disabled={busy === r.id}>
                          <Receipt size={14} className="mr-1" aria-hidden={true} focusable={false} /> Rechnung jetzt
                        </Button>
                      )}
                      {r.status !== "cancelled" && (
                        <Button size="sm" variant="ghost" onClick={() => cancel(r)} disabled={busy === r.id}>
                          <XCircle size={14} aria-hidden={true} focusable={false} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}