import { useEffect, useState, useMemo, FormEvent, useCallback, useRef } from "react";
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
  Share2,
} from "lucide-react";
import { Calendar as CalendarIcon, PhoneCall, Video, MessageCircle } from "lucide-react";
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

const STORAGE_KEY = "kostenlose-vorschau-v2-form";

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
  { trade: "Malerbetrieb", company: "Maler Müller – Köln", desc: "Hochwertige Bildgalerie, klare Leistungen, einfache Online-Anfrage." },
  { trade: "Elektriker", company: "Elektro Bauer – München", desc: "Modern, klar strukturiert, mit Online-Anfrage in 60 Sekunden." },
  { trade: "Sanitär & Heizung", company: "Sanitär Schmidt – Hamburg", desc: "Notdienst-Hotline prominent, schnelle Terminbuchung." },
];

const testimonials = [
  {
    quote: "Vorher hatte ich kaum Anfragen über das Internet. Seit der neuen Website melden sich jede Woche neue Kunden – ohne dass ich was tun muss.",
    name: "Klaus B.",
    role: "Malerbetrieb Bergmann, Köln",
    result: "+9 Anfragen/Monat",
  },
  {
    quote: "Ich war skeptisch, weil ich sowas noch nie gemacht habe. Aber die Vorschau war kostenlos, hat mir sofort gefallen und der Preis war fair. Kann ich nur empfehlen.",
    name: "Markus H.",
    role: "Elektro Huber, München",
    result: "Kunde seit 3 Monaten",
  },
  {
    quote: "Meine Konkurrenten haben alle bessere Websites gehabt als ich. Das ist jetzt vorbei. Bekomme sogar Anfragen von Leuten die mich vorher gar nicht kannten.",
    name: "Stefan R.",
    role: "Sanitär & Heizung Richter, Hamburg",
    result: "3x mehr Anfragen",
  },
];

const faqs = [
  {
    q: "Lohnt sich eine Website überhaupt für meinen Betrieb?",
    a: "Ja – und zwar schneller als du denkst. Ein einziger neuer Auftrag über deine Website deckt oft die kompletten Jahreskosten. Handwerker die wir betreuen berichten von durchschnittlich 6–12 neuen Anfragen pro Monat allein über ihre neue Website.",
  },
  {
    q: "Was passiert wenn mir die Vorschau nicht gefällt?",
    a: "Gar nichts. Du zahlst keinen Cent. Kein Kleingedrucktes, kein Druck, keine Verpflichtung. Ich zeige dir die Vorschau – gefällt sie dir nicht, war es das. Kein unangenehmes Gespräch danach.",
  },
  {
    q: "Muss ich selbst viel Zeit investieren oder mich um Technik kümmern?",
    a: "Nein. Du füllst einmal ein 2-Minuten-Formular aus und lehnst dich zurück. Ich kümmere mich um alles: Design, Texte, Technik, Einrichtung. Du bekommst deine fertige Website – ohne einen einzigen technischen Handgriff.",
  },
  {
    q: "Was passiert nach den 12 Monaten Mindestlaufzeit?",
    a: "Nach den 12 Monaten läuft dein Vertrag automatisch monatlich weiter – das ist der Normalfall.\nDu kannst aber jederzeit kündigen, mit einer Frist von nur 30 Tagen.\nKein Preisanstieg, kein neuer Vertrag, keine versteckten Änderungen.\nEinfach kurz Bescheid geben – fertig.",
  },
  {
    q: "Wie lange dauert es bis ich erste Anfragen bekomme?",
    a: "Die meisten unserer Kunden sehen erste Ergebnisse innerhalb von 2–6 Wochen nach Launch. Wie schnell es geht hängt von deiner Region und deinem Gewerk ab. Wer zusätzlich Google Business einrichtet (ab Pro-Paket inklusive) sieht oft noch schneller Ergebnisse.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Countdown hook – Ende des aktuellen Monats, 23:59 Uhr
// ─────────────────────────────────────────────────────────────────────────────

function getEndOfMonth(): Date {
  // V2: Countdown immer 47h 59min ab Mount-Zeitpunkt (dynamisch laufend).
  return new Date(Date.now() + (47 * 60 + 59) * 60 * 1000);
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
  tradeOther: string;
  hasWebsite: string;
  goals: string[];
  urgency: string;
  firstName: string;
  company: string;
  email: string;
  phone: string;
  currentWebsite: string;
  notes: string;
  bookingDate: string;
  bookingTime: string;
  contactMethod: "phone" | "online" | "";
};

const initialState: FormState = {
  step: 1,
  trade: "",
  tradeOther: "",
  hasWebsite: "",
  goals: [],
  urgency: "",
  firstName: "",
  company: "",
  email: "",
  phone: "",
  currentWebsite: "",
  notes: "",
  bookingDate: "",
  bookingTime: "",
  contactMethod: "",
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

// ─────────────────────────────────────────────────────────────────────────────
// Success Screen mit zwei Optionen: Anruf abwarten ODER Termin direkt buchen
// ─────────────────────────────────────────────────────────────────────────────

function getNextWeekdays(count: number): { iso: string; label: string }[] {
  const out: { iso: string; label: string }[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue; // skip Sa/So
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
    out.push({ iso, label });
  }
  return out;
}

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

type SuccessScreenProps = {
  firstName: string;
  email: string;
  company: string;
  phone: string;
  trade: string;
  tradeOther: string;
  hasWebsite: string;
  goals: string[];
  urgency: string;
  currentWebsite: string;
  notes: string;
  leadId: string | null;
  bookingMode: boolean;
  setBookingMode: (v: boolean) => void;
  bookingDate: string;
  setBookingDate: (v: string) => void;
  bookingTime: string;
  setBookingTime: (v: string) => void;
  contactMethod: "phone" | "online" | "";
  setContactMethod: (v: "phone" | "online") => void;
  bookingConfirmed: boolean;
  setBookingConfirmed: (v: boolean) => void;
  isWaitlist: boolean;
  nextMonthLabel: string;
};

const SuccessScreen = ({
  firstName,
  email,
  company,
  phone,
  trade,
  tradeOther,
  hasWebsite,
  goals,
  urgency,
  currentWebsite,
  notes,
  leadId,
  bookingMode,
  setBookingMode,
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  contactMethod,
  setContactMethod,
  bookingConfirmed,
  setBookingConfirmed,
  isWaitlist,
  nextMonthLabel,
}: SuccessScreenProps) => {
  const dates = useMemo(() => getNextWeekdays(7), []);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const screenRef = useRef<HTMLDivElement | null>(null);

  // Whenever the success screen mounts or switches sub-state (booking
  // selector, confirmation), pull the user back up so they see the new
  // headline instead of being stuck mid-page on mobile.
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [bookingMode, bookingConfirmed]);

  const confirmBooking = async () => {
    if (!bookingDate || !bookingTime || !contactMethod) {
      toast.error("Bitte wähle Datum, Uhrzeit und Kontaktweg.");
      return;
    }
    setBookingSubmitting(true);
    const dateLabel = dates.find((d) => d.iso === bookingDate)?.label ?? bookingDate;
    const methodLabel = contactMethod === "online" ? "Online-Meeting" : "Telefonat";

    try {
      // 1. Buchung + alle Funnel-Daten verlässlich speichern, bevor die Bestätigung gezeigt wird
      if (leadId) {
        const { data: attached, error: updateError } = await supabase.rpc(
          "attach_booking_to_lead",
          {
            p_lead_id: leadId,
            p_booking_date: bookingDate,
            p_booking_time: bookingTime,
            p_contact_method: contactMethod,
            p_trade: trade || null,
            p_trade_other: tradeOther || null,
            p_has_website: hasWebsite || null,
            p_goals: goals.length > 0 ? goals : null,
            p_urgency: urgency || null,
            p_current_website: currentWebsite || null,
            p_notes: notes || null,
          }
        );

        if (updateError) throw updateError;
        if (attached === false) {
          throw new Error("Für diesen Lead existiert bereits eine Buchung.");
        }
      }

      // 2. Admin-Benachrichtigung mit ALLEN Lead-Details + Termin (Hintergrund)
      void supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-notification",
          idempotencyKey: `vorschau2-booking-admin-${email}-${bookingDate}-${bookingTime}-${contactMethod}`,
          templateData: {
            source: "Termin-Direktbuchung (Kostenlose Vorschau)",
            firstName,
            companyName: company,
            email,
            phone: phone || "—",
            website: currentWebsite || "Nicht angegeben",
            trade: trade === "Sonstiges" && tradeOther ? `Sonstiges: ${tradeOther}` : trade,
            hasWebsite,
            goals: goals.join(", "),
            urgency,
            message: notes || "",
            bookingDate: dateLabel,
            bookingTime,
            contactMethod,
            submittedAt: new Date().toLocaleString("de-DE"),
          },
        },
      }).catch(() => {});

      // 3. Bestätigungs-Mail an den Kunden (Hintergrund)
      void supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "booking-confirmation",
          recipientEmail: email,
          idempotencyKey: `vorschau2-booking-customer-${email}-${bookingDate}-${bookingTime}-${contactMethod}`,
          templateData: {
            firstName,
            bookingDate: dateLabel,
            bookingTime,
            contactMethod,
          },
        },
      }).catch(() => {});

      setBookingConfirmed(true);
      toast.success(`Termin gebucht: ${dateLabel} um ${bookingTime} (${methodLabel})`);
    } catch (error) {
      console.error("Booking konnte nicht gespeichert werden", error);
      toast.error("Der Termin konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Booking bestätigt → Thank-You mit Ablauf-Erklärung
  if (bookingConfirmed) {
    const dateLabel = dates.find((d) => d.iso === bookingDate)?.label ?? bookingDate;
    const methodLabel = contactMethod === "online" ? "Online-Meeting" : "Telefonat";
    return (
      <div ref={screenRef} className="text-center py-8 px-2 sm:px-4 scroll-mt-20">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-3">
          {isWaitlist
            ? `Danke ${firstName}! Dein Wunschtermin ist auf der ${nextMonthLabel}-Warteliste.`
            : `Danke ${firstName}! Dein Termin steht – Platz vorgemerkt.`}
        </h3>
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2 text-sm font-semibold mb-6">
          <CalendarIcon className="w-4 h-4" />
          {dateLabel} · {bookingTime} Uhr
          <span className="opacity-60">·</span>
          {contactMethod === "online" ? <Video className="w-4 h-4" /> : <PhoneCall className="w-4 h-4" />}
          {methodLabel}
        </div>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Eine Bestätigung mit allen Details kommt gleich an <strong>{email}</strong>.{" "}
          {isWaitlist
            ? `Sobald die Plätze für ${nextMonthLabel} freigeschaltet werden, melden wir uns zuerst bei dir, um den Termin zu bestätigen.`
            : "Dein Platz ist für dich vorgemerkt – nach unserem kurzen Gespräch ist er fix deiner."}
        </p>
        <div className="bg-secondary/40 border border-border rounded-2xl p-5 sm:p-6 text-left max-w-lg mx-auto">
          <p className="font-bold mb-4 text-center">So geht's weiter:</p>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">1</span>
              <span><strong>Kurzes Gespräch (5–10 Min.)</strong> – telefonisch oder per Online-Meeting. Ich stelle dir ein paar Fragen, damit deine Vorschau perfekt zu deinem Betrieb passt.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">2</span>
              <span><strong>Ich baue deine Vorschau (kostenlos, 48h)</strong> – maßgeschneidert für deinen Betrieb.</span>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs">3</span>
              <span><strong>Wir schauen sie gemeinsam an</strong> – du entscheidest in Ruhe, ob du weitermachen willst. Ohne Druck, ohne Verpflichtung.</span>
            </li>
          </ol>
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          📧 Falls du keine E-Mail bekommst, schau bitte in deinen Spam-Ordner.
        </p>
      </div>
    );
  }

  // Booking-Modus: Datum + Uhrzeit auswählen
  if (bookingMode) {
    return (
      <div ref={screenRef} className="py-2 px-1 sm:px-2 scroll-mt-20">
        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CalendarIcon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Wann passt es dir am besten?
          </h3>
          <p className="text-sm text-muted-foreground">
            Wähle Datum & Uhrzeit – das Gespräch dauert nur 5–10 Minuten.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Datum auswählen</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dates.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setBookingDate(d.iso)}
                  className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                    bookingDate === d.iso
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {bookingDate && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium mb-2 block">Uhrzeit auswählen</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBookingTime(t)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                      bookingTime === t
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bookingDate && bookingTime && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium mb-2 block">
                Wie möchtest du das Gespräch führen?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setContactMethod("phone")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    contactMethod === "phone"
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <PhoneCall className="w-4 h-4" /> Telefonat
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod("online")}
                  className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    contactMethod === "online"
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <Video className="w-4 h-4" /> Online-Meeting
                </button>
              </div>
            </div>
          )}

          <Button
            type="button"
            size="lg"
            disabled={!bookingDate || !bookingTime || !contactMethod || bookingSubmitting}
            onClick={confirmBooking}
            className="w-full"
          >
            {bookingSubmitting ? "Wird gebucht..." : (
              <>Termin verbindlich sichern <ArrowRight className="ml-2 w-4 h-4" /></>
            )}
          </Button>

          <button
            type="button"
            onClick={() => setBookingMode(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1 underline-offset-4 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  // Standard-Erfolgs-Screen mit beiden Optionen
  return (
    <div ref={screenRef} className="py-6 px-2 sm:px-4 scroll-mt-20">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-5 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">
          {isWaitlist
            ? `Danke ${firstName}! Du stehst auf der ${nextMonthLabel}-Warteliste. 🙌`
            : `Danke ${firstName}! Deine Anfrage ist da. 🙌`}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {isWaitlist ? (
            <>Sobald die Plätze für <strong>{nextMonthLabel}</strong> freigeschaltet werden, melden wir uns zuerst bei dir. Eine Bestätigung kommt an <strong>{email}</strong>.</>
          ) : (
            <>Wir melden uns kurz telefonisch, um zu schauen, ob es passt – dann sichern wir deinen Platz. Eine Bestätigung kommt an <strong>{email}</strong>.</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: Was passiert jetzt */}
        <div className="rounded-2xl border-2 border-border bg-card p-5 sm:p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-base sm:text-lg">Was jetzt passiert</h4>
          </div>
          <ol className="space-y-2.5 text-sm text-muted-foreground mb-4 flex-1">
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">1.</span>
              <span>Ich melde mich <strong className="text-foreground">am nächsten Werktag</strong> bei dir.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">2.</span>
              <span>Wir führen ein <strong className="text-foreground">5–10 Min. Telefonat</strong>, in dem ich kurz ein paar Fragen stelle, damit deine Vorschau zu 100 % zu deinem Betrieb passt.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">3.</span>
              <span>Innerhalb von <strong className="text-foreground">48 Stunden</strong> bekommst du deine fertige Vorschau – kostenlos.</span>
            </li>
          </ol>
          <div className="bg-secondary/40 rounded-lg px-3 py-3 mt-auto space-y-2">
            <p className="text-xs font-semibold text-foreground">
              Wie sollen wir uns melden?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setContactMethod("phone")}
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  contactMethod === "phone"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <PhoneCall className="w-3 h-3" /> Telefonat
              </button>
              <button
                type="button"
                onClick={() => setContactMethod("online")}
                className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  contactMethod === "online"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <Video className="w-3 h-3" /> Online-Meeting
              </button>
            </div>
            {contactMethod && (
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3 h-3" /> Notiert – wir melden uns wie gewünscht.
              </p>
            )}
          </div>
        </div>

        {/* Option 2: Termin direkt buchen */}
        <div className="rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 to-accent/5 p-5 sm:p-6 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap">
            ⚡ Schneller geht's nicht
          </div>
          <div className="flex items-center gap-3 mb-3 mt-2">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-base sm:text-lg">Lieber direkt Termin buchen?</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            Wähle direkt Datum und Uhrzeit für dein 5–10 Min. Gespräch – telefonisch oder per Online-Meeting. Du sparst dir das Hin und Her.
          </p>
          <Button
            type="button"
            size="lg"
            onClick={() => setBookingMode(true)}
            className="w-full shadow-md"
          >
            <CalendarIcon className="mr-2 w-4 h-4" />
            Termin jetzt auswählen
          </Button>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><PhoneCall className="w-3 h-3" /> Telefon</span>
            <span className="inline-flex items-center gap-1"><Video className="w-3 h-3" /> oder Online</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6 flex items-center justify-center gap-1.5">
        <MessageCircle className="w-3.5 h-3.5" />
        Schau auch in deinen Spam-Ordner – manchmal landet die Bestätigung dort.
      </p>
    </div>
  );
};

type MultiStepFormProps = {
  isWaitlist: boolean;
  nextMonthLabel: string;
};

const MultiStepForm = ({ isWaitlist, nextMonthLabel }: MultiStepFormProps) => {
  const [state, setState] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingMode, setBookingMode] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  // Smoothly scroll the form card to a comfortable position below the sticky
  // header whenever the active step or sub-screen changes (mobile especially
  // landed too far down because the card grew/shrank while the scroll
  // position stayed put).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const headerOffset = 80; // sticky header (h-16) + small breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [state.step, done, bookingMode, bookingConfirmed]);

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
    if (!state.firstName || !state.company || !state.phone) {
      toast.error("Bitte fülle die Pflichtfelder aus.");
      return;
    }
    setSubmitting(true);
    try {
      const newLeadId = crypto.randomUUID();
      // V2 erfasst keine E-Mail mehr – wir generieren einen Platzhalter,
      // damit das DB-Schema (email NOT NULL + Format-Check) erfüllt bleibt.
      const submissionEmail =
        state.email && state.email.includes("@")
          ? state.email
          : `lead-${newLeadId}@vorschau-v2.local`;
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .insert({
          id: newLeadId,
          first_name: state.firstName,
          email: submissionEmail,
          phone: state.phone.trim(),
          company_name: state.company || "",
          trade: state.trade || null,
          trade_other: state.tradeOther || null,
          has_website: state.hasWebsite || null,
          goals: state.goals.length > 0 ? state.goals : null,
          urgency: state.urgency || null,
          current_website: state.currentWebsite || null,
          notes: state.notes || null,
          is_waitlist: isWaitlist,
        });

      if (leadError) throw leadError;
      setLeadId(newLeadId);

      // Webhook + E-Mail-Benachrichtigung im Hintergrund (UI nicht blockieren)
      void fetch("https://webhook.site/placeholder", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).catch(() => {});

      void supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "lead-notification",
          idempotencyKey: `vorschau2-${newLeadId}`,
          templateData: {
            source: "Kostenlose Vorschau V2 (Handwerker)",
            firstName: state.firstName,
            companyName: state.company,
            email: submissionEmail,
            phone: state.phone,
            trade: state.trade === "Sonstiges" && state.tradeOther
              ? `Sonstiges: ${state.tradeOther}`
              : state.trade,
            hasWebsite: state.hasWebsite,
            goals: state.goals.join(", "),
            urgency: state.urgency,
            website: state.currentWebsite || "Nicht angegeben",
            message: state.notes || "",
            submittedAt: new Date().toLocaleString("de-DE"),
          },
        },
      }).catch(() => {});

      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  // Wrapper für die SuccessScreen: speichert den Wert sowohl in den Form-State (Persistenz)
  // als auch direkt im Lead-Datensatz, sobald gewählt.
  const updateContactMethod = useCallback(
    (method: "phone" | "online") => {
      setState((s) => ({ ...s, contactMethod: method }));
      // Auch ohne verbindliche Buchung den gewünschten Kontaktweg im Lead speichern,
      // damit er im Admin-Bereich sichtbar ist (Fire-and-forget, blockiert UI nicht).
      if (leadId) {
        void supabase
          .rpc("set_lead_contact_method", {
            p_lead_id: leadId,
            p_contact_method: method,
          })
          .then(({ error }) => {
            if (error) {
              console.warn("Kontaktweg konnte nicht gespeichert werden", error);
            }
          });
      }
    },
    [leadId],
  );

  const setBookingDate = useCallback(
    (v: string) => setState((s) => ({ ...s, bookingDate: v })),
    [],
  );
  const setBookingTime = useCallback(
    (v: string) => setState((s) => ({ ...s, bookingTime: v })),
    [],
  );

  if (done) {
    return (
      <SuccessScreen
        firstName={state.firstName}
        email={state.email}
        company={state.company}
        phone={state.phone}
        trade={state.trade}
        tradeOther={state.tradeOther}
        hasWebsite={state.hasWebsite}
        goals={state.goals}
        urgency={state.urgency}
        currentWebsite={state.currentWebsite}
        notes={state.notes}
        leadId={leadId}
        bookingMode={bookingMode}
        setBookingMode={setBookingMode}
        bookingDate={state.bookingDate}
        setBookingDate={setBookingDate}
        bookingTime={state.bookingTime}
        setBookingTime={setBookingTime}
        contactMethod={state.contactMethod}
        setContactMethod={updateContactMethod}
        bookingConfirmed={bookingConfirmed}
        setBookingConfirmed={setBookingConfirmed}
        isWaitlist={isWaitlist}
        nextMonthLabel={nextMonthLabel}
      />
    );
  }

  const progressPct = (state.step / 5) * 100;

  return (
    <div
      ref={cardRef}
      className="bg-card rounded-2xl shadow-xl border border-border p-5 sm:p-8 scroll-mt-20"
    >
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
                  if (opt.value !== "Sonstiges") {
                    setTimeout(next, 200);
                  }
                }}
              />
            ))}
          </div>
          {state.trade === "Sonstiges" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium block">
                Beschreibe kurz, was du beruflich machst *
              </label>
              <Input
                value={state.tradeOther}
                onChange={(e) => update({ tradeOther: e.target.value })}
                placeholder="z. B. Bodenleger, Fliesenleger, Fensterbauer ..."
                maxLength={120}
                autoFocus
              />
              <Button
                type="button"
                size="lg"
                disabled={state.tradeOther.trim().length < 2}
                onClick={next}
                className="w-full sm:w-auto"
              >
                Weiter <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          )}
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
            Fast geschafft! Wie kann ich dich erreichen?
          </h3>
          <div className="grid grid-cols-1 gap-4">
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
              <label className="text-sm font-medium mb-1.5 block">
                Telefonnummer *
              </label>
              <Input
                required
                type="tel"
                minLength={3}
                value={state.phone}
                onChange={(e) => update({ phone: e.target.value })}
                placeholder="+49 ..."
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

const KostenloseVorschauV2 = () => {
  const { settings, demos: dbDemos, faqs: dbFaqs, portfolio, testimonials: dbTestimonials } = useVorschauSettings();
  const totalSlots = settings?.total_slots ?? 5;
  const takenSlots = Math.min(settings?.taken_slots ?? 3, totalSlots);
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
  // Fallbacks: wenn DB-Listen leer, nutze hardcoded Defaults
  // V2: feste Handwerker-Demos & Testimonials, unabhängig von DB-Inhalten
  const activeDemos = demos.map(d => ({ ...d, image_url: "" }));
  const activeTestimonials = testimonials.map(t => ({
    quote: t.quote,
    name: t.name,
    role: t.role,
    result: t.result,
  }));
  // Identische FAQs wie auf /preise – DB-FAQs hier bewusst nicht überschreiben lassen.
  const activeFaqs = faqs;
  const heroBadge = isWaitlist
    ? `Alle Plätze im ${monatName} vergeben – sichere dir jetzt einen Platz für ${nextMonthLabel}`
    : (settings?.hero_badge_text ?? "Nur noch {remaining} von {total} Plätzen im {month} verfügbar")
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
              Ich zeige dir in 48 Stunden, wie dein Betrieb online wirkt – speziell für Handwerksbetriebe. Kostenlos. Unverbindlich. Ohne Risiko.
            </p>

            {/* Countdown */}
            {(settings?.show_countdown ?? true) && (
              <div className="mb-8">
                <div className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {settings?.countdown_label ?? "Aktion endet in:"}
                </div>
                <Countdown mode="end_of_month" />
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
              {isWaitlist
                ? `Jetzt für ${nextMonthLabel} vormerken lassen`
                : (settings?.hero_cta_label ?? "Jetzt kostenlose Vorschau sichern")}
              {" "}<ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="mt-3 text-xs text-muted-foreground text-center">
              Bereits überzeugt?{" "}
              <Link to="/preise" className="underline hover:text-foreground">
                Preise direkt ansehen →
              </Link>
            </p>

            <p className="mt-3 text-xs sm:text-sm text-muted-foreground text-center max-w-md mx-auto">
              Nach deiner Vorschau: Fertige Website ab 49€/Monat – kein Vertrag, monatlich kündbar.
            </p>

            {/* Social Proof */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium shadow-sm">
              <Award className="w-4 h-4 text-primary" />
              <span>
                <strong className="text-foreground">Bereits 12 Handwerksbetriebe</strong>{" "}
                <span className="text-muted-foreground">vertrauen uns</span>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              {isWaitlist ? `Jetzt für ${nextMonthLabel} vormerken lassen` : "Jetzt deinen Platz sichern"}
            </h2>
            {isWaitlist ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 px-4 py-1.5 text-sm font-semibold">
                <CalendarClock className="w-4 h-4" />
                {monatName} ist ausgebucht – Warteliste für {nextMonthLabel}
              </div>
            ) : (
              (settings?.show_slots ?? true) && <SlotPill total={totalSlots} taken={takenSlots} />
            )}
          </div>
          <div className="max-w-2xl mx-auto">
            <MultiStepForm isWaitlist={isWaitlist} nextMonthLabel={nextMonthLabel} />
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
                <AccordionContent className="text-muted-foreground text-base whitespace-pre-line">
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
                <Countdown inverse mode="end_of_month" />
              </div>
            )}
            {(settings?.show_slots ?? true) && (
              <div className="mb-6 flex justify-center">
                <SlotPill inverse total={totalSlots} taken={takenSlots} />
              </div>
            )}
            <h2 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
              {isWaitlist
                ? `${monatName} ist ausgebucht – sichere dir ${nextMonthLabel}.`
                : (settings?.final_cta_headline ?? "Warte nicht, bis es dein Mitbewerber tut.")}
            </h2>
            <p className="text-base sm:text-xl text-primary-foreground/85 mb-8">
              {isWaitlist
                ? `Lass dich auf die Warteliste setzen – sobald die Plätze für ${nextMonthLabel} freigeschaltet werden, melden wir uns zuerst bei dir.`
                : (settings?.final_cta_subtext ?? "Deine kostenlose Webseiten-Vorschau wartet.")}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={scrollToForm}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 shadow-xl"
            >
              {isWaitlist
                ? `Auf die ${nextMonthLabel}-Warteliste`
                : (settings?.final_cta_button ?? "Jetzt letzten Platz sichern")}
              {" "}<ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default KostenloseVorschauV2;
