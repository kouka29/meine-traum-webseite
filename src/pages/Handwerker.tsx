import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AnimatedSection from "@/components/AnimatedSection";
import EmojiIcon from "@/lib/emojiToIcon";
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
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { submitLead } from "@/lib/submitLead";

const painPoints = [
  { title: "Auf Google unsichtbar", text: "Wenn jemand „Elektriker Mainz“ sucht — erscheinst Du auf Seite 3. Dein Konkurrent auf Seite 1 bekommt den Auftrag." },
  { title: "Kein Auftrag über die Website", text: "Du hast eine Website, aber sie bringt keine Anfragen. Du sieht zwar aus — aber sie verkauft nicht." },
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

const Handwerker = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ vorname: "", telefon: "", branche: "", ort: "", email: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vorname || !form.telefon || !form.branche || !form.ort) {
      toast({ title: "Bitte alle Pflichtfelder ausfüllen", variant: "destructive" });
      return;
    }
    setLoading(true);
    const ok = await submitLead({
      name: form.vorname,
      phone: form.telefon,
      email: form.email,
      branche: form.branche,
      ort: form.ort,
      company: form.company,
      source_cta: "hero_vorschau",
    });
    setLoading(false);
    if (ok) setSubmitted(true);
    else toast({ title: "Bitte ruf kurz an: 06131 3076498", variant: "destructive" });
  };

  return (
    <main id="main-content" className="pt-20 overflow-x-hidden">
      {/* Top banner */}
      <button
        onClick={scrollToForm}
        className="fixed top-0 left-0 right-0 z-[60] w-full bg-gradient-to-r from-primary via-[hsl(265,60%,55%)] to-accent text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-medium hover:brightness-110 transition tracking-wide"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles size={14} className="opacity-80" aria-hidden={true} focusable={false} />
          Speziell für Handwerksbetriebe — Kostenlose Website-Vorschau in 48 Stunden sichern
          <ArrowRight size={14} aria-hidden={true} focusable={false} />
        </span>
      </button>

      {/* ============ HERO ============ */}
      <section className="relative bg-[hsl(228,28%,5%)] text-white overflow-hidden mt-8">
        {/* Aurora mesh */}
        <div
          className="absolute -top-40 -right-40 w-[820px] h-[820px] rounded-full opacity-60 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, hsl(250 56% 55% / 0.55), transparent 60%)",
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />
        <div
          className="absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full opacity-50 pointer-events-none"
          style={{ background: "radial-gradient(circle at center, hsl(215 100% 50% / 0.4), transparent 60%)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(228 28% 5% / 0), hsl(228 28% 5%) 100%)" }}
        />

        <div className="container-narrow px-4 py-24 md:py-32 lg:py-40 relative">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-16 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-[0.18em] text-amber-300 uppercase">
                  Für Elektriker · Maler · Sanitär · Dachdecker · Heizung
                </span>
              </div>

              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] mb-8 tracking-tight text-balance">
                Dein Betrieb.<br />
                Gefunden auf Google.{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-br from-white via-[hsl(250,80%,85%)] to-[hsl(215,100%,75%)] bg-clip-text text-transparent">
                    Mehr Aufträge.
                  </span>
                </span>{" "}
                <span className="bg-gradient-to-br from-[hsl(250,90%,70%)] to-[hsl(215,100%,65%)] bg-clip-text text-transparent">
                  Weniger Leerläufe.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/65 mb-10 leading-relaxed max-w-xl">
                Wir bauen Dir eine Website, die echte Anfragen bringt — nicht nur gut aussieht.
                Speziell für Handwerksbetriebe im DACH-Raum.
              </p>

              <div className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/80 mb-10">
                {["Kostenlose Vorschau in 48 h", "Kein Technik-Stress", "Fertig während Du arbeitest"].map((b) => (
                  <span key={b} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check size={12} className="text-primary" strokeWidth={3} aria-hidden={true} focusable={false} />
                    </span>
                    {b}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={scrollToForm}
                  className="group bg-white text-[hsl(228,28%,5%)] hover:bg-white hover:scale-[1.02] transition-all shadow-[0_20px_60px_-15px_hsl(250_56%_60%/0.6)] h-14 px-7 text-base font-semibold rounded-full"
                >
                  Kostenlose Vorschau anfordern
                  <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden={true} focusable={false} />
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="bg-white/5 border border-white/15 text-white hover:bg-white/10 h-14 px-7 text-base font-medium rounded-full"
                >
                  <a href="tel:+4961313076498" className="flex items-center gap-2">
                    <Phone size={16} aria-hidden={true} focusable={false} /> 06131 3076498
                  </a>
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["M", "K", "A", "T"].map((l, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full ring-2 ring-[hsl(228,28%,5%)] flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: `linear-gradient(135deg, hsl(${230 + i * 15} 70% 55%), hsl(${260 + i * 10} 65% 60%))` }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-amber-400 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" aria-hidden={true} focusable={false} />)}
                  </div>
                  <p className="text-white/60 text-xs">+150 Betriebe aus der Region vertrauen uns</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Hero device mockup */}
            <AnimatedSection delay={0.15}>
              <div className="relative" style={{ perspective: "1500px" }}>
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-accent/30 to-transparent blur-[100px] rounded-full" />

                {/* Laptop */}
                <div
                  className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-3 shadow-[0_40px_100px_-20px_rgb(0_0_0/0.7)]"
                  style={{ transform: "rotateY(-8deg) rotateX(4deg)" }}
                >
                  <div className="rounded-[20px] bg-white text-foreground overflow-hidden">
                    {/* Browser bar */}
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-b from-[hsl(225,20%,97%)] to-[hsl(225,20%,94%)] border-b border-border/50">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                      <div className="ml-3 flex-1 h-5 rounded-md bg-white border border-border/50 flex items-center justify-center gap-1.5">
                        <ShieldCheck size={9} className="text-green-600" aria-hidden={true} focusable={false} />
                        <span className="text-[9px] text-muted-foreground">elektro-mueller.de</span>
                      </div>
                    </div>
                    {/* Website hero */}
                    <div className="relative h-44 bg-gradient-to-br from-primary via-[hsl(265,60%,55%)] to-accent overflow-hidden">
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <div className="relative p-5 text-white">
                        <div className="text-[10px] font-semibold tracking-wider opacity-80 mb-2">⚡ ELEKTRO MÜLLER GMBH</div>
                        <div className="font-heading text-xl font-bold leading-tight mb-2">Strom. Sicherheit.<br />Service in Mainz.</div>
                        <div className="inline-flex gap-1.5">
                          <div className="px-3 py-1.5 rounded-full bg-white text-primary text-[10px] font-semibold">Termin anfragen</div>
                          <div className="px-3 py-1.5 rounded-full border border-white/40 text-white text-[10px]">06131…</div>
                        </div>
                      </div>
                    </div>
                    {/* Content rows */}
                    <div className="p-4 space-y-2.5">
                      <div className="grid grid-cols-3 gap-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-base">
                            {["🔌", "💡", "⚡"][i]}
                          </div>
                        ))}
                      </div>
                      <div className="h-1.5 rounded bg-muted w-full" />
                      <div className="h-1.5 rounded bg-muted w-4/5" />
                    </div>
                  </div>
                </div>

                {/* Floating phone */}
                <div
                  className="absolute -bottom-10 -right-4 md:-right-10 w-36 md:w-44 rounded-[28px] border border-white/15 bg-[hsl(228,20%,9%)] p-1.5 shadow-[0_30px_80px_-10px_rgb(0_0_0/0.8)]"
                  style={{ transform: "rotateY(12deg) rotateX(-4deg) rotate(6deg)" }}
                >
                  <div className="rounded-[22px] bg-white overflow-hidden">
                    <div className="h-5 bg-[hsl(228,20%,9%)] flex items-center justify-center">
                      <div className="w-12 h-3 rounded-full bg-black" />
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[9px] font-bold">
                        Elektro Müller
                      </div>
                      <div className="rounded-lg border border-border p-2 space-y-1">
                        <div className="text-[8px] font-semibold text-foreground">📞 Anfrage</div>
                        <div className="h-1 rounded bg-muted" />
                        <div className="h-1 rounded bg-muted w-2/3" />
                        <div className="h-4 rounded bg-primary text-white text-[7px] flex items-center justify-center font-semibold">Senden</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating chip */}
                <div className="absolute -top-4 -left-4 md:-left-8 px-4 py-3 rounded-2xl bg-white/95 shadow-2xl border border-white/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-base">📩</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground">Neue Anfrage</p>
                      <p className="text-xs font-bold text-foreground">+3 heute</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Marquee tradesline */}
        <div className="relative border-t border-white/5 py-6 bg-black/20 overflow-hidden">
          <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-white/30 text-sm font-medium tracking-wider">
            {[...trades, ...trades].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <EmojiIcon emoji={t.icon} size={16} className="text-white/60" /> {t.label.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PAIN POINTS ============ */}
      <section className="bg-[hsl(228,28%,5%)] text-white py-28 md:py-36 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(0 70% 50% / 0.15), transparent 60%)" }} />
        <div className="container-narrow px-4 relative">
          <AnimatedSection>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
                Die Realität
              </span>
              <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
                Kommt Dir das bekannt vor?
              </h2>
              <p className="text-white/55 text-lg">Das sagen uns Handwerker bevor wir ihre Website gebaut haben.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {painPoints.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.06}>
                <div
                  className="group relative p-8 rounded-3xl h-full transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "#FFFFFF", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500/15 to-orange-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                    <AlertCircle size={20} className="text-red-500" aria-hidden={true} focusable={false} />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3 tracking-tight" style={{ color: "#0A0A1F" }}>{p.title}</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(10,10,31,0.65)" }}>{p.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="text-center mt-16">
              <p className="text-white text-xl md:text-2xl font-heading font-medium max-w-2xl mx-auto tracking-tight">
                Das muss nicht so sein. In 48 Stunden zeigen wir Dir wie es besser geht — <span className="bg-gradient-to-r from-[hsl(250,80%,75%)] to-[hsl(215,100%,70%)] bg-clip-text text-transparent font-semibold">kostenlos</span>.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-gradient-to-b from-[hsl(225,40%,98%)] to-background py-28 md:py-36 relative">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-4">
                So einfach geht's
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
                Deine neue Website — ohne Stress, ohne Technik
              </h2>
              <p className="text-muted-foreground text-lg">Du machst Dein Handwerk. Wir machen Deine Website. Punkt.</p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {steps.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="relative p-8 rounded-3xl bg-background border border-border/60 h-full hover:shadow-elevated hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_10px_30px_-10px_hsl(250_56%_48%/0.6)]">
                      <s.icon size={24} className="text-white" />
                    </div>
                    <span className="font-heading text-6xl font-bold bg-gradient-to-br from-primary/20 to-accent/10 bg-clip-text text-transparent leading-none">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-3 tracking-tight">{s.title}</h3>
                  <p className="text-[15px] text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="group bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 h-14 px-8 text-base font-semibold rounded-full shadow-[0_20px_50px_-15px_hsl(250_56%_48%/0.6)]"
            >
              Jetzt Vorschau anfordern
              <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden={true} focusable={false} />
            </Button>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="bg-background py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{ background: "var(--gradient-glow)" }} />
        <div className="container-narrow px-4 relative">
          <AnimatedSection>
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-4">
                Was Du bekommst
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
                Eine Website, die für Dich arbeitet — auch wenn Du schläfst
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.05}>
                <div className="group relative p-8 rounded-3xl border border-border/60 bg-card/40 h-full transition-all hover:border-primary/30 hover:shadow-elevated hover:-translate-y-1 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/10 flex items-center justify-center mb-5">
                    <f.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="relative font-heading font-semibold text-lg mb-2.5 tracking-tight">{f.title}</h3>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">{f.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-[hsl(228,28%,5%)] text-white py-28 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(250 56% 55% / 0.3), transparent 60%)" }} />
        <div className="container-narrow px-4 relative">
          <AnimatedSection>
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase mb-4">
                Stimmen vom Bau
              </span>
              <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-5">
                Was Handwerker über uns sagen
              </h2>
              <p className="text-white/55 text-lg">Echte Betriebe. Echte Ergebnisse.</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.08}>
                <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-white/90 text-foreground h-full flex flex-col shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)] hover:-translate-y-2 transition-transform duration-500">
                  <div className="absolute top-6 right-6 font-heading text-6xl text-primary/15 leading-none">"</div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" aria-hidden={true} focusable={false} />)}
                  </div>
                  <span className="self-start text-[10px] font-bold tracking-[0.15em] bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-5">
                    {t.badge}
                  </span>
                  <p className="text-[15px] leading-relaxed mb-6 flex-1 text-foreground/80">„{t.quote}“</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-bold ring-2 ring-white shadow-md">
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

      {/* ============ PRICING ============ */}
      <section className="bg-gradient-to-b from-background to-[hsl(225,40%,98%)] py-28 md:py-36 relative">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-20 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-4">
                Transparent & Fair
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
                Was kostet Deine neue Website?
              </h2>
              <p className="text-muted-foreground text-lg">
                Keine versteckten Kosten. Keine Überraschungen. Für Gewerbetreibende voll steuerlich absetzbar.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {pricingTiers.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.08}>
                <div
                  className={`relative p-8 rounded-3xl h-full flex flex-col transition-all duration-300 ${
                    t.highlighted
                      ? "bg-gradient-to-br from-[hsl(228,28%,5%)] to-[hsl(250,40%,12%)] text-white border border-primary/40 shadow-[0_40px_80px_-20px_hsl(250_56%_48%/0.5)] md:-translate-y-4"
                      : "bg-background border border-border/60 hover:shadow-elevated hover:-translate-y-1"
                  }`}
                >
                  {t.highlighted && (
                    <>
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em] rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg">
                        BELIEBTESTE WAHL
                      </span>
                    </>
                  )}
                  <div className="relative">
                    <h3 className="font-heading font-bold text-2xl mb-1.5 tracking-tight">{t.name}</h3>
                    <p className={`text-sm mb-6 ${t.highlighted ? "text-white/60" : "text-muted-foreground"}`}>{t.sub}</p>
                    <div className="mb-7 flex items-baseline gap-1">
                      <span className="font-heading text-5xl font-bold tracking-tight">{t.price}</span>
                      <span className={t.highlighted ? "text-white/50" : "text-muted-foreground"}>/Monat</span>
                    </div>
                    <ul className="space-y-3.5 mb-8 flex-1">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-[15px]">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${t.highlighted ? "bg-primary/30" : "bg-primary/15"}`}>
                            <Check size={12} className={t.highlighted ? "text-white" : "text-primary"} strokeWidth={3} aria-hidden={true} focusable={false} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full h-12 rounded-full font-semibold ${
                        t.highlighted
                          ? "bg-white text-[hsl(228,28%,5%)] hover:bg-white/90"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      }`}
                    >
                      <Link to="/preise">Jetzt starten <ArrowRight size={16} aria-hidden={true} focusable={false} /></Link>
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <button onClick={scrollToForm} className="text-primary font-semibold hover:underline underline-offset-4">
              Nicht sicher welches Paket passt? → Kostenlos beraten lassen
            </button>
            <p className="text-xs text-muted-foreground mt-4">
              Alle Preise zzgl. 19 % MwSt. · Mindestlaufzeit 12 Monate · danach monatlich kündbar
            </p>
          </div>
        </div>
      </section>

      {/* ============ TRADES ============ */}
      <section className="bg-background py-28 md:py-36 relative overflow-hidden">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-4">
                Deine Branche
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                Wir kennen Dein Handwerk
              </h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {trades.map((t, i) => (
              <AnimatedSection key={t.label} delay={i * 0.03}>
                <button
                  onClick={scrollToForm}
                  className="group relative w-full p-6 rounded-2xl border border-border/60 bg-card/40 hover:border-primary hover:bg-gradient-to-br hover:from-primary/10 hover:to-accent/5 hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center overflow-hidden"
                >
                  <div className="mb-2.5 flex justify-center group-hover:scale-110 transition-transform duration-300"><EmojiIcon emoji={t.icon} size={20} /></div>
                  <div className="text-sm font-semibold group-hover:text-primary transition-colors">{t.label}</div>
                </button>
              </AnimatedSection>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-12 max-w-xl mx-auto">
            Deine Branche nicht dabei? Kein Problem — wir haben schon über 20 verschiedene Gewerke umgesetzt.
          </p>
        </div>
      </section>

      {/* ============ LEAD FORM ============ */}
      <section ref={formRef} id="vorschau" className="bg-[hsl(228,28%,5%)] text-white py-28 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-50 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(250 56% 55% / 0.35), transparent 60%)" }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(215 100% 50% / 0.25), transparent 60%)" }} />
        <div className="container-narrow px-4 relative">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-12 lg:gap-16 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 mb-7">
                <Sparkles size={12} className="text-amber-300" aria-hidden={true} focusable={false} />
                <span className="text-[11px] font-semibold tracking-[0.18em] text-amber-300 uppercase">
                  Kostenlos & unverbindlich
                </span>
              </div>

              <h2 className="text-white text-5xl md:text-6xl font-bold mb-8 leading-[1.05] tracking-tight">
                Deine kostenlose<br />
                <span className="bg-gradient-to-br from-[hsl(250,90%,75%)] to-[hsl(215,100%,70%)] bg-clip-text text-transparent">
                  Website-Vorschau
                </span><br />
                in 48 Stunden
              </h2>

              <ul className="space-y-3.5 mb-10">
                {[
                  "Individuelle Vorschau für Deinen Betrieb",
                  "Ich melde mich innerhalb von 2 Stunden",
                  "Kein Risiko — Du entscheidest danach frei",
                  "Kostenlos — auch wenn Du nicht kaufst",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3 text-white/90 text-[15px]">
                    <span className="w-6 h-6 rounded-full bg-primary/25 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={13} className="text-primary" strokeWidth={3} aria-hidden={true} focusable={false} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.04] inline-block">
                <a href="tel:+4961313076498" className="flex items-center gap-3 text-2xl md:text-3xl font-heading font-bold hover:text-primary transition tracking-tight">
                  <span className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Phone size={20} className="text-primary" aria-hidden={true} focusable={false} />
                  </span>
                  06131 3076498
                </a>
                <p className="text-sm text-white/55 mt-2 ml-14">Mo–Fr 9–18 Uhr</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="relative">
                <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-primary/60 via-accent/40 to-transparent blur-sm" />
                <div className="relative bg-white text-foreground rounded-[28px] p-8 md:p-10 shadow-[0_40px_100px_-20px_rgb(0_0_0/0.6)]">
                  {submitted ? (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6 shadow-lg">
                        <Check size={36} className="text-white" strokeWidth={3} aria-hidden={true} focusable={false} />
                      </div>
                      <h3 className="font-heading font-bold text-3xl mb-4 tracking-tight">Super!</h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Ich melde mich innerhalb von 2 Stunden bei Dir. Schau auch kurz auf Dein Handy!
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-heading font-bold text-2xl mb-1 tracking-tight">Vorschau jetzt anfordern</h3>
                      <p className="text-sm text-muted-foreground mb-7">Dauert keine 60 Sekunden.</p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="vorname" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vorname *</Label>
                          <Input id="vorname" value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} required className="mt-2 h-12 rounded-xl border-border/60 focus-visible:border-primary" />
                        </div>
                        <div>
                          <Label htmlFor="telefon" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefonnummer *</Label>
                          <Input id="telefon" type="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} required className="mt-2 h-12 rounded-xl border-border/60 focus-visible:border-primary" />
                        </div>
                        <div>
                          <Label htmlFor="branche" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deine Branche *</Label>
                          <select
                            id="branche"
                            value={form.branche}
                            onChange={(e) => setForm({ ...form, branche: e.target.value })}
                            required
                            className="mt-2 flex h-12 w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary"
                          >
                            <option value="">Bitte wählen…</option>
                            {["Elektriker", "Maler", "Sanitär & Heizung", "Dachdecker", "Schreiner", "Fliesenleger", "Garten & Landschaft", "KFZ", "Sonstiges"].map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="ort" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ort/Stadt *</Label>
                          <Input id="ort" value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} required className="mt-2 h-12 rounded-xl border-border/60 focus-visible:border-primary" />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-Mail (optional)</Label>
                          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 h-12 rounded-xl border-border/60 focus-visible:border-primary" />
                        </div>
                        {/* Honeypot */}
                        <input
                          type="text"
                          name="company"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                        />
                        <Button type="submit" size="lg" disabled={loading} className="w-full h-14 rounded-full bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 font-semibold text-base shadow-[0_15px_40px_-10px_hsl(250_56%_48%/0.5)] group disabled:opacity-60">
                          {loading ? "Wird gesendet…" : "Kostenlose Vorschau anfordern"}
                          <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden={true} focusable={false} />
                        </Button>
                        <div className="space-y-2 pt-3 border-t border-border/60">
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock size={12} aria-hidden={true} focusable={false} /> Ich melde mich innerhalb von 2 Stunden — Mo–Fr 9–18 Uhr
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <ShieldCheck size={12} aria-hidden={true} focusable={false} /> Keine Weitergabe Deiner Daten. Kein Spam. Versprochen.
                          </p>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-background py-28 md:py-36">
        <div className="container-narrow px-4 max-w-3xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-primary uppercase mb-4">
                FAQ
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                Das fragen Handwerker am häufigsten
              </h2>
              <p className="text-muted-foreground text-lg">Keine Fachbegriffe. Keine Ausreden. Nur ehrliche Antworten.</p>
            </div>
          </AnimatedSection>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/60 rounded-2xl px-6 bg-card/40 data-[state=open]:border-primary/30 data-[state=open]:shadow-card transition-all"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-base md:text-lg hover:no-underline py-5 tracking-tight">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-[15px]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-[hsl(228,28%,5%)] text-white py-32 md:py-40 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-50"
            style={{ background: "radial-gradient(circle, hsl(250 56% 55% / 0.45), transparent 60%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-50"
            style={{ background: "radial-gradient(circle, hsl(215 100% 50% / 0.35), transparent 60%)" }} />
        </div>
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="container-narrow px-4 text-center relative">
          <AnimatedSection>
            <h2 className="text-white font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1] tracking-tight text-balance">
              Mehr Aufträge.<br />
              <span className="bg-gradient-to-br from-[hsl(250,90%,75%)] via-[hsl(265,85%,75%)] to-[hsl(215,100%,70%)] bg-clip-text text-transparent">
                Weniger Leerläufe.
              </span>
            </h2>
            <p className="text-white/65 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Kostenlose Design-Vorschau in 48 Stunden. Kein Risiko. Keine Verpflichtung.
              Gefällt sie Dir nicht — Du zahlst nichts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="group bg-white text-[hsl(228,28%,5%)] hover:bg-white hover:scale-[1.02] h-14 px-8 text-base font-semibold rounded-full shadow-[0_20px_60px_-15px_hsl(250_56%_60%/0.6)]"
              >
                Kostenlose Vorschau anfordern
                <ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" aria-hidden={true} focusable={false} />
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-white/5 border border-white/15 text-white hover:bg-white/10 h-14 px-8 text-base font-medium rounded-full"
              >
                <a href="tel:+4961313076498" className="flex items-center gap-2">
                  <Phone size={16} aria-hidden={true} focusable={false} /> 06131 3076498
                </a>
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-4 justify-center">
              <div className="flex -space-x-2">
                {["M", "K", "A", "T"].map((l, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full ring-2 ring-[hsl(228,28%,5%)] flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, hsl(${230 + i * 15} 70% 55%), hsl(${260 + i * 10} 65% 60%))` }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div className="text-sm text-left">
                <div className="flex text-amber-400 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" aria-hidden={true} focusable={false} />)}
                </div>
                <p className="text-white/60 text-xs">+150 Betriebe aus der Region vertrauen uns</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Handwerker;
