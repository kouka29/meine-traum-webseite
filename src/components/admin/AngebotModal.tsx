import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Trash2, Shuffle, Copy, ExternalLink, Loader2, FileText, CheckCircle2,
  Upload, Sparkles,
} from "lucide-react";

interface AngebotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  lead: {
    first_name: string;
    email: string;
    trade?: string | null;
    trade_other?: string | null;
  };
  onCreated?: () => void;
}

interface Leistung { emoji: string; titel: string; beschreibung: string; }
interface Faq { frage: string; antwort: string; }
interface Option {
  id: string;
  emoji: string;
  titel: string;
  beschreibung: string;
  preis: string; // string in form, number on serialize
  preis_typ: "einmalig" | "monatlich";
  stripe_link: string;
}
interface Bundle {
  id: string;
  label: string;
  option_ids: string[]; // refs to Option.id
  gesamt_preis: string;
  stripe_link: string;
}

const BRAND = "#4F3FF0";
const ANGEBOT_BASE_URL = "https://meine-traum-webseite.de/angebot";

function encodeBase64Utf8(payload: unknown): string {
  const json = JSON.stringify(payload);
  // UTF-8 safe base64 encode
  return btoa(unescape(encodeURIComponent(json)));
}

function genPin(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

const emptyLeistung = (): Leistung => ({ emoji: "", titel: "", beschreibung: "" });
const emptyFaq = (): Faq => ({ frage: "", antwort: "" });
const genId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
const emptyOption = (): Option => ({
  id: genId(), emoji: "", titel: "", beschreibung: "",
  preis: "", preis_typ: "einmalig", stripe_link: "",
});
const emptyBundle = (): Bundle => ({
  id: genId(), label: "", option_ids: [], gesamt_preis: "", stripe_link: "",
});

export default function AngebotModal({ open, onOpenChange, password, lead, onCreated }: AngebotModalProps) {
  const branche = lead.trade === "Sonstiges" && lead.trade_other
    ? lead.trade_other
    : (lead.trade || "");

  const [nachricht, setNachricht] = useState("");
  const [pin, setPin] = useState(genPin());
  const [preis, setPreis] = useState("");
  const [normalpreis, setNormalpreis] = useState("");
  const [mieteMonatlich, setMieteMonatlich] = useState("");
  const [anzahlung, setAnzahlung] = useState("");
  const [wachstumspaketPreis, setWachstumspaketPreis] = useState("");
  const [wachstumspaketBeschreibung, setWachstumspaketBeschreibung] = useState("");
  const [gueltigkeit, setGueltigkeit] = useState<"7" | "14" | "30">("14");
  const [stripeLink, setStripeLink] = useState("");
  const [leistungen, setLeistungen] = useState<Leistung[]>([emptyLeistung(), emptyLeistung(), emptyLeistung()]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [optionen, setOptionen] = useState<Option[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<{ link: string; pin: string } | null>(null);

  useEffect(() => {
    if (open) {
      // Reset state on open
      setNachricht("");
      setPin(genPin());
      setPreis("");
      setNormalpreis("");
      setMieteMonatlich("");
      setAnzahlung("");
      setWachstumspaketPreis("");
      setWachstumspaketBeschreibung("");
      setGueltigkeit("14");
      setStripeLink("");
      setLeistungen([emptyLeistung(), emptyLeistung(), emptyLeistung()]);
      setFaqs([]);
      setOptionen([]);
      setBundles([]);
      setResult(null);
    }
  }, [open]);

  const updateLeistung = (i: number, patch: Partial<Leistung>) => {
    setLeistungen((prev) => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  };
  const removeLeistung = (i: number) => setLeistungen((prev) => prev.filter((_, idx) => idx !== i));
  const addLeistung = () => {
    if (leistungen.length >= 6) return;
    setLeistungen((prev) => [...prev, emptyLeistung()]);
  };

  const updateFaq = (i: number, patch: Partial<Faq>) => {
    setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  };
  const removeFaq = (i: number) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  const addFaq = () => {
    if (faqs.length >= 5) return;
    setFaqs((prev) => [...prev, emptyFaq()]);
  };

  const updateOption = (i: number, patch: Partial<Option>) =>
    setOptionen((prev) => prev.map((o, idx) => idx === i ? { ...o, ...patch } : o));
  const removeOption = (i: number) => {
    const removedId = optionen[i]?.id;
    setOptionen((prev) => prev.filter((_, idx) => idx !== i));
    if (removedId) {
      setBundles((prev) => prev.map((b) => ({ ...b, option_ids: b.option_ids.filter((id) => id !== removedId) })));
    }
  };
  const addOption = () => {
    if (optionen.length >= 4) return;
    setOptionen((prev) => [...prev, emptyOption()]);
  };

  const updateBundle = (i: number, patch: Partial<Bundle>) =>
    setBundles((prev) => prev.map((b, idx) => idx === i ? { ...b, ...patch } : b));
  const removeBundle = (i: number) =>
    setBundles((prev) => prev.filter((_, idx) => idx !== i));
  const addBundle = () => {
    if (bundles.length >= 6) return;
    setBundles((prev) => [...prev, emptyBundle()]);
  };
  const toggleBundleOption = (bi: number, optId: string) => {
    setBundles((prev) => prev.map((b, idx) => {
      if (idx !== bi) return b;
      const has = b.option_ids.includes(optId);
      return { ...b, option_ids: has ? b.option_ids.filter((x) => x !== optId) : [...b.option_ids, optId] };
    }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!/^\d{5}$/.test(pin)) {
      toast.error("PIN muss genau 5 Ziffern haben");
      return;
    }
    const preisNum = Number(preis);
    if (!preis || !Number.isFinite(preisNum) || preisNum <= 0) {
      toast.error("Bitte einen gültigen Preis eingeben");
      return;
    }
    if (normalpreis) {
      const np = Number(normalpreis);
      if (!Number.isFinite(np) || np <= 0) {
        toast.error("Normalpreis ungültig");
        return;
      }
    }
    if (!stripeLink || !/^https?:\/\//i.test(stripeLink)) {
      toast.error("Bitte gültigen Stripe-Link eingeben (mit https://)");
      return;
    }
    const cleanLeistungen = leistungen.filter(l => l.titel.trim() || l.beschreibung.trim() || l.emoji.trim());
    if (cleanLeistungen.length === 0) {
      toast.error("Mindestens eine Leistung erforderlich");
      return;
    }
    const cleanFaqs = faqs.filter(f => f.frage.trim() && f.antwort.trim());

    // Optionen validieren & serialisieren
    const cleanOptionen = optionen
      .filter((o) => o.titel.trim() && o.preis && Number(o.preis) > 0)
      .map((o) => ({
        id: o.id,
        emoji: o.emoji.trim(),
        titel: o.titel.trim(),
        beschreibung: o.beschreibung.trim(),
        preis: Number(o.preis),
        preis_typ: o.preis_typ,
        stripe_link: o.stripe_link.trim(),
      }));
    for (const o of cleanOptionen) {
      if (o.stripe_link && !/^https?:\/\//i.test(o.stripe_link)) {
        toast.error(`Option "${o.titel}": Stripe-Link ungültig`);
        return;
      }
    }
    const validOptionIds = new Set(cleanOptionen.map((o) => o.id));
    const cleanBundles = bundles
      .filter((b) => b.option_ids.length >= 2 && b.stripe_link.trim())
      .map((b) => ({
        id: b.id,
        label: b.label.trim(),
        option_ids: b.option_ids.filter((id) => validOptionIds.has(id)),
        gesamt_preis: b.gesamt_preis ? Number(b.gesamt_preis) : null,
        stripe_link: b.stripe_link.trim(),
      }))
      .filter((b) => b.option_ids.length >= 2);
    for (const b of cleanBundles) {
      if (!/^https?:\/\//i.test(b.stripe_link)) {
        toast.error(`Bundle "${b.label || "ohne Name"}": Stripe-Link ungültig`);
        return;
      }
    }

    const days = Number(gueltigkeit);
    const ablauf = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const payload = {
      v: 1,
      lead_name: lead.first_name,
      lead_email: lead.email,
      branche,
      nachricht: nachricht.trim(),
      pin,
      preis: preisNum,
      normalpreis: normalpreis ? Number(normalpreis) : null,
      miete_monatlich: mieteMonatlich ? Number(mieteMonatlich) : null,
      anzahlung: anzahlung ? Number(anzahlung) : null,
      wachstumspaket_preis: wachstumspaketPreis ? Number(wachstumspaketPreis) : null,
      wachstumspaket_beschreibung: wachstumspaketBeschreibung.trim() || null,
      ablauf_datum: ablauf.toISOString(),
      stripe_link: stripeLink.trim(),
      leistungen: cleanLeistungen,
      faqs: cleanFaqs,
      optionen: cleanOptionen,
      bundles: cleanBundles,
    };

    const base64 = encodeBase64Utf8(payload);
    const link = `${ANGEBOT_BASE_URL}?d=${encodeURIComponent(base64)}`;

    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password,
        action: "angebot-create",
        lead_name: lead.first_name,
        lead_email: lead.email,
        preis: preisNum,
        normalpreis: normalpreis ? Number(normalpreis) : null,
        pin,
        ablauf_datum: ablauf.toISOString(),
        base64_data: base64,
        stripe_link: stripeLink.trim(),
      },
    });
    setSaving(false);
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Fehler beim Speichern");
      return;
    }
    toast.success("Angebot erstellt");
    setResult({ link, pin });
    onCreated?.();
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} kopiert`);
    } catch {
      toast.error("Konnte nicht kopieren");
    }
  };

  const handleUpload = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Datei zu groß (max. 15 MB)");
      return;
    }
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Bitte PDF, PNG, JPG oder WEBP hochladen");
      return;
    }
    setParsing(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const r = String(reader.result || "");
          const idx = r.indexOf(",");
          resolve(idx >= 0 ? r.slice(idx + 1) : r);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke("parse-angebot-upload", {
        body: { password, file_base64: base64, mime_type: file.type },
      });
      if (error || data?.error) {
        toast.error(data?.error || error?.message || "Auslesen fehlgeschlagen");
        return;
      }
      const ex = data?.extracted || {};
      if (typeof ex.nachricht === "string") setNachricht(ex.nachricht.slice(0, 200));
      if (typeof ex.preis === "number") setPreis(String(ex.preis));
      if (typeof ex.normalpreis === "number") setNormalpreis(String(ex.normalpreis));
      if (typeof ex.miete_monatlich === "number") setMieteMonatlich(String(ex.miete_monatlich));
      if (typeof ex.anzahlung === "number") setAnzahlung(String(ex.anzahlung));
      if (typeof ex.wachstumspaket_preis === "number") setWachstumspaketPreis(String(ex.wachstumspaket_preis));
      if (typeof ex.wachstumspaket_beschreibung === "string") setWachstumspaketBeschreibung(ex.wachstumspaket_beschreibung);
      if (Array.isArray(ex.leistungen) && ex.leistungen.length > 0) {
        setLeistungen(
          ex.leistungen.slice(0, 6).map((l: any) => ({
            emoji: typeof l?.emoji === "string" ? l.emoji : "",
            titel: typeof l?.titel === "string" ? l.titel : "",
            beschreibung: typeof l?.beschreibung === "string" ? l.beschreibung : "",
          })),
        );
      }
      if (Array.isArray(ex.faqs) && ex.faqs.length > 0) {
        setFaqs(
          ex.faqs.slice(0, 5).map((f: any) => ({
            frage: typeof f?.frage === "string" ? f.frage : "",
            antwort: typeof f?.antwort === "string" ? f.antwort : "",
          })),
        );
      }
      toast.success("Angebot ausgelesen — bitte prüfen und ggf. anpassen");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload fehlgeschlagen");
    } finally {
      setParsing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} style={{ color: BRAND }} />
            Angebot für {lead.first_name} erstellen
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={20} />
              <span className="font-semibold">Angebot erfolgreich generiert</span>
            </div>

            <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-50 p-4 dark:bg-emerald-950/20">
              <div className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400 mb-2">
                Angebot-Link
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background rounded px-2 py-1.5 border border-emerald-200 dark:border-emerald-900 break-all">
                  {result.link}
                </code>
                <Button size="sm" variant="outline" onClick={() => copy(result.link, "Link")}>
                  <Copy size={14} /> Kopieren
                </Button>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ background: `${BRAND}10`, border: `2px solid ${BRAND}40` }}>
              <div className="text-xs font-semibold uppercase mb-2" style={{ color: BRAND }}>
                Kunden-PIN für {lead.first_name}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold tracking-[0.4em] flex-1" style={{ color: BRAND, fontVariantNumeric: "tabular-nums" }}>
                  {result.pin}
                </div>
                <Button size="sm" variant="outline" onClick={() => copy(result.pin, "PIN")}>
                  <Copy size={14} /> Kopieren
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(result.link, "_blank")} className="flex-1">
                <ExternalLink size={14} /> Vorschau öffnen
              </Button>
              <Button variant="default" onClick={() => onOpenChange(false)} className="flex-1">
                Schließen
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Auto-fill info */}
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              Übernommen: <strong>{lead.first_name}</strong> · {lead.email}
              {branche ? <> · {branche}</> : null}
            </div>

            {/* KI-Upload */}
            <div
              className="rounded-lg border-2 border-dashed p-4 flex items-center gap-3"
              style={{ borderColor: `${BRAND}40`, background: `${BRAND}08` }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND }}>
                  <Sparkles size={14} /> Angebot per KI auslesen
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Laden Sie ein bestehendes Angebot (PDF / Bild) hoch — Felder werden automatisch befüllt.
                </div>
              </div>
              <label className="shrink-0">
                <input
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  className="hidden"
                  disabled={parsing}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) handleUpload(f);
                  }}
                />
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-md px-3 py-2 cursor-pointer ${parsing ? "opacity-60 pointer-events-none" : ""}`}
                  style={{ background: BRAND, color: "#fff" }}
                >
                  {parsing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {parsing ? "Lese aus…" : "Datei wählen"}
                </span>
              </label>
            </div>

            {/* Persönliche Nachricht */}
            <div className="space-y-1.5">
              <Label>Persönliche Nachricht <span className="text-muted-foreground font-normal">({nachricht.length}/200)</span></Label>
              <Textarea
                value={nachricht}
                onChange={(e) => setNachricht(e.target.value.slice(0, 200))}
                placeholder={`Was haben wir besprochen? Was macht dieses Angebot besonders für ${lead.first_name}?`}
                rows={3}
                maxLength={200}
              />
            </div>

            {/* PIN */}
            <div className="space-y-1.5">
              <Label>PIN (5-stellig)</Label>
              <div className="flex gap-2">
                <Input
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  maxLength={5}
                  inputMode="numeric"
                  className="font-mono tracking-widest"
                />
                <Button type="button" variant="outline" onClick={() => setPin(genPin())}>
                  <Shuffle size={14} /> Zufällig
                </Button>
              </div>
            </div>

            {/* Preise */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Preis in € *</Label>
                <Input type="number" min="1" value={preis} onChange={(e) => setPreis(e.target.value)} placeholder="z.B. 1490" />
              </div>
              <div className="space-y-1.5">
                <Label>Normalpreis in € <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input type="number" min="1" value={normalpreis} onChange={(e) => setNormalpreis(e.target.value)} placeholder="z.B. 1990" />
              </div>
            </div>

            {/* Optionale Zahlungsmodelle */}
            <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/20">
              <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                Optionale Zahlungsmodelle
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Monatliche Miete in € <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input type="number" min="1" value={mieteMonatlich} onChange={(e) => setMieteMonatlich(e.target.value)} placeholder="z.B. 89" />
                </div>
                <div className="space-y-1.5">
                  <Label>Anzahlung in € <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input type="number" min="1" value={anzahlung} onChange={(e) => setAnzahlung(e.target.value)} placeholder="z.B. 500" />
                </div>
              </div>
            </div>

            {/* Wachstumspaket */}
            <div className="rounded-lg border border-border p-3 space-y-3 bg-muted/20">
              <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                Wachstumspaket <span className="font-normal normal-case">(optional Upsell)</span>
              </div>
              <div className="space-y-1.5">
                <Label>Preis Wachstumspaket in €</Label>
                <Input type="number" min="1" value={wachstumspaketPreis} onChange={(e) => setWachstumspaketPreis(e.target.value)} placeholder="z.B. 990" />
              </div>
              <div className="space-y-1.5">
                <Label>Beschreibung</Label>
                <Textarea
                  value={wachstumspaketBeschreibung}
                  onChange={(e) => setWachstumspaketBeschreibung(e.target.value.slice(0, 400))}
                  placeholder="Was ist im Wachstumspaket enthalten?"
                  rows={2}
                  maxLength={400}
                />
              </div>
            </div>

            {/* Gültigkeit */}
            <div className="space-y-1.5">
              <Label>Gültigkeit</Label>
              <Select value={gueltigkeit} onValueChange={(v) => setGueltigkeit(v as "7" | "14" | "30")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Tage</SelectItem>
                  <SelectItem value="14">14 Tage</SelectItem>
                  <SelectItem value="30">30 Tage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stripe Link */}
            <div className="space-y-1.5">
              <Label>Stripe Payment Link *</Label>
              <Input type="url" value={stripeLink} onChange={(e) => setStripeLink(e.target.value)} placeholder="https://buy.stripe.com/..." />
            </div>

            {/* Leistungen */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Leistungen ({leistungen.length}/6)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addLeistung} disabled={leistungen.length >= 6}>
                  <Plus size={14} /> Leistung hinzufügen
                </Button>
              </div>
              {leistungen.map((l, i) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
                  <div className="flex gap-2">
                    <Input
                      value={l.emoji}
                      onChange={(e) => updateLeistung(i, { emoji: e.target.value })}
                      placeholder="🚀"
                      className="w-16 text-center text-lg"
                      maxLength={4}
                    />
                    <Input
                      value={l.titel}
                      onChange={(e) => updateLeistung(i, { titel: e.target.value })}
                      placeholder="Titel der Leistung"
                      className="flex-1"
                      maxLength={100}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeLeistung(i)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <Textarea
                    value={l.beschreibung}
                    onChange={(e) => updateLeistung(i, { beschreibung: e.target.value })}
                    placeholder="Kurzbeschreibung"
                    rows={2}
                    maxLength={300}
                  />
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>FAQs ({faqs.length}/5)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addFaq} disabled={faqs.length >= 5}>
                  <Plus size={14} /> FAQ hinzufügen
                </Button>
              </div>
              {faqs.map((f, i) => (
                <div key={i} className="rounded-lg border border-border p-3 space-y-2 bg-muted/20">
                  <div className="flex gap-2">
                    <Input
                      value={f.frage}
                      onChange={(e) => updateFaq(i, { frage: e.target.value })}
                      placeholder="Frage"
                      className="flex-1"
                      maxLength={200}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFaq(i)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <Textarea
                    value={f.antwort}
                    onChange={(e) => updateFaq(i, { antwort: e.target.value })}
                    placeholder="Antwort"
                    rows={2}
                    maxLength={600}
                  />
                </div>
              ))}
            </div>

            {/* Submit */}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={saving}
              className="w-full text-white"
              style={{ background: `linear-gradient(135deg, ${BRAND}, #7B5EF8)` }}
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
              Angebot-Link generieren
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}