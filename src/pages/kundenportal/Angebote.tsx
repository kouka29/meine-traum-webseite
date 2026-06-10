import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KundenportalAngebote() {
  const [loading, setLoading] = useState(true);
  const [angebote, setAngebote] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("angebote").select("id, short_id, lead_name, preis, status, erstellt_am, ablauf_datum")
      .order("erstellt_am", { ascending: false })
      .then(({ data }) => { setAngebote(data || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" aria-hidden={true} focusable={false} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Angebote</h1>
        <p className="text-muted-foreground mt-1">Alle Angebote, die wir dir erstellt haben.</p>
      </div>

      {angebote.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <FileCheck size={40} className="mx-auto text-muted-foreground mb-3" aria-hidden={true} focusable={false} />
          <p className="text-muted-foreground">Aktuell keine Angebote.</p>
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {angebote.map((a) => (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-medium">Angebot für {a.lead_name || "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.erstellt_am).toLocaleDateString("de-DE")}
                    {a.preis ? ` · ${Number(a.preis).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}` : ""}
                    {a.ablauf_datum ? ` · gültig bis ${new Date(a.ablauf_datum).toLocaleDateString("de-DE")}` : ""}
                  </div>
                </div>
                {a.short_id && (
                  <Button asChild size="sm" variant="outline">
                    <a href={`/a/${a.short_id}`} target="_blank" rel="noreferrer"><ExternalLink size={14} className="mr-1" aria-hidden={true} focusable={false} /> Ansehen</a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}