import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Receipt, MessageSquare, FileCheck, Package, ArrowRight, Loader2 } from "lucide-react";

export default function KundenportalDashboard() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [buchungen, setBuchungen] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [angebote, setAngebote] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [a, b, t, ang] = await Promise.all([
        supabase.from("customer_accounts").select("*").maybeSingle(),
        supabase.from("buchungen").select("id, angebots_nr, gebucht_am, status, gesamtbetrag_brutto, pakete").order("gebucht_am", { ascending: false }),
        supabase.from("customer_tickets").select("id, subject, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("angebote").select("id, short_id, lead_name, preis, status, erstellt_am").order("erstellt_am", { ascending: false }).limit(5),
      ]);
      setAccount(a.data);
      setBuchungen(b.data || []);
      setTickets(t.data || []);
      setAngebote(ang.data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>;

  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
  const aktiveBuchungen = buchungen.filter((b) => b.status === "bezahlt" || b.status === "neu");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold">Willkommen{account?.first_name ? `, ${account.first_name}` : ""} 👋</h1>
        <p className="text-muted-foreground mt-1">Hier siehst du alles Wichtige zu deinem Webseiten-Projekt auf einen Blick.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Aktive Buchungen" value={aktiveBuchungen.length} to="/kundenportal/vertrag" />
        <StatCard icon={MessageSquare} label="Offene Wünsche" value={openTickets} to="/kundenportal/wuensche" />
        <StatCard icon={FileCheck} label="Angebote" value={angebote.length} to="/kundenportal/angebote" />
      </div>

      <Card>
        <CardHeader><CardTitle>Aktuelle Buchungen</CardTitle></CardHeader>
        <CardContent>
          {buchungen.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Noch keine Buchungen vorhanden.</p>
          ) : (
            <ul className="divide-y divide-border">
              {buchungen.slice(0, 5).map((b) => (
                <li key={b.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{(b.pakete?.[0]?.name) || b.angebots_nr}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(b.gebucht_am).toLocaleDateString("de-DE")} · {b.angebots_nr}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Letzte Wünsche</CardTitle>
          <Link to="/kundenportal/wuensche" className="text-xs text-primary inline-flex items-center gap-1">Alle <ArrowRight size={12} /></Link>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Noch keine Wünsche eingereicht.</p>
          ) : (
            <ul className="divide-y divide-border">
              {tickets.map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <Link to={`/kundenportal/wuensche/${t.id}`} className="font-medium truncate hover:text-primary">{t.subject}</Link>
                    <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString("de-DE")}</div>
                  </div>
                  <TicketStatus status={t.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, to }: any) {
  return (
    <Link to={to}>
      <Card className="hover:shadow-md hover:border-primary/30 transition-all">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Icon size={22} /></div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    bezahlt: { label: "Bezahlt", cls: "bg-emerald-100 text-emerald-700" },
    neu: { label: "Neu", cls: "bg-blue-100 text-blue-700" },
    storniert: { label: "Storniert", cls: "bg-red-100 text-red-700" },
  };
  const cfg = map[status] || { label: status, cls: "bg-muted text-muted-foreground" };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.cls}`}>{cfg.label}</span>;
}

function TicketStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    open: { label: "Offen", cls: "bg-amber-100 text-amber-700" },
    in_progress: { label: "In Arbeit", cls: "bg-blue-100 text-blue-700" },
    done: { label: "Erledigt", cls: "bg-emerald-100 text-emerald-700" },
  };
  const cfg = map[status] || { label: status, cls: "bg-muted text-muted-foreground" };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.cls}`}>{cfg.label}</span>;
}