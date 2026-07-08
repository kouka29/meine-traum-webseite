import { useCallback, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, FileText, Building2, Mail } from "lucide-react";

interface Account {
  user_id: string;
  email: string;
  first_name: string | null;
  company_name: string | null;
  phone: string | null;
  invoice_allowed: boolean;
  created_at: string;
}

export default function AdminKundenTab({ password }: { password: string }) {
  const [rows, setRows] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "customer-accounts-list" },
    });
    setLoading(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Fehler beim Laden");
      return;
    }
    setRows(data.accounts || []);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (row: Account, next: boolean) => {
    setBusy(row.user_id);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "customer-account-set-invoice-allowed", userId: row.user_id, invoiceAllowed: next },
    });
    setBusy(null);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Speichern fehlgeschlagen");
      return;
    }
    setRows((r) => r.map((x) => x.user_id === row.user_id ? { ...x, invoice_allowed: next } : x));
    toast.success(next ? "Rechnungszahlung freigeschaltet" : "Rechnungszahlung deaktiviert");
  };

  const filtered = rows.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return r.email.toLowerCase().includes(q)
      || (r.first_name || "").toLowerCase().includes(q)
      || (r.company_name || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-foreground">Kunden-Konten</h2>
          <p className="text-sm text-muted-foreground">Zahlung auf Rechnung pro Kunde freischalten.</p>
        </div>
        <input
          type="search"
          placeholder="Suche nach Name, Firma, E-Mail…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background text-sm w-64"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 size={16} className="animate-spin" /> Lädt…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center border border-dashed rounded-lg">Keine Kundenkonten gefunden.</div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Kunde</th>
                <th className="px-4 py-3 font-semibold">Kontakt</th>
                <th className="px-4 py-3 font-semibold">Registriert</th>
                <th className="px-4 py-3 font-semibold text-right">Auf Rechnung</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.user_id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <Building2 size={14} className="text-muted-foreground" />
                      {r.company_name || r.first_name || "—"}
                    </div>
                    {r.first_name && r.company_name && (
                      <div className="text-xs text-muted-foreground">{r.first_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-foreground"><Mail size={12} className="text-muted-foreground" /> {r.email}</div>
                    {r.phone && <div className="text-xs text-muted-foreground mt-0.5">{r.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(r.created_at).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {r.invoice_allowed && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium flex items-center gap-1">
                          <FileText size={11} /> Aktiv
                        </span>
                      )}
                      <Switch
                        checked={r.invoice_allowed}
                        onCheckedChange={(v) => toggle(r, v)}
                        disabled={busy === r.user_id}
                        aria-label="Auf Rechnung freischalten"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
