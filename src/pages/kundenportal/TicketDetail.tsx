import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const load = async () => {
    const [{ data: t }, { data: m }] = await Promise.all([
      supabase.from("customer_tickets").select("*").eq("id", id!).maybeSingle(),
      supabase.from("customer_ticket_messages").select("*").eq("ticket_id", id!).order("created_at"),
    ]);
    setTicket(t); setMessages(m || []); setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const send = async () => {
    if (reply.trim().length < 2) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSending(true);
    const { error } = await supabase.from("customer_ticket_messages").insert({
      ticket_id: id!, author_type: "customer", author_user_id: user.id, message: reply.trim(),
    });
    setSending(false);
    if (error) { toast.error("Konnte Nachricht nicht senden"); return; }
    setReply(""); load();
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>;
  if (!ticket) return <p>Wunsch nicht gefunden.</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/kundenportal/wuensche" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Zurück
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-bold">{ticket.subject}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Erstellt am {new Date(ticket.created_at).toLocaleString("de-DE")} · Status: <strong>{ticket.status}</strong>
        </p>
      </div>

      <Card><CardContent className="p-5">
        <div className="text-sm whitespace-pre-wrap">{ticket.message}</div>
      </CardContent></Card>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`p-4 rounded-lg ${m.author_type === "admin" ? "bg-primary/10 border border-primary/20" : "bg-muted"}`}>
            <div className="text-xs font-medium mb-1 text-muted-foreground">
              {m.author_type === "admin" ? "QK Marketing Team" : "Du"} · {new Date(m.created_at).toLocaleString("de-DE")}
            </div>
            <div className="text-sm whitespace-pre-wrap">{m.message}</div>
          </div>
        ))}
      </div>

      {ticket.status !== "done" && (
        <div className="space-y-2">
          <Textarea rows={4} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Antworten oder Ergänzung..." maxLength={5000} />
          <Button onClick={send} disabled={sending}>
            {sending ? <Loader2 className="animate-spin" size={16} /> : <><Send size={14} className="mr-1" /> Senden</>}
          </Button>
        </div>
      )}
    </div>
  );
}