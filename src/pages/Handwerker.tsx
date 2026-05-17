import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedSection from "@/components/AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Phone,
  Check,
  AlertCircle,
  Search,
  Smartphone,
  MessageSquare,
  Zap,
  Wrench,
  Euro,
  Clipboard,
  Palette,
  Rocket,
  Star,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const painPoints = [
  {
    title: "Auf Google unsichtbar",
    text: "Wenn jemand „Elektriker Mainz“ sucht — erscheinst Du auf Seite 3. Dein Konkurrent auf Seite 1 bekommt den Auftrag.",
  },
  {
    title: "Kein Auftrag über die Website",
    text: "Du hast eine Website, aber sie bringt keine Anfragen. Sie sieht zwar aus — aber sie verkauft nicht.",
  },
  {
    title: "Keine Zeit für so einen Kram",
    text: "Du bist auf der Baustelle, nicht am PC. Wer soll sich um die Website kümmern? Das übernehmen wir komplett.",
  },
  {
    title: "Veraltete oder keine Website",
    text: "Kunden googeln Dich — und finden entweder nichts oder eine Seite aus 2015. Erster Eindruck verloren.",
  },
];

const steps = [
  {
    icon: Clipboard,
    title: "Kurz erzählen (5 Minuten)",
    text: "Du füllst ein kurzes Formular aus oder rufst uns an. Kein langes Meeting, keine Vorbereitung nötig.",
  },
  {
    icon: Palette,
    title: "Wir bauen Deine Vorschau (48 Stunden)",
    text: "Du bekommst eine echte Design-Vorschau Deiner neuen Website — individuell für Deinen Betrieb. Kostenlos.",
  },
  {
    icon: Rocket,
    title: "Gefällt sie Dir — geht sie live",
    text: "Gefällt Dir die Vorschau nicht — kein Problem, Du zahlst nichts. Gefällt sie Dir → wir schalten sie live.",
  },
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
  {
    name: "Einzelkämpfer",
    price: "59 €",
    sub: "Für Betriebe die schnell online wollen",
    features: ["1-Seite Website", "Mobil-optimiert", "Online in 7 Tagen"],
    highlighted: false,
  },
  {
    name: "Wachstums-Betrieb",
    price: "99 €",
    sub: "Für Betriebe die wachsen wollen",
    features: ["Bis zu 5 Seiten", "Google-Optimierung", "Google Maps Einrichtung"],
    highlighted: true,
  },
  {
    name: "Marktführer",
    price: "159 €",
    sub: "Für Betriebe die dominieren wollen",
    features: ["Bis zu 10 Seiten", "SEO + Seitenstruktur", "Individuelle Umsetzung"],
    highlighted: false,
  },
];

const Handwerker = () => {
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
      {/* Top banner */}
      <button
        onClick={scrollToForm}
        className="fixed top-0 left-0 right-0 z-[60] w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-medium hover:opacity-95 transition"
      >
        🔨 Speziell für Handwerksbetriebe — Kostenlose Website-Vorschau in 48 Stunden sichern →
      </button>

      {/* HERO */}
      <section className="relative bg-[hsl(228,24%,7%)] text-white overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="container-narrow px-4 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="inline-block badge-label bg-amber-500/15 text-amber-400 border border-amber-500/20 mb-6">
                FÜR ELEKTRIKER · MALER · SANITÄR · DACHDECKER · HEIZUNG
              </span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
                Dein Betrieb. Gefunden auf Google.{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Mehr Aufträge. Weniger Leerläufe.
                </span>
              </h1>
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                Wir bauen Dir eine Website, die echte Anfragen bringt — nicht nur gut aussieht.
                Speziell für Handwerksbetriebe im DACH-Raum.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 mb-8">
                <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> Kostenlose Vorschau in 48 h</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> Kein Technik-Stress</span>
                <span className="flex items-center gap-2"><Check size={16} className="text-primary" /> Fertig während Du arbeitest</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="gradient" size="lg" onClick={scrollToForm} className="animate-cta-pulse">
                  Kostenlose Vorschau anfordern <ArrowRight size={18} />
                </Button>
                <Button variant="outline" size="lg" asChild className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white">
                  <a href="tel:+4961313076498"><Phone size={16} /> 06131 30 764 98</a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-white/60">
                ⭐⭐⭐⭐⭐ Bereits 12 Handwerksbetriebe aus der Region vertrauen uns
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl rounded-3xl" />
                <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="rounded-xl bg-white text-foreground p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="ml-auto text-[10px] text-muted-foreground">elektro-mueller.de</span>
                    </div>
                    <div className="h-32 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-bold text-lg">
                      Elektro Müller GmbH
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 rounded bg-muted w-3/4" />
                      <div className="h-2 rounded bg-muted w-1/2" />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-8 rounded bg-primary" />
                      <div className="flex-1 h-8 rounded border border-border" />
                    </div>
                  </div>
                  <div className="mt-4 mx-auto w-32 rounded-2xl border-2 border-white/20 bg-white p-2">
                    <div className="rounded-lg bg-gradient-to-br from-primary to-accent h-20 flex items-center justify-center text-white text-[10px] font-bold">
                      📱 Anfrage
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="bg-[hsl(228,24%,7%)] text-white py-20 md:py-28">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <h2 className="text-white mb-4 text-balance">Kommt Dir das bekannt vor?</h2>
              <p className="text-white/60">Das sagen uns Handwerker bevor wir ihre Website gebaut haben.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {painPoints.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.05}>
                <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm h-full">
                  <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center mb-4">
                    <AlertCircle size={20} className="text-red-400" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{p.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <p className="text-center text-white mt-12 text-lg max-w-2xl mx-auto">
              Das muss nicht so sein. In 48 Stunden zeigen wir Dir wie es besser geht — kostenlos.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[hsl(225,40%,98%)] py-20 md:py-28">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-4">SO EINFACH GEHT'S</span>
              <h2 className="mb-4 text-balance">Deine neue Website — ohne Stress, ohne Technik</h2>
              <p className="text-muted-foreground">Du machst Dein Handwerk. Wir machen Deine Website. Punkt.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="relative p-7 rounded-2xl border border-border bg-background h-full">
                  <div className="absolute -top-4 left-7 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent text-white font-heading font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mt-2">
                    <s.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="gradient" size="lg" onClick={scrollToForm}>
              Jetzt Vorschau anfordern <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-4">WAS DU BEKOMMST</span>
              <h2 className="mb-4 text-balance">Eine Website, die für Dich arbeitet — auch wenn Du schläfst</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.06}>
                <div className="p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-card transition-all bg-background h-full">
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
      <section className="bg-[hsl(228,24%,7%)] text-white py-20 md:py-28">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <h2 className="text-white mb-4">Was Handwerker über uns sagen</h2>
              <p className="text-white/60">Echte Betriebe. Echte Ergebnisse.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.08}>
                <div className="p-7 rounded-2xl bg-white text-foreground h-full flex flex-col">
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                  </div>
                  <span className="self-start badge-label bg-primary/10 text-primary mb-4">{t.badge}</span>
                  <p className="text-sm leading-relaxed mb-5 flex-1">„{t.quote}“</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-[hsl(225,40%,98%)] py-20 md:py-28">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-4">TRANSPARENT & FAIR</span>
              <h2 className="mb-4 text-balance">Was kostet Deine neue Website?</h2>
              <p className="text-muted-foreground">
                Keine versteckten Kosten. Keine Überraschungen. Für Gewerbetreibende voll steuerlich absetzbar. ✅
              </p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.06}>
                <div className={`relative p-7 rounded-2xl bg-background h-full flex flex-col ${t.highlighted ? "border-2 border-primary shadow-elevated" : "border border-border"}`}>
                  {t.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-label bg-gradient-to-r from-primary to-accent text-white">
                      BELIEBTESTE WAHL
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-xl mb-1">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t.sub}</p>
                  <div className="mb-5">
                    <span className="font-heading text-4xl font-bold">{t.price}</span>
                    <span className="text-muted-foreground">/Monat</span>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-primary mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={t.highlighted ? "gradient" : "outline-primary"} className="w-full" asChild>
                    <Link to="/preise">Jetzt starten <ArrowRight size={16} /></Link>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <button onClick={scrollToForm} className="text-primary font-semibold hover:underline">
              Nicht sicher welches Paket passt? → Kostenlos beraten lassen
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Alle Preise zzgl. 19 % MwSt. · Mindestlaufzeit 12 Monate · danach monatlich kündbar
            </p>
          </div>
        </div>
      </section>

      {/* TRADES */}
      <section className="bg-background py-20 md:py-28">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-4">DEINE BRANCHE</span>
              <h2 className="mb-4">Wir kennen Dein Handwerk</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {trades.map((t, i) => (
              <AnimatedSection key={t.label} delay={i * 0.03}>
                <button
                  onClick={scrollToForm}
                  className="w-full p-5 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 hover:shadow-card transition-all text-center group"
                >
                  <div className="text-3xl mb-2">{t.icon}</div>
                  <div className="text-sm font-medium group-hover:text-primary transition-colors">{t.label}</div>
                </button>
              </AnimatedSection>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-10 max-w-xl mx-auto">
            Deine Branche nicht dabei? Kein Problem — wir haben schon über 20 verschiedene Gewerke umgesetzt.
          </p>
        </div>
      </section>

      {/* LEAD FORM */}
      <section ref={formRef} id="vorschau" className="bg-[hsl(228,24%,7%)] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="container-narrow px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="inline-block badge-label bg-amber-500/15 text-amber-400 border border-amber-500/20 mb-6">
                KOSTENLOS & UNVERBINDLICH
              </span>
              <h2 className="text-white text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Deine kostenlose Website-Vorschau in 48 Stunden
              </h2>
              <ul className="space-y-3 mb-8">
                {[
                  "Individuelle Vorschau für Deinen Betrieb",
                  "Ich melde mich innerhalb von 2 Stunden",
                  "Kein Risiko — Du entscheidest danach frei",
                  "Kostenlos — auch wenn Du nicht kaufst",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-white/90">
                    <Check size={18} className="text-primary mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
              <a href="tel:+4961313076498" className="inline-flex items-center gap-3 text-2xl font-heading font-bold hover:text-primary transition mb-2">
                <Phone size={22} className="text-primary" /> 06131 30 764 98
              </a>
              <p className="text-sm text-white/60 mb-6">Mo–Fr 9–18 Uhr</p>
              <p className="text-sm text-white/70">⭐⭐⭐⭐⭐ 12 Handwerksbetriebe vertrauen uns bereits</p>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="bg-white text-foreground rounded-3xl p-8 shadow-2xl">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
                      <Check size={32} className="text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-3">Super!</h3>
                    <p className="text-muted-foreground">
                      ✅ Ich melde mich innerhalb von 2 Stunden bei Dir. Schau auch kurz auf Dein Handy!
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-heading font-bold text-2xl mb-6">Vorschau jetzt anfordern</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="vorname">Vorname *</Label>
                        <Input id="vorname" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="telefon">Telefonnummer *</Label>
                        <Input id="telefon" type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="branche">Deine Branche *</Label>
                        <select
                          id="branche"
                          value={form.branche}
                          onChange={(e) => setForm({ ...form, branche: e.target.value })}
                          required
                          className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Bitte wählen…</option>
                          {["Elektriker", "Maler", "Sanitär & Heizung", "Dachdecker", "Schreiner", "Fliesenleger", "Garten & Landschaft", "KFZ", "Sonstiges"].map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="ort">Ort/Stadt *</Label>
                        <Input id="ort" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} required className="mt-1.5" />
                      </div>
                      <div>
                        <Label htmlFor="email">E-Mail (optional)</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
                      </div>
                      <Button type="submit" variant="gradient" size="lg" className="w-full">
                        Kostenlose Vorschau anfordern <ArrowRight size={18} />
                      </Button>
                      <div className="space-y-1.5 pt-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock size={12} /> Ich melde mich innerhalb von 2 Stunden — Mo–Fr 9–18 Uhr
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <ShieldCheck size={12} /> Keine Weitergabe Deiner Daten. Kein Spam. Versprochen.
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
      <section className="bg-background py-20 md:py-28">
        <div className="container-narrow px-4 max-w-3xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="mb-4">Das fragen Handwerker am häufigsten</h2>
              <p className="text-muted-foreground">Keine Fachbegriffe. Keine Ausreden. Nur ehrliche Antworten.</p>
            </div>
          </AnimatedSection>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/20 data-[state=open]:shadow-card transition-all"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-base hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[hsl(228,24%,7%)] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />
        <div className="container-narrow px-4 text-center relative">
          <AnimatedSection>
            <h2 className="text-white text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
              Mehr Aufträge.<br />Weniger Leerläufe.
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Kostenlose Design-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.
              Gefällt sie Dir nicht — Du zahlst nichts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={scrollToForm} className="bg-white text-primary hover:bg-white/90">
                Kostenlose Vorschau anfordern <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" asChild className="border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white">
                <a href="tel:+4961313076498"><Phone size={16} /> 06131 30 764 98</a>
              </Button>
            </div>
            <p className="mt-8 text-sm text-white/60">
              ⭐⭐⭐⭐⭐ Bereits 12 Handwerksbetriebe aus der Region vertrauen uns
            </p>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Handwerker;
