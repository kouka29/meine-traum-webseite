import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle, Shield, Clock, CalendarCheck, PhoneCall, Target } from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/lib/submitLead";

const trustPoints = [
  "15 Minuten Klarheit – kein Verkaufsgespräch",
  "Konkrete Empfehlung für dein Projekt",
  "Transparente Preisinfo direkt im Call",
  "Persönlicher Ansprechpartner – kein Callcenter",
];

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input:not([name='_gotcha']), textarea",
    );
    const v = Array.from(inputs).map(
      (el) => (el as HTMLInputElement | HTMLTextAreaElement).value.trim()
    );
    const [name, email, phone, website, company, message] = v;
    const honeypot = (form.querySelector("input[name='_gotcha']") as HTMLInputElement | null)?.value || "";
    const companyHp = (form.querySelector("input[name='company']") as HTMLInputElement | null)?.value || "";
    if (honeypot || companyHp) {
      setLoading(false);
      return;
    }

    try {
      const ok = await submitLead({
        name,
        email,
        phone,
        branche: company,
        message: [website && `Website: ${website}`, message].filter(Boolean).join("\n"),
        source_cta: "kontakt_hauptformular",
        company: companyHp,
      });
      if (!ok) throw new Error("submitLead failed");
      toast.success("Anfrage gesendet! Wir melden uns innerhalb von 24 Stunden mit Terminvorschlägen.");
      form.reset();
    } catch {
      setSubmitError(
        "Etwas ist schiefgelaufen. Bitte ruf mich direkt an: 06131/30 765 00",
      );
      toast.error("Fehler beim Senden. Bitte versuchen du es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="pt-20">
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-20 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-5">
                Kostenloses Erstgespräch
              </span>
              <h1 className="mb-5 text-balance">
                <span className="block">dein kostenloses Erstgespräch –</span>
                <span className="gradient-text block mt-3">in 15 Minuten zur Klarheit</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Du hast sich für ein persönliches Erstgespräch entschieden. Perfekt. In 15 Minuten besprechen
                wir dein Projekt, klären deine Ziele und Du erhältst eine konkrete Empfehlung – ohne Verkaufsdruck,
                ohne Verpflichtung.
              </p>
              <div className="flex flex-wrap justify-center gap-5 mt-8">
                {[
                  { icon: Clock, text: "15 Minuten" },
                  { icon: Shield, text: "Unverbindlich" },
                  { icon: PhoneCall, text: "Persönlich am Telefon" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <b.icon size={16} className="text-primary" />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
            <AnimatedSection className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name *</label>
                    <Input required placeholder="dein Name" className="bg-card h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">E-Mail *</label>
                    <Input required type="email" placeholder="name@email.de" className="bg-card h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Telefon *</label>
                    <Input required type="tel" placeholder="+49 123 456 789" className="bg-card h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Website (falls vorhanden)</label>
                    <Input placeholder="www.ihre-website.de" className="bg-card h-12" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Unternehmen / Branche</label>
                  <Input placeholder="z. B. Malerbetrieb, Coaching, Steuerberatung..." className="bg-card h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Wann passt es dir am besten? (optional)</label>
                  <Input placeholder="z. B. Mo–Fr vormittags, oder Di nachmittag" className="bg-card h-12" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Worum soll es im Gespräch gehen? (optional)</label>
                  <Textarea
                    rows={4}
                    placeholder="z. B. Neue Website, Relaunch, mehr Anfragen, Preise klären..."
                    className="bg-card resize-none"
                  />
                </div>
                <Button variant="gradient" size="lg" type="submit" disabled={loading} className="w-full sm:w-auto text-base py-6 px-8">
                  {loading ? "Wird gesendet..." : (
                    <>Erstgespräch anfragen <Send size={18} aria-hidden={true} focusable={false} /></>
                  )}
                </Button>
                {/* Honeypot – unsichtbar für Nutzer, fängt Spam-Bots */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: "none" }}
                  aria-hidden="true"
                />
                {submitError && (
                  <p className="text-sm text-destructive">
                    Etwas ist schiefgelaufen. Bitte ruf mich direkt an:{" "}
                    <a href="tel:+4961313076500" className="font-semibold underline">
                      06131/30 765 00
                    </a>
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Kein Verkaufsgespräch. Keine versteckten Kosten. Wir melden uns persönlich bei dir.
                </p>
              </form>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-2" delay={0.2}>
              <div className="space-y-10">
                <div className="p-8 rounded-2xl gradient-hero-bg">
                  <h2 className="font-heading font-semibold text-primary-foreground mb-4 text-lg">
                    So läuft dein Erstgespräch ab
                  </h2>
                  <ol className="space-y-4 text-sm text-primary-foreground/75">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary-foreground text-base">1.</span>
                      du füllen das Formular aus (2 Minuten)
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary-foreground text-base">2.</span>
                      Wir melden uns in 24 h mit Terminvorschlägen
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary-foreground text-base">3.</span>
                      15-Minuten-Call: Klarheit, Empfehlung, Preisinfo
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-heading font-semibold mb-5 text-lg">Das bekommst du</h3>
                  <div className="space-y-3.5">
                    {trustPoints.map((t) => (
                      <div key={t} className="flex items-center gap-3">
                        <CheckCircle size={17} className="text-primary shrink-0" aria-hidden={true} focusable={false} />
                        <span className="text-sm">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-semibold mb-5 text-lg">Direkter Kontakt</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Phone, text: "06131/30 765 00", label: "Jetzt anrufen" },
                      { icon: Mail, text: "info@meine-traum-webseite.de", label: "E-Mail schreiben" },
                      { icon: MapPin, text: "Rheinallee 88, 55120 Mainz", label: "Standort" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                          <span className="text-sm font-medium">{item.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Weitere Optionen:</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <Link to="/kostenloser-website-check" className="text-primary hover:underline">Kostenloser Website-Check</Link>
                    <Link to="/webdesign-preise" className="text-primary hover:underline">Webdesign Preise</Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
