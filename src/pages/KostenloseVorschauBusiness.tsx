import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Clock,
  Check,
  Info,
  Stethoscope,
  Briefcase,
  UtensilsCrossed,
  ShoppingBag,
  Palette,
  Scale,
  Dumbbell,
  Car,
  GraduationCap,
  Wrench,
  Sparkles,
  Monitor,
  Smartphone,
  MousePointerClick,
  ClipboardList,
  Search,
  Rocket,
  Calendar,
  Settings,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useVorschauSettings } from "@/hooks/useVorschauSettings";
import {
  MultiStepForm,
  WaitlistMiniForm,
  type TradeOption,
} from "./KostenloseVorschauV2";

const PLAETZE_PRO_MONAT = 5;

const brancheTiles: { icon: typeof Stethoscope; label: string }[] = [
  { icon: Stethoscope, label: "Praxen & Ärzte" },
  { icon: Briefcase, label: "Berater & Coaches" },
  { icon: UtensilsCrossed, label: "Gastro & Hotellerie" },
  { icon: ShoppingBag, label: "Onlineshops & Handel" },
  { icon: Palette, label: "Agenturen & Kreative" },
  { icon: Scale, label: "Kanzleien" },
  { icon: Dumbbell, label: "Fitness & Wellness" },
  { icon: Car, label: "Auto & Mobilität" },
  { icon: GraduationCap, label: "Bildung & Kurse" },
  { icon: Wrench, label: "Handwerk & Bau" },
];

// Für die Funnel-Step-1-Kacheln (breitere Business-Auswahl)
const businessTradeOptions: TradeOption[] = [
  { value: "Praxis / Arzt", icon: Stethoscope },
  { value: "Berater / Coach", icon: Briefcase },
  { value: "Gastro / Hotel", icon: UtensilsCrossed },
  { value: "Onlineshop / Handel", icon: ShoppingBag },
  { value: "Agentur / Kreativ", icon: Palette },
  { value: "Kanzlei", icon: Scale },
  { value: "Fitness / Wellness", icon: Dumbbell },
  { value: "Sonstiges", icon: Settings },
];

const processSteps = [
  {
    icon: ClipboardList,
    title: "Kurze Anfrage",
    text: "Du sagst uns, wer du bist und was du machst. Dauert 90 Sekunden.",
  },
  {
    icon: Search,
    title: "Wir schauen kurz drauf",
    text: "Innerhalb von 24 Stunden bekommst du Rückmeldung. Wenn's passt, gibt's den Link zum Onboarding.",
  },
  {
    icon: Rocket,
    title: "Onboarding + Vorschau",
    text: "Du gibst uns Logo & Infos. Ein paar Tage später zeigen wir dir deine fertige Website live in einem 15-Min-Call.",
  },
];

const nutzenCards = [
  {
    icon: Monitor,
    title: "Komplette Startseite live",
    text: "Echte Website im Browser — keine statischen Mockups, keine PDF-Screenshots.",
  },
  {
    icon: Palette,
    title: "Deine Farben & dein Logo",
    text: "In deiner CI aufgebaut. So siehst du sofort, wie es zu dir passt.",
  },
  {
    icon: MousePointerClick,
    title: "Echte Struktur",
    text: "Über uns, Leistungen, Kontakt — alles klickbar und durchdacht.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Ansicht",
    text: "Läuft direkt auf deinem Handy, nicht nur am Desktop.",
  },
];

const KostenloseVorschauBusiness = () => {
  const { settings } = useVorschauSettings("v2");

  const [belegteSlots, setBelegteSlots] = useState<number>(0);
  useEffect(() => {
    let cancelled = false;
    supabase.rpc("count_freigegebene_leads_this_month").then(({ data, error }) => {
      if (cancelled) return;
      if (error) return;
      if (typeof data === "number") setBelegteSlots(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalSlots = PLAETZE_PRO_MONAT;
  const takenSlots = Math.min(belegteSlots, totalSlots);
  const remainingSlots = Math.max(0, totalSlots - takenSlots);
  const slotPct = totalSlots > 0 ? (takenSlots / totalSlots) * 100 : 0;
  const monatName = useMemo(
    () => new Date().toLocaleDateString("de-DE", { month: "long" }),
    [],
  );
  const nextMonthLabel = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("de-DE", { month: "long" });
  }, []);
  const isWaitlist = remainingSlots <= 0;

  const scrollToForm = () => {
    document.getElementById("formular")?.scrollIntoView({ behavior: "smooth" });
  };

  const funnelProps = {
    sourceKey: "kostenlose-vorschau-business",
    sourcePage: "kostenlose-vorschau-business",
    telegramLabel: "Business-LP",
    emailSource: "Kostenlose Vorschau (Business-LP)",
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Mini-Header */}
      <header className="sticky top-0 z-40 bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
              W
            </div>
            <span className="font-bold text-sm sm:text-base hidden sm:inline">
              Meine Traum Webseite
            </span>
          </Link>
          <a
            href={`tel:${(settings?.phone_number ?? "+49 170 123 45 67").replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden focusable={false} />
            <span className="hidden sm:inline">
              {settings?.phone_number ?? "+49 170 123 45 67"}
            </span>
            <span className="sm:hidden">Anrufen</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-subtle)]" />
        <div className="absolute inset-0 bg-[var(--gradient-glow)] pointer-events-none" />
        <div className="container relative mx-auto px-4 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex flex-wrap justify-center items-center gap-2 mb-6">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm font-semibold ${
                  isWaitlist
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-600"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isWaitlist ? "bg-rose-500" : "bg-emerald-500"
                  } animate-pulse`}
                />
                {isWaitlist
                  ? `Alle ${totalSlots} Plätze im ${monatName} vergeben`
                  : `Noch ${remainingSlots} von ${totalSlots} Plätzen frei`}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs sm:text-sm font-semibold text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" aria-hidden focusable={false} />
                Monat: {monatName}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
              Kostenlose Website-Vorschau{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                für Selbstständige & Unternehmen
              </span>
              , die was zu zeigen haben
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Egal ob Berater, Praxis, Agentur, Coach, Shop oder Dienstleister — wir bauen
              dir eine komplette Website-Vorschau, bevor du einen Cent zahlst. Nur{" "}
              {totalSlots} Plätze pro Monat, weil jede Vorschau von Hand entsteht.
            </p>

            {/* Slot-Progress (dezent) */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between text-sm font-medium mb-2">
                <span>
                  {takenSlots} von {totalSlots} Plätzen vergeben
                </span>
                <span className={isWaitlist ? "text-rose-600" : "text-emerald-700"}>
                  {remainingSlots} frei
                </span>
              </div>
              <Progress value={slotPct} className="h-3" />
            </div>

            <Button
              size="lg"
              onClick={scrollToForm}
              className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              {isWaitlist
                ? `Jetzt für ${nextMonthLabel} vormerken lassen`
                : "Jetzt kostenlose Vorschau anfordern"}{" "}
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden focusable={false} />
            </Button>

            <p className="mt-5 text-sm text-muted-foreground">
              Über 150 Kunden aus verschiedensten Branchen · Seit 6 Jahren aktiv
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {[
                { icon: ShieldCheck, text: "Kostenlos & unverbindlich" },
                { icon: Clock, text: "Rückmeldung in 24 h" },
                { icon: Check, text: "Kein technisches Wissen nötig" },
              ].map((it) => (
                <div
                  key={it.text}
                  className="flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <it.icon className="w-5 h-5 text-primary shrink-0" />
                  <span>{it.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FÜR WEN */}
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-3">Für wen wir bauen</h2>
            <p className="text-muted-foreground">
              Wir haben in fast jeder Branche schon gebaut. Ein paar Beispiele:
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {brancheTiles.map((b) => (
              <div
                key={b.label}
                className="bg-card rounded-2xl border border-border p-4 sm:p-5 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-primary" aria-hidden focusable={false} />
                </div>
                <span className="text-sm font-semibold leading-tight">{b.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-xl mx-auto">
            Deine Branche nicht dabei? Trotzdem anfragen — wir bauen für alles, was klare
            Anfragen und Vertrauen braucht.
          </p>
        </div>
      </section>

      {/* WIE'S ABLÄUFT */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">So läuft's ab</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 max-w-5xl mx-auto items-stretch">
            {processSteps.map((s, i) => (
              <div key={s.title} className="relative flex">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <s.icon className="w-6 h-6 text-primary" aria-hidden focusable={false} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.text}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <ArrowRight
                    className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40 z-10"
                    aria-hidden
                    focusable={false}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={scrollToForm} className="shadow-md">
              Anfrage starten{" "}
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden focusable={false} />
            </Button>
          </div>
        </div>
      </section>

      {/* WAS DU BEKOMMST */}
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-bold mb-3">Was du in deiner Vorschau siehst</h2>
            <p className="text-muted-foreground">
              Kein Konzept-Deck. Keine Skizze. Eine echte Website — aufgebaut auf deine
              Marke.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {nutzenCards.map((c) => (
              <div
                key={c.title}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <c.icon className="w-6 h-6 text-primary" aria-hidden focusable={false} />
                </div>
                <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                <p className="text-muted-foreground text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FUNNEL */}
      <section
        id="formular"
        className="pt-16 sm:pt-20 pb-[60px] scroll-mt-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">
              {isWaitlist
                ? `Jetzt für ${nextMonthLabel} vormerken lassen`
                : "Jetzt deinen Platz sichern"}
            </h2>
            {isWaitlist ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-4 py-1.5 text-sm font-semibold">
                <Calendar className="w-4 h-4" aria-hidden focusable={false} />
                {monatName} ist ausgebucht – Warteliste für {nextMonthLabel}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 text-sm font-semibold">
                <Sparkles className="w-4 h-4" aria-hidden focusable={false} />
                Noch {remainingSlots} von {totalSlots} Plätzen im {monatName} frei
              </div>
            )}
          </div>
          <div className="max-w-2xl mx-auto">
            {isWaitlist ? (
              <WaitlistMiniForm
                nextMonthLabel={nextMonthLabel}
                phoneNumber={settings?.phone_number}
                sourceKey={funnelProps.sourceKey}
                sourcePage={funnelProps.sourcePage}
                telegramLabel={funnelProps.telegramLabel}
              />
            ) : (
              <MultiStepForm
                isWaitlist={isWaitlist}
                nextMonthLabel={nextMonthLabel}
                phoneNumber={settings?.phone_number}
                sourceKey={funnelProps.sourceKey}
                telegramLabel={funnelProps.telegramLabel}
                emailSource={funnelProps.emailSource}
                tradeOptions={businessTradeOptions}
                tradeQuestion="Was ist deine Branche?"
                sonstigesLabel="Beschreib kurz, was du machst *"
                sonstigesPlaceholder="z. B. Steuerberatung, Zahnarztpraxis, Online-Shop, Marketingagentur"
              />
            )}
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <Info
                className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70"
                aria-hidden
                focusable={false}
              />
              <p className="leading-relaxed">
                Hinweis: Wir bauen jede Vorschau von Hand. Deshalb schauen wir kurz, ob's
                für dich und für uns passt. Details dazu bekommst du direkt nach dem
                Absenden.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KostenloseVorschauBusiness;