import { useState, FormEvent } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Nachricht gesendet! Wir melden uns in Kürze.");
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
                Kontakt
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Lassen Sie uns <span className="gradient-text">sprechen</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Erzählen Sie uns von Ihrem Projekt – das Erstgespräch ist kostenlos und unverbindlich.
              </p>
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
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Unternehmen</label>
                  <Input placeholder="Ihr Unternehmen (optional)" className="bg-card" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nachricht *</label>
                  <Textarea
                    required
                    rows={5}
                    placeholder="Beschreiben Sie kurz Ihr Projekt oder Ihre Wünsche..."
                    className="bg-card resize-none"
                  />
                </div>
                <Button variant="gradient" size="lg" type="submit" disabled={loading}>
                  {loading ? "Wird gesendet..." : (
                    <>Nachricht senden <Send size={18} /></>
                  )}
                </Button>
              </form>
            </AnimatedSection>

            <AnimatedSection className="lg:col-span-2" delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading font-semibold mb-4">Kontaktdaten</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Mail, text: "info@meinetraumwebseite.de" },
                      { icon: Phone, text: "+49 123 456 789" },
                      { icon: MapPin, text: "Deutschland" },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon size={18} className="text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 rounded-xl gradient-hero-bg">
                  <h4 className="font-heading font-semibold text-primary-foreground mb-2">
                    Kostenloses Erstgespräch
                  </h4>
                  <p className="text-sm text-primary-foreground/80">
                    In einem unverbindlichen Gespräch besprechen wir Ihre Ziele und
                    zeigen Ihnen, wie wir Ihnen helfen können.
                  </p>
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
