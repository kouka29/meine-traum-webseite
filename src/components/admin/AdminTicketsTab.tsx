import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, MessageSquare, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "done";
  priority: string;
  created_at: string;
  admin_response: string | null;
  customer_accounts?: { email: string; first_name: string | null; company_name: string | null } | null;
}

interface TicketMessage {
  id: string;
  author_type: "customer" | "admin";
  message: string;
  created_at: string;
}

const STATUS_OPTIONS: { value: Ticket["status"]; label: string; cls: string }[] = [
  { value: "open", label: "Offen", cls: "bg-amber-100 text-amber-700" },
  { value: "in_progress", label: "In Arbeit", cls: "bg-blue-100 text-blue-700" },
  { value: "done", label: "Erledigt", cls: "bg-emerald-100 text-emerald-700" },
];

export default function AdminTicketsTab({ password }: { password: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | Ticket["status"]>("all");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "tickets-list" },
    });
    setLoading(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Fehler beim Laden");
      return;
    }
    setTickets((data.tickets as Ticket[]) || []);
  }, [password]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const openTicket = async (t: Ticket) => {
    setSelected(t);
    setReply("");
    setLoadingMessages(true);
    setMessages([]);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "ticket-messages", ticketId: t.id },
    });
    setLoadingMessages(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Laden der Nachrichten");
      return;
    }
    setMessages((data.messages as TicketMessage[]) || []);
  };

  const setStatus = async (t: Ticket, status: Ticket["status"]) => {
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "ticket-update-status", ticketId: t.id, status },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Fehler");
      return;
    }
    setTickets((prev) => prev.map((x) => x.id === t.id ? { ...x, status } : x));
    if (selected?.id === t.id) setSelected({ ...selected, status });
    toast.success("Status aktualisiert");
  };

  const sendReply = async () => {
    if (!selected || reply.trim().length < 2) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "ticket-respond", ticketId: selected.id, message: reply.trim() },
    });
    setSending(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Senden");
      return;
    }
    toast.success("Antwort gesendet");
    setReply("");
    openTicket(selected);
    fetchTickets();
  };

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
          {[
            { value: "all" as const, label: `Alle (${tickets.length})` },
            ...STATUS_OPTIONS.map((s) => ({
              value: s.value,
              label: `${s.label} (${tickets.filter((t) => t.status === s.value).length})`,
            })),
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin mr-1" : "mr-1"} /> Aktualisieren
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <MessageSquare size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Keine Tickets in dieser Ansicht.</p>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <ul className="divide-y divide-border">
            {filtered.map((t) => {
              const cfg = STATUS_OPTIONS.find((s) => s.value === t.status);
              return (
                <li key={t.id} className="p-4 hover:bg-muted/40 transition-colors flex items-center gap-4 cursor-pointer" onClick={() => openTicket(t)}>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{t.subject}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {t.customer_accounts?.first_name || t.customer_accounts?.company_name || "—"} · {t.customer_accounts?.email || "—"} · {new Date(t.created_at).toLocaleDateString("de-DE")}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1 mt-1">{t.message}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${cfg?.cls || "bg-muted"}`}>
                    {cfg?.label || t.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent></Card>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selected?.subject}</DialogTitle>
            <p className="text-xs text-muted-foreground">
              {selected?.customer_accounts?.email} · {selected && new Date(selected.created_at).toLocaleString("de-DE")}
            </p>
          </DialogHeader>

          {selected && (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <Button
                    key={s.value}
                    size="sm"
                    variant={selected.status === s.value ? "default" : "outline"}
                    onClick={() => setStatus(selected, s.value)}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>

              <div className="rounded-lg border border-border p-3 bg-muted/30">
                <div className="text-xs font-semibold text-muted-foreground mb-1">Ursprünglicher Wunsch</div>
                <div className="text-sm whitespace-pre-wrap">{selected.message}</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Verlauf</div>
                {loadingMessages ? (
                  <div className="flex justify-center py-4"><Loader2 className="animate-spin" size={18} /></div>
                ) : messages.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">Noch keine Antworten.</p>
                ) : (
                  <ul className="space-y-2">
                    {messages.map((m) => (
                      <li key={m.id} className={`rounded-lg p-3 text-sm ${m.author_type === "admin" ? "bg-primary/10 ml-6" : "bg-muted mr-6"}`}>
                        <div className="text-[10px] font-semibold uppercase mb-1 text-muted-foreground">
                          {m.author_type === "admin" ? "Du" : "Kunde"} · {new Date(m.created_at).toLocaleString("de-DE")}
                        </div>
                        <div className="whitespace-pre-wrap">{m.message}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1">Antwort an Kunde</div>
                <Textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Antwort schreiben..." />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Schließen</Button>
            <Button onClick={sendReply} disabled={sending || reply.trim().length < 2}>
              {sending ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} className="mr-1" /> Antwort senden</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}