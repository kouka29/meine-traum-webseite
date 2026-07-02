import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string; subject: string; message: string; status: string;
  priority: string; created_at: string;
}

export default function KundenportalTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("customer_tickets").select("*").order("created_at", { ascending: false });
    setTickets(data as Ticket[] || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (subject.trim().length < 3) { toast.error("Bitte Betreff eingeben"); return; }
    if (message.trim().length < 5) { toast.error("Bitte beschreibe Deinen Wunsch etwas ausführlicher"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("customer_tickets").insert({
      user_id: user.id, subject: subject.trim(), message: message.trim(), status: "open", priority: "normal",
    });
    setSaving(false);
    if (error) { toast.error("Konnte Wunsch nicht senden: " + error.message); return; }
    toast.success("Dein Wunsch wurde gesendet – wir melden uns!");
    setSubject(""); setMessage(""); setOpen(false); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Wünsche & Support</h1>
          <p className="text-muted-foreground mt-1">Änderungswünsche, Support-Anfragen, alles an einem Ort.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-1" aria-hidden={true} focusable={false} /> Neuer Wunsch</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" aria-hidden={true} focusable={false} /></div>
      ) : tickets.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <MessageSquare size={40} className="mx-auto text-muted-foreground mb-3" aria-hidden={true} focusable={false} />
          <p className="text-muted-foreground">Noch keine Wünsche eingereicht.</p>
          <Button className="mt-4" onClick={() => setOpen(true)}><Plus size={16} className="mr-1" aria-hidden={true} focusable={false} /> Ersten Wunsch senden</Button>
        </CardContent></Card>
      ) : (
        <Card><CardContent className="p-0">
          <ul className="divide-y divide-border">
            {tickets.map((t) => (
              <li key={t.id}>
                <Link to={`/kundenportal/wuensche/${t.id}`} className="block p-4 hover:bg-muted/40 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{t.subject}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{t.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(t.created_at).toLocaleDateString("de-DE")}</div>
                    </div>
                    <Status status={t.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent></Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Neuer Wunsch / Anfrage</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Betreff</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="z.B. Logo ändern" maxLength={200} />
            </div>
            <div>
              <Label>Beschreibung</Label>
              <Textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Beschreibe Deinen Wunsch so genau wie möglich..." maxLength={5000} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
            <Button onClick={submit} disabled={saving}>{saving ? <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} /> : "Wunsch senden"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    open: { label: "Offen", cls: "bg-amber-100 text-amber-700" },
    in_progress: { label: "In Arbeit", cls: "bg-blue-100 text-blue-700" },
    done: { label: "Erledigt", cls: "bg-emerald-100 text-emerald-700" },
  };
  const cfg = map[status] || { label: status, cls: "bg-muted text-muted-foreground" };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${cfg.cls}`}>{cfg.label}</span>;
}