import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { CheckCircle2, ClipboardList, Sparkles, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { submitLead } from "@/lib/submitLead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

const WHATSAPP_NUMBER_DISPLAY = "+49 6131 3076500";
const WHATSAPP_URL = "https://wa.me/4961313076500";
const DEFAULT_SLOTS = 5;

const phoneRegex = /^(\+?\d[\d\s\-\/()]{5,25})$/;

const schema = z
  .object({
    name: z.string().trim().min(2, "Bitte deinen Namen angeben").max(120),
    firmenname: z.string().trim().min(2, "Bitte Firmennamen angeben").max(160),
    gewerk: z.string().trim().min(2, "Bitte Gewerk/Branche angeben").max(120),
    ort: z.string().trim().min(2, "Bitte Ort oder PLZ angeben").max(120),
    hat_website: z.enum(["ja", "nein"], { required_error: "Bitte auswählen" }),
    website_url: z.string().trim().max(300).optional().or(z.literal("")),
    warum: z.string().trim().min(30, "Mindestens 30 Zeichen").max(2000),
    timeline: z.string().min(1, "Bitte auswählen"),
    budget: z.string().min(1, "Bitte auswählen"),
    telefon: z
      .string()
      .trim()
      .regex(phoneRegex, "Bitte gültige Telefonnummer angeben"),
    email: z.string().trim().email("Bitte gültige E-Mail angeben").max(200),
    datenschutz: z.literal(true, {
      errorMap: () => ({ message: "Bitte Datenschutz akzeptieren" }),
    }),
  })
  .refine(
    (d) =>
      d.hat_website !== "ja" ||
      !d.website_url ||
      d.website_url.length === 0 ||
      /^([\w-]+\.)+[a-z]{2,}([\/?#].*)?$/i.test(d.website_url) ||
      /^https?:\/\//i.test(d.website_url),
    { path: ["website_url"], message: "Bitte gültige URL angeben" },
  );

type FormState = {
  name: string;
  firmenname: string;
  gewerk: string;
  ort: string;
  hat_website: "ja" | "nein" | "";
  website_url: string;
  warum: string;
  timeline: string;
  budget: string;
  telefon: string;
  email: string;
  datenschutz: boolean;
  company: string; // honeypot
};

const initialForm: FormState = {
  name: "",
  firmenname: "",
  gewerk: "",
  ort: "",
  hat_website: "",
  website_url: "",
  warum: "",
  timeline: "",
  budget: "",
  telefon: "",
  email: "",
  datenschutz: false,
  company: "",
};

const MONTHS_DE = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

const KostenloseVorschauBewerbung = () => {
  const [totalSlots, setTotalSlots] = useState<number>(DEFAULT_SLOTS);
  const [belegt, setBelegt] = useState<number>(0);
  const [slotsLoaded, setSlotsLoaded] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | { typ: "bewerbung" | "warteliste"; vorname: string }>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const monatLabel = `${MONTHS_DE[now.getMonth()]} ${now.getFullYear()}`;

  const plaetzeFrei = Math.max(0, totalSlots - belegt);
  const isWarteliste = slotsLoaded && plaetzeFrei === 0;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const [settingsRes, countRes] = await Promise.all([
          supabase
            .from("vorschau_settings")
            .select("total_slots")
            .eq("page_key", "global")
            .maybeSingle(),
          supabase
            .from("vorschau_bewerbungen")
            .select("id", { count: "exact", head: true })
            .eq("status", "freigegeben")
            .gte("created_at", startOfMonth),
        ]);
        if (cancelled) return;
        if (settingsRes.data?.total_slots) setTotalSlots(settingsRes.data.total_slots);
        setBelegt(countRes.count ?? 0);
      } catch (e) {
        console.error("slot load error", e);
      } finally {
        if (!cancelled) setSlotsLoaded(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (form.company) return; // honeypot

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString();
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      toast.error("Bitte prüf die markierten Felder");
      return;
    }

    setSubmitting(true);
    const typ: "bewerbung" | "warteliste" = isWarteliste ? "warteliste" : "bewerbung";
    const status = isWarteliste ? "warteliste" : "neu";

    const insertPayload = {
      name: form.name.trim(),
      firmenname: form.firmenname.trim(),
      gewerk: form.gewerk.trim(),
      ort: form.ort.trim(),
      hat_website: form.hat_website === "ja",
      website_url: form.hat_website === "ja" && form.website_url.trim() ? form.website_url.trim() : null,
      warum: form.warum.trim(),
      timeline: form.timeline,
      budget: form.budget,
      telefon: form.telefon.trim(),
      email: form.email.trim().toLowerCase(),
      status,
      typ,
      source_cta: "kostenlose-vorschau",
    };

    const { error: insertError } = await supabase
      .from("vorschau_bewerbungen")
      .insert(insertPayload);

    if (insertError) {
      console.error("bewerbung insert error", insertError);
      toast.error("Bewerbung konnte nicht gespeichert werden. Bitte kurz später erneut versuchen.");
      setSubmitting(false);
      return;
    }

    // Telegram-Benachrichtigung (fire-and-forget, blockiert Success nicht)
    const websiteInfo = insertPayload.hat_website
      ? insertPayload.website_url ?? "ja (ohne URL)"
      : "keine";
    const message =
      typ === "bewerbung"
        ? `🆕 NEUE BEWERBUNG — /kostenlose-vorschau\n👤 ${insertPayload.name} · ${insertPayload.firmenname} (${insertPayload.gewerk}), ${insertPayload.ort}\n🌐 Website: ${websiteInfo}\n💬 Warum: ${insertPayload.warum}\n⏱️ Timeline: ${insertPayload.timeline} · 💰 Budget: ${insertPayload.budget}\n📞 ${insertPayload.telefon} · ${insertPayload.email}\n\n➡️ Prüfen & entscheiden: freigeben oder ablehnen`
        : `⏳ WARTELISTE — /kostenlose-vorschau\n👤 ${insertPayload.name} · ${insertPayload.firmenname}, ${insertPayload.ort}\n📞 ${insertPayload.telefon} · ${insertPayload.email}`;

    submitLead({
      name: insertPayload.name,
      phone: insertPayload.telefon,
      email: insertPayload.email,
      branche: insertPayload.gewerk,
      ort: insertPayload.ort,
      message,
      source_cta: `kostenlose-vorschau-${typ}`,
    }).catch((err) => console.warn("notify-lead skipped", err));

    const vorname = insertPayload.name.split(" ")[0] || insertPayload.name;
    setSuccess({ typ, vorname });
    setSubmitting(false);
  };

  const chipSlot = isWarteliste
    ? "Alle Plätze vergeben"
    : `Noch ${plaetzeFrei} von ${totalSlots} Plätzen frei`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-subtle-bg">
        <div className="mx-auto max-w-4xl px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-foreground">
            Kostenlose Website-Vorschau —{" "}
            <span className="text-primary">aber nicht für jeden.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Wir bauen dir eine komplette Website-Vorschau, bevor du einen Cent zahlst. Wir vergeben nur{" "}
            <strong className="text-foreground">{totalSlots}</strong> Plätze pro Monat — weil wir jede Vorschau selbst bauen, nicht per Vorlage.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                isWarteliste
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isWarteliste ? "bg-destructive" : "bg-emerald-500"
                }`}
              />
              {chipSlot}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              📅 Monat: {monatLabel}
            </span>
          </motion.div>

          <div className="mt-10">
            <Button size="lg" onClick={scrollToForm} className="min-h-12 px-8 text-base">
              Jetzt bewerben →
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">Bewerbung dauert 90 Sekunden.</p>
          </div>
        </div>
      </section>

      {/* WIE ES ABLÄUFT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-center mb-12">
            So läuft's ab:
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ClipboardList,
                num: "1",
                title: "Kurze Bewerbung",
                text: "Du sagst uns, wer du bist und was du machst. Dauert 90 Sekunden.",
              },
              {
                icon: CheckCircle2,
                num: "2",
                title: "Wir prüfen",
                text: "Innerhalb von 24 Stunden schauen wir, ob's passt. Wenn ja, schicken wir dir einen Link zum Onboarding.",
              },
              {
                icon: Sparkles,
                num: "3",
                title: "Onboarding + Vorschau",
                text: "Du gibst uns dein Logo & Infos. Ein paar Tage später zeigen wir dir deine fertige Website live in einem 15-Minuten-Call.",
              },
            ].map((s) => (
              <div
                key={s.num}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {s.num}
                  </div>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WARUM NICHT JEDER */}
      <section className="py-20 sm:py-24 bg-muted/40">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
            Warum wir aussortieren
          </h2>
          <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
            Wir bauen jede Vorschau selbst — kein Baukasten, kein Copy-Paste. Das kostet uns pro Kunde mehrere Stunden. Deshalb sagen wir manchmal ehrlich Nein — zum Beispiel wenn:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              "Wir merken, dass deine Branche nicht zu unserer Expertise passt",
              "Grundlegende Infos zu deinem Betrieb fehlen oder nicht auffindbar sind",
              "Die Erwartung nicht zur Realität passt (z. B. „Website + Online-Shop + App für 500 €“)",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-foreground/90">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground italic">
            Kein Drama, keine Kosten — wir sagen dir dann direkt, was besser zu dir passt.
          </p>
        </div>
      </section>

      {/* BEWERBUNGSFORMULAR */}
      <section ref={formRef} className="py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Deine Bewerbung</h2>
          <p className="text-muted-foreground mb-8">
            Kein Login, keine Uploads — nur ein paar Fragen, damit wir dich einordnen können.
          </p>

          {success ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="font-heading text-2xl font-semibold mb-3">
                Danke, {success.vorname}!
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {success.typ === "bewerbung"
                  ? "Wir prüfen deine Bewerbung und melden uns innerhalb von 24 Stunden per WhatsApp oder E-Mail. Wenn's passt, bekommst du den Link zum Onboarding."
                  : "Du stehst auf der Warteliste. Sobald im nächsten Monat wieder Plätze frei sind, melden wir uns."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {isWarteliste && (
                <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-foreground/80">
                  Diesen Monat sind alle Plätze vergeben. Wir nehmen dich auf die Warteliste für nächsten Monat.
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={form.company}
                onChange={(e) => setField("company", e.target.value)}
                style={{
                  position: "absolute", left: "-9999px",
                  width: 1, height: 1, opacity: 0, pointerEvents: "none",
                }}
              />

              <FieldRow label="Name" error={errors.name} htmlFor="name" required>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  autoComplete="name"
                />
              </FieldRow>

              <FieldRow label="Firmenname" error={errors.firmenname} htmlFor="firmenname" required>
                <Input
                  id="firmenname"
                  value={form.firmenname}
                  onChange={(e) => setField("firmenname", e.target.value)}
                  autoComplete="organization"
                />
              </FieldRow>

              <FieldRow label="Gewerk / Branche" error={errors.gewerk} htmlFor="gewerk" required>
                <Input
                  id="gewerk"
                  value={form.gewerk}
                  onChange={(e) => setField("gewerk", e.target.value)}
                  placeholder="z. B. Malerbetrieb, KFZ-Werkstatt, Physiopraxis"
                />
              </FieldRow>

              <FieldRow label="Ort / PLZ" error={errors.ort} htmlFor="ort" required>
                <Input
                  id="ort"
                  value={form.ort}
                  onChange={(e) => setField("ort", e.target.value)}
                  autoComplete="address-level2"
                />
              </FieldRow>

              <FieldRow label="Bestehende Website?" error={errors.hat_website} required>
                <RadioGroup
                  value={form.hat_website}
                  onValueChange={(v) => setField("hat_website", v as "ja" | "nein")}
                  className="flex gap-6"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="ja" id="hw-ja" /> Ja
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="nein" id="hw-nein" /> Nein
                  </label>
                </RadioGroup>
                {form.hat_website === "ja" && (
                  <div className="mt-3">
                    <Input
                      value={form.website_url}
                      onChange={(e) => setField("website_url", e.target.value)}
                      placeholder="URL (optional)"
                      inputMode="url"
                    />
                    {errors.website_url && (
                      <p className="text-sm text-destructive mt-1">{errors.website_url}</p>
                    )}
                  </div>
                )}
              </FieldRow>

              <FieldRow label="Warum willst du eine neue Website?" error={errors.warum} htmlFor="warum" required>
                <Textarea
                  id="warum"
                  rows={4}
                  value={form.warum}
                  onChange={(e) => setField("warum", e.target.value)}
                  placeholder="z. B. Aktuelle Seite sieht aus wie 2010, ich bekomme kaum Anfragen darüber, brauche mehr Aufträge"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.warum.trim().length}/30 Zeichen
                </p>
              </FieldRow>

              <FieldRow label="Wann willst du live gehen?" error={errors.timeline} required>
                <Select value={form.timeline} onValueChange={(v) => setField("timeline", v)}>
                  <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sofort">Sofort</SelectItem>
                    <SelectItem value="In 1–2 Monaten">In 1–2 Monaten</SelectItem>
                    <SelectItem value="In 3–6 Monaten">In 3–6 Monaten</SelectItem>
                    <SelectItem value="Weiß noch nicht">Weiß noch nicht</SelectItem>
                  </SelectContent>
                </Select>
              </FieldRow>

              <FieldRow label="Budget-Rahmen" error={errors.budget} required>
                <Select value={form.budget} onValueChange={(v) => setField("budget", v)}>
                  <SelectTrigger><SelectValue placeholder="Bitte auswählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unter 500 €">Unter 500 €</SelectItem>
                    <SelectItem value="500–1500 €">500–1500 €</SelectItem>
                    <SelectItem value="1500–3000 €">1500–3000 €</SelectItem>
                    <SelectItem value="Über 3000 €">Über 3000 €</SelectItem>
                    <SelectItem value="Weiß ich nicht">Weiß ich nicht</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Wir sagen dir ehrlich, was in welchem Rahmen realistisch ist.
                </p>
              </FieldRow>

              <FieldRow label="Handynummer" error={errors.telefon} htmlFor="telefon" required>
                <Input
                  id="telefon"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.telefon}
                  onChange={(e) => setField("telefon", e.target.value)}
                  placeholder="+49 …"
                />
              </FieldRow>

              <FieldRow label="E-Mail" error={errors.email} htmlFor="email" required>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                />
              </FieldRow>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="datenschutz"
                  checked={form.datenschutz}
                  onCheckedChange={(v) => setField("datenschutz", v === true)}
                  className="mt-1"
                />
                <Label htmlFor="datenschutz" className="text-sm leading-relaxed font-normal">
                  Ich habe die{" "}
                  <a href="/datenschutz" target="_blank" rel="noreferrer" className="underline text-primary">
                    Datenschutzerklärung
                  </a>{" "}
                  gelesen und bin mit der Verarbeitung meiner Daten einverstanden.
                </Label>
              </div>
              {errors.datenschutz && (
                <p className="text-sm text-destructive">{errors.datenschutz}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full min-h-12 text-base"
              >
                {submitting
                  ? "Wird gesendet…"
                  : isWarteliste
                    ? "Auf Warteliste eintragen"
                    : "Bewerbung absenden →"}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-24 bg-muted/40">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">Häufige Fragen</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {[
              {
                q: "Kostet die Vorschau wirklich nichts?",
                a: "Ja. Erst wenn du sie live schalten willst, wird's kostenpflichtig. Vorher kein Cent.",
              },
              {
                q: "Wie lange dauert die Prüfung?",
                a: "Max. 24 Stunden, meist schneller.",
              },
              {
                q: "Was passiert, wenn ihr Nein sagt?",
                a: "Wir schreiben dir ehrlich, warum, und empfehlen dir eine Alternative. Keine Kosten, kein Nachhaken.",
              },
              {
                q: "Ich habe schon eine Website — bringt das trotzdem was?",
                a: "Genau dann besonders. Wir bauen die Vorschau als Vergleich zu deiner aktuellen Seite.",
              },
              {
                q: "Was passiert nach der Bewerbung, wenn's passt?",
                a: "Du bekommst per Mail/WhatsApp einen Link zum Onboarding-Funnel (/vorschau-start). Da lädst du Logo & Fotos hoch, beantwortest 5 kurze Fragen und wählst deinen Vorschau-Termin.",
              },
            ].map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-card px-4"
              >
                <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Floating WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp: ${WHATSAPP_NUMBER_DISPLAY}`}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg hover:bg-[#1ebe5b] transition min-h-12"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
      </a>
    </main>
  );
};

const FieldRow = ({
  label,
  children,
  error,
  htmlFor,
  required,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  htmlFor?: string;
  required?: boolean;
}) => (
  <div>
    <Label htmlFor={htmlFor} className="mb-1.5 block">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
    {error && <p className="text-sm text-destructive mt-1">{error}</p>}
  </div>
);

export default KostenloseVorschauBewerbung;