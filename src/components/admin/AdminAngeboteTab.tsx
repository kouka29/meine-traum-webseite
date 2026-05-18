import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";

interface Angebot {
  id: string;
  lead_name: string | null;
  lead_email: string | null;
  preis: number | null;
  normalpreis: number | null;
  pin: string | null;
  ablauf_datum: string | null;
  base64_data: string | null;
  stripe_link: string | null;
  erstellt_am: string;
  status: string;
}

const ANGEBOT_BASE_URL = "https://meine-traum-webseite.de/angebot";

export default function AdminAngeboteTab({ password }: { password: string }) {
  const [angebote, setAngebote] = useState<Angebot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAngebote = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "angebote-list" },
    });
    setLoading(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Fehler beim Laden");
      return;
    }
    setAngebote(data.angebote || []);
  }, [password]);

  useEffect(() => { fetchAngebote(); }, [fetchAngebote]);

  const linkFor = (a: Angebot) =>
    a.base64_data ? `${ANGEBOT_BASE_URL}?d=${encodeURIComponent(a.base64_data)}` : "";

  const copyLink = async (a: Angebot) => {
    const url = linkFor(a);
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link kopiert");
    } catch {
      toast.error("Konnte nicht kopieren");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Angebot wirklich löschen?")) return;
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "angebot-delete", angebotId: id },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Löschen");
      return;
    }
    toast.success("Angebot gelöscht");
    setAngebote((prev) => prev.filter((a) => a.id !== id));
  };

  const isExpired = (a: Angebot) =>
    a.ablauf_datum ? new Date(a.ablauf_datum).getTime() < Date.now() : false;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">{angebote.length} Angebot{angebote.length !== 1 ? "e" : ""}</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
          <p className="text-muted-foreground">Lade Angebote...</p>
        </div>
      ) : angebote.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Noch keine Angebote vorhanden.</p>
          <p className="text-sm">Erstellen Sie ein Angebot aus dem Leads-Tab.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Kunde</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-right px-4 py-3 font-semibold">Preis</th>
                <th className="text-left px-4 py-3 font-semibold">Erstellt</th>
                <th className="text-left px-4 py-3 font-semibold">Läuft ab</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {angebote.map((a) => {
                const expired = isExpired(a);
                return (
                  <tr key={a.id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{a.lead_name || "–"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.lead_email || "–"}</td>
                    <td className="px-4 py-3 text-right font-semibold" style={{ color: "#4F3FF0" }}>
                      {a.preis ? `${Number(a.preis).toLocaleString("de-DE")} €` : "–"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(a.erstellt_am).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {a.ablauf_datum
                        ? new Date(a.ablauf_datum).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "–"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                        expired
                          ? "bg-muted text-muted-foreground border-border"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      }`}>
                        ● {expired ? "Abgelaufen" : "Aktiv"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => window.open(linkFor(a), "_blank")} title="Öffnen" className="h-8 w-8">
                          <ExternalLink size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => copyLink(a)} title="Link kopieren" className="h-8 w-8">
                          <Copy size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => del(a.id)} title="Löschen" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}