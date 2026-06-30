import { useSearchParams, Link } from "react-router-dom";
import { Check, Mail, Calendar, ArrowRight, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KaufErfolgreich() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const kind = searchParams.get("kind") === "rent" ? "rent" : "deposit";

  const isRent = kind === "rent";

  const heading = isRent
    ? "Vielen Dank für deine Buchung!"
    : "Vielen Dank für deine Anzahlung!";

  const subline = isRent
    ? "dein Miet-Abo ist aktiv. Wir starten jetzt mit deiner neuen Website."
    : "deine 50 % Anzahlung ist eingegangen. Wir starten jetzt mit deiner neuen Website.";

  const emailText = isRent
    ? "Du erhältst in Kürze eine Bestätigung mit deiner ersten Monatsrechnung als PDF."
    : "Du erhältst in Kürze eine Bestätigung mit deiner Anzahlungs-Rechnung als PDF.";

  return (
    <main id="main-content" className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Check className="text-primary" size={48} aria-hidden={true} focusable={false} />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading text-3xl font-bold mb-4">
          {heading}
        </h1>
        <p className="text-lg text-muted-foreground mb-10">{subline}</p>

        <div className="grid gap-4 text-left mb-10">
          <div className="flex items-start gap-4 p-5 rounded-xl border bg-card">
            <Mail className="text-primary shrink-0 mt-0.5" size={22} aria-hidden={true} focusable={false} />
            <div>
              <p className="font-semibold mb-1">Bestätigung per E-Mail</p>
              <p className="text-sm text-muted-foreground">{emailText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl border bg-card">
            <Calendar className="text-primary shrink-0 mt-0.5" size={22} aria-hidden={true} focusable={false} />
            <div>
              <p className="font-semibold mb-1">Onboarding innerhalb von 24 h</p>
              <p className="text-sm text-muted-foreground">
                Wir melden uns persönlich, um die nächsten Schritte zu besprechen und deinen
                Onboarding-Fragebogen zu schicken.
              </p>
            </div>
          </div>
          {isRent ? (
            <div className="flex items-start gap-4 p-5 rounded-xl border bg-card">
              <Repeat className="text-primary shrink-0 mt-0.5" size={22} aria-hidden={true} focusable={false} />
              <div>
                <p className="font-semibold mb-1">Monatliche Abrechnung</p>
                <p className="text-sm text-muted-foreground">
                  Die erste Monatsmiete wurde eingezogen, danach erfolgt die Abrechnung automatisch
                  monatlich. Mindestlaufzeit 12 Monate – danach jederzeit kündbar.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4 p-5 rounded-xl border bg-card">
              <Check className="text-primary shrink-0 mt-0.5" size={22} aria-hidden={true} focusable={false} />
              <div>
                <p className="font-semibold mb-1">Restzahlung bei Go-Live</p>
                <p className="text-sm text-muted-foreground">
                  Die restlichen 50 % werden erst fällig, wenn deine Website live geht – per Rechnung.
                </p>
              </div>
            </div>
          )}
        </div>

        <Button asChild size="lg" variant="outline-primary">
          <Link to="/">
            Zurück zur Startseite <ArrowRight size={16} aria-hidden={true} focusable={false} />
          </Link>
        </Button>

        {sessionId && (
          <p className="text-xs text-muted-foreground mt-8">
            Referenz: <code className="font-mono">{sessionId}</code>
          </p>
        )}
      </div>
    </main>
  );
}
