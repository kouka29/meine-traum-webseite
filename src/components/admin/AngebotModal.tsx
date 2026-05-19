import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Trash2, Shuffle, Copy, ExternalLink, Loader2, FileText, CheckCircle2,
  Upload, Sparkles, Eye, FileDown, Package, CreditCard, Receipt, Pencil,
} from "lucide-react";

interface AngebotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  lead: { first_name: string; email: string; trade?: string | null; trade_other?: string | null };
  onCreated?: () => void;
  /** Wenn gesetzt: Bearbeitungs-Modus. Felder werden aus base64_data vorbefüllt und „Speichern" updated statt zu erstellen. */
  editing?: {
    angebotId: string;
    base64_data: string;
    short_id?: string | null;
  } | null;
}

interface Leistung { emoji: string; titel: string; beschreibung: string; }
interface Faq { frage: string; antwort: string; }
interface Option {
  id: string; emoji: string; titel: string; beschreibung: string;
  preis: string; preis_typ: "einmalig" | "monatlich"; stripe_link: string;
}
interface Bundle { id: string; label: string; option_ids: string[]; gesamt_preis: string; stripe_link: string; }
interface Paket {
  id: string; name: string; badge: string; beschreibung: string;
  preis: string; normalpreis: string; miete_monatlich: string; anzahlung: string;
  stripe_link: string; leistungen: Leistung[]; optionen: Option[];
}

const BRAND = "#4F3FF0";
const ANGEBOT_BASE_URL = "https://meine-traum-webseite.de/angebot";

function encodeBase64Utf8(payload: unknown): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
const genPin = () => String(Math.floor(10000 + Math.random() * 90000));
const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
const emptyLeistung = (): Leistung => ({ emoji: "", titel: "", beschreibung: "" });
const emptyFaq = (): Faq => ({ frage: "", antwort: "" });
const emptyOption = (): Option => ({
  id: genId(), emoji: "", titel: "", beschreibung: "",
  preis: "", preis_typ: "einmalig", stripe_link: "",
});
const emptyBundle = (): Bundle => ({ id: genId(), label: "", option_ids: [], gesamt_preis: "", stripe_link: "" });
const emptyPaket = (name = ""): Paket => ({
  id: genId(), name, badge: "", beschreibung: "",
  preis: "", normalpreis: "", miete_monatlich: "", anzahlung: "",
  stripe_link: "", leistungen: [emptyLeistung(), emptyLeistung()], optionen: [],
});

// Sparkles-Button für KI-Neuformulierung
function RephraseButton({
  password, text, kontext, onResult, disabled,
}: {
  password: string; text: string;
  kontext: "nachricht" | "leistung" | "wachstumspaket" | "paket" | "allgemein";
  onResult: (s: string) => void; disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    if (!text.trim()) { toast.error("Bitte erst etwas Text eingeben"); return; }
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("rephrase-text", {
      body: { password, text, kontext, ton: "professionell" },
    });
    setBusy(false);
    if (error || data?.error) { toast.error(data?.error || error?.message || "KI-Fehler"); return; }
    if (data?.text) { onResult(data.text); toast.success("Text neu formuliert"); }
  };
  return (
    <Button type="button" size="sm" variant="ghost" disabled={busy || disabled} onClick={handle}
      className="h-7 px-2 text-xs" style={{ color: BRAND }} title="KI-Neuformulierung">
      {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
      KI
    </Button>
  );
}

function decodeBase64Utf8Safe(b64: string): any | null {
  try { return JSON.parse(decodeURIComponent(escape(atob(b64)))); } catch { return null; }
}

export default function AngebotModal({ open, onOpenChange, password, lead, onCreated, editing }: AngebotModalProps) {
  const branche = lead.trade === "Sonstiges" && lead.trade_other ? lead.trade_other : (lead.trade || "");

  // Globaler Zustand
  const [nachricht, setNachricht] = useState("");
  const [pin, setPin] = useState(genPin());
  const [dauerTage, setDauerTage] = useState("14");
  const [wachstumspaketPreis, setWachstumspaketPreis] = useState("");
  const [wachstumspaketBeschreibung, setWachstumspaketBeschreibung] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string | null>(null);

  // Single-Mode (wenn !multiMode)
  const [preis, setPreis] = useState("");
  const [normalpreis, setNormalpreis] = useState("");
  const [mieteMonatlich, setMieteMonatlich] = useState("");
  const [anzahlung, setAnzahlung] = useState("");
  const [stripeLink, setStripeLink] = useState("");
  const [leistungen, setLeistungen] = useState<Leistung[]>([emptyLeistung(), emptyLeistung(), emptyLeistung()]);
  const [optionen, setOptionen] = useState<Option[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);

  // Multi-Mode
  const [multiMode, setMultiMode] = useState(false);
  const [pakete, setPakete] = useState<Paket[]>([]);

  // Zahlungsart
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "rechnung">("stripe");

  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ link: string; pin: string } | null>(null);

  useEffect(() => {
    if (open) {
      setNachricht(""); setPin(genPin()); setDauerTage("14");
      setWachstumspaketPreis(""); setWachstumspaketBeschreibung(""); setFaqs([]);
      setPdfPath(null); setPdfFilename(null);
      setPreis(""); setNormalpreis(""); setMieteMonatlich(""); setAnzahlung("");
      setStripeLink(""); setLeistungen([emptyLeistung(), emptyLeistung(), emptyLeistung()]);
      setOptionen([]); setBundles([]);
      setMultiMode(false);
      setPakete([emptyPaket("Starter"), emptyPaket("Pro")]);
      setPaymentMethod("stripe");
      setResult(null);

      // Edit-Modus: bestehende Daten einladen
      if (editing?.base64_data) {
        const d = decodeBase64Utf8Safe(editing.base64_data);
        if (d && typeof d === "object") {
          setNachricht(String(d.nachricht || "").slice(0, 200));
          if (typeof d.pin === "string" && /^\d{5}$/.test(d.pin)) setPin(d.pin);
          if (d.ablauf_datum) {
            const ms = new Date(d.ablauf_datum).getTime() - Date.now();
            const days = Math.max(1, Math.round(ms / 86400000));
            setDauerTage(String(Math.min(365, days)));
          }
          if (typeof d.wachstumspaket_preis === "number") setWachstumspaketPreis(String(d.wachstumspaket_preis));
          if (typeof d.wachstumspaket_beschreibung === "string") setWachstumspaketBeschreibung(d.wachstumspaket_beschreibung);
          if (Array.isArray(d.faqs)) setFaqs(d.faqs.slice(0, 5).map((f: any) => ({ frage: String(f?.frage || ""), antwort: String(f?.antwort || "") })));
          if (d.pdf_path) setPdfPath(String(d.pdf_path));
          if (d.payment_method === "rechnung") setPaymentMethod("rechnung");

          if (Array.isArray(d.pakete) && d.pakete.length > 0) {
            setMultiMode(true);
            setPakete(d.pakete.slice(0, 3).map((p: any) => ({
              id: genId(),
              name: String(p?.name || ""), badge: String(p?.badge || ""), beschreibung: String(p?.beschreibung || ""),
              preis: typeof p?.preis === "number" ? String(p.preis) : "",
              normalpreis: typeof p?.normalpreis === "number" ? String(p.normalpreis) : "",
              miete_monatlich: typeof p?.miete_monatlich === "number" ? String(p.miete_monatlich) : "",
              anzahlung: typeof p?.anzahlung === "number" ? String(p.anzahlung) : "",
              stripe_link: String(p?.stripe_link || ""),
              leistungen: Array.isArray(p?.leistungen) && p.leistungen.length > 0
                ? p.leistungen.map((l: any) => ({ emoji: String(l?.emoji || ""), titel: String(l?.titel || ""), beschreibung: String(l?.beschreibung || "") }))
                : [emptyLeistung()],
              optionen: Array.isArray(p?.optionen) ? p.optionen.map((o: any) => ({
                id: genId(), emoji: String(o?.emoji || ""), titel: String(o?.titel || ""), beschreibung: String(o?.beschreibung || ""),
                preis: typeof o?.preis === "number" ? String(o.preis) : "",
                preis_typ: o?.preis_typ === "monatlich" ? "monatlich" : "einmalig",
                stripe_link: String(o?.stripe_link || ""),
              })) : [],
            })));
          } else {
            setMultiMode(false);
            if (typeof d.preis === "number") setPreis(String(d.preis));
            if (typeof d.normalpreis === "number") setNormalpreis(String(d.normalpreis));
            if (typeof d.miete_monatlich === "number") setMieteMonatlich(String(d.miete_monatlich));
            if (typeof d.anzahlung === "number") setAnzahlung(String(d.anzahlung));
            if (typeof d.stripe_link === "string") setStripeLink(d.stripe_link);
            if (Array.isArray(d.leistungen) && d.leistungen.length > 0) {
              setLeistungen(d.leistungen.map((l: any) => ({ emoji: String(l?.emoji || ""), titel: String(l?.titel || ""), beschreibung: String(l?.beschreibung || "") })));
            }
            if (Array.isArray(d.optionen)) {
              const opts = d.optionen.map((o: any) => ({
                id: String(o?.id || genId()),
                emoji: String(o?.emoji || ""), titel: String(o?.titel || ""), beschreibung: String(o?.beschreibung || ""),
                preis: typeof o?.preis === "number" ? String(o.preis) : "",
                preis_typ: o?.preis_typ === "monatlich" ? "monatlich" : "einmalig",
                stripe_link: String(o?.stripe_link || ""),
              }));
              setOptionen(opts);
            }
            if (Array.isArray(d.bundles)) {
              setBundles(d.bundles.map((b: any) => ({
                id: String(b?.id || genId()),
                label: String(b?.label || ""),
                option_ids: Array.isArray(b?.option_ids) ? b.option_ids.map(String) : [],
                gesamt_preis: typeof b?.gesamt_preis === "number" ? String(b.gesamt_preis) : "",
                stripe_link: String(b?.stripe_link || ""),
              })));
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing?.angebotId]);

  // Helpers Single-Mode
  const updateLeistung = (i: number, p: Partial<Leistung>) =>
    setLeistungen((prev) => prev.map((l, idx) => idx === i ? { ...l, ...p } : l));
  const removeLeistung = (i: number) => setLeistungen((prev) => prev.filter((_, idx) => idx !== i));
  const addLeistung = () => leistungen.length < 6 && setLeistungen((prev) => [...prev, emptyLeistung()]);

  const updateFaq = (i: number, p: Partial<Faq>) =>
    setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, ...p } : f));
  const removeFaq = (i: number) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  const addFaq = () => faqs.length < 5 && setFaqs((prev) => [...prev, emptyFaq()]);

  const updateOption = (i: number, p: Partial<Option>) =>
    setOptionen((prev) => prev.map((o, idx) => idx === i ? { ...o, ...p } : o));
  const removeOption = (i: number) => {
    const removedId = optionen[i]?.id;
    setOptionen((prev) => prev.filter((_, idx) => idx !== i));
    if (removedId) setBundles((prev) => prev.map((b) => ({ ...b, option_ids: b.option_ids.filter((id) => id !== removedId) })));
  };
  const addOption = () => optionen.length < 4 && setOptionen((prev) => [...prev, emptyOption()]);

  const updateBundle = (i: number, p: Partial<Bundle>) =>
    setBundles((prev) => prev.map((b, idx) => idx === i ? { ...b, ...p } : b));
  const removeBundle = (i: number) => setBundles((prev) => prev.filter((_, idx) => idx !== i));
  const addBundle = () => bundles.length < 6 && setBundles((prev) => [...prev, emptyBundle()]);
  const toggleBundleOption = (bi: number, optId: string) =>
    setBundles((prev) => prev.map((b, idx) => idx === bi
      ? { ...b, option_ids: b.option_ids.includes(optId) ? b.option_ids.filter((x) => x !== optId) : [...b.option_ids, optId] }
      : b));

  // Helpers Pakete
  const updatePaket = (pi: number, p: Partial<Paket>) =>
    setPakete((prev) => prev.map((x, idx) => idx === pi ? { ...x, ...p } : x));
  const removePaket = (pi: number) => setPakete((prev) => prev.filter((_, idx) => idx !== pi));
  const addPaket = () => pakete.length < 3 && setPakete((prev) => [...prev, emptyPaket(`Paket ${prev.length + 1}`)]);
  const updatePaketLeistung = (pi: number, li: number, p: Partial<Leistung>) =>
    updatePaket(pi, { leistungen: pakete[pi].leistungen.map((l, idx) => idx === li ? { ...l, ...p } : l) });
  const addPaketLeistung = (pi: number) =>
    pakete[pi].leistungen.length < 8 && updatePaket(pi, { leistungen: [...pakete[pi].leistungen, emptyLeistung()] });
  const removePaketLeistung = (pi: number, li: number) =>
    updatePaket(pi, { leistungen: pakete[pi].leistungen.filter((_, idx) => idx !== li) });
  const updatePaketOption = (pi: number, oi: number, p: Partial<Option>) =>
    updatePaket(pi, { optionen: pakete[pi].optionen.map((o, idx) => idx === oi ? { ...o, ...p } : o) });
  const addPaketOption = (pi: number) =>
    pakete[pi].optionen.length < 4 && updatePaket(pi, { optionen: [...pakete[pi].optionen, emptyOption()] });
  const removePaketOption = (pi: number, oi: number) =>
    updatePaket(pi, { optionen: pakete[pi].optionen.filter((_, idx) => idx !== oi) });

  // Payload bauen (für Save UND Preview)
  const buildPayload = useCallback((): { ok: true; payload: any; error?: never } | { ok: false; error: string } => {
    if (!/^\d{5}$/.test(pin)) return { ok: false, error: "PIN muss genau 5 Ziffern haben" };
    const daysNum = Number(dauerTage);
    if (!Number.isFinite(daysNum) || daysNum < 1 || daysNum > 365) return { ok: false, error: "Gültigkeit: 1–365 Tage" };
    const ablauf = new Date(Date.now() + daysNum * 86400000);

    const cleanFaqs = faqs.filter((f) => f.frage.trim() && f.antwort.trim());

    const base: any = {
      v: 1,
      lead_name: lead.first_name,
      lead_email: lead.email,
      branche,
      nachricht: nachricht.trim(),
      pin,
      ablauf_datum: ablauf.toISOString(),
      wachstumspaket_preis: wachstumspaketPreis ? Number(wachstumspaketPreis) : null,
      wachstumspaket_beschreibung: wachstumspaketBeschreibung.trim() || null,
      faqs: cleanFaqs,
      pdf_path: pdfPath || null,
      payment_method: paymentMethod,
    };

    if (multiMode) {
      if (pakete.length === 0) return { ok: false, error: "Mindestens ein Paket erforderlich" };
      const cleanPakete = pakete.map((p) => {
        const preisN = Number(p.preis);
        if (!p.name.trim()) throw new Error("Paket-Name fehlt");
        if (!Number.isFinite(preisN) || preisN <= 0) throw new Error(`Paket "${p.name || "?"}": Preis ungültig`);
        if (paymentMethod === "stripe" && (!p.stripe_link.trim() || !/^https?:\/\//i.test(p.stripe_link))) {
          throw new Error(`Paket "${p.name}": Stripe-Link ungültig`);
        }
        const cleanL = p.leistungen.filter((l) => l.titel.trim() || l.beschreibung.trim() || l.emoji.trim());
        if (cleanL.length === 0) throw new Error(`Paket "${p.name}": Mindestens eine Leistung`);
        const cleanO = p.optionen
          .filter((o) => o.titel.trim() && Number(o.preis) > 0)
          .map((o) => ({
            id: o.id, emoji: o.emoji.trim(), titel: o.titel.trim(), beschreibung: o.beschreibung.trim(),
            preis: Number(o.preis), preis_typ: o.preis_typ, stripe_link: o.stripe_link.trim(),
          }));
        return {
          id: p.id, name: p.name.trim(), badge: p.badge.trim(), beschreibung: p.beschreibung.trim(),
          preis: preisN,
          normalpreis: p.normalpreis ? Number(p.normalpreis) : null,
          miete_monatlich: p.miete_monatlich ? Number(p.miete_monatlich) : null,
          anzahlung: p.anzahlung ? Number(p.anzahlung) : null,
          stripe_link: paymentMethod === "stripe" ? p.stripe_link.trim() : "",
          leistungen: cleanL, optionen: cleanO,
        };
      });
      // Für DB-Insert nehmen wir Preis/Stripe des ersten Pakets als „Hauptpreis"
      base.pakete = cleanPakete;
      base.preis = cleanPakete[0].preis;
      base.normalpreis = cleanPakete[0].normalpreis;
      base.stripe_link = paymentMethod === "stripe" ? cleanPakete[0].stripe_link : "";
      base.leistungen = [];
    } else {
      const preisN = Number(preis);
      if (!Number.isFinite(preisN) || preisN <= 0) return { ok: false, error: "Bitte gültigen Preis eingeben" };
      if (paymentMethod === "stripe" && (!stripeLink || !/^https?:\/\//i.test(stripeLink))) {
        return { ok: false, error: "Bitte gültigen Stripe-Link eingeben" };
      }
      const cleanL = leistungen.filter((l) => l.titel.trim() || l.beschreibung.trim() || l.emoji.trim());
      if (cleanL.length === 0) return { ok: false, error: "Mindestens eine Leistung erforderlich" };
      const cleanO = optionen.filter((o) => o.titel.trim() && Number(o.preis) > 0).map((o) => ({
        id: o.id, emoji: o.emoji.trim(), titel: o.titel.trim(), beschreibung: o.beschreibung.trim(),
        preis: Number(o.preis), preis_typ: o.preis_typ, stripe_link: o.stripe_link.trim(),
      }));
      const validIds = new Set(cleanO.map((o) => o.id));
      const cleanB = bundles
        .filter((b) => b.option_ids.length >= 2 && b.stripe_link.trim())
        .map((b) => ({
          id: b.id, label: b.label.trim(),
          option_ids: b.option_ids.filter((id) => validIds.has(id)),
          gesamt_preis: b.gesamt_preis ? Number(b.gesamt_preis) : null,
          stripe_link: b.stripe_link.trim(),
        })).filter((b) => b.option_ids.length >= 2);
      base.preis = preisN;
      base.normalpreis = normalpreis ? Number(normalpreis) : null;
      base.miete_monatlich = mieteMonatlich ? Number(mieteMonatlich) : null;
      base.anzahlung = anzahlung ? Number(anzahlung) : null;
      base.stripe_link = paymentMethod === "stripe" ? stripeLink.trim() : "";
      base.leistungen = cleanL;
      base.optionen = cleanO;
      base.bundles = cleanB;
    }
    return { ok: true, payload: base };
  }, [pin, dauerTage, lead, branche, nachricht, wachstumspaketPreis, wachstumspaketBeschreibung, faqs, pdfPath,
      multiMode, pakete, preis, normalpreis, mieteMonatlich, anzahlung, stripeLink, leistungen, optionen, bundles,
      paymentMethod]);

  const handlePreview = () => {
    let r: ReturnType<typeof buildPayload>;
    try { r = buildPayload(); } catch (e: any) { toast.error(e.message); return; }
    if (!r.ok) { toast.error(r.error); return; }
    const link = `${window.location.origin}/angebot?d=${encodeURIComponent(encodeBase64Utf8(r.payload))}&preview=1`;
    window.open(link, "_blank");
  };

  const handleGenerate = async () => {
    let r: ReturnType<typeof buildPayload>;
    try { r = buildPayload(); } catch (e: any) { toast.error(e.message); return; }
    if (!r.ok) { toast.error(r.error); return; }
    const base64 = encodeBase64Utf8(r.payload);

    setSaving(true);
    if (editing?.angebotId) {
      // UPDATE bestehendes Angebot
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        body: {
          password, action: "angebot-update",
          angebotId: editing.angebotId,
          preis: r.payload.preis,
          normalpreis: r.payload.normalpreis,
          pin, ablauf_datum: r.payload.ablauf_datum,
          base64_data: base64, stripe_link: r.payload.stripe_link,
          pdf_path: pdfPath,
        },
      });
      setSaving(false);
      if (error || data?.error) { toast.error(data?.error || error?.message || "Fehler"); return; }
      const shortId = editing.short_id;
      const link = shortId ? `${ANGEBOT_BASE_URL}?s=${shortId}` : `${ANGEBOT_BASE_URL}?d=${base64}`;
      toast.success("Angebot aktualisiert");
      setResult({ link, pin });
      onCreated?.();
      return;
    }

    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password, action: "angebot-create",
        lead_name: lead.first_name, lead_email: lead.email,
        preis: r.payload.preis,
        normalpreis: r.payload.normalpreis,
        pin, ablauf_datum: r.payload.ablauf_datum,
        base64_data: base64, stripe_link: r.payload.stripe_link,
        pdf_path: pdfPath,
      },
    });
    setSaving(false);
    if (error || data?.error) { toast.error(data?.error || error?.message || "Fehler"); return; }
    const shortId = data?.short_id || data?.angebot?.short_id;
    const link = shortId
      ? `${ANGEBOT_BASE_URL}?s=${shortId}`
      : `${ANGEBOT_BASE_URL}?d=${base64}`;
    toast.success("Angebot erstellt");
    setResult({ link, pin });
    onCreated?.();
  };

  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); toast.success(`${label} kopiert`); }
    catch { toast.error("Konnte nicht kopieren"); }
  };

  const handleUpload = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) { toast.error("Datei zu groß (max 15 MB)"); return; }
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(file.type)) { toast.error("Bitte PDF, PNG, JPG oder WEBP"); return; }
    setParsing(true);
    setUploading(true);
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

      // 1. Hochladen in Storage
      const upRes = await supabase.functions.invoke("admin-leads", {
        body: { password, action: "angebot-upload-pdf", file_base64: base64, mime_type: file.type, filename: file.name.replace(/\.[^.]+$/, "") },
      });
      if (upRes.error || upRes.data?.error) {
        toast.error(upRes.data?.error || upRes.error?.message || "Upload fehlgeschlagen");
      } else if (upRes.data?.pdf_path) {
        setPdfPath(upRes.data.pdf_path);
        setPdfFilename(file.name);
        toast.success("Datei hochgeladen — wird ausgelesen…");
      }
      setUploading(false);

      // 2. KI-Auslesen
      const { data, error } = await supabase.functions.invoke("parse-angebot-upload", {
        body: { password, file_base64: base64, mime_type: file.type },
      });
      if (error || data?.error) { toast.error(data?.error || error?.message || "Auslesen fehlgeschlagen"); return; }
      const ex = data?.extracted || {};
      if (typeof ex.nachricht === "string") setNachricht(ex.nachricht.slice(0, 200));
      if (typeof ex.wachstumspaket_preis === "number") setWachstumspaketPreis(String(ex.wachstumspaket_preis));
      if (typeof ex.wachstumspaket_beschreibung === "string") setWachstumspaketBeschreibung(ex.wachstumspaket_beschreibung);
      if (Array.isArray(ex.faqs) && ex.faqs.length > 0) {
        setFaqs(ex.faqs.slice(0, 5).map((f: any) => ({
          frage: String(f?.frage || ""), antwort: String(f?.antwort || ""),
        })));
      }
      // Pakete vs Single
      if (Array.isArray(ex.pakete) && ex.pakete.length >= 2) {
        setMultiMode(true);
        setPakete(ex.pakete.slice(0, 3).map((p: any) => ({
          id: genId(),
          name: String(p?.name || ""),
          badge: String(p?.badge || ""),
          beschreibung: String(p?.beschreibung || ""),
          preis: typeof p?.preis === "number" ? String(p.preis) : "",
          normalpreis: typeof p?.normalpreis === "number" ? String(p.normalpreis) : "",
          miete_monatlich: typeof p?.miete_monatlich === "number" ? String(p.miete_monatlich) : "",
          anzahlung: typeof p?.anzahlung === "number" ? String(p.anzahlung) : "",
          stripe_link: "",
          leistungen: Array.isArray(p?.leistungen) && p.leistungen.length > 0
            ? p.leistungen.slice(0, 8).map((l: any) => ({
                emoji: String(l?.emoji || ""), titel: String(l?.titel || ""), beschreibung: String(l?.beschreibung || ""),
              }))
            : [emptyLeistung()],
          optionen: Array.isArray(p?.optionen)
            ? p.optionen.slice(0, 4).map((o: any) => ({
                id: genId(),
                emoji: String(o?.emoji || ""), titel: String(o?.titel || ""), beschreibung: String(o?.beschreibung || ""),
                preis: typeof o?.preis === "number" ? String(o.preis) : "",
                preis_typ: o?.preis_typ === "monatlich" ? "monatlich" : "einmalig",
                stripe_link: "",
              }))
            : [],
        })));
      } else {
        setMultiMode(false);
        if (typeof ex.preis === "number") setPreis(String(ex.preis));
        if (typeof ex.normalpreis === "number") setNormalpreis(String(ex.normalpreis));
        if (typeof ex.miete_monatlich === "number") setMieteMonatlich(String(ex.miete_monatlich));
        if (typeof ex.anzahlung === "number") setAnzahlung(String(ex.anzahlung));
        if (Array.isArray(ex.leistungen) && ex.leistungen.length > 0) {
          setLeistungen(ex.leistungen.slice(0, 6).map((l: any) => ({
            emoji: String(l?.emoji || ""), titel: String(l?.titel || ""), beschreibung: String(l?.beschreibung || ""),
          })));
        }
        if (Array.isArray(ex.optionen) && ex.optionen.length > 0) {
          setOptionen(ex.optionen.slice(0, 4).map((o: any) => ({
            id: genId(),
            emoji: String(o?.emoji || ""), titel: String(o?.titel || ""), beschreibung: String(o?.beschreibung || ""),
            preis: typeof o?.preis === "number" ? String(o.preis) : "",
            preis_typ: o?.preis_typ === "monatlich" ? "monatlich" : "einmalig",
            stripe_link: "",
          })));
        }
      }
      toast.success("Angebot ausgelesen — bitte prüfen");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Fehler");
    } finally {
      setParsing(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} style={{ color: BRAND }} />
            Angebot für {lead.first_name} erstellen
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={20} /><span className="font-semibold">Angebot erfolgreich generiert</span>
            </div>
            <div className="rounded-lg border-2 border-emerald-500/40 bg-emerald-50 p-4 dark:bg-emerald-950/20">
              <div className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400 mb-2">Angebot-Link</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background rounded px-2 py-1.5 border border-emerald-200 break-all">{result.link}</code>
                <Button size="sm" variant="outline" onClick={() => copy(result.link, "Link")}><Copy size={14} /> Kopieren</Button>
              </div>
            </div>
            <div className="rounded-lg p-4" style={{ background: `${BRAND}10`, border: `2px solid ${BRAND}40` }}>
              <div className="text-xs font-semibold uppercase mb-2" style={{ color: BRAND }}>Kunden-PIN für {lead.first_name}</div>
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold tracking-[0.4em] flex-1" style={{ color: BRAND, fontVariantNumeric: "tabular-nums" }}>{result.pin}</div>
                <Button size="sm" variant="outline" onClick={() => copy(result.pin, "PIN")}><Copy size={14} /> Kopieren</Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.open(result.link, "_blank")} className="flex-1"><ExternalLink size={14} /> Vorschau</Button>
              <Button onClick={() => onOpenChange(false)} className="flex-1">Schließen</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              Übernommen: <strong>{lead.first_name}</strong> · {lead.email}{branche ? <> · {branche}</> : null}
            </div>

            {/* KI-Upload */}
            <div className="rounded-lg border-2 border-dashed p-4 flex items-center gap-3"
              style={{ borderColor: `${BRAND}40`, background: `${BRAND}08` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND }}>
                  <Sparkles size={14} /> Angebot per KI auslesen
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  PDF/Bild hochladen — Felder werden befüllt UND das Original ist später vom Kunden downloadbar.
                </div>
                {pdfPath && (
                  <div className="text-xs mt-1 flex items-center gap-1.5" style={{ color: BRAND }}>
                    <FileDown size={12} /> {pdfFilename} hochgeladen
                  </div>
                )}
              </div>
              <label className="shrink-0">
                <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="hidden"
                  disabled={parsing}
                  onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) handleUpload(f); }} />
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-md px-3 py-2 cursor-pointer ${parsing ? "opacity-60 pointer-events-none" : ""}`}
                  style={{ background: BRAND, color: "#fff" }}>
                  {parsing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? "Lade hoch…" : parsing ? "Lese aus…" : "Datei wählen"}
                </span>
              </label>
            </div>

            {/* Persönliche Nachricht */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Persönliche Nachricht <span className="text-muted-foreground font-normal">({nachricht.length}/200)</span></Label>
                <RephraseButton password={password} text={nachricht} kontext="nachricht"
                  onResult={(t) => setNachricht(t.slice(0, 200))} />
              </div>
              <Textarea value={nachricht} onChange={(e) => setNachricht(e.target.value.slice(0, 200))}
                placeholder={`Was haben wir besprochen?`} rows={3} maxLength={200} />
            </div>

            {/* PIN + Gültigkeit */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>PIN (5-stellig)</Label>
                <div className="flex gap-2">
                  <Input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    maxLength={5} inputMode="numeric" className="font-mono tracking-widest" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setPin(genPin())} title="Zufällig"><Shuffle size={14} /></Button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Gültigkeit (Tage)</Label>
                <div className="flex gap-2">
                  <Input type="number" min={1} max={365} value={dauerTage}
                    onChange={(e) => setDauerTage(e.target.value)} className="flex-1" />
                  {["7", "14", "30"].map((d) => (
                    <Button key={d} type="button" variant={dauerTage === d ? "default" : "outline"} size="sm"
                      onClick={() => setDauerTage(d)} className="px-2">{d}</Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modus-Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-3" style={{ borderColor: `${BRAND}30`, background: `${BRAND}05` }}>
              <div className="flex items-center gap-2">
                <Package size={16} style={{ color: BRAND }} />
                <div>
                  <div className="text-sm font-semibold">Mehrere Pakete anbieten</div>
                  <div className="text-xs text-muted-foreground">z.B. Starter / Pro — Kunde wählt eines</div>
                </div>
              </div>
              <Switch checked={multiMode} onCheckedChange={setMultiMode} />
            </div>

            {/* Zahlungsart */}
            <div className="rounded-lg border p-3 space-y-2" style={{ borderColor: `${BRAND}30`, background: `${BRAND}05` }}>
              <Label>Zahlungsart</Label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPaymentMethod("stripe")}
                  className={`flex items-center gap-2 rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors ${paymentMethod === "stripe" ? "text-white" : "bg-background text-muted-foreground"}`}
                  style={paymentMethod === "stripe" ? { background: BRAND, borderColor: BRAND } : { borderColor: "var(--border)" }}>
                  <CreditCard size={14} /> Stripe Checkout
                </button>
                <button type="button" onClick={() => setPaymentMethod("rechnung")}
                  className={`flex items-center gap-2 rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors ${paymentMethod === "rechnung" ? "text-white" : "bg-background text-muted-foreground"}`}
                  style={paymentMethod === "rechnung" ? { background: BRAND, borderColor: BRAND } : { borderColor: "var(--border)" }}>
                  <Receipt size={14} /> Zahlung per Rechnung
                </button>
              </div>
              {paymentMethod === "rechnung" && (
                <div className="text-xs text-muted-foreground bg-muted/40 rounded-md p-2 leading-relaxed">
                  Der Kunde bucht verbindlich per Bestätigungsflow. Du erhältst eine E-Mail und sendest die Rechnung manuell. Stripe-Link wird nicht benötigt.
                </div>
              )}
            </div>

            {!multiMode ? (
              <SingleEditor
                password={password}
                preis={preis} setPreis={setPreis}
                normalpreis={normalpreis} setNormalpreis={setNormalpreis}
                mieteMonatlich={mieteMonatlich} setMieteMonatlich={setMieteMonatlich}
                anzahlung={anzahlung} setAnzahlung={setAnzahlung}
                stripeLink={stripeLink} setStripeLink={setStripeLink}
                leistungen={leistungen} updateLeistung={updateLeistung} removeLeistung={removeLeistung} addLeistung={addLeistung}
                optionen={optionen} updateOption={updateOption} removeOption={removeOption} addOption={addOption}
                bundles={bundles} updateBundle={updateBundle} removeBundle={removeBundle} addBundle={addBundle} toggleBundleOption={toggleBundleOption}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Pakete ({pakete.length}/3)</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addPaket} disabled={pakete.length >= 3}>
                    <Plus size={14} /> Paket hinzufügen
                  </Button>
                </div>
                {pakete.map((p, pi) => (
                  <PaketEditor key={p.id} password={password} pi={pi} paket={p}
                    update={(patch) => updatePaket(pi, patch)} remove={() => removePaket(pi)}
                    updateLeistung={(li, patch) => updatePaketLeistung(pi, li, patch)}
                    addLeistung={() => addPaketLeistung(pi)} removeLeistung={(li) => removePaketLeistung(pi, li)}
                    updateOption={(oi, patch) => updatePaketOption(pi, oi, patch)}
                    addOption={() => addPaketOption(pi)} removeOption={(oi) => removePaketOption(pi, oi)} />
                ))}
              </div>
            )}

            {/* Wachstumspaket */}
            <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
              <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Wachstumspaket (optional Upsell)</div>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min="1" value={wachstumspaketPreis}
                  onChange={(e) => setWachstumspaketPreis(e.target.value)} placeholder="Preis €" />
                <div className="text-xs text-muted-foreground self-center">Optional — wird nur angezeigt wenn Preis gesetzt</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Beschreibung</Label>
                  <RephraseButton password={password} text={wachstumspaketBeschreibung} kontext="wachstumspaket"
                    onResult={(t) => setWachstumspaketBeschreibung(t.slice(0, 400))} />
                </div>
                <Textarea value={wachstumspaketBeschreibung}
                  onChange={(e) => setWachstumspaketBeschreibung(e.target.value.slice(0, 400))}
                  placeholder="Was ist im Wachstumspaket enthalten?" rows={2} maxLength={400} />
              </div>
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
                <div key={i} className="rounded-lg border p-3 space-y-2 bg-muted/20">
                  <div className="flex gap-2">
                    <Input value={f.frage} onChange={(e) => updateFaq(i, { frage: e.target.value })}
                      placeholder="Frage" className="flex-1" maxLength={200} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFaq(i)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 size={14} /></Button>
                  </div>
                  <Textarea value={f.antwort} onChange={(e) => updateFaq(i, { antwort: e.target.value })}
                    placeholder="Antwort" rows={2} maxLength={600} />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 sticky bottom-0 pt-3 bg-background border-t">
              <Button type="button" variant="outline" onClick={handlePreview} className="flex-1">
                <Eye size={16} /> Kundenansicht
              </Button>
              <Button type="button" onClick={handleGenerate} disabled={saving}
                className="flex-[2] text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND}, #7B5EF8)` }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                Angebot-Link generieren
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============ SUB COMPONENTS ============

function SingleEditor(props: {
  password: string;
  preis: string; setPreis: (v: string) => void;
  normalpreis: string; setNormalpreis: (v: string) => void;
  mieteMonatlich: string; setMieteMonatlich: (v: string) => void;
  anzahlung: string; setAnzahlung: (v: string) => void;
  stripeLink: string; setStripeLink: (v: string) => void;
  leistungen: Leistung[]; updateLeistung: (i: number, p: Partial<Leistung>) => void;
  removeLeistung: (i: number) => void; addLeistung: () => void;
  optionen: Option[]; updateOption: (i: number, p: Partial<Option>) => void;
  removeOption: (i: number) => void; addOption: () => void;
  bundles: Bundle[]; updateBundle: (i: number, p: Partial<Bundle>) => void;
  removeBundle: (i: number) => void; addBundle: () => void;
  toggleBundleOption: (bi: number, optId: string) => void;
}) {
  const { password } = props;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Preis in € *</Label>
          <Input type="number" min="1" value={props.preis} onChange={(e) => props.setPreis(e.target.value)} placeholder="1490" />
        </div>
        <div className="space-y-1.5">
          <Label>Normalpreis € <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input type="number" min="1" value={props.normalpreis} onChange={(e) => props.setNormalpreis(e.target.value)} placeholder="1990" />
        </div>
      </div>
      <div className="rounded-lg border p-3 space-y-3 bg-muted/20">
        <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Optionale Zahlungsmodelle</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Miete monatlich € <span className="text-muted-foreground font-normal">(opt.)</span></Label>
            <Input type="number" min="1" value={props.mieteMonatlich} onChange={(e) => props.setMieteMonatlich(e.target.value)} placeholder="89" />
          </div>
          <div className="space-y-1.5">
            <Label>Anzahlung € <span className="text-muted-foreground font-normal">(opt.)</span></Label>
            <Input type="number" min="1" value={props.anzahlung} onChange={(e) => props.setAnzahlung(e.target.value)} placeholder="500" />
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Stripe Payment Link *</Label>
        <Input type="url" value={props.stripeLink} onChange={(e) => props.setStripeLink(e.target.value)} placeholder="https://buy.stripe.com/..." />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Leistungen ({props.leistungen.length}/6)</Label>
          <Button type="button" size="sm" variant="outline" onClick={props.addLeistung} disabled={props.leistungen.length >= 6}>
            <Plus size={14} /> Leistung
          </Button>
        </div>
        {props.leistungen.map((l, i) => (
          <div key={i} className="rounded-lg border p-3 space-y-2 bg-muted/20">
            <div className="flex gap-2">
              <Input value={l.emoji} onChange={(e) => props.updateLeistung(i, { emoji: e.target.value })}
                placeholder="🚀" className="w-16 text-center text-lg" maxLength={4} />
              <Input value={l.titel} onChange={(e) => props.updateLeistung(i, { titel: e.target.value })}
                placeholder="Titel" className="flex-1" maxLength={100} />
              <Button type="button" variant="ghost" size="icon" onClick={() => props.removeLeistung(i)}
                className="text-destructive"><Trash2 size={14} /></Button>
            </div>
            <div className="flex gap-1 items-start">
              <Textarea value={l.beschreibung} onChange={(e) => props.updateLeistung(i, { beschreibung: e.target.value })}
                placeholder="Kurzbeschreibung" rows={2} maxLength={300} className="flex-1" />
              <RephraseButton password={password} text={l.beschreibung} kontext="leistung"
                onResult={(t) => props.updateLeistung(i, { beschreibung: t.slice(0, 300) })} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Optionale Positionen ({props.optionen.length}/4)</Label>
          <Button type="button" size="sm" variant="outline" onClick={props.addOption} disabled={props.optionen.length >= 4}>
            <Plus size={14} /> Option
          </Button>
        </div>
        <p className="text-xs text-muted-foreground -mt-1">Add-ons per Checkbox dazubuchbar. Eigener Stripe-Link pro Option.</p>
        {props.optionen.map((o, i) => (
          <div key={o.id} className="rounded-lg border p-3 space-y-2 bg-muted/20">
            <div className="flex gap-2">
              <Input value={o.emoji} onChange={(e) => props.updateOption(i, { emoji: e.target.value })}
                placeholder="✨" className="w-14 text-center text-lg" maxLength={4} />
              <Input value={o.titel} onChange={(e) => props.updateOption(i, { titel: e.target.value })}
                placeholder="Titel" className="flex-1" maxLength={100} />
              <Button type="button" variant="ghost" size="icon" onClick={() => props.removeOption(i)}
                className="text-destructive"><Trash2 size={14} /></Button>
            </div>
            <div className="flex gap-1 items-start">
              <Textarea value={o.beschreibung} onChange={(e) => props.updateOption(i, { beschreibung: e.target.value })}
                placeholder="Beschreibung" rows={2} maxLength={300} className="flex-1" />
              <RephraseButton password={password} text={o.beschreibung} kontext="leistung"
                onResult={(t) => props.updateOption(i, { beschreibung: t.slice(0, 300) })} />
            </div>
            <div className="grid grid-cols-[1fr,140px] gap-2">
              <Input type="number" min="1" value={o.preis} onChange={(e) => props.updateOption(i, { preis: e.target.value })} placeholder="Preis €" />
              <Select value={o.preis_typ} onValueChange={(v) => props.updateOption(i, { preis_typ: v as "einmalig" | "monatlich" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="einmalig">einmalig</SelectItem>
                  <SelectItem value="monatlich">monatlich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input type="url" value={o.stripe_link} onChange={(e) => props.updateOption(i, { stripe_link: e.target.value })}
              placeholder="Stripe-Link (Hauptangebot + diese Option)" />
          </div>
        ))}
      </div>

      {props.optionen.length >= 2 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Bundle-Links ({props.bundles.length}/6)</Label>
            <Button type="button" size="sm" variant="outline" onClick={props.addBundle} disabled={props.bundles.length >= 6}>
              <Plus size={14} /> Bundle
            </Button>
          </div>
          {props.bundles.map((b, bi) => (
            <div key={b.id} className="rounded-lg border p-3 space-y-2 bg-muted/20">
              <div className="flex gap-2">
                <Input value={b.label} onChange={(e) => props.updateBundle(bi, { label: e.target.value })}
                  placeholder="Bundle-Name" className="flex-1" maxLength={100} />
                <Button type="button" variant="ghost" size="icon" onClick={() => props.removeBundle(bi)}
                  className="text-destructive"><Trash2 size={14} /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {props.optionen.map((o) => {
                  const active = b.option_ids.includes(o.id);
                  return (
                    <button key={o.id} type="button" onClick={() => props.toggleBundleOption(bi, o.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${active ? "text-white" : "bg-background text-muted-foreground border-border"}`}
                      style={active ? { background: BRAND, borderColor: BRAND } : undefined}>
                      {o.emoji ? `${o.emoji} ` : ""}{o.titel || "Option"}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min="1" value={b.gesamt_preis}
                  onChange={(e) => props.updateBundle(bi, { gesamt_preis: e.target.value })} placeholder="Gesamtpreis (opt.)" />
                <Input type="url" value={b.stripe_link}
                  onChange={(e) => props.updateBundle(bi, { stripe_link: e.target.value })} placeholder="Stripe-Link *" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaketEditor({
  password, pi, paket, update, remove,
  updateLeistung, addLeistung, removeLeistung,
  updateOption, addOption, removeOption,
}: {
  password: string; pi: number; paket: Paket;
  update: (p: Partial<Paket>) => void; remove: () => void;
  updateLeistung: (li: number, p: Partial<Leistung>) => void;
  addLeistung: () => void; removeLeistung: (li: number) => void;
  updateOption: (oi: number, p: Partial<Option>) => void;
  addOption: () => void; removeOption: (oi: number) => void;
}) {
  return (
    <div className="rounded-xl border-2 p-4 space-y-3" style={{ borderColor: `${BRAND}30` }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: BRAND }}>
            {pi + 1}
          </div>
          <Input value={paket.name} onChange={(e) => update({ name: e.target.value })}
            placeholder="Paketname (z.B. Starter, Pro)" maxLength={50} className="font-semibold" />
          <Input value={paket.badge} onChange={(e) => update({ badge: e.target.value })}
            placeholder="Badge (opt.)" maxLength={30} className="w-32" />
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={remove}
          className="text-destructive shrink-0"><Trash2 size={14} /></Button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Paket-Beschreibung</Label>
          <RephraseButton password={password} text={paket.beschreibung} kontext="paket"
            onResult={(t) => update({ beschreibung: t.slice(0, 200) })} />
        </div>
        <Textarea value={paket.beschreibung} onChange={(e) => update({ beschreibung: e.target.value.slice(0, 200) })}
          placeholder="Worum geht's in diesem Paket?" rows={2} maxLength={200} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1"><Label className="text-xs">Preis € *</Label>
          <Input type="number" min="1" value={paket.preis} onChange={(e) => update({ preis: e.target.value })} placeholder="1490" /></div>
        <div className="space-y-1"><Label className="text-xs">Normalpreis €</Label>
          <Input type="number" min="1" value={paket.normalpreis} onChange={(e) => update({ normalpreis: e.target.value })} placeholder="opt." /></div>
        <div className="space-y-1"><Label className="text-xs">Miete €/Monat</Label>
          <Input type="number" min="1" value={paket.miete_monatlich} onChange={(e) => update({ miete_monatlich: e.target.value })} placeholder="opt." /></div>
        <div className="space-y-1"><Label className="text-xs">Anzahlung €</Label>
          <Input type="number" min="1" value={paket.anzahlung} onChange={(e) => update({ anzahlung: e.target.value })} placeholder="opt." /></div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Stripe-Link für dieses Paket *</Label>
        <Input type="url" value={paket.stripe_link} onChange={(e) => update({ stripe_link: e.target.value })}
          placeholder="https://buy.stripe.com/..." />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Leistungen ({paket.leistungen.length}/8)</Label>
          <Button type="button" size="sm" variant="outline" onClick={addLeistung} disabled={paket.leistungen.length >= 8} className="h-7 text-xs">
            <Plus size={12} /> Leistung
          </Button>
        </div>
        {paket.leistungen.map((l, li) => (
          <div key={li} className="rounded-lg border p-2 space-y-1.5 bg-background">
            <div className="flex gap-1.5">
              <Input value={l.emoji} onChange={(e) => updateLeistung(li, { emoji: e.target.value })} placeholder="🚀" className="w-12 text-center" maxLength={4} />
              <Input value={l.titel} onChange={(e) => updateLeistung(li, { titel: e.target.value })} placeholder="Titel" className="flex-1" maxLength={100} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeLeistung(li)} className="text-destructive h-9 w-9"><Trash2 size={12} /></Button>
            </div>
            <div className="flex gap-1 items-start">
              <Textarea value={l.beschreibung} onChange={(e) => updateLeistung(li, { beschreibung: e.target.value })}
                placeholder="Beschreibung" rows={1} maxLength={300} className="flex-1 min-h-[36px]" />
              <RephraseButton password={password} text={l.beschreibung} kontext="leistung"
                onResult={(t) => updateLeistung(li, { beschreibung: t.slice(0, 300) })} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Add-ons in diesem Paket ({paket.optionen.length}/4)</Label>
          <Button type="button" size="sm" variant="outline" onClick={addOption} disabled={paket.optionen.length >= 4} className="h-7 text-xs">
            <Plus size={12} /> Option
          </Button>
        </div>
        {paket.optionen.map((o, oi) => (
          <div key={o.id} className="rounded-lg border p-2 space-y-1.5 bg-background">
            <div className="flex gap-1.5">
              <Input value={o.emoji} onChange={(e) => updateOption(oi, { emoji: e.target.value })} placeholder="✨" className="w-12 text-center" maxLength={4} />
              <Input value={o.titel} onChange={(e) => updateOption(oi, { titel: e.target.value })} placeholder="Titel" className="flex-1" maxLength={100} />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(oi)} className="text-destructive h-9 w-9"><Trash2 size={12} /></Button>
            </div>
            <Textarea value={o.beschreibung} onChange={(e) => updateOption(oi, { beschreibung: e.target.value })} placeholder="Beschreibung" rows={1} maxLength={200} />
            <div className="grid grid-cols-[1fr,110px] gap-1.5">
              <Input type="number" min="1" value={o.preis} onChange={(e) => updateOption(oi, { preis: e.target.value })} placeholder="Preis €" />
              <Select value={o.preis_typ} onValueChange={(v) => updateOption(oi, { preis_typ: v as "einmalig" | "monatlich" })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="einmalig">einmalig</SelectItem>
                  <SelectItem value="monatlich">monatlich</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input type="url" value={o.stripe_link} onChange={(e) => updateOption(oi, { stripe_link: e.target.value })} placeholder="Stripe-Link (Paket + Add-on)" />
          </div>
        ))}
      </div>
    </div>
  );
}
