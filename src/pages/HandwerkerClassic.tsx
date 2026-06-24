import { Link } from "react-router-dom";
import { Phone, Check, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import HandwerkerLeadForm from "@/components/trade/HandwerkerLeadForm";
import PainPointCard from "@/components/trade/PainPointCard";
import FeatureCard from "@/components/trade/FeatureCard";
import TestimonialCard from "@/components/trade/TestimonialCard";
import PricingTeaserCard from "@/components/trade/PricingTeaserCard";

const scrollToForm = () => {
  document.getElementById("vorschau-formular")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const painPoints = [
  { icon: "🔍", title: "Auf Google unsichtbar", description: "Wenn jemand 'Elektriker Mainz' sucht erscheinst Du auf Seite 3. Dein Konkurrent auf Seite 1 bekommt den Auftrag." },
  { icon: "💻", title: "Kein Auftrag über die Website", description: "Du hast eine Website aber sie bringt keine Anfragen. Sie sieht zwar aus — aber sie verkauft nicht." },
  { icon: "⏰", title: "Keine Zeit für so einen Kram", description: "Du bist auf der Baustelle nicht am PC. Wer soll sich um die Website kümmern? Das übernehmen wir komplett." },
  { icon: "📅", title: "Veraltete oder keine Website", description: "Kunden googeln Dich — und finden entweder nichts oder eine Seite aus 2015. Erster Eindruck verloren." },
];

const steps = [
  { emoji: "📋", title: "Kurz erzählen (5 Minuten)", text: "Du füllst ein kurzes Formular aus oder rufst uns an. Kein langes Meeting, keine Vorbereitung nötig." },
  { emoji: "🎨", title: "Wir bauen Deine Vorschau (48 Stunden)", text: "Du bekommst eine echte Design-Vorschau Deiner Website — individuell für Deinen Betrieb. Kostenlos." },
  { emoji: "🚀", title: "Gefällt sie Dir — geht sie live", text: "Gefällt sie nicht — zahlst Du nichts. Gefällt sie Dir → wir schalten sie live." },
];

const features = [
  { emoji: "🔍", title: "Google findet Dich", description: "Optimiert für '[Beruf] [Stadt]' Suchen — damit Du erscheinst, nicht Dein Konkurrent." },
  { emoji: "📱", title: "Perfekt auf jedem Handy", description: "80% Deiner Kunden suchen auf dem Handy. Deine Seite funktioniert auf jedem Gerät." },
  { emoji: "📩", title: "Anfragen rund um die Uhr", description: "Kontaktformular, WhatsApp-Button, Click-to-Call — Kunden erreichen Dich jederzeit." },
  { emoji: "⚡", title: "In 7–14 Tagen online", description: "Während Du auf der Baustelle bist bauen wir Deine Website." },
  { emoji: "🔧", title: "Wir kümmern uns um alles", description: "Hosting, Domain, SSL, Updates — alles inklusive, nichts zu tun für Dich." },
  { emoji: "💶", title: "Steuerlich absetzbar", description: "Als Gewerbetreibender kannst Du die Website komplett von der Steuer absetzen." },
];

const trades = [
  { icon: "⚡", label: "Elektriker", to: "/elektriker" },
  { icon: "🎨", label: "Maler", to: "/maler" },
  { icon: "🔧", label: "Sanitär & Heizung", to: "/sanitaer" },
  { icon: "🏠", label: "Dachdecker", to: "/dachdecker" },
  { icon: "🪵", label: "Schreiner", to: "/handwerker" },
  { icon: "🧱", label: "Fliesenleger", to: "/handwerker" },
  { icon: "🌿", label: "Garten & Landschaft", to: "/handwerker" },
  { icon: "🚗", label: "KFZ-Betrieb", to: "/handwerker" },
  { icon: "❄️", label: "Kältetechnik", to: "/handwerker" },
  { icon: "➕", label: "Weitere Betriebe", to: "/handwerker/kontakt" },
];

const testimonials = [
  { stars: 5, badge: "4X MEHR ANFRAGEN", badgeColor: "#10B981", quote: "Vorher hatte ich kaum Anfragen über die Website. Seit dem Relaunch melde ich mich bei Kunden — nicht umgekehrt.", name: "Michael S.", business: "Elektrobetrieb, Mainz" },
  { stars: 5, badge: "IN 10 TAGEN LIVE", badgeColor: "#3B82F6", quote: "Die haben alles übernommen. Ich musste nur kurz Infos geben — eine Woche später war meine neue Seite online.", name: "Klaus B.", business: "Malerbetrieb, Wiesbaden" },
  { stars: 5, badge: "TOP 3 BEI GOOGLE", badgeColor: "#5B5FEF", quote: "Endlich findet man mich bei Google. Letzte Woche 3 neue Aufträge über die Website — das gab es vorher nie.", name: "Andrea T.", business: "Sanitärbetrieb, Frankfurt" },
];

const pricing = [
  { name: "Einzelkämpfer", price: "59 €/Monat", description: "Schnell professionell online", features: ["1-Seite Website", "Mobil-optimiert", "Online in 7 Tagen"], highlighted: false, ctaLink: "/handwerker/preise" },
  { name: "Wachstums-Betrieb", price: "99 €/Monat", description: "Für Betriebe die wachsen wollen", features: ["Bis zu 5 Seiten", "Google-Optimierung", "Google Maps Einrichtung"], highlighted: true, ctaLink: "/handwerker/preise" },
  { name: "Marktführer", price: "159 €/Monat", description: "Für Betriebe die dominieren wollen", features: ["Bis zu 10 Seiten", "SEO + Seitenstruktur", "Individuelle Umsetzung"], highlighted: false, ctaLink: "/handwerker/preise" },
];

const faqs = [
  { q: "Lohnt sich eine Website für meinen Betrieb wirklich?", a: "Ja — wenn sie richtig gemacht ist. Eine Website die auf Google gefunden wird und Vertrauen aufbaut bringt täglich neue Anfragen. Ohne Website verlierst Du jeden Tag Kunden an Konkurrenten die online sind." },
  { q: "Ich habe keine Zeit mich darum zu kümmern", a: "Das musst Du nicht. Du gibst uns kurz Deine Infos — wir übernehmen alles. Texte, Design, Technik, Hosting. Du machst Dein Handwerk, wir machen Deine Website." },
  { q: "Was passiert wenn mir die Vorschau nicht gefällt?", a: "Dann zahlst Du nichts. Die Vorschau ist komplett kostenlos und unverbindlich. Wir zeigen Dir was möglich ist — Du entscheidest danach frei." },
  { q: "Wie lange dauert es bis meine Website live ist?", a: "Die Vorschau bekommst Du in 48 Stunden. Nach Deiner Freigabe ist die Website in der Regel in 7–14 Tagen live." },
  { q: "Muss ich mich um Technik, Hosting oder Updates kümmern?", a: "Nein. Hosting, Domain, SSL-Zertifikat und monatliche Updates sind inklusive. Du musst Dich um nichts kümmern." },
  { q: "Bekomme ich wirklich mehr Aufträge?", a: "Wir können keine Garantie auf eine bestimmte Anzahl versprechen — aber alle unsere Kunden berichten von mehr Anfragen. Eine professionelle Google-optimierte Website arbeitet 24/7 für Dich." },
];

const Section = ({ bg, children, id }: { bg: "dark" | "light" | "white"; children: React.ReactNode; id?: string }) => {
  const style = bg === "dark" ? { background: "var(--dark-bg)" } : bg === "light" ? { background: "var(--light-bg)" } : { background: "#fff" };
  return <section id={id} className="py-20 md:py-24" style={style}>{children}</section>;
};

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container-narrow px-4 max-w-6xl mx-auto">{children}</div>
);

const HandwerkerHub = () => (
  <main id="main-content" className="pt-[110px]">
    {/* HERO */}
    <Section bg="dark">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full text-white mb-6" style={{ background: "var(--amber)" }}>
            Für Elektriker · Maler · Sanitär · Dachdecker & mehr
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Dein Betrieb. Gefunden auf Google.<br />
            <span style={{ color: "var(--brand-purple)" }}>Mehr Aufträge. Weniger Leerläufe.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: "var(--text-muted)" }}>
            Wir bauen Dir eine Website die echte Anfragen bringt — nicht nur gut aussieht. Speziell für Handwerksbetriebe im DACH-Raum.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white mb-8">
            {["Kostenlose Vorschau in 48 h", "Kein Technik-Stress", "Fertig während Du arbeitest"].map((b) => (
              <span key={b} className="flex items-center gap-2"><Check size={16} style={{ color: "var(--success)" }} aria-hidden={true} focusable={false} /> {b}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToForm} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
              Kostenlose Vorschau anfordern →
            </button>
            <a href="tel:+4961313076498" className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              <Phone size={16} aria-hidden={true} focusable={false} /> 06131 30 764 98
            </a>
          </div>
          <p className="mt-6 text-sm" style={{ color: "var(--text-muted)" }}>⭐⭐⭐⭐⭐ +150 Betriebe aus der Region vertrauen uns</p>
        </div>
      </Container>
    </Section>

    {/* PAIN POINTS */}
    <Section bg="dark">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Kommt Dir das bekannt vor?</h2>
          <p style={{ color: "var(--text-muted)" }}>Das sagen uns Handwerker bevor wir ihre Website gebaut haben.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {painPoints.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl p-6 flex flex-col gap-3 transition duration-300 hover:-translate-y-0.5"
              style={{ background: "#FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
            >
              <div className="text-3xl">{p.icon}</div>
              <h3 className="text-base font-semibold" style={{ color: "#0A0A1F" }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(10,10,31,0.65)" }}>{p.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>

    {/* HOW IT WORKS */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--brand-purple)" }}>So einfach geht's</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">Deine neue Website — ohne Stress, ohne Technik</h2>
          <p className="text-muted-foreground">Du machst Dein Handwerk. Wir machen Deine Website. Punkt.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-white p-7 shadow-card flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--brand-purple)" }}>{i + 1}</span>
                <span className="text-2xl">{s.emoji}</span>
              </div>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button onClick={scrollToForm} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
            Jetzt Vorschau anfordern →
          </button>
        </div>
      </Container>
    </Section>

    {/* FEATURES */}
    <Section bg="white">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12 max-w-3xl mx-auto">
          Eine Website die für Dich arbeitet — auch wenn Du schläfst
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </Container>
    </Section>

    {/* TRADE SELECTOR */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--brand-purple)" }}>Deine Branche</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Wir kennen Dein Handwerk</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          {trades.map((t) => (
            <Link key={t.label} to={t.to} className="group rounded-2xl bg-white p-5 flex flex-col items-center gap-2 shadow-card border border-border hover:bg-[var(--brand-purple)] hover:text-white hover:border-transparent transition-all">
              <span className="text-3xl">{t.icon}</span>
              <span className="text-sm font-semibold text-center">{t.label}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Deine Branche nicht dabei? Kein Problem — wir haben schon über 20 verschiedene Gewerke umgesetzt.
        </p>
      </Container>
    </Section>

    {/* TESTIMONIALS */}
    <Section bg="dark">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Was Handwerker über uns sagen</h2>
          <p style={{ color: "var(--text-muted)" }}>Echte Betriebe. Echte Ergebnisse.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </Container>
    </Section>

    {/* PRICING TEASER */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-12">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--brand-purple)" }}>Transparent & fair</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">Was kostet Deine neue Website?</h2>
          <p className="text-muted-foreground">Keine versteckten Kosten. Für Gewerbetreibende voll steuerlich absetzbar. ✅</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {pricing.map((p) => <PricingTeaserCard key={p.name} {...p} />)}
        </div>
        <div className="text-center">
          <Link to="/handwerker/kontakt" className="text-sm font-semibold hover:underline" style={{ color: "var(--brand-purple)" }}>
            Nicht sicher welches Paket passt? → Kostenlos beraten lassen
          </Link>
          <p className="text-xs text-muted-foreground mt-3">
            Alle Preise zzgl. 19% MwSt. · Mindestlaufzeit 12 Monate · danach monatlich kündbar
          </p>
        </div>
      </Container>
    </Section>

    {/* LEAD FORM */}
    <Section bg="dark" id="vorschau-formular">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="text-white">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white mb-5" style={{ background: "var(--amber)" }}>
              Kostenlos & unverbindlich
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Deine kostenlose Website-Vorschau in 48 Stunden
            </h2>
            <ul className="space-y-3 mb-8">
              {["Individuell für Deinen Betrieb", "Ich melde mich innerhalb von 2 Stunden", "Kein Risiko — Du entscheidest danach frei", "Kostenlos — auch wenn Du nicht kaufst"].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm">
                  <Check size={18} style={{ color: "var(--success)" }} className="mt-0.5 shrink-0" aria-hidden={true} focusable={false} /> {t}
                </li>
              ))}
            </ul>
            <a href="tel:+4961313076498" className="inline-flex items-center gap-3 text-2xl font-bold text-white hover:underline">
              <Phone size={24} aria-hidden={true} focusable={false} /> 06131 30 764 98
            </a>
            <p className="text-sm mt-1 mb-6" style={{ color: "var(--text-muted)" }}>Mo–Fr 9–18 Uhr</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>⭐⭐⭐⭐⭐ +150 Betriebe aus der Region vertrauen uns</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Vorschau jetzt anfordern</h3>
            <HandwerkerLeadForm />
          </div>
        </div>
      </Container>
    </Section>

    {/* FAQ */}
    <Section bg="light">
      <Container>
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Das fragen Handwerker am häufigsten</h2>
          <p className="text-muted-foreground">Keine Fachbegriffe. Keine Ausreden. Nur ehrliche Antworten.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-border bg-white px-6">
                <AccordionTrigger className="text-left font-semibold text-base py-5 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>

    {/* FINAL CTA */}
    <Section bg="dark">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Mehr Aufträge. Weniger Leerläufe.</h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Kostenlose Design-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung. Gefällt sie Dir nicht — Du zahlst nichts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button onClick={scrollToForm} className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "var(--brand-purple)" }}>
              Kostenlose Vorschau anfordern →
            </button>
            <a href="tel:+4961313076498" className="rounded-xl px-7 py-3.5 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              <Phone size={16} aria-hidden={true} focusable={false} /> 06131 30 764 98
            </a>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>⭐⭐⭐⭐⭐ +150 Betriebe aus der Region vertrauen uns</p>
        </div>
      </Container>
    </Section>
  </main>
);

export default HandwerkerHub;
