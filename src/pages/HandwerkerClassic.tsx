import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight, Phone, Check, Search, Smartphone, MessageSquare, Zap,
  Wrench, Euro, Clipboard, Palette, Rocket, Star, ShieldCheck, Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const painPoints = [
  { title: "Auf Google unsichtbar", text: "Wenn jemand „Elektriker Mainz“ sucht — erscheinst Du auf Seite 3. Dein Konkurrent auf Seite 1 bekommt den Auftrag." },
  { title: "Kein Auftrag über die Website", text: "Du hast eine Website, aber sie bringt keine Anfragen. Sie sieht zwar aus — aber sie verkauft nicht." },
  { title: "Keine Zeit für so einen Kram", text: "Du bist auf der Baustelle, nicht am PC. Wer soll sich um die Website kümmern? Das übernehmen wir komplett." },
  { title: "Veraltete oder keine Website", text: "Kunden googeln Dich — und finden entweder nichts oder eine Seite aus 2015. Erster Eindruck verloren." },
];

const steps = [
  { icon: Clipboard, title: "Kurz erzählen (5 Minuten)", text: "Du füllst ein kurzes Formular aus oder rufst uns an. Kein langes Meeting, keine Vorbereitung nötig." },
  { icon: Palette, title: "Wir bauen Deine Vorschau (48 Stunden)", text: "Du bekommst eine echte Design-Vorschau Deiner neuen Website — individuell für Deinen Betrieb. Kostenlos." },
  { icon: Rocket, title: "Gefällt sie Dir — geht sie live", text: "Gefällt Dir die Vorschau nicht — kein Problem, Du zahlst nichts. Gefällt sie Dir → wir schalten sie live." },
];

const features = [
  { icon: Search, title: "Google findet Dich", text: "Wir optimieren Deine Seite damit Du bei „Elektriker [Deine Stadt]“ auftauchst — nicht Dein Konkurrent." },
  { icon: Smartphone, title: "Perfekt auf jedem Handy", text: "80 % Deiner Kunden suchen auf dem Handy. Deine Seite funktioniert auf jedem Gerät perfekt." },
  { icon: MessageSquare, title: "Anfragen rund um die Uhr", text: "Kontaktformular, WhatsApp-Button, Click-to-Call — Kunden können Dich jederzeit erreichen." },
  { icon: Zap, title: "In 7–14 Tagen online", text: "Keine monatelangen Projekte. Während Du auf der Baustelle bist, bauen wir Deine Website." },
  { icon: Wrench, title: "Wir kümmern uns um alles", text: "Hosting, Domain, SSL, Updates — alles inklusive. Du musst Dich um nichts kümmern." },
  { icon: Euro, title: "Steuerlich absetzbar", text: "Als Gewerbetreibender kannst Du die Website komplett von der Steuer absetzen." },
];

const testimonials = [
  { badge: "4× MEHR ANFRAGEN", quote: "Vorher hatte ich kaum Anfragen über die Website. Seit dem Relaunch melde ich mich bei Kunden — nicht umgekehrt.", name: "Michael S.", role: "Elektrobetrieb, Mainz" },
  { badge: "IN 10 TAGEN LIVE", quote: "Die haben alles übernommen. Ich musste nur kurz Infos geben — eine Woche später war meine neue Seite online.", name: "Klaus B.", role: "Malerbetrieb, Wiesbaden" },
  { badge: "TOP 3 BEI GOOGLE", quote: "Endlich findet man mich bei Google. Letzte Woche 3 neue Aufträge über die Website — das gab es vorher nie.", name: "Andrea T.", role: "Sanitärbetrieb, Frankfurt" },
];

const trades = [
  { icon: "⚡", label: "Elektriker" },
  { icon: "🎨", label: "Maler" },
  { icon: "🔧", label: "Sanitär & Heizung" },
  { icon: "🏠", label: "Dachdecker" },
  { icon: "🪵", label: "Schreiner" },
  { icon: "🧱", label: "Fliesenleger" },
  { icon: "🌿", label: "Garten & Landschaft" },
  { icon: "❄️", label: "Kältetechnik" },
  { icon: "🚗", label: "KFZ-Betrieb" },
  { icon: "➕", label: "Weitere Betriebe" },
];

const faqs = [
  { q: "Lohnt sich eine Website für meinen Betrieb wirklich?", a: "Ja — wenn sie richtig gemacht ist. Eine Website die auf Google gefunden wird und Vertrauen aufbaut, bringt Dir täglich neue Anfragen. Ohne Website verlierst Du jeden Tag Kunden an Konkurrenten die online sind." },
  { q: "Ich habe keine Zeit mich darum zu kümmern", a: "Das musst Du nicht. Du gibst uns kurz Deine Infos — wir übernehmen alles. Texte, Design, Technik, Hosting. Du machst Dein Handwerk, wir machen Deine Website." },
  { q: "Was passiert wenn mir die Vorschau nicht gefällt?", a: "Dann zahlst Du nichts. Die Vorschau ist komplett kostenlos und unverbindlich. Wir zeigen Dir was möglich ist — Du entscheidest danach frei." },
  { q: "Wie lange dauert es bis meine Website live ist?", a: "Nach Deiner Freigabe in der Regel 7–14 Tage. Die Vorschau bekommst Du bereits innerhalb von 48 Stunden." },
  { q: "Muss ich mich um Technik, Hosting oder Updates kümmern?", a: "Nein. Hosting, Domain, SSL-Zertifikat und monatliche Updates sind bei uns inklusive. Du musst Dich um nichts kümmern." },
  { q: "Bekomme ich wirklich mehr Aufträge?", a: "Wir können keine Garantie auf eine bestimmte Anzahl versprechen — aber: Alle unsere Kunden berichten von mehr Anfragen nach dem Relaunch. Eine professionelle Website die Google-optimiert ist und Vertrauen aufbaut, arbeitet 24/7 für Dich." },
];

const pricingTiers = [
  { name: "Einzelkämpfer", price: "59 €", sub: "Für Betriebe die schnell online wollen", features: ["1-Seite Website", "Mobil-optimiert", "Online in 7 Tagen"], highlighted: false },
  { name: "Wachstums-Betrieb", price: "99 €", sub: "Für Betriebe die wachsen wollen", features: ["Bis zu 5 Seiten", "Google-Optimierung", "Google Maps Einrichtung"], highlighted: true },
  { name: "Marktführer", price: "159 €", sub: "Für Betriebe die dominieren wollen", features: ["Bis zu 10 Seiten", "SEO + Seitenstruktur", "Individuelle Umsetzung"], highlighted: false },
];

const HandwerkerClassic = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ vorname: "", telefon: "", branche: "", ort: "", email: "" });

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vorname || !form.telefon || !form.branche || !form.ort) {
      toast({ title: "Bitte alle Pflichtfelder ausfüllen", variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="pt-20">
      <button
        onClick={scrollToForm}
        className="fixed top-0 left-0 right-0 z-[60] w-full bg-primary text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-medium hover:brightness-110 transition"
      >
        Speziell für Handwerksbetriebe — Kostenlose Website-Vorschau in 48 Stunden sichern →
      </button>

      {/* HERO */}
      <section className="section-padding mt-8">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-6">
                Für Elektriker · Maler · Sanitär · Dachdecker · Heizung
              </span>
              <h1 className="mb-6 text-balance">
                Dein Betrieb. Gefunden auf Google.{" "}
                <span className="gradient-text">Mehr Aufträge. Weniger Leerläufe.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Wir bauen Dir eine Website, die echte Anfragen bringt — nicht nur gut aussieht.
                Speziell für Handwerksbetriebe im DACH-Raum.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center mb-8">
                {["Kostenlose Vorschau in 48 h", "Kein Technik-Stress", "Fertig während Du arbeitest"].map((b) => (
                  <span key={b} className="flex items-center gap-1.5">
                    <Check size={14} className="text-primary" /> {b}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="gradient" size="lg" onClick={scrollToForm} className="animate-cta-pulse">
                  Kostenlose Vorschau anfordern <ArrowRight size={18} />
                </Button>
                <Button variant="outline-primary" size="lg" asChild>
                  <a href="tel:+4961313076498"><Phone size={18} /> 06131 30 764 98</a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="section-padding bg-card">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <h2 className="text-center mb-12 text-balance">Kommt Dir das bekannt vor?</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {painPoints.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.05}>
                <div className="p-7 rounded-2xl border border-border bg-background hover:shadow-card transition">
                  <h3 className="font-heading font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{p.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <h2 className="text-center mb-12 text-balance">So einfach geht's</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="p-8 rounded-2xl border border-border bg-card text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <s.icon size={24} className="text-primary" />
                  </div>
                  <div className="text-xs font-bold text-primary tracking-wider mb-2">SCHRITT {i + 1}</div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-padding bg-card">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <h2 className="text-center mb-12 text-balance">Das bekommst Du</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.05}>
                <div className="p-7 rounded-2xl border border-border bg-background h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <h2 className="text-center mb-12 text-balance">Was Handwerker sagen</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="p-7 rounded-2xl border border-border bg-card h-full">
                  <span className="inline-block badge-label bg-primary/10 text-primary mb-4">{t.badge}</span>
                  <p className="text-foreground leading-relaxed mb-5">„{t.quote}"</p>
                  <div className="flex text-amber-500 mb-2">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TRADES */}
      <section className="section-padding bg-card">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <h2 className="text-center mb-12 text-balance">Für jedes Gewerk</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {trades.map((t) => (
              <div key={t.label} className="p-5 rounded-2xl border border-border bg-background text-center hover:border-primary/30 hover:shadow-card transition">
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="text-sm font-medium">{t.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 max-w-xl mx-auto text-sm">
            Deine Branche nicht dabei? Kein Problem — wir haben schon über 20 verschiedene Gewerke umgesetzt.
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <h2 className="text-center mb-3 text-balance">Faire Preise. Keine Überraschungen.</h2>
            <p className="text-center text-muted-foreground mb-12">Ab 59 € im Monat — komplett gemanagt.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((p) => (
              <div key={p.name} className={`p-8 rounded-2xl border bg-card ${p.highlighted ? "border-primary shadow-elevated relative" : "border-border"}`}>
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-primary text-primary-foreground">Beliebteste Wahl</span>
                )}
                <h3 className="font-heading font-semibold text-xl mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{p.sub}</p>
                <div className="mb-6">
                  <span className="text-4xl font-heading font-bold">{p.price}</span>
                  <span className="text-muted-foreground text-sm"> / Monat</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={16} className="text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant={p.highlighted ? "gradient" : "outline-primary"} className="w-full">
                  <Link to="/preise">Mehr erfahren</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section ref={formRef} id="vorschau" className="section-padding bg-card">
        <div className="container-narrow px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <AnimatedSection>
              <span className="badge-label bg-primary/10 text-primary mb-5">Kostenlos & unverbindlich</span>
              <h2 className="mb-6 text-balance">Deine kostenlose Website-Vorschau in 48 Stunden</h2>
              <ul className="space-y-3 mb-8">
                {[
                  "Individuelle Vorschau für Deinen Betrieb",
                  "Ich melde mich innerhalb von 2 Stunden",
                  "Kein Risiko — Du entscheidest danach frei",
                  "Kostenlos — auch wenn Du nicht kaufst",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px]">
                    <Check size={18} className="text-primary mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <a href="tel:+4961313076498" className="inline-flex items-center gap-3 text-2xl font-heading font-bold hover:text-primary transition">
                <Phone size={20} className="text-primary" /> 06131 30 764 98
              </a>
              <p className="text-sm text-muted-foreground mt-1">Mo–Fr 9–18 Uhr</p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-background rounded-2xl p-8 border border-border shadow-card">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-5">
                      <Check size={28} className="text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-3">Super!</h3>
                    <p className="text-muted-foreground">Ich melde mich innerhalb von 2 Stunden bei Dir.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-heading font-bold text-xl mb-1">Vorschau jetzt anfordern</h3>
                    <p className="text-sm text-muted-foreground mb-5">Dauert keine 60 Sekunden.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="vorname-c">Vorname *</Label>
                        <Input id="vorname-c" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="telefon-c">Telefonnummer *</Label>
                        <Input id="telefon-c" type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="branche-c">Deine Branche *</Label>
                        <select
                          id="branche-c"
                          value={form.branche}
                          onChange={(e) => setForm({ ...form, branche: e.target.value })}
                          required
                          className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Bitte wählen…</option>
                          {["Elektriker", "Maler", "Sanitär & Heizung", "Dachdecker", "Schreiner", "Fliesenleger", "Garten & Landschaft", "KFZ", "Sonstiges"].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="ort-c">Ort/Stadt *</Label>
                        <Input id="ort-c" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="email-c">E-Mail (optional)</Label>
                        <Input id="email-c" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
                      </div>
                      <Button type="submit" variant="gradient" size="lg" className="w-full">
                        Kostenlose Vorschau anfordern <ArrowRight size={18} />
                      </Button>
                      <div className="space-y-1.5 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock size={12} /> Antwort innerhalb von 2 Stunden — Mo–Fr 9–18 Uhr
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <ShieldCheck size={12} /> Keine Weitergabe Deiner Daten. Kein Spam.
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-narrow px-4 max-w-3xl">
          <AnimatedSection>
            <h2 className="text-center mb-12 text-balance">Das fragen Handwerker am häufigsten</h2>
          </AnimatedSection>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all">
                <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding bg-card">
        <div className="container-narrow px-4 text-center">
          <AnimatedSection>
            <h2 className="mb-6 text-balance">Mehr Aufträge. <span className="gradient-text">Weniger Leerläufe.</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Kostenlose Design-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="gradient" size="lg" onClick={scrollToForm} className="animate-cta-pulse">
                Kostenlose Vorschau anfordern <ArrowRight size={18} />
              </Button>
              <Button variant="outline-primary" size="lg" asChild>
                <a href="tel:+4961313076498"><Phone size={18} /> 06131 30 764 98</a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default HandwerkerClassic;