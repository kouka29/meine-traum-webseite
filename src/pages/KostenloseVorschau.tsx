import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Gift,
  ShieldCheck,
  AlertTriangle,
  CalendarClock,
  Trophy,
  ClipboardList,
  Wand2,
  Sparkles,
  Star,
  Lock,
  MapPin,
  Award,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const trades = [
  "Elektriker",
  "Maler",
  "Sanitär & Heizung",
  "Dachdecker",
  "Schreiner",
  "Garten & Landschaft",
  "KFZ",
  "Sonstiges",
];

const goals = [
  "Mehr Kundenanfragen",
  "Moderner Auftritt",
  "Besser als die Konkurrenz",
  "Lokale Sichtbarkeit bei Google",
];

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Veraltete Webseite",
    text: "Deine Webseite wirkt veraltet – und du verlierst dadurch jeden Monat Aufträge an die Konkurrenz.",
  },
  {
    icon: Clock,
    title: "Keine Zeit dafür",
    text: "Du steckst auf der Baustelle. Für deine Online-Präsenz bleibt am Ende des Tages einfach keine Zeit.",
  },
  {
    icon: Trophy,
    title: "Konkurrenz zieht vorbei",
    text: "Andere Betriebe in deiner Region sind online besser aufgestellt – und kassieren die Anfragen, die dir zustehen.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Formular ausfüllen",
    duration: "2 Minuten",
    text: "Sag mir kurz, was dein Betrieb macht – das war's auch schon.",
  },
  {
    icon: Wand2,
    title: "Ich baue deine Vorschau",
    duration: "48 Stunden",
    text: "Du lehnst dich zurück, ich arbeite. Du bekommst eine maßgeschneiderte Vorschau für deinen Betrieb.",
  },
  {
    icon: Sparkles,
    title: "Du entscheidest",
    duration: "Ohne Druck",
    text: "Gefällt sie dir? Dann reden wir. Wenn nicht, kostet dich das Ganze keinen Cent.",
  },
];

const examples = [
  {
    badge: "Elektriker",
    name: "Elektrotechnik Mustermann",
    desc: "Klare Leistungsübersicht, Notdienst-Hotline und ein Anfrageformular, das wirklich genutzt wird.",
    color: "from-amber-500/20 to-yellow-500/10",
    accent: "bg-amber-500",
  },
  {
    badge: "Malerbetrieb",
    name: "Malerbetrieb Schmidt",
    desc: "Hochwertige Vorher-Nachher-Galerie, Kundenstimmen und ein direkter Weg zur Terminanfrage.",
    color: "from-rose-500/20 to-pink-500/10",
    accent: "bg-rose-500",
  },
  {
    badge: "Sanitär & Heizung",
    name: "Müller SHK GmbH",
    desc: "Online-Terminbuchung, Förderhinweise zu Wärmepumpen und ein vertrauenswürdiges Auftreten.",
    color: "from-sky-500/20 to-blue-500/10",
    accent: "bg-sky-500",
  },
];

const testimonials = [
  {
    name: "Thomas K.",
    trade: "Elektromeister, NRW",
    text: "Ich war skeptisch – kostenlos klingt immer verdächtig. Nach 2 Tagen hatte ich eine Vorschau, die besser war als jedes Angebot vorher. Ehrlich, schnell, ohne Bullshit.",
  },
  {
    name: "Stefan B.",
    trade: "Malermeister, Bayern",
    text: "Endlich jemand, der versteht, dass wir Handwerker keine Zeit für Marketing-Geschwätz haben. 2 Minuten Formular, 48h später lag die Vorschau im Postfach.",
  },
  {
    name: "Markus L.",
    trade: "SHK-Betrieb, Hessen",
    text: "Die Vorschau war so gut, dass ich direkt zugesagt habe. Heute bringt mir die Webseite jede Woche neue Anfragen – und das alles ohne Risiko getestet.",
  },
];

const faqs = [
  {
    q: "Was kostet mich die Vorschau?",
    a: "Gar nichts. Die Vorschau ist zu 100 % kostenlos. Es gibt keine versteckten Kosten, keine Probeabos und keinen Pferdefuß.",
  },
  {
    q: "Bin ich zu irgendwas verpflichtet?",
    a: "Nein. Du bekommst die Vorschau, schaust sie dir in Ruhe an und entscheidest selbst, ob du weitermachen willst. Wenn nicht, ist die Sache für dich erledigt.",
  },
  {
    q: "Wie sieht die Vorschau genau aus?",
    a: "Du bekommst einen echten Entwurf deiner zukünftigen Webseite – keine Powerpoint, kein Mockup-Bildchen, sondern eine klickbare Vorschau, die zeigt, wie dein Betrieb online aussehen könnte.",
  },
  {
    q: "Was passiert nach der Vorschau?",
    a: "Wenn sie dir gefällt, besprechen wir gemeinsam die nächsten Schritte: Inhalte, Bilder, Veröffentlichung. Wenn nicht, hörst du einfach nichts mehr von mir – versprochen.",
  },
  {
    q: "Wie schnell geht das wirklich?",
    a: "48 Stunden ab Eingang deines Formulars. Solltest du an einem Freitag absenden, kann es bis Montag dauern. Aber mehr als 48 Werktagsstunden brauche ich nicht.",
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "100% Risikofrei" },
  { icon: MapPin, label: "Made in Germany" },
  { icon: Award, label: "5+ Jahre im Webdesign" },
];

const KostenloseVorschau = () => {
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState("");
  const [hasWebsite, setHasWebsite] = useState("");
  const [urgency, setUrgency] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const scrollToForm = () => {
    document.getElementById("formular")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const firstName = (fd.get("firstName") as string)?.trim();
    const companyName = (fd.get("companyName") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = ((fd.get("phone") as string) || "").trim();

    if (!firstName || !companyName || !email) {
      toast.error("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    if (!trade) {
      toast.error("Bitte wähle dein Gewerk aus.");
      return;
    }
    if (!hasWebsite) {
      toast.error("Bitte gib an, ob du aktuell eine Webseite hast.");
      return;
    }
    if (!urgency) {
      toast.error("Bitte gib an, wie dringend das Thema ist.");
      return;
    }

    setLoading(true);
    try {
      const leadId = crypto.randomUUID();
      const { error } = await supabase.from("leads").insert({
        id: leadId,
        first_name: firstName,
        company_name: companyName,
        email,
        phone: phone || "—",
        trade,
        has_website: hasWebsite,
        urgency,
        goals: selectedGoals.length > 0 ? selectedGoals : null,
      });
      if (error) throw error;

      supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-notification",
          idempotencyKey: `vorschau-${leadId}`,
          templateData: {
            source: "Kostenlose Webseiten-Vorschau (Handwerker-Kampagne)",
            firstName,
            companyName,
            email,
            phone: phone || "Nicht angegeben",
            trade,
            hasWebsite,
            urgency,
            goals: selectedGoals.join(", ") || "Keine Angabe",
            submittedAt: new Date().toLocaleString("de-DE"),
          },
        },
      });

      toast.success("Anfrage gesendet! Ich melde mich innerhalb von 24 Stunden bei dir.");
      form.reset();
      setTrade("");
      setHasWebsite("");
      setUrgency("");
      setSelectedGoals([]);
    } catch {
      toast.error("Fehler beim Senden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-20">
      {/* HERO */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none" />
        <div className="container-narrow px-4 relative">
          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-5 inline-block">
                Kampagne für Handwerksbetriebe
              </span>
              <h1 className="mb-5 text-balance">
                Dein Handwerksbetrieb. Eine neue Webseite.{" "}
                <span className="gradient-text">Kostenlos in 48h.</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8 text-balance">
                Ich zeige dir, wie dein Betrieb online aussehen könnte – ohne Risiko, ohne Kosten,
                ohne Verpflichtung.
              </p>
              <Button
                variant="gradient"
                size="lg"
                onClick={scrollToForm}
                className="text-base sm:text-lg px-6 sm:px-10 h-auto min-h-14 py-4 w-full sm:w-auto whitespace-normal text-center leading-tight font-bold animate-cta-pulse"
              >
                Jetzt kostenlose Vorschau anfordern <ArrowRight size={18} />
              </Button>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
                {[
                  { icon: Gift, text: "Kostenlos & unverbindlich" },
                  { icon: Clock, text: "Fertig in 48 Stunden" },
                  { icon: ShieldCheck, text: "Kein technisches Wissen nötig" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <b.icon size={16} className="text-primary" />
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="mb-3 text-balance">Erkennst du dich wieder?</h2>
              <p className="text-muted-foreground">
                Wenn dir auch nur einer dieser Punkte bekannt vorkommt, lohnt sich eine kostenlose
                Vorschau – ohne wenn und aber.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {painPoints.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-elevated transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                    <p.icon size={22} className="text-destructive" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="badge-label bg-primary/10 text-primary mb-4 inline-block">
                So funktioniert's
              </span>
              <h2 className="mb-3 text-balance">In 3 Schritten zu deiner Vorschau</h2>
              <p className="text-muted-foreground">
                Schnell, ehrlich, ohne Schnickschnack – und vor allem ohne Risiko für dich.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
            {steps.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.1}>
                <div className="relative bg-card border border-border rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full gradient-bg text-primary-foreground flex items-center justify-center font-bold text-base">
                      {i + 1}
                    </div>
                    <s.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-xs font-semibold text-primary mb-3">{s.duration}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background border border-border items-center justify-center text-primary">
                    <ArrowRight size={16} />
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO EXAMPLES */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="mb-3 text-balance">So könnte deine Webseite aussehen</h2>
              <p className="text-muted-foreground">
                Drei Beispiele, wie eine moderne Handwerker-Webseite heute wirklich aussieht – klar,
                vertrauenswürdig, mobil optimiert.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {examples.map((ex, i) => (
              <AnimatedSection key={ex.name} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-2xl overflow-hidden h-full hover:shadow-elevated transition-shadow">
                  <div
                    className={`relative aspect-[4/3] bg-gradient-to-br ${ex.color} flex flex-col items-center justify-center p-6`}
                  >
                    <div className="w-full max-w-[80%] bg-background rounded-lg shadow-lg p-3 space-y-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-destructive/60" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
                      </div>
                      <div className={`h-3 w-1/2 rounded ${ex.accent} opacity-80`} />
                      <div className="h-2 w-full rounded bg-muted" />
                      <div className="h-2 w-3/4 rounded bg-muted" />
                      <div className="grid grid-cols-3 gap-1 pt-1">
                        <div className="h-6 rounded bg-muted" />
                        <div className="h-6 rounded bg-muted" />
                        <div className="h-6 rounded bg-muted" />
                      </div>
                      <div className={`h-4 w-1/3 rounded ${ex.accent} mt-1`} />
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="badge-label bg-primary/10 text-primary mb-3 inline-block">
                      {ex.badge}
                    </span>
                    <h3 className="font-heading text-base font-semibold mb-2">{ex.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ex.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="text-center mt-10">
              <Button variant="outline-primary" size="lg" onClick={scrollToForm}>
                So eine Vorschau für meinen Betrieb <ArrowDown size={18} />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* TRUST */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="mb-3 text-balance">Warum Handwerker mir vertrauen</h2>
              <p className="text-muted-foreground">
                Ehrliche Worte von Betrieben, die genau dort standen, wo du jetzt vielleicht stehst.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-2xl p-6 h-full">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-5 italic">
                    „{t.text}"
                  </p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.trade}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {trustBadges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium"
                >
                  <b.icon size={16} className="text-primary" />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* QUALIFYING FORM */}
      <section id="formular" className="section-padding bg-muted/30 scroll-mt-24">
        <div className="container-narrow px-4">
          <div className="max-w-2xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="badge-label bg-primary/10 text-primary mb-4 inline-block">
                  Jetzt anfordern
                </span>
                <h2 className="mb-3 text-balance">Jetzt kostenlose Vorschau anfordern</h2>
                <p className="text-muted-foreground">
                  Nur 2 Minuten – ich melde mich innerhalb von 24 Stunden bei dir.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Vorname *</label>
                      <Input
                        required
                        name="firstName"
                        placeholder="Dein Vorname"
                        className="h-12"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Betriebsname *</label>
                      <Input
                        required
                        name="companyName"
                        placeholder="Name deines Betriebs"
                        className="h-12"
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Branche / Gewerk *</label>
                    <Select value={trade} onValueChange={setTrade}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Bitte wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {trades.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Hast du aktuell eine Webseite? *
                    </label>
                    <RadioGroup
                      value={hasWebsite}
                      onValueChange={setHasWebsite}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                    >
                      {["Ja", "Nein", "Ja, aber sie ist veraltet"].map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                            hasWebsite === opt
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={opt} id={`web-${opt}`} />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Was ist dein wichtigstes Ziel? (Mehrfachauswahl)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {goals.map((g) => {
                        const checked = selectedGoals.includes(g);
                        return (
                          <label
                            key={g}
                            className={`flex items-start gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                              checked
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleGoal(g)}
                              className="mt-0.5"
                            />
                            <span className="text-sm">{g}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Wie dringend ist das Thema? *
                    </label>
                    <RadioGroup
                      value={urgency}
                      onValueChange={setUrgency}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                    >
                      {[
                        { v: "Sofort", icon: AlertTriangle },
                        { v: "1–3 Monate", icon: CalendarClock },
                        { v: "Ich schaue mich um", icon: Clock },
                      ].map((opt) => (
                        <label
                          key={opt.v}
                          className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition-colors ${
                            urgency === opt.v
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={opt.v} id={`urg-${opt.v}`} />
                          <span className="text-sm">{opt.v}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">E-Mail-Adresse *</label>
                      <Input
                        required
                        type="email"
                        name="email"
                        placeholder="name@email.de"
                        className="h-12"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Telefonnummer{" "}
                        <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="Für schnellere Rückmeldung"
                        className="h-12"
                        maxLength={30}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    disabled={loading}
                    className="w-full text-base sm:text-lg py-6 h-auto font-bold whitespace-normal text-center leading-tight"
                  >
                    {loading ? (
                      "Wird gesendet..."
                    ) : (
                      <>
                        Kostenlose Vorschau jetzt anfordern <ArrowRight size={18} />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                    <Lock size={12} />
                    Deine Daten sind sicher. Kein Spam. Keine Verpflichtung.
                  </p>
                  <p className="text-xs text-muted-foreground/80 text-center">
                    Mit dem Absenden akzeptierst du unsere{" "}
                    <Link to="/datenschutz" className="underline hover:text-primary">
                      Datenschutzbestimmungen
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="badge-label bg-primary/10 text-primary mb-4 inline-block">
                  FAQ
                </span>
                <h2 className="mb-3 text-balance">Die wichtigsten Fragen – ehrlich beantwortet</h2>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <Accordion
                type="single"
                collapsible
                className="bg-card border border-border rounded-2xl px-5 sm:px-7"
              >
                {faqs.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`item-${i}`}
                    className={i === faqs.length - 1 ? "border-b-0" : ""}
                  >
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline py-5">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="section-padding">
        <div className="container-narrow px-4">
          <AnimatedSection>
            <div className="gradient-hero-bg rounded-2xl sm:rounded-3xl p-8 sm:p-14 md:p-20 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-5">
                  <CheckCircle2 size={14} className="text-primary-foreground" />
                  <span className="text-xs font-semibold text-primary-foreground">
                    100% kostenlos · 0 € · 0 Risiko
                  </span>
                </div>
                <h2 className="text-primary-foreground mb-4 text-balance">
                  Warte nicht, bis es dein Mitbewerber tut.
                </h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-base sm:text-lg">
                  Deine kostenlose Webseiten-Vorschau wartet.
                </p>
                <Button
                  size="lg"
                  onClick={scrollToForm}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold shadow-elevated animate-cta-pulse w-full sm:w-auto text-sm sm:text-base px-6 sm:px-10 h-auto min-h-14 py-4 whitespace-normal text-center leading-tight"
                >
                  Jetzt starten <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default KostenloseVorschau;