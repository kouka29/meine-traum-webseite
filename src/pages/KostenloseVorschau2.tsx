import { useEffect, useState, useMemo, FormEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Trophy,
  ClipboardList,
  Wand2,
  Sparkles,
  Star,
  Lock,
  Phone,
  Zap,
  Brush,
  Wrench,
  Home,
  Hammer,
  Trees,
  Car,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Award,
  Flame,
  CalendarClock,
  Eye,
  Share2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useVorschauSettings, type VorschauSettings, type VorschauDemo, type VorschauFaq } from "@/hooks/useVorschauSettings";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "kostenlose-vorschau2-form";

const tradeOptions = [
  { value: "Elektriker", icon: Zap },
  { value: "Maler", icon: Brush },
  { value: "Sanitär & Heizung", icon: Wrench },
  { value: "Dachdecker", icon: Home },
  { value: "Schreiner", icon: Hammer },
  { value: "Garten & Landschaft", icon: Trees },
  { value: "KFZ", icon: Car },
  { value: "Sonstiges", icon: Settings },
];

const websiteOptions = [
  { value: "Ja, und ich bin zufrieden", icon: CheckCircle, tone: "success" as const },
  { value: "Ja, aber sie ist veraltet", icon: AlertCircle, tone: "warning" as const },
  { value: "Nein, noch gar keine", icon: XCircle, tone: "danger" as const },
];

const goalOptions = [
  { value: "Mehr Kundenanfragen", icon: TrendingUp },
  { value: "Moderner Auftritt", icon: Sparkles },
  { value: "Besser als die Konkurrenz", icon: Award },
  { value: "Lokale Sichtbarkeit bei Google", icon: MapPin },
];

const urgencyOptions = [
  { value: "Sofort – ich brauche das jetzt", icon: Flame },
  { value: "In den nächsten 1–3 Monaten", icon: CalendarClock },
  { value: "Ich schaue mich erstmal um", icon: Eye },
];

const painPoints = [
  {
    icon: AlertTriangle,
    title: "Veraltete Webseite",
    text: "Du verlierst Aufträge, weil dein Auftritt online nicht überzeugt.",
  },
  {
    icon: Clock,
    title: "Keine Zeit",
    text: "Du hast genug mit deinem Kerngeschäft zu tun – die Webseite bleibt liegen.",
  },
  {
    icon: Trophy,
    title: "Konkurrenz zieht vorbei",
    text: "Andere Betriebe in deiner Region sind online besser aufgestellt als du.",
  },
];

const processSteps = [
  {
    icon: ClipboardList,
    title: "Formular ausfüllen (2 Min.)",
    text: "Sag mir kurz, was dein Betrieb macht.",
  },
  {
    icon: Wand2,
    title: "Ich baue deine Vorschau (48h)",
    text: "Du lehnst dich zurück, ich arbeite.",
  },
  {
    icon: Sparkles,
    title: "Du entscheidest – ohne Druck",
    text: "Gefällt sie dir? Dann reden wir. Wenn nicht, zahlst du nichts.",
  },
];

const demos = [
  { trade: "Elektriker", company: "Elektro Mustermann GmbH", desc: "Modern, klar, mit Online-Anfrage in 60 Sekunden." },
  { trade: "Maler", company: "Malerbetrieb Schmidt", desc: "Bildstark, hochwertig, mit Galerie und Bewertungen." },
  { trade: "Sanitär", company: "Heizung & Bad Müller", desc: "Notdienst-Hotline prominent, schnelle Terminbuchung." },
];

const testimonials = [
  {
    quote: "Ich hab nicht erwartet, dass das so professionell aussieht. Bin direkt Kunde geworden.",
    name: "Thomas K.",
    role: "Elektriker, München",
  },
  {
    quote: "In 48 Stunden hatte ich eine Webseite vor mir, die ich so nie erwartet hätte. Einfach top.",
    name: "Stefan M.",
    role: "Maler, Wien",
  },
  {
    quote: "Kein Risiko, kein Druck – und das Ergebnis hat mich überzeugt.",
    name: "Andreas B.",
    role: "Dachdecker, Zürich",
  },
];

const faqs = [
  {
    q: "Was kostet mich die Vorschau wirklich?",
    a: "Gar nichts. Weder jetzt noch später, wenn es dir nicht gefällt.",
  },
  {
    q: "Bin ich nach der Vorschau zu irgendetwas verpflichtet?",
    a: "Nein. Absolut nicht.",
  },
  {
    q: "Wie sieht die Vorschau konkret aus?",
    a: "Du bekommst eine echte, klickbare Webseite mit deinem Firmennamen – kein PDF, kein Screenshot.",
  },
  {
    q: "Warum machst du das kostenlos?",
    a: "Weil ich überzeugt bin, dass die Qualität meiner Arbeit für sich spricht. Erst sehen, dann entscheiden.",
  },
  {
    q: "Was passiert, wenn alle 5 Plätze weg sind?",
    a: "Du kannst dich auf die Warteliste setzen lassen und bekommst im nächsten Monat Priorität.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Countdown hook – Ende des aktuellen Monats, 23:59 Uhr
// ─────────────────────────────────────────────────────────────────────────────

function getEndOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 0, 0);
}

function useCountdown(targetISO?: string | null, mode: string = "end_of_month") {
  const target = useMemo(() => {
    if (mode === "fixed_date" && targetISO) {
      const d = new Date(targetISO);
      if (!isNaN(d.getTime())) return d;
    }
    return getEndOfMonth();
  }, [targetISO, mode]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-xl px-3 py-3 sm:px-5 sm:py-4 min-w-[64px] sm:min-w-[80px] shadow-lg">
      <div className="text-2xl sm:text-4xl font-bold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </div>
    </div>
    <div className="mt-2 text-xs sm:text-sm text-muted-foreground uppercase tracking-wide">
      {label}
    </div>
  </div>
);

const Countdown = ({
  inverse = false,
  targetISO,
  mode,
}: {
  inverse?: boolean;
  targetISO?: string | null;
  mode?: string;
}) => {
  const { days, hours, minutes, seconds } = useCountdown(targetISO, mode);
  if (inverse) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        {[
          { v: days, l: "Tage" },
          { v: hours, l: "Std." },
          { v: minutes, l: "Min." },
          { v: seconds, l: "Sek." },
        ].map((it) => (
          <div key={it.l} className="flex flex-col items-center">
            <div className="bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/25 text-primary-foreground rounded-xl px-3 py-3 sm:px-5 sm:py-4 min-w-[64px] sm:min-w-[80px]">
              <div className="text-2xl sm:text-4xl font-bold tabular-nums leading-none">
                {String(it.v).padStart(2, "0")}
              </div>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-primary-foreground/80 uppercase tracking-wide">
              {it.l}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
      <CountdownBox value={days} label="Tage" />
      <CountdownBox value={hours} label="Std." />
      <CountdownBox value={minutes} label="Min." />
      <CountdownBox value={seconds} label="Sek." />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Multi-Step Form
// ─────────────────────────────────────────────────────────────────────────────

type FormState = {
  step: number;
  trade: string;
  hasWebsite: string;
  goals: string[];
  urgency: string;
  firstName: string;
  company: string;
  email: string;
  phone: string;
};

const initialState: FormState = {
  step: 1,
  trade: "",
  hasWebsite: "",
  goals: [],
  urgency: "",
  firstName: "",
  company: "",
  email: "",
  phone: "",
};

const TileButton = ({
  selected,
  onClick,
  icon: Icon,
  label,
  tone,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "success" | "warning" | "danger";
}) => {
  const toneRing =
    tone === "success"
      ? "data-[selected=true]:ring-emerald-500"
      : tone === "warning"
      ? "data-[selected=true]:ring-amber-500"
      : tone === "danger"
      ? "data-[selected=true]:ring-rose-500"
      : "";
  return (
    <button
      type="button"
      onClick={onClick}
      data-selected={selected}
      className={`group relative w-full text-left rounded-2xl border-2 border-border bg-card p-4 sm:p-5 transition-all hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:shadow-lg ${toneRing}`}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 group-data-[selected=true]:bg-primary-foreground/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary group-data-[selected=true]:text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm sm:text-base flex-1 break-words">
          {label}
        </span>
        {selected && (
          <CheckCircle2 className="w-5 h-5 text-primary-foreground shrink-0" />
        )}
      </div>
    </button>
  );
};

const SlotPill = ({
  inverse = false,
  total,
  taken,
}: {
  inverse?: boolean;
  total: number;
  taken: number;
}) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold ${
      inverse
        ? "bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/25"
        : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
    }`}
  >
    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
    Noch {Math.max(0, total - taken)} von {total} Plätzen verfügbar
  </span>
);

const MultiStepForm = () => {
  const [state, setState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist (nur bis Schritt 5)
  useEffect(() => {
    if (done) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, done]);

  const update = useCallback((patch: Partial<FormState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const next = () => setState((s) => ({ ...s, step: Math.min(5, s.step + 1) }));
  const prev = () => setState((s) => ({ ...s, step: Math.max(1, s.step - 1) }));

  const toggleGoal = (g: string) =>
    setState((s) => ({
      ...s,
      goals: s.goals.includes(g) ? s.goals.filter((x) => x !== g) : [...s.goals, g],
    }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!state.firstName || !state.company || !state.email) {
      toast.error("Bitte fülle die Pflichtfelder aus.");
      return;
    }
    setSubmitting(true);
    try {
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .insert({
          first_name: state.firstName,
          email: state.email,
          phone: state.phone || "",
          company_name: state.company || "",
        })
        .select("id")
        .single();

      if (leadError) throw leadError;

      // Webhook-Platzhalter (silently fail)
      try {
        await fetch("https://webhook.site/placeholder", {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
      } catch {
        /* ignore */
      }

      // E-Mail-Benachrichtigung
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "lead-notification",
            idempotencyKey: `vorschau2-${leadData?.id ?? Date.now()}`,
            templateData: {
              source: "Kostenlose Vorschau 2 (Multi-Step)",
              firstName: state.firstName,
              company: state.company,
              email: state.email,
              phone: state.phone,
              trade: state.trade,
              hasWebsite: state.hasWebsite,
              goals: state.goals.join(", "),
              urgency: state.urgency,
              submittedAt: new Date().toLocaleString("de-DE"),
            },
          },
        });
      } catch {
        /* ignore */
      }

      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    const shareText = encodeURIComponent(
      "Schau mal: kostenlose Webseiten-Vorschau in 48h für Handwerker → https://meinetraumwebseite.de/kostenlose-vorschau2",
    );
    return (
      <div className="text-center py-10 px-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3">
          Perfekt, {state.firstName}! Dein Platz ist gesichert.
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-2">
          Ich melde mich innerhalb von 24 Stunden bei dir und starte sofort mit deiner Vorschau.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          📧 Schau auch in deinen Spam-Ordner.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" /> Per WhatsApp teilen
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://meinetraumwebseite.de/kostenlose-vorschau2`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1877f2] hover:bg-[#155fc7] text-white px-5 py-3 font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" /> Auf Facebook teilen
          </a>
        </div>
      </div>
    );
  }

  const progressPct = (state.step / 5) * 100;

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border p-5 sm:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Schritt {state.step} von 5</span>
          <span className="text-muted-foreground">{Math.round(progressPct)}%</span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </div>

      {/* Step 1 */}
      {state.step === 1 && (
        <div className="space-y-5">
          <h3 className="text-xl sm:text-2xl font-bold">Was machst du beruflich?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tradeOptions.map((opt) => (
              <TileButton
                key={opt.value}
                icon={opt.icon}
                label={opt.value}
                selected={state.trade === opt.value}
                onClick={() => {
                  update({ trade: opt.value });
                  setTimeout(next, 200);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {state.step === 2 && (
        <div className="space-y-5">
          <h3 className="text-xl sm:text-2xl font-bold">Hast du aktuell eine Webseite?</h3>
          <div className="grid grid-cols-1 gap-3">
            {websiteOptions.map((opt) => (
              <TileButton
                key={opt.value}
                icon={opt.icon}
                label={opt.value}
                tone={opt.tone}
                selected={state.hasWebsite === opt.value}
                onClick={() => {
                  update({ hasWebsite: opt.value });
                  setTimeout(next, 200);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {state.step === 3 && (
        <div className="space-y-5">
          <h3 className="text-xl sm:text-2xl font-bold">Was ist dein wichtigstes Ziel?</h3>
          <p className="text-sm text-muted-foreground">Mehrfachauswahl möglich.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {goalOptions.map((opt) => (
              <TileButton
                key={opt.value}
                icon={opt.icon}
                label={opt.value}
                selected={state.goals.includes(opt.value)}
                onClick={() => toggleGoal(opt.value)}
              />
            ))}
          </div>
          <Button
            type="button"
            size="lg"
            disabled={state.goals.length === 0}
            onClick={next}
            className="w-full sm:w-auto"
          >
            Weiter <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Step 4 */}
      {state.step === 4 && (
        <div className="space-y-5">
          <h3 className="text-xl sm:text-2xl font-bold">Wie dringend ist das Thema für dich?</h3>
          <div className="grid grid-cols-1 gap-3">
            {urgencyOptions.map((opt) => (
              <TileButton
                key={opt.value}
                icon={opt.icon}
                label={opt.value}
                selected={state.urgency === opt.value}
                onClick={() => {
                  update({ urgency: opt.value });
                  setTimeout(next, 200);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 5 */}
      {state.step === 5 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-xl sm:text-2xl font-bold">
            Fast geschafft! Wo soll ich die Vorschau hinschicken?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Vorname *</label>
              <Input
                required
                value={state.firstName}
                onChange={(e) => update({ firstName: e.target.value })}
                placeholder="Max"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Betriebsname *</label>
              <Input
                required
                value={state.company}
                onChange={(e) => update({ company: e.target.value })}
                placeholder="Mustermann GmbH"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">E-Mail-Adresse *</label>
              <Input
                required
                type="email"
                value={state.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="max@mustermann.de"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1.5 block">
                Telefonnummer{" "}
                <span className="text-muted-foreground font-normal">
                  (optional – für schnellere Rückmeldung)
                </span>
              </label>
              <Input
                type="tel"
                value={state.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="+49 ..."
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Wird gesendet..." : (
              <>Kostenlose Vorschau jetzt anfordern <ArrowRight className="ml-2 w-4 h-4" /></>
            )}
          </Button>
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Deine Daten sind sicher. Kein Spam. Keine Verpflichtung. Du kannst jederzeit zurückgehen und Antworten ändern.
            </span>
          </p>
        </form>
      )}

      {/* Back link */}
      {state.step > 1 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={prev}
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Zurück
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

const KostenloseVorschau2 = () => {
  const { settings, demos: dbDemos, faqs: dbFaqs, portfolio, testimonials: dbTestimonials } = useVorschauSettings();
  const totalSlots = settings?.total_slots ?? 5;
  const takenSlots = Math.min(settings?.taken_slots ?? 3, totalSlots);
  const remainingSlots = Math.max(0, totalSlots - takenSlots);
  const slotPct = totalSlots > 0 ? (takenSlots / totalSlots) * 100 : 0;
  const monatName = useMemo(
    () => new Date().toLocaleDateString("de-DE", { month: "long" }),
    [],
  );
  // Fallbacks: wenn DB-Listen leer, nutze hardcoded Defaults
  const activeDemos = dbDemos.length > 0
    ? dbDemos.map(d => {
        // Merge: wenn mit Portfolio-Projekt verknüpft, fülle leere Felder aus Portfolio
        const linked = d.portfolio_project_id ? portfolio.find(p => p.id === d.portfolio_project_id) : undefined;
        return {
          trade: d.trade || linked?.category || "",
          company: d.company || linked?.title || "",
          desc: d.description || linked?.description || "",
          image_url: d.image_url || linked?.mockup_desktop_url || linked?.image_url || "",
        };
      })
    : demos.map(d => ({ ...d, image_url: "" }));
  // Bewertungen aus DB (Fallback: hardcoded testimonials)
  const activeTestimonials = dbTestimonials.length > 0
    ? dbTestimonials.map(t => ({ quote: t.text, name: t.name, role: t.role, result: t.result }))
    : testimonials.map(t => ({ ...t, result: "" }));
  const activeFaqs = dbFaqs.length > 0
    ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
    : faqs;
  const heroBadge = (settings?.hero_badge_text ?? "Nur noch {remaining} von {total} Plätzen im {month} verfügbar")
    .replace("{remaining}", String(remainingSlots))
    .replace("{total}", String(totalSlots))
    .replace("{taken}", String(takenSlots))
    .replace("{month}", monatName);

  const scrollToForm = () => {
    document.getElementById("formular")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Mini-Header (fokussiert) */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
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
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{settings?.phone_number ?? "+49 170 123 45 67"}</span>
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
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {heroBadge}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
              {settings?.hero_h1_line1 ?? "Dein Handwerksbetrieb."}
              <br />
              {settings?.hero_h1_line2 ?? "Eine neue Webseite."}
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {settings?.hero_h1_line3 ?? "Kostenlos in 48h."}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {settings?.hero_subheadline ?? "Ich zeige dir, wie dein Betrieb online aussehen könnte – ohne Risiko, ohne Kosten, ohne Verpflichtung."}
            </p>

            {/* Countdown */}
            {(settings?.show_countdown ?? true) && (
              <div className="mb-8">
                <div className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {settings?.countdown_label ?? "Aktion endet in:"}
                </div>
                <Countdown targetISO={settings?.countdown_target} mode={settings?.countdown_mode} />
              </div>
            )}

            {/* Slot progress */}
            {(settings?.show_slots ?? true) && (
              <div className="max-w-md mx-auto mb-8">
                <div className="flex items-center justify-between text-sm font-medium mb-2">
                  <span>{takenSlots} von {totalSlots} Plätzen bereits vergeben</span>
                  <span className="text-rose-600">{remainingSlots} frei</span>
                </div>
                <Progress value={slotPct} className="h-3" />
              </div>
            )}

            <Button
              size="lg"
              onClick={scrollToForm}
              className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              {settings?.hero_cta_label ?? "Jetzt kostenlose Vorschau sichern"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Social Proof: 150+ Webseiten */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium shadow-sm">
              <Award className="w-4 h-4 text-primary" />
              <span>
                <strong className="text-foreground">Über 150 Webseiten</strong>{" "}
                <span className="text-muted-foreground">erfolgreich umgesetzt</span>
              </span>
            </div>

            {/* Trust icons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
              {[
                { icon: ShieldCheck, text: "Kostenlos & unverbindlich" },
                { icon: Clock, text: "Fertig in 48 Stunden" },
                { icon: CheckCircle2, text: "Kein technisches Wissen nötig" },
              ].map((it) => (
                <div key={it.text} className="flex items-center justify-center gap-2 text-sm font-medium">
                  <it.icon className="w-5 h-5 text-primary shrink-0" />
                  <span>{it.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      {(settings?.show_pain_points ?? true) && (
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Erkennst du dich wieder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {painPoints.map((p) => (
              <div key={p.title} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <p.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <p className="text-muted-foreground">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={scrollToForm} className="shadow-md">
              Jetzt kostenlose Vorschau sichern <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* PROCESS */}
      {(settings?.show_process ?? true) && (
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            In 3 Schritten zu deiner Vorschau
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 max-w-5xl mx-auto items-stretch">
            {processSteps.map((s, i) => (
              <div key={s.title} className="relative flex">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm">{s.text}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/40 z-10" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={scrollToForm} className="shadow-md">
              Schritt 1 starten – Formular ausfüllen <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* FORM */}
      <section id="formular" className="py-16 sm:py-20 bg-secondary/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Jetzt deinen Platz sichern</h2>
            {(settings?.show_slots ?? true) && <SlotPill total={totalSlots} taken={takenSlots} />}
          </div>
          <div className="max-w-2xl mx-auto">
            <MultiStepForm />
          </div>
        </div>
      </section>

      {/* DEMOS */}
      {(settings?.show_demos ?? true) && activeDemos.length > 0 && (
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">So könnte deine Webseite aussehen</h2>
            <p className="text-muted-foreground">Echte Vorschauen – in 48 Stunden erstellt.</p>
          </div>
          <Carousel
            opts={{ align: "start", loop: activeDemos.length > 3 }}
            className="max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {activeDemos.map((d, idx) => (
                <CarouselItem key={`${d.company}-${idx}`} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
                    {/* Mockup */}
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-5">
                      <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
                        <div className="bg-muted h-6 flex items-center gap-1.5 px-2.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        {d.image_url ? (
                          <img src={d.image_url} alt={d.company} className="aspect-video w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-4 flex flex-col justify-end">
                            <div className="h-2 w-2/3 bg-foreground/20 rounded mb-2" />
                            <div className="h-1.5 w-1/2 bg-foreground/15 rounded mb-1" />
                            <div className="h-1.5 w-1/3 bg-foreground/15 rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {d.trade && <span className="inline-flex self-start items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold mb-2">
                        {d.trade}
                      </span>}
                      <h3 className="font-bold mb-1">{d.company}</h3>
                      <p className="text-sm text-muted-foreground mb-3 flex-1">{(d as any).desc ?? (d as any).description}</p>
                      <div className="flex items-center gap-1 text-amber-500 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                        <span className="ml-1 text-muted-foreground">Kunde ist begeistert</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {activeDemos.length > 1 && (
              <>
                <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
                <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
              </>
            )}
          </Carousel>
          <div className="text-center mt-10">
            <Button size="lg" onClick={scrollToForm} className="shadow-md">
              So eine Vorschau für meinen Betrieb <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* TESTIMONIALS */}
      {(settings?.show_testimonials ?? true) && (
      <section className="py-16 sm:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Was Kunden über ihre Vorschau sagen
          </h2>
          <Carousel
            opts={{ align: "start", loop: activeTestimonials.length > 3 }}
            className="max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {activeTestimonials.map((t, idx) => (
                <CarouselItem key={`${t.name}-${idx}`} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-foreground/90 mb-4 flex-1">
                      „{t.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold">{t.name}</div>
                        <div className="text-sm text-muted-foreground">{t.role}</div>
                      </div>
                      {t.result && (
                        <span className="shrink-0 inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">
                          {t.result}
                        </span>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {activeTestimonials.length > 1 && (
              <>
                <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-12" />
                <CarouselNext className="hidden sm:flex -right-4 lg:-right-12" />
              </>
            )}
          </Carousel>
          <div className="text-center mt-10">
            <Button size="lg" onClick={scrollToForm} className="shadow-md">
              Jetzt meine kostenlose Vorschau anfordern <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* FAQ */}
      {(settings?.show_faq ?? true) && activeFaqs.length > 0 && (
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border px-5 shadow-sm">
            {activeFaqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-b-0">
                <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      )}

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            {(settings?.show_countdown ?? true) && (
              <div className="mb-6">
                <Countdown inverse targetISO={settings?.countdown_target} mode={settings?.countdown_mode} />
              </div>
            )}
            {(settings?.show_slots ?? true) && (
              <div className="mb-6 flex justify-center">
                <SlotPill inverse total={totalSlots} taken={takenSlots} />
              </div>
            )}
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              {settings?.final_cta_headline ?? "Warte nicht, bis es dein Mitbewerber tut."}
            </h2>
            <p className="text-base sm:text-xl text-primary-foreground/85 mb-8">
              {settings?.final_cta_subtext ?? "Deine kostenlose Webseiten-Vorschau wartet."}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={scrollToForm}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-xl"
            >
              {settings?.final_cta_button ?? "Jetzt letzten Platz sichern"} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default KostenloseVorschau2;
