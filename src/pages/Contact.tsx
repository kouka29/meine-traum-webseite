import { useState, FormEvent } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle, Shield, Gift, Clock } from "lucide-react";
import { toast } from "sonner";

const trustPoints = [
  "Kostenlose Website-Vorschau",
  "Keine Verpflichtung",
  "Antwort innerhalb von 24 Stunden",
  "Persönlicher Ansprechpartner",
];

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Nachricht gesendet! Wir melden uns innerhalb von 24 Stunden.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <main className="pt-16">
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                Kostenlose Beratung
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Sichern Sie sich Ihre{" "}
                <span className="gradient-text">kostenlose Website-Vorschau</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Sehen Sie in 48 Stunden, wie Ihre neue Website aussehen könnte – 
                komplett kostenlos und ohne Verpflichtung.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {[
                  { icon: Gift, text: "Kostenlos" },
                  { icon: Shield, text: "Unverbindlich" },
                  { icon: Clock, text: "In 48h fertig" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <b.icon size={16} className="text-primary" />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <AnimatedSection className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name *</label>
                    <Input required placeholder="Ihr Name" className="bg-card" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">E-Mail *</label>
                    <Input required type="email" placeholder="name@email.de" className="bg-card" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Telefon</label>
                    <Input type="tel" placeholder="+49 123 456 789" className="bg-card" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Website (falls vorhanden)</label>
                    <Input placeholder="www.ihre-website.de" className="bg-card" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Unternehmen / Branche</label>
                  <Input placeholder="z.B. Malerbetrieb, Coaching, Steuerberatung..." className="bg-card" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Was ist Ihr größtes Problem mit Ihrer aktuellen Website?</label>
                  <Textarea
                    rows={4}
                    placeholder="z.B. Keine Anfragen, veraltetes Design, schlechte Sichtbarkeit..."
                    className="bg-card resize-none"
                  />
                </div>
                <Button variant="gradient" size="lg" type="submit" disabled={loading} className="w-full sm:w-auto text-base py-6 px-8">
                  {loading ? "Wird gesendet..." : (
                    <>Kostenlose Vorschau anfordern <Send size={18} /></>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Kein Spam. Keine versteckten Kosten. Wir melden uns persönlich bei Ihnen.
                </p>
              </form>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-2" delay={0.2}>
              <div className="space-y-8">
                <div className="p-6 rounded-xl gradient-hero-bg">
                  <h4 className="font-heading font-semibold text-primary-foreground mb-3">
                    So funktioniert's:
                  </h4>
                  <ol className="space-y-3 text-sm text-primary-foreground/80">
                    <li className="flex gap-3">
                      <span className="font-bold text-primary-foreground">1.</span>
                      Sie füllen das Formular aus (2 Minuten)
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary-foreground">2.</span>
                      Wir erstellen eine individuelle Vorschau (48h)
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-primary-foreground">3.</span>
                      Sie entscheiden – ohne Druck, ohne Verpflichtung
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-heading font-semibold mb-4">Das bekommen Sie:</h3>
                  <div className="space-y-3">
                    {trustPoints.map((t) => (
                      <div key={t} className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-primary shrink-0" />
                        <span className="text-sm">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-semibold mb-4">Direkter Kontakt</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Phone, text: "+49 123 456 789", label: "Rufen Sie uns an" },
                      { icon: Mail, text: "info@meinetraumwebseite.de", label: "Schreiben Sie uns" },
                      { icon: MapPin, text: "Deutschland", label: "Standort" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
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
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
