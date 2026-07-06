import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFunnel } from "../state";
import {
  addBusinessDays,
  currentMonthKey,
  formatDateLong,
  isValidDePhone,
  isValidEmail,
  STIL_LABEL,
  TIME_SLOTS,
  toDateKey,
  whatsappLink,
  ZIEL_LABEL,
} from "../utils";

const WD_SHORT = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export default function Step4Termin() {
  const { state, patch, back, next } = useFunnel();
  const [submitting, setSubmitting] = useState(false);

  const days = useMemo(() => {
    const earliest = addBusinessDays(new Date(), 2);
    const out: { key: string; label: string; dow: number; disabled: boolean }[] = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      const weekend = dow === 0 || dow === 6;
      const beforeEarliest = d < new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate());
      const afterMax = i > 14;
      out.push({
        key: toDateKey(d),
        label: `${WD_SHORT[dow]} ${d.getDate()}.${d.getMonth() + 1}.`,
        dow,
        disabled: weekend || beforeEarliest || afterMax,
      });
    }
    return out;
  }, []);

  const contactValid =
    state.name.trim().length >= 2 &&
    isValidDePhone(state.telefon) &&
    isValidEmail(state.email) &&
    state.datenschutz &&
    !!state.kontaktart &&
    !!state.terminDatum &&
    !!state.terminUhrzeit;

  async function handleSubmit() {
    if (submitting || !contactValid) return;
    setSubmitting(true);
    try {
      const { error: insertErr } = await supabase.from("funnel_leads").insert({
        id: state.funnelUuid,
        firmenname: state.firmenname.trim(),
        ort: state.ort.trim(),
        gewerk: state.gewerk.trim(),
        leistungen: state.leistungen.trim(),
        hat_website: state.hatWebsite,
        website_url: state.websiteUrl.trim() || null,
        stil: state.stil,
        ziel: state.ziel,
        kein_logo: state.keinLogo,
        logo_url: state.logoUrl,
        foto_urls: state.fotos.map((f) => f.url),
        termin_datum: state.terminDatum,
        termin_uhrzeit: state.terminUhrzeit,
        kontaktart: state.kontaktart,
        name: state.name.trim(),
        telefon: state.telefon.trim(),
        email: state.email.trim(),
        datenschutz_akzeptiert: state.datenschutz,
        source_cta: "vorschau-funnel",
        source_page: "/vorschau-start",
        month_key: currentMonthKey(),
      });
      if (insertErr) throw insertErr;

      // Slot reservieren
      await supabase.rpc("increment_taken_slot", { p_page_key: "vorschau-funnel" });

      // Telegram notify — nutzt bestehende notify-lead Function
      const msg = [
        `🎯 NEUER VORSCHAU-LEAD`,
        `🏢 ${state.firmenname} (${state.gewerk}), ${state.ort}`,
        `📅 Termin: ${state.terminDatum} ${state.terminUhrzeit} · ${state.kontaktart === "phone" ? "Telefon" : "Videocall"}`,
        `🎨 Stil: ${STIL_LABEL[state.stil!] ?? state.stil} · Ziel: ${ZIEL_LABEL[state.ziel!] ?? state.ziel}`,
        `📎 Logo: ${state.keinLogo ? "keins" : state.logoUrl || "keins"} · Fotos: ${state.fotos.length}`,
        state.fotos.length ? state.fotos.map((f) => `   – ${f.url}`).join("\n") : "",
        state.hatWebsite && state.websiteUrl ? `🌐 Bestehende Website: ${state.websiteUrl}` : "",
        `📞 ${state.telefon} · ${state.email}`,
        `💡 Leistungen: ${state.leistungen}`,
      ]
        .filter(Boolean)
        .join("\n");

      await supabase.functions.invoke("notify-lead", {
        body: {
          name: state.name.trim(),
          phone: state.telefon.trim(),
          email: state.email.trim(),
          branche: state.gewerk.trim(),
          ort: state.ort.trim(),
          message: msg,
          source_page: "/vorschau-start",
          source_cta: "vorschau-funnel",
        },
      });

      next();
    } catch (e) {
      console.error("funnel submit failed", e);
      toast.error("Da ist was schiefgelaufen — versuch's nochmal.", {
        action: {
          label: "WhatsApp",
          onClick: () => window.open(whatsappLink(), "_blank"),
        },
      });
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 pt-6 pb-40 md:pb-12"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-3">
        Wähle deinen Termin zur Vorschau-Besprechung
      </h2>
      <p className="text-muted-foreground mb-8">
        In ca. 15–20 Minuten zeigen wir dir deine fertige Website-Vorschau — telefonisch oder per
        Videocall.
      </p>

      <div className="mb-6">
        <Label className="mb-3 block">Tag wählen (Mo–Fr, ab in 2 Werktagen)</Label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {days.map((d) => (
            <button
              key={d.key}
              type="button"
              disabled={d.disabled}
              onClick={() => patch({ terminDatum: d.key, terminUhrzeit: null })}
              className={`min-h-12 rounded-xl border px-2 py-2 text-sm font-medium transition-colors ${
                d.disabled
                  ? "opacity-30 cursor-not-allowed"
                  : state.terminDatum === d.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:border-primary hover:bg-primary/5"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {state.terminDatum && (
        <div className="mb-6">
          <Label className="mb-3 block">Uhrzeit</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => patch({ terminUhrzeit: t })}
                className={`min-h-12 rounded-xl border px-2 py-2 text-sm font-medium transition-colors ${
                  state.terminUhrzeit === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:border-primary hover:bg-primary/5"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <Label className="mb-3 block">Wie sollen wir uns melden?</Label>
        <RadioGroup
          value={state.kontaktart ?? ""}
          onValueChange={(v) => patch({ kontaktart: v as "phone" | "video" })}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { v: "phone", l: "📞 Telefon" },
            { v: "video", l: "🎥 Videocall (WhatsApp/Meet)" },
          ].map((o) => (
            <label
              key={o.v}
              className={`flex items-center gap-3 rounded-xl border p-4 min-h-14 cursor-pointer hover:bg-muted/50 ${
                state.kontaktart === o.v ? "border-primary bg-primary/5" : ""
              }`}
            >
              <RadioGroupItem value={o.v} />
              <span className="font-medium text-sm">{o.l}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="name">Dein Name *</Label>
          <Input
            id="name"
            value={state.name}
            onChange={(e) => patch({ name: e.target.value })}
            placeholder="Vor- und Nachname"
            className="mt-1 h-12"
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="tel">Handynummer *</Label>
          <Input
            id="tel"
            type="tel"
            inputMode="tel"
            value={state.telefon}
            onChange={(e) => patch({ telefon: e.target.value })}
            placeholder="0170 1234567"
            className="mt-1 h-12"
            autoComplete="tel"
          />
        </div>
        <div>
          <Label htmlFor="mail">E-Mail *</Label>
          <Input
            id="mail"
            type="email"
            inputMode="email"
            value={state.email}
            onChange={(e) => patch({ email: e.target.value })}
            placeholder="du@firma.de"
            className="mt-1 h-12"
            autoComplete="email"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm mb-6">
        <Checkbox
          checked={state.datenschutz}
          onCheckedChange={(v) => patch({ datenschutz: v === true })}
          className="mt-0.5"
        />
        <span className="text-muted-foreground">
          Ich stimme der Verarbeitung meiner Daten zur Erstellung der Vorschau zu.{" "}
          <Link to="/datenschutz" target="_blank" className="text-primary underline underline-offset-4">
            Datenschutz
          </Link>
        </span>
      </label>

      {state.terminDatum && state.terminUhrzeit && (
        <div className="rounded-xl bg-muted/50 p-3 text-sm mb-6">
          <strong>Termin-Vorschau:</strong> {formatDateLong(state.terminDatum)}, {state.terminUhrzeit} Uhr
        </div>
      )}

      <div className="md:static fixed bottom-0 left-0 right-0 p-4 md:p-0 bg-background/95 md:bg-transparent backdrop-blur md:backdrop-blur-none border-t md:border-0 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={back} disabled={submitting}>
          ← Zurück
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!contactValid || submitting}
          className="min-h-12 flex-1 md:flex-none font-semibold"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Wird gesendet …
            </>
          ) : (
            "Termin verbindlich sichern ✓"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
