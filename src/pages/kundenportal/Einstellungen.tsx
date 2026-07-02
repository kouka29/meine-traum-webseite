import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ExternalLink, Save } from "lucide-react";
import { toast } from "sonner";
import { getStripeEnvironment } from "@/lib/stripe";

export default function KundenportalEinstellungen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [form, setForm] = useState({ first_name: "", company_name: "", phone: "" });
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email || "");
      const { data } = await supabase.from("customer_accounts").select("*").maybeSingle();
      if (data) setForm({ first_name: data.first_name || "", company_name: data.company_name || "", phone: data.phone || "" });
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("customer_accounts").update({
      first_name: form.first_name.trim() || null,
      company_name: form.company_name.trim() || null,
      phone: form.phone.trim() || null,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error("Konnte nicht speichern"); return; }
    toast.success("Gespeichert");
  };

  const openStripePortal = async () => {
    setPortalLoading(true);
    const { data, error } = await supabase.functions.invoke("customer-portal", {
      body: { action: "portal", env: getStripeEnvironment(), return_url: window.location.href },
    });
    setPortalLoading(false);
    if (error || data?.error) { toast.error(data?.error || "Stripe-Portal nicht verfügbar"); return; }
    window.open(data.url, "_blank");
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" aria-hidden={true} focusable={false} /></div>;

 return (
 <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground mt-1">Stammdaten, Zahlungsmethode und Abo verwalten.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Stammdaten</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>E-Mail</Label>
            <Input value={email} disabled />
            <p className="text-xs text-muted-foreground mt-1">E-Mail kann nicht direkt geändert werden – schreib uns bei Bedarf eine Nachricht.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Vorname</Label>
              <Input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div>
              <Label>Telefon</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Firma</Label>
            <Input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} /> : <><Save size={14} className="mr-1" aria-hidden={true} focusable={false} /> Speichern</>}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Zahlungsmethode & Abo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
 Im sicheren Stripe-Kundenportal kannst du Karte oder SEPA-Lastschrift ändern,
 Rechnungen herunterladen und dein Abo verwalten.
 </p>
          <Button variant="outline" onClick={openStripePortal} disabled={portalLoading}>
            {portalLoading ? <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} /> : <><ExternalLink size={14} className="mr-1" aria-hidden={true} focusable={false} /> Stripe-Kundenportal öffnen</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}