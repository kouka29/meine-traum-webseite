import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  first_name: z.string().trim().min(1, "Name erforderlich").max(100),
  email: z.string().trim().email("Ungültige E-Mail").max(200),
  phone: z.string().trim().min(3, "Telefon erforderlich").max(50),
  company_name: z.string().trim().max(200).optional().default(""),
  trade: z.string().trim().max(100).optional().default(""),
  current_website: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(5000).optional().default(""),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}

export default function NewLeadModal({ open, onOpenChange, onCreated }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    email: "",
    phone: "",
    company_name: "",
    trade: "",
    current_website: "",
    notes: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Bitte Eingaben prüfen");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("leads").insert({
      first_name: parsed.data.first_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company_name: parsed.data.company_name || "",
      trade: parsed.data.trade || null,
      current_website: parsed.data.current_website || null,
      notes: parsed.data.notes ? `[Manuell angelegt]\n${parsed.data.notes}` : "[Manuell angelegt]",
      status: "new",
    });
    setSaving(false);
    if (error) {
      toast.error("Konnte Lead nicht anlegen: " + error.message);
      return;
    }
    toast.success("Lead angelegt");
    setForm({ first_name: "", email: "", phone: "", company_name: "", trade: "", current_website: "", notes: "" });
    onOpenChange(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neuen Lead anlegen</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name *</Label>
            <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>E-Mail *</Label>
              <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <Label>Telefon *</Label>
              <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Firma</Label>
              <Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} />
            </div>
            <div>
              <Label>Branche</Label>
              <Input value={form.trade} onChange={(e) => update("trade", e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Aktuelle Webseite</Label>
            <Input value={form.current_website} onChange={(e) => update("current_website", e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Notizen</Label>
            <Textarea rows={4} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Abbrechen</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : "Lead anlegen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}