import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2, Save, Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  Eye, EyeOff, Image as ImageIcon, Sparkles, Clock, Users,
  HelpCircle, Phone, MessageSquare, Briefcase, Link2, Globe,
} from "lucide-react";

type Settings = {
  id: number;
  page_key: string;
  total_slots: number;
  taken_slots: number;
  countdown_target: string | null;
  countdown_mode: string;
  hero_badge_text: string;
  hero_h1_line1: string;
  hero_h1_line2: string;
  hero_h1_line3: string;
  hero_subheadline: string;
  hero_cta_label: string;
  countdown_label: string;
  final_cta_headline: string;
  final_cta_subtext: string;
  final_cta_button: string;
  phone_number: string;
  show_countdown: boolean;
  show_slots: boolean;
  show_testimonials: boolean;
  show_demos: boolean;
  show_faq: boolean;
  show_pain_points: boolean;
  show_process: boolean;
};

type Demo = {
  id: string;
  trade: string;
  company: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
  portfolio_project_id?: string | null;
};

type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_visible: boolean;
};

type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  mockup_desktop_url: string;
  external_url: string;
  is_visible: boolean;
  sort_order: number;
};

// Lädt eine Datei direkt in den Storage-Bucket (signierte URL).
// Vermeidet, dass große Bilder als Base64 durch die Edge Function laufen.
const uploadFileToBucket = async (
  password: string,
  file: File,
  bucket: "portfolio-images" | "vorschau-demos",
): Promise<string> => {
  const { data, error } = await supabase.functions.invoke("admin-leads", {
    body: { password, action: "get-upload-url", bucket, fileName: file.name },
  });
  if (error || !data?.signedUrl) {
    throw new Error(data?.error || "Upload-URL konnte nicht erstellt werden");
  }
  const uploadRes = await fetch(data.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!uploadRes.ok) {
    throw new Error(`Upload fehlgeschlagen (${uploadRes.status})`);
  }
  return data.publicUrl as string;
};

// Datetime-local helper (keeps local timezone)
const isoToLocal = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60_000);
  return local.toISOString().slice(0, 16);
};
const localToISO = (local: string): string | null => {
  if (!local) return null;
  const d = new Date(local);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
};

export default function AdminVorschauTab({ password }: { password: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageKey, setPageKey] = useState<"v1" | "v2">("v2");
  const [settings, setSettings] = useState<Settings | null>(null);

  // Global slot settings (used by /lp/gesetz etc. via check-vorschau-availability)
  const [globalSettings, setGlobalSettings] = useState<Settings | null>(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);

  // Demo dialog
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  const [demoForm, setDemoForm] = useState({ trade: "", company: "", description: "", is_visible: true, portfolio_project_id: "" as string });
  const [demoImageFile, setDemoImageFile] = useState<File | null>(null);
  const [savingDemo, setSavingDemo] = useState(false);
  const [genDescLoading, setGenDescLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [genShotLoading, setGenShotLoading] = useState(false);

  // Combined slot section: which scope are we editing?
  const [slotScope, setSlotScope] = useState<"page" | "global">("page");
  const [autoCountLoading, setAutoCountLoading] = useState(false);

  const generateScreenshot = async () => {
    const url = screenshotUrl.trim();
    if (!url) {
      toast.error("Bitte eine URL eingeben.");
      return;
    }
    setGenShotLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-demo-screenshot", {
        body: { password, url },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message || "Fehler");
      const u = (data as any)?.image_url;
      if (!u) throw new Error("Kein Bild erhalten");
      setGeneratedImageUrl(u);
      setDemoImageFile(null);
      toast.success("Screenshot generiert");
    } catch (e: any) {
      toast.error(e?.message || "Generierung fehlgeschlagen");
    } finally {
      setGenShotLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!demoForm.company.trim()) {
      toast.error("Bitte zuerst den Firmennamen eingeben.");
      return;
    }
    setGenDescLoading(true);
    try {
      const existing = demos
        .filter(d => d.id !== editingDemo?.id && d.description?.trim())
        .map(d => d.description.trim());
      const { data, error } = await supabase.functions.invoke("generate-demo-description", {
        body: { trade: demoForm.trade, company: demoForm.company, existing },
      });
      if (error) throw error;
      const text = (data as any)?.description?.trim();
      if (!text) throw new Error("Keine Antwort erhalten");
      setDemoForm(f => ({ ...f, description: text }));
      toast.success("Beschreibung generiert");
    } catch (e: any) {
      toast.error(e?.message || "Generierung fehlgeschlagen");
    } finally {
      setGenDescLoading(false);
    }
  };

  // FAQ dialog
  const [showFaqDialog, setShowFaqDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", is_visible: true });
  const [savingFaq, setSavingFaq] = useState(false);

  const load = async () => {
    if (!password) {
      setLoading(false);
      toast.error("Nicht angemeldet — bitte Seite neu laden und erneut anmelden.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-get", pageKey },
    });
    setLoading(false);
    if (error || data?.error) {
      let msg = data?.error || "Fehler beim Laden";
      // Extract real error body from FunctionsHttpError
      if (error && (error as any).context?.body) {
        try {
          const text = await new Response((error as any).context.body).text();
          const parsed = JSON.parse(text);
          msg = parsed.error || msg;
        } catch {}
      }
      toast.error(msg);
      return;
    }
    setSettings(data.settings);
    setDemos(data.demos || []);
    setFaqs(data.faqs || []);
    setPortfolio(data.portfolio || []);
  };

  useEffect(() => {
    if (password) {
      load();
      loadGlobal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, pageKey]);

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings(s => (s ? { ...s, ...patch } : s));
  };

  const loadGlobal = async () => {
    setGlobalLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-get", pageKey: "global" },
    });
    setGlobalLoading(false);
    if (error || data?.error) {
      // Silently ignore — global may not exist yet
      return;
    }
    setGlobalSettings(data.settings);
  };

  const updateGlobalSettings = (patch: Partial<Settings>) => {
    setGlobalSettings(s => (s ? { ...s, ...patch } : s));
  };

  const [globalCountdownSaving, setGlobalCountdownSaving] = useState(false);
  const saveGlobalCountdown = async () => {
    if (!globalSettings) return;
    setGlobalCountdownSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password,
        action: "vorschau-update-settings",
        settings: {
          countdown_mode: globalSettings.countdown_mode,
          countdown_target: globalSettings.countdown_target,
          countdown_label: globalSettings.countdown_label,
          show_countdown: globalSettings.show_countdown,
        },
        pageKey: "global",
      },
    });
    setGlobalCountdownSaving(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    setGlobalSettings(data.settings);
    toast.success("Globaler Countdown gespeichert – sofort live auf allen Seiten!");
  };

  const saveGlobalSettings = async () => {
    if (!globalSettings) return;
    setGlobalSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-update-settings", settings: { total_slots: globalSettings.total_slots }, pageKey: "global" },
    });
    setGlobalSaving(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    setGlobalSettings(data.settings);
    toast.success("Globale Plätze gespeichert – sofort live auf allen Seiten!");
  };

  const saveSettings = async () => {
    if (!settings) return;
    if (settings.taken_slots > settings.total_slots) {
      toast.error("Vergebene Plätze dürfen nicht größer als die Gesamtanzahl sein.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-update-settings", settings, pageKey },
    });
    setSaving(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    setSettings(data.settings);
    toast.success("Einstellungen gespeichert – live auf der Seite!");
  };

  // Save just the slot fields for the currently selected scope.
  const saveSlots = async () => {
    const target = slotScope === "global" ? globalSettings : settings;
    if (!target) return;
    if (target.taken_slots > target.total_slots) {
      toast.error("Vergebene Plätze dürfen nicht größer als die Gesamtanzahl sein.");
      return;
    }
    if (slotScope === "global") {
      setGlobalSaving(true);
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        body: {
          password,
          action: "vorschau-update-settings",
          settings: { total_slots: target.total_slots, taken_slots: target.taken_slots },
          pageKey: "global",
        },
      });
      setGlobalSaving(false);
      if (error || data?.error) { toast.error(data?.error || "Fehler beim Speichern"); return; }
      setGlobalSettings(data.settings);
      toast.success("Globale Plätze gespeichert – sofort live auf allen Seiten!");
    } else {
      setSaving(true);
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        body: {
          password,
          action: "vorschau-update-settings",
          settings: { ...settings!, total_slots: target.total_slots, taken_slots: target.taken_slots, show_slots: settings!.show_slots },
          pageKey,
        },
      });
      setSaving(false);
      if (error || data?.error) { toast.error(data?.error || "Fehler beim Speichern"); return; }
      setSettings(data.settings);
      toast.success("Plätze gespeichert – live auf der Seite!");
    }
  };

  // Auto-count: read real "slot_assigned" count for current month and write into the selected scope.
  const autoCountTaken = async () => {
    setAutoCountLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-vorschau-availability", { body: {} });
      if (error || !data) throw new Error(error?.message || "Konnte Anfragen nicht zählen");
      const total = (data as any).total as number;
      const available = (data as any).available as number;
      const taken = Math.max(0, total - available);
      if (slotScope === "global") {
        updateGlobalSettings({ taken_slots: taken });
      } else {
        updateSettings({ taken_slots: taken });
      }
      toast.success(`Aktuell ${taken} echte Anfrage${taken === 1 ? "" : "n"} diesen Monat gezählt`);
    } catch (e: any) {
      toast.error(e?.message || "Auto-Zählen fehlgeschlagen");
    } finally {
      setAutoCountLoading(false);
    }
  };

  // ===== Demo actions =====
  const openNewDemo = () => {
    setEditingDemo(null);
    setDemoForm({ trade: "", company: "", description: "", is_visible: true, portfolio_project_id: "" });
    setDemoImageFile(null);
    setScreenshotUrl("");
    setGeneratedImageUrl("");
    setShowDemoDialog(true);
  };
  const openEditDemo = (d: Demo) => {
    setEditingDemo(d);
    setDemoForm({ trade: d.trade, company: d.company, description: d.description, is_visible: d.is_visible, portfolio_project_id: d.portfolio_project_id || "" });
    setDemoImageFile(null);
    setGeneratedImageUrl("");
    const linked = d.portfolio_project_id ? portfolio.find(p => p.id === d.portfolio_project_id) : null;
    setScreenshotUrl(linked?.external_url || "");
    setShowDemoDialog(true);
  };
  const saveDemo = async () => {
    if (!demoForm.company.trim()) {
      toast.error("Bitte Firmennamen eingeben");
      return;
    }
    setSavingDemo(true);
    let uploadedImageUrl: string | undefined;
    if (demoImageFile) {
      try {
        uploadedImageUrl = await uploadFileToBucket(password, demoImageFile, "vorschau-demos");
      } catch (e) {
        setSavingDemo(false);
        toast.error(e instanceof Error ? e.message : "Bild-Upload fehlgeschlagen");
        return;
      }
    }
    const action = editingDemo ? "vorschau-demo-update" : "vorschau-demo-create";
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password, action,
        ...(editingDemo ? { demoId: editingDemo.id } : {}),
        ...demoForm,
        portfolio_project_id: demoForm.portfolio_project_id || null,
        ...(uploadedImageUrl ? { image_url: uploadedImageUrl } : {}),
        ...(!uploadedImageUrl && generatedImageUrl ? { image_url: generatedImageUrl } : {}),
        pageKey,
      },
    });
    setSavingDemo(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    setShowDemoDialog(false);
    toast.success(editingDemo ? "Demo aktualisiert" : "Demo erstellt");
    load();
  };
  const deleteDemo = async (id: string) => {
    if (!confirm("Demo wirklich löschen?")) return;
    const { error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-demo-delete", demoId: id },
    });
    if (error) { toast.error("Fehler beim Löschen"); return; }
    setDemos(prev => prev.filter(d => d.id !== id));
    toast.success("Demo gelöscht");
  };
  const toggleDemoVisibility = async (d: Demo) => {
    await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-demo-update", demoId: d.id, is_visible: !d.is_visible },
    });
    setDemos(prev => prev.map(x => x.id === d.id ? { ...x, is_visible: !x.is_visible } : x));
  };
  const moveDemo = async (i: number, dir: "up" | "down") => {
    const arr = [...demos];
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[i].sort_order;
    arr[i].sort_order = arr[j].sort_order;
    arr[j].sort_order = tmp;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setDemos(arr);
    await supabase.functions.invoke("admin-leads", {
      body: {
        password, action: "vorschau-demo-reorder",
        demos: arr.map(d => ({ id: d.id, sort_order: d.sort_order })),
      },
    });
  };

  // Quick-Add/Remove eines Portfolio-Projekts als Demo
  const togglePortfolioDemo = async (p: PortfolioProject, currentlyUsed: Demo | undefined) => {
    if (currentlyUsed) {
      const { error } = await supabase.functions.invoke("admin-leads", {
        body: { password, action: "vorschau-demo-delete", demoId: currentlyUsed.id },
      });
      if (error) { toast.error("Fehler beim Entfernen"); return; }
      setDemos(prev => prev.filter(d => d.id !== currentlyUsed.id));
      toast.success("Aus Demos entfernt");
    } else {
      const { data, error } = await supabase.functions.invoke("admin-leads", {
        body: {
          password, action: "vorschau-demo-create",
          trade: p.category || "",
          company: p.title,
          description: p.description || "",
          is_visible: true,
          portfolio_project_id: p.id,
          pageKey,
        },
      });
      if (error || data?.error) { toast.error(data?.error || "Fehler beim Hinzufügen"); return; }
      if (data?.demo) setDemos(prev => [...prev, data.demo]);
      toast.success("Als Demo hinzugefügt");
    }
  };

  // ===== FAQ actions =====
  const openNewFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: "", answer: "", is_visible: true });
    setShowFaqDialog(true);
  };
  const openEditFaq = (f: Faq) => {
    setEditingFaq(f);
    setFaqForm({ question: f.question, answer: f.answer, is_visible: f.is_visible });
    setShowFaqDialog(true);
  };
  const saveFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) {
      toast.error("Bitte Frage und Antwort eingeben");
      return;
    }
    setSavingFaq(true);
    const action = editingFaq ? "vorschau-faq-update" : "vorschau-faq-create";
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password, action,
        ...(editingFaq ? { faqId: editingFaq.id } : {}),
        ...faqForm,
        pageKey,
      },
    });
    setSavingFaq(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    setShowFaqDialog(false);
    toast.success(editingFaq ? "FAQ aktualisiert" : "FAQ erstellt");
    load();
  };
  const deleteFaq = async (id: string) => {
    if (!confirm("FAQ wirklich löschen?")) return;
    const { error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-faq-delete", faqId: id },
    });
    if (error) { toast.error("Fehler beim Löschen"); return; }
    setFaqs(prev => prev.filter(f => f.id !== id));
    toast.success("FAQ gelöscht");
  };
  const toggleFaqVisibility = async (f: Faq) => {
    await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-faq-update", faqId: f.id, is_visible: !f.is_visible },
    });
    setFaqs(prev => prev.map(x => x.id === f.id ? { ...x, is_visible: !x.is_visible } : x));
  };
  const moveFaq = async (i: number, dir: "up" | "down") => {
    const arr = [...faqs];
    const j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[i].sort_order;
    arr[i].sort_order = arr[j].sort_order;
    arr[j].sort_order = tmp;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setFaqs(arr);
    await supabase.functions.invoke("admin-leads", {
      body: {
        password, action: "vorschau-faq-reorder",
        faqs: arr.map(f => ({ id: f.id, sort_order: f.sort_order })),
      },
    });
  };

  if (loading || !settings) {
    return (
      <div className="text-center py-20">
        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} aria-hidden={true} focusable={false} />
        <p className="text-muted-foreground">Lade Vorschau-Einstellungen...</p>
      </div>
    );
  }

  const remaining = Math.max(0, settings.total_slots - settings.taken_slots);

  return (
    <div className="space-y-6">
      {/* Page switcher */}
      <div className="rounded-xl border border-border bg-card p-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium mr-2">Seite:</span>
        {([
          { key: "v2" as const, label: "/kostenlose-vorschau", path: "/kostenlose-vorschau" },
          { key: "v1" as const, label: "/kostenlose-vorschau-v2", path: "/kostenlose-vorschau-v2" },
        ]).map(p => (
          <Button
            key={p.key}
            variant={pageKey === p.key ? "gradient" : "outline"}
            size="sm"
            onClick={() => setPageKey(p.key)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {/* Hint banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Sparkles className="text-primary shrink-0 mt-0.5" size={18} aria-hidden={true} focusable={false} />
        <div className="text-sm">
          <p className="font-medium text-foreground">Live-Vorschau aktiv</p>
          <p className="text-muted-foreground">
            Alle Änderungen werden nach dem Speichern sofort auf{" "}
            <a href={pageKey === "v2" ? "/kostenlose-vorschau" : "/kostenlose-vorschau-v2"} target="_blank" rel="noreferrer" className="text-primary underline">
              {pageKey === "v2" ? "/kostenlose-vorschau" : "/kostenlose-vorschau-v2"}
            </a>{" "}
            sichtbar.
          </p>
        </div>
      </div>

      {/* SLOTS — combined page + global */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users size={16} className="text-primary" aria-hidden={true} focusable={false} /> Plätze &amp; Verknappung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Scope switch */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium mr-1">Gilt für:</span>
            <Button
              type="button"
              size="sm"
              variant={slotScope === "page" ? "gradient" : "outline"}
              onClick={() => setSlotScope("page")}
            >
              Diese Seite ({pageKey === "v2" ? "/kostenlose-vorschau" : "/kostenlose-vorschau-v2"})
            </Button>
            <Button
              type="button"
              size="sm"
              variant={slotScope === "global" ? "gradient" : "outline"}
              onClick={() => setSlotScope("global")}
              disabled={!globalSettings && !globalLoading}
            >
              <Globe size={14} className="mr-1" aria-hidden={true} focusable={false} />
              Global (alle Landingpages)
            </Button>
          </div>

          {slotScope === "global" && globalLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin" size={16} /> Lade globale Einstellungen…
            </div>
          ) : (() => {
            const active = slotScope === "global" ? globalSettings : settings;
            if (!active) {
              return <p className="text-sm text-muted-foreground">Einstellungen konnten nicht geladen werden.</p>;
            }
            const avail = Math.max(0, active.total_slots - active.taken_slots);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="combined-total-slots">Plätze gesamt</Label>
                    <Input
                      id="combined-total-slots"
                      type="number"
                      min={1}
                      max={999}
                      value={active.total_slots}
                      onChange={e => {
                        const v = Math.max(1, parseInt(e.target.value) || 1);
                        slotScope === "global" ? updateGlobalSettings({ total_slots: v }) : updateSettings({ total_slots: v });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="combined-taken-slots">Davon vergeben</Label>
                    <div className="flex gap-2">
                      <Input
                        id="combined-taken-slots"
                        type="number"
                        min={0}
                        max={active.total_slots}
                        value={active.taken_slots}
                        onChange={e => {
                          const v = Math.max(0, parseInt(e.target.value) || 0);
                          slotScope === "global" ? updateGlobalSettings({ taken_slots: v }) : updateSettings({ taken_slots: v });
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={autoCountTaken}
                        disabled={autoCountLoading}
                        title="Aus echten Anfragen (Status slot_assigned) im aktuellen Monat zählen"
                      >
                        {autoCountLoading ? <Loader2 className="animate-spin" size={14} /> : <><Sparkles size={14} className="mr-1" />Auto</>}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Verfügbar</Label>
                    <div className="h-10 flex items-center px-3 rounded-md border border-input bg-muted/40 font-semibold text-foreground">
                      {avail} {avail === 1 ? "Platz" : "Plätze"}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Beide Werte sind manuell editierbar. Der <strong>Auto-Button</strong> trägt automatisch die echten Anfragen
                  (Status <code>slot_assigned</code>, aktueller Monat) ein – danach kannst Du den Wert noch von Hand anpassen.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <Switch
                    checked={settings.show_slots}
                    onCheckedChange={v => updateSettings({ show_slots: v })}
                  />
                  <Label>Plätze-Anzeige auf der Seite einblenden (gilt pro Seite)</Label>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <Button
                    onClick={saveSlots}
                    disabled={slotScope === "global" ? globalSaving : saving}
                    variant="gradient"
                    size="sm"
                  >
                    {(slotScope === "global" ? globalSaving : saving)
                      ? <Loader2 className="animate-spin mr-2" size={16} />
                      : <Save className="mr-2" size={16} />}
                    {slotScope === "global" ? "Globale Plätze speichern" : "Plätze für diese Seite speichern"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {slotScope === "global"
                      ? "Wirkt sich sofort auf alle Landingpages aus (z. B. /lp/gesetz)."
                      : "Wirkt sich sofort auf die ausgewählte Seite aus."}
                  </span>
                </div>
              </>
            );
          })()}
        </CardContent>
      </Card>

      {/* COUNTDOWN — global für alle Landingpages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock size={16} className="text-primary" aria-hidden={true} focusable={false} />
            Countdown
            <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-primary">
              <Globe size={12} aria-hidden={true} focusable={false} /> Global
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {globalLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="animate-spin" size={16} /> Lade globalen Countdown…
            </div>
          ) : !globalSettings ? (
            <p className="text-sm text-muted-foreground">Globale Einstellungen konnten nicht geladen werden.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="countdown-mode">Modus</Label>
                  <select
                    id="countdown-mode"
                    value={globalSettings.countdown_mode}
                    onChange={e => updateGlobalSettings({ countdown_mode: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="end_of_month">Automatisch: Monatsende (23:59)</option>
                    <option value="fixed_date">Festes Datum / Uhrzeit</option>
                  </select>
                </div>
                {globalSettings.countdown_mode === "fixed_date" && (
                  <div>
                    <Label htmlFor="countdown-target">Ziel-Zeitpunkt</Label>
                    <Input
                      id="countdown-target"
                      type="datetime-local"
                      value={isoToLocal(globalSettings.countdown_target)}
                      onChange={e => updateGlobalSettings({ countdown_target: localToISO(e.target.value) })}
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="countdown-label">Label über dem Countdown</Label>
                <Input
                  id="countdown-label"
                  value={globalSettings.countdown_label}
                  onChange={e => updateGlobalSettings({ countdown_label: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={globalSettings.show_countdown}
                  onCheckedChange={v => updateGlobalSettings({ show_countdown: v })}
                />
                <Label>Countdown auf allen Landingpages einblenden</Label>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <Button
                  onClick={saveGlobalCountdown}
                  disabled={globalCountdownSaving}
                  variant="gradient"
                  size="sm"
                >
                  {globalCountdownSaving
                    ? <Loader2 className="animate-spin mr-2" size={16} />
                    : <Save className="mr-2" size={16} />}
                  Globalen Countdown speichern
                </Button>
                <span className="text-xs text-muted-foreground">
                  Wirkt sich sofort auf alle Landingpages aus (z. B. /kostenlose-vorschau, /lp/gesetz).
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* HERO TEXTE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles size={16} className="text-primary" aria-hidden={true} focusable={false} /> Hero-Texte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="badge">Verknappungs-Badge (oben)</Label>
            <Input id="badge" value={settings.hero_badge_text}
              onChange={e => updateSettings({ hero_badge_text: e.target.value })} />
            <p className="text-xs text-muted-foreground mt-1">
              Platzhalter: <code>{"{remaining}"}</code> · <code>{"{total}"}</code> · <code>{"{taken}"}</code> · <code>{"{month}"}</code>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Headline Zeile 1</Label>
              <Input value={settings.hero_h1_line1}
                onChange={e => updateSettings({ hero_h1_line1: e.target.value })} />
            </div>
            <div>
              <Label>Headline Zeile 2</Label>
              <Input value={settings.hero_h1_line2}
                onChange={e => updateSettings({ hero_h1_line2: e.target.value })} />
            </div>
            <div>
              <Label>Headline Zeile 3 (farbig)</Label>
              <Input value={settings.hero_h1_line3}
                onChange={e => updateSettings({ hero_h1_line3: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Subheadline</Label>
            <Textarea rows={2} value={settings.hero_subheadline}
              onChange={e => updateSettings({ hero_subheadline: e.target.value })} />
          </div>
          <div>
            <Label>CTA-Button Text (Hero)</Label>
            <Input value={settings.hero_cta_label}
              onChange={e => updateSettings({ hero_cta_label: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* FINAL CTA */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Finaler CTA-Banner (unten)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Input value={settings.final_cta_headline}
              onChange={e => updateSettings({ final_cta_headline: e.target.value })} />
          </div>
          <div>
            <Label>Subtext</Label>
            <Input value={settings.final_cta_subtext}
              onChange={e => updateSettings({ final_cta_subtext: e.target.value })} />
          </div>
          <div>
            <Label>Button-Text</Label>
            <Input value={settings.final_cta_button}
              onChange={e => updateSettings({ final_cta_button: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* PHONE & SECTIONS */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Header & Sektionen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone size={14} aria-hidden={true} focusable={false} /> Telefonnummer im Header</Label>
            <Input id="phone" value={settings.phone_number}
              onChange={e => updateSettings({ phone_number: e.target.value })}
              placeholder="+49 170 123 45 67" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {([
              { key: "show_pain_points" as const, label: "„Erkennst Du sich wieder?" },
              { key: "show_process" as const, label: "„In 3 Schritten zu Deiner Vorschau" },
              { key: "show_demos" as const, label: "Demo-Beispiele" },
              { key: "show_testimonials" as const, label: "Testimonials" },
              { key: "show_faq" as const, label: "FAQ" },
            ]).map(s => (
              <div key={s.key} className="flex items-center gap-3 rounded-md border border-border p-3">
                <Switch checked={settings[s.key]} onCheckedChange={v => updateSettings({ [s.key]: v } as Partial<Settings>)} />
                <Label className="cursor-pointer">{s.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SAVE BUTTON */}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button variant="gradient" size="lg" onClick={saveSettings} disabled={saving} className="shadow-xl">
          {saving ? <Loader2 className="animate-spin" size={18} aria-hidden={true} focusable={false} /> : <><Save size={16} aria-hidden={true} focusable={false} /> Einstellungen speichern</>}
        </Button>
      </div>

      {/* DEMOS */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ImageIcon size={16} className="text-primary" aria-hidden={true} focusable={false} /> Demo-Beispiele ({demos.length})
          </CardTitle>
          <Button variant="gradient" size="sm" onClick={openNewDemo}>
            <Plus size={14} aria-hidden={true} focusable={false} /> Neue Demo
          </Button>
        </CardHeader>
        <CardContent>
          {demos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Noch keine Demos. Lege das erste Beispiel an.</p>
          ) : (
            <div className="grid gap-3">
              {demos.map((d, i) => (
                <div key={d.id} className={`flex items-center gap-3 rounded-lg border border-border p-3 min-w-0 ${!d.is_visible ? "opacity-60" : ""}`}>
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                    {d.image_url
                      ? <img src={d.image_url} alt={d.company} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground" aria-hidden={true} focusable={false} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{d.company}</h4>
                      {!d.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Versteckt</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{d.trade} {d.description && `· ${d.description}`}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => moveDemo(i, "up")} disabled={i === 0} className="h-8 w-8"><ChevronUp size={14} aria-hidden={true} focusable={false} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveDemo(i, "down")} disabled={i === demos.length - 1} className="h-8 w-8"><ChevronDown size={14} aria-hidden={true} focusable={false} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleDemoVisibility(d)} className="h-8 w-8">
                      {d.is_visible ? <Eye size={14} aria-hidden={true} focusable={false} /> : <EyeOff size={14} aria-hidden={true} focusable={false} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDemo(d)} className="h-8 w-8"><Pencil size={14} aria-hidden={true} focusable={false} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteDemo(d.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 size={14} aria-hidden={true} focusable={false} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PORTFOLIO QUICK-LINK */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Briefcase size={16} className="text-primary" aria-hidden={true} focusable={false} /> Portfolio-Projekte als Demos verwenden
          </CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Keine Portfolio-Projekte vorhanden. Lege erst Projekte im Portfolio-Tab an.
            </p>
          ) : (
            <div className="grid gap-2">
              {portfolio.map(p => {
                const usedDemo = demos.find(d => d.portfolio_project_id === p.id);
                const used = !!usedDemo;
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3 min-w-0">
                    <div className="w-14 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                      {(p.mockup_desktop_url || p.image_url) ? (
                        <img src={p.mockup_desktop_url || p.image_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon size={14} className="text-muted-foreground" aria-hidden={true} focusable={false} /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{p.title}</h4>
                        {used && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">In Vorschau</span>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{p.category}{p.description && ` · ${p.description}`}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch checked={used} onCheckedChange={() => togglePortfolioDemo(p, usedDemo)} />
                      <span className="text-xs text-muted-foreground">{used ? "An" : "Aus"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQS */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <HelpCircle size={16} className="text-primary" aria-hidden={true} focusable={false} /> FAQs ({faqs.length})
          </CardTitle>
          <Button variant="gradient" size="sm" onClick={openNewFaq}>
            <Plus size={14} aria-hidden={true} focusable={false} /> Neue Frage
          </Button>
        </CardHeader>
        <CardContent>
          {faqs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Noch keine FAQs.</p>
          ) : (
            <div className="grid gap-3">
              {faqs.map((f, i) => (
                <div key={f.id} className={`flex items-start gap-3 rounded-lg border border-border p-3 ${!f.is_visible ? "opacity-60" : ""}`}>
                  <MessageSquare size={16} className="text-primary mt-1 shrink-0" aria-hidden={true} focusable={false} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{f.question}</h4>
                      {!f.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Versteckt</span>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => moveFaq(i, "up")} disabled={i === 0} className="h-8 w-8"><ChevronUp size={14} aria-hidden={true} focusable={false} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveFaq(i, "down")} disabled={i === faqs.length - 1} className="h-8 w-8"><ChevronDown size={14} aria-hidden={true} focusable={false} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleFaqVisibility(f)} className="h-8 w-8">
                      {f.is_visible ? <Eye size={14} aria-hidden={true} focusable={false} /> : <EyeOff size={14} aria-hidden={true} focusable={false} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditFaq(f)} className="h-8 w-8"><Pencil size={14} aria-hidden={true} focusable={false} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFaq(f.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 size={14} aria-hidden={true} focusable={false} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DEMO DIALOG */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingDemo ? "Demo bearbeiten" : "Neue Demo"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2"><Link2 size={14} aria-hidden={true} focusable={false} /> Aus Portfolio übernehmen (optional)</Label>
              <select
                value={demoForm.portfolio_project_id}
                onChange={e => {
                  const pid = e.target.value;
                  const p = portfolio.find(x => x.id === pid);
                  setDemoForm(f => ({
                    ...f,
                    portfolio_project_id: pid,
                    ...(p ? {
                      trade: f.trade || p.category || "",
                      company: f.company || p.title || "",
                      description: f.description || p.description || "",
                    } : {}),
                  }));
                  if (p?.external_url && !screenshotUrl) setScreenshotUrl(p.external_url);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">— Kein Portfolio-Projekt verlinkt —</option>
                {portfolio.map(p => (
                  <option key={p.id} value={p.id}>{p.title}{p.category ? ` (${p.category})` : ""}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Wenn verlinkt, werden Bild und Daten des Portfolio-Projekts in der Vorschau-Demo verwendet (falls hier nichts überschrieben wird).
              </p>
            </div>
            <div>
              <Label>Branche / Badge</Label>
              <Input value={demoForm.trade} onChange={e => setDemoForm(f => ({ ...f, trade: e.target.value }))} placeholder="z.B. Elektriker" />
            </div>
            <div>
              <Label>Firmenname *</Label>
              <Input value={demoForm.company} onChange={e => setDemoForm(f => ({ ...f, company: e.target.value }))} placeholder="Mustermann GmbH" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Beschreibung</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-primary hover:text-primary"
                  onClick={generateDescription}
                  disabled={genDescLoading || !demoForm.company.trim()}
                >
                  {genDescLoading ? <Loader2 className="animate-spin" size={12} aria-hidden={true} focusable={false} /> : <Sparkles size={12} aria-hidden={true} focusable={false} />}
                  Mit KI generieren
                </Button>
              </div>
              <Textarea rows={2} value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Vorschaubild</Label>
              <div className="rounded-lg border border-dashed border-border p-3 space-y-3 bg-muted/20">
                <div>
                  <Label className="text-xs text-muted-foreground">Auto-Screenshot der Webseite (Cookie-Banner werden ausgeblendet)</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="https://beispiel.de"
                      value={screenshotUrl}
                      onChange={e => setScreenshotUrl(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline-primary"
                      onClick={generateScreenshot}
                      disabled={genShotLoading || !screenshotUrl.trim()}
                      className="shrink-0"
                    >
                      {genShotLoading ? <Loader2 className="animate-spin" size={14} aria-hidden={true} focusable={false} /> : <Sparkles size={14} aria-hidden={true} focusable={false} />}
                      Screenshot
                    </Button>
                  </div>
                  {generatedImageUrl && (
                    <div className="mt-2">
                      <img src={generatedImageUrl} alt="Generierte Vorschau" className="w-full max-h-48 object-cover rounded-md border border-border" />
                      <p className="text-xs text-muted-foreground mt-1">Wird beim Speichern als Vorschaubild verwendet.</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">oder</span>
                  <div className="h-px bg-border flex-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Bild-Datei hochladen</Label>
                  <Input type="file" accept="image/*" onChange={e => { setDemoImageFile(e.target.files?.[0] || null); if (e.target.files?.[0]) setGeneratedImageUrl(""); }} className="mt-1" />
                  {editingDemo?.image_url && !demoImageFile && !generatedImageUrl && (
                    <p className="text-xs text-muted-foreground mt-1">Aktuelles Bild bleibt bestehen.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={demoForm.is_visible} onCheckedChange={v => setDemoForm(f => ({ ...f, is_visible: v }))} />
              <Label>Sichtbar</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoDialog(false)}>Abbrechen</Button>
            <Button variant="gradient" onClick={saveDemo} disabled={savingDemo}>
              {savingDemo ? <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} /> : (editingDemo ? "Speichern" : "Erstellen")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ DIALOG */}
      <Dialog open={showFaqDialog} onOpenChange={setShowFaqDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "FAQ bearbeiten" : "Neue Frage"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Frage *</Label>
              <Input value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} />
            </div>
            <div>
              <Label>Antwort *</Label>
              <Textarea rows={4} value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={faqForm.is_visible} onCheckedChange={v => setFaqForm(f => ({ ...f, is_visible: v }))} />
              <Label>Sichtbar</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFaqDialog(false)}>Abbrechen</Button>
            <Button variant="gradient" onClick={saveFaq} disabled={savingFaq}>
              {savingFaq ? <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} /> : (editingFaq ? "Speichern" : "Erstellen")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}