import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedSection from "@/components/AnimatedSection";
import CTABanner from "@/components/CTABanner";
import { CheckCircle, Gift, Shield, Clock, Search, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const checkPoints = [
  "Performance & Ladegeschwindigkeit",
  "Mobile-Optimierung",
  "SEO-Grundlagen & Meta-Daten",
  "Conversion-Elemente & Call-to-Actions",
  "Technische Fehler & Broken Links",
  "Vergleich mit deiner Konkurrenz",
];

const KostenloserWebsiteCheck = () => {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const honeypot = (formData.get("_gotcha") as string) || "";
    if (honeypot) {
      setLoading(false);
      return;
    }

    try {
      const leadId = crypto.randomUUID();
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = (formData.get("phone") as string) || "";
      const website = (formData.get("website") as string) || "";

      // Primär: an Formspree senden
      const formspreeRes = await fetch("https://formspree.io/f/xojrerqe", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          company: website,
          email,
          _subject: `🔔 Neuer Website-Check: ${website || name}`,
          _replyto: email,
          _gotcha: honeypot,
          website,
          seite: "kostenloser-website-check",
        }),
      });
      if (!formspreeRes.ok) throw new Error(`Formspree ${formspreeRes.status}`);

      const { error } = await supabase.from("leads").insert({
        id: leadId,
        first_name: name,
        email: email,
        phone: phone,
        company_name: website,
      });
      if (error) {
        console.warn("Lead konnte nicht in der DB gespeichert werden", error);
      }

      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-notification",
          idempotencyKey: `website-check-${leadId}`,
          templateData: {
            source: "Kostenloser Website-Check",
            firstName: name,
            email: email,
            phone: phone,
            website: website,
            submittedAt: new Date().toLocaleString("de-DE"),
          },
        },
      });

      toast.success("Anfrage gesendet! Wir melden uns innerhalb von 24 Stunden mit deiner Website-Analyse.");
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
    <main className="pt-20">
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-5">Kostenloser Website-Check</span>
              <h1 className="mb-5 text-balance">
                Kostenloser Website-Check –{" "}
                <span className="gradient-text">So gut ist deine Website wirklich</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Erhältst du eine kostenlose Website-Analyse mit konkreten Handlungsempfehlungen.
                Wir prüfen deine Website auf Performance, SEO, Mobile-Optimierung und Conversion-Potenzial.
              </p>
              <div className="flex flex-wrap justify-center gap-5 mt-8">
                {[
                  { icon: Gift, text: "100 % kostenlos" },
                  { icon: Shield, text: "Unverbindlich" },
                  { icon: Clock, text: "Ergebnis in 48 h" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <b.icon size={16} className="text-primary" />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <AnimatedSection>
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h2 className="mb-2">Jetzt Website-Check anfordern</h2>
                <p className="text-muted-foreground mb-8">Füllen du das Formular aus – wir analysieren deine Website kostenlos.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name *</label>
                    <Input required name="name" placeholder="dein Name" className="bg-background h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">E-Mail *</label>
                    <Input required type="email" name="email" placeholder="name@email.de" className="bg-background h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Telefon</label>
                    <Input type="tel" name="phone" placeholder="+49 123 456 789" className="bg-background h-12" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">deine aktuelle Website-URL *</label>
                    <Input required name="website" placeholder="www.ihre-website.de" className="bg-background h-12" />
                  </div>
                  <Button variant="gradient" size="lg" type="submit" disabled={loading} className="w-full text-base py-6">
                    {loading ? "Wird gesendet..." : <>Kostenlosen Check anfordern <Send size={18} /></>}
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
                    <p className="text-sm text-destructive text-center">
                      Etwas ist schiefgelaufen. Bitte ruf mich direkt an:{" "}
                      <a href="tel:+4961313076500" className="font-semibold underline">
                        06131/30 765 00
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground text-center">
                    Kein Spam. Keine versteckten Kosten. Wir melden uns persönlich bei dir.
                  </p>
                </form>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-10">
                <div>
                  <h2 className="mb-5">Was wir bei deinem Website-Check prüfen</h2>
                  <div className="space-y-4">
                    {checkPoints.map((p) => (
                      <div key={p} className="flex items-center gap-3 p-4 rounded-xl border border-border">
                        <Search size={18} className="text-primary shrink-0" />
                        <span className="text-sm font-medium">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gradient-hero-bg rounded-2xl p-8 text-primary-foreground">
                  <h3 className="font-heading text-xl font-semibold text-primary-foreground mb-4">Warum ein Website-Check?</h3>
                  <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4">
                    Die meisten Unternehmen wissen nicht, warum ihre Website keine Anfragen bringt.
                    Unser kostenloser Website-Check deckt die wahren Probleme auf und gibt dir konkrete Empfehlungen.
                  </p>
                  <Link to="/kontakt" className="inline-flex items-center gap-2 text-sm text-primary-foreground font-semibold hover:underline">
                    Oder direkt Vorschau anfordern <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
};

export default KostenloserWebsiteCheck;
