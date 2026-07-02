import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package } from "lucide-react";

export default function KundenportalVertrag() {
  const [loading, setLoading] = useState(true);
  const [buchungen, setBuchungen] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("buchungen").select("*").order("gebucht_am", { ascending: false }).then(({ data }) => {
      setBuchungen(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" aria-hidden={true} focusable={false} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Vertrag & Paket</h1>
        <p className="text-muted-foreground mt-1">Übersicht Deiner gebuchten Leistungen und Vertragsdaten.</p>
      </div>

      {buchungen.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Noch keine Buchung vorhanden.</CardContent></Card>
      ) : buchungen.map((b) => (
        <Card key={b.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-2"><Package size={18} className="text-primary" aria-hidden={true} focusable={false} /> Buchung {b.angebots_nr}</span>
              <span className="text-xs font-normal text-muted-foreground">{new Date(b.gebucht_am).toLocaleDateString("de-DE")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.isArray(b.pakete) && b.pakete.map((p: any, i: number) => (
              <div key={i} className="rounded-lg border border-border p-4 bg-muted/30">
                <div className="font-semibold text-base">{p.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {p.payment_mode === "miete" || p.typ === "miete"
                    ? `${(p.miete_monatlich || p.mietpreis || 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" })} / Monat`
                    : `${(p.preis || 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" })} einmalig`}
                </div>
              </div>
            ))}
            {Array.isArray(b.addons) && b.addons.length > 0 && (
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Extras</div>
                <ul className="space-y-1 text-sm">
                  {b.addons.map((a: any, i: number) => (
                    <li key={i} className="flex justify-between">
                      <span>{a.name}</span>
                      <span className="text-muted-foreground">
                        {(a.preis || (a.price_cents || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                        {(a.typ === "monatlich" || a.price_type === "monthly") ? "/Monat" : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-4 border-t border-border flex justify-between font-semibold">
              <span>Gesamt (brutto)</span>
              <span>{Number(b.gesamtbetrag_brutto || 0).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              Status: <strong className="text-foreground">{b.status}</strong> · Zahlungsart: {b.payment_method}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 text-sm">
          <strong>Kündigung oder Änderungswunsch?</strong> Schreib uns einfach über die{" "}
          <a href="/kundenportal/wuensche" className="text-primary underline">Wünsche-Seite</a> – wir kümmern uns persönlich darum.
        </CardContent>
      </Card>
    </div>
  );
}