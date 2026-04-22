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
  HelpCircle, Phone, MessageSquare, Briefcase, Link2,
} from "lucide-react";

type Settings = {
  id: number;
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

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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
  const [settings, setSettings] = useState<Settings | null>(null);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>([]);

  // Demo dialog
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  const [demoForm, setDemoForm] = useState({ trade: "", company: "", description: "", is_visible: true, portfolio_project_id: "" as string });
  const [demoImageFile, setDemoImageFile] = useState<File | null>(null);
  const [savingDemo, setSavingDemo] = useState(false);

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
      body: { password, action: "vorschau-get" },
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
    if (password) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const updateSettings = (patch: Partial<Settings>) => {
    setSettings(s => (s ? { ...s, ...patch } : s));
  };

  const saveSettings = async () => {
    if (!settings) return;
    if (settings.taken_slots > settings.total_slots) {
      toast.error("Vergebene Plätze dürfen nicht größer als die Gesamtanzahl sein.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "vorschau-update-settings", settings },
    });
    setSaving(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    setSettings(data.settings);
    toast.success("Einstellungen gespeichert – live auf der Seite!");
  };

  // ===== Demo actions =====
  const openNewDemo = () => {
    setEditingDemo(null);
    setDemoForm({ trade: "", company: "", description: "", is_visible: true, portfolio_project_id: "" });
    setDemoImageFile(null);
    setShowDemoDialog(true);
  };
  const openEditDemo = (d: Demo) => {
    setEditingDemo(d);
    setDemoForm({ trade: d.trade, company: d.company, description: d.description, is_visible: d.is_visible, portfolio_project_id: d.portfolio_project_id || "" });
    setDemoImageFile(null);
    setShowDemoDialog(true);
  };
  const saveDemo = async () => {
    if (!demoForm.company.trim()) {
      toast.error("Bitte Firmennamen eingeben");
      return;
    }
    setSavingDemo(true);
    let image_base64: string | undefined;
    let image_name: string | undefined;
    if (demoImageFile) {
      image_base64 = await fileToBase64(demoImageFile);
      image_name = demoImageFile.name;
    }
    const action = editingDemo ? "vorschau-demo-update" : "vorschau-demo-create";
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password, action,
        ...(editingDemo ? { demoId: editingDemo.id } : {}),
        ...demoForm,
        portfolio_project_id: demoForm.portfolio_project_id || null,
        ...(image_base64 ? { image_base64, image_name } : {}),
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
        <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
        <p className="text-muted-foreground">Lade Vorschau-Einstellungen...</p>
      </div>
    );
  }

  const remaining = Math.max(0, settings.total_slots - settings.taken_slots);

  return (
    <div className="space-y-6">
      {/* Hint banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Sparkles className="text-primary shrink-0 mt-0.5" size={18} />
        <div className="text-sm">
          <p className="font-medium text-foreground">Live-Vorschau aktiv</p>
          <p className="text-muted-foreground">
            Alle Änderungen werden nach dem Speichern sofort auf{" "}
            <a href="/kostenlose-vorschau" target="_blank" rel="noreferrer" className="text-primary underline">
              /kostenlose-vorschau
            </a>{" "}
            sichtbar.
          </p>
        </div>
      </div>

      {/* SLOTS */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users size={16} className="text-primary" /> Plätze (Verknappung)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total-slots">Plätze gesamt</Label>
              <Input id="total-slots" type="number" min={1} max={999}
                value={settings.total_slots}
                onChange={e => updateSettings({ total_slots: Math.max(1, parseInt(e.target.value) || 1) })}
              />
            </div>
            <div>
              <Label htmlFor="taken-slots">Davon vergeben</Label>
              <Input id="taken-slots" type="number" min={0} max={settings.total_slots}
                value={settings.taken_slots}
                onChange={e => updateSettings({ taken_slots: Math.max(0, parseInt(e.target.value) || 0) })}
              />
            </div>
            <div>
              <Label>Verfügbar</Label>
              <div className="h-10 flex items-center px-3 rounded-md border border-input bg-muted/40 font-semibold text-foreground">
                {remaining} {remaining === 1 ? "Platz" : "Plätze"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Switch checked={settings.show_slots} onCheckedChange={v => updateSettings({ show_slots: v })} />
            <Label>Plätze-Anzeige auf der Seite einblenden</Label>
          </div>
        </CardContent>
      </Card>

      {/* COUNTDOWN */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock size={16} className="text-primary" /> Countdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="countdown-mode">Modus</Label>
              <select
                id="countdown-mode"
                value={settings.countdown_mode}
                onChange={e => updateSettings({ countdown_mode: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="end_of_month">Automatisch: Monatsende (23:59)</option>
                <option value="fixed_date">Festes Datum / Uhrzeit</option>
              </select>
            </div>
            {settings.countdown_mode === "fixed_date" && (
              <div>
                <Label htmlFor="countdown-target">Ziel-Zeitpunkt</Label>
                <Input
                  id="countdown-target"
                  type="datetime-local"
                  value={isoToLocal(settings.countdown_target)}
                  onChange={e => updateSettings({ countdown_target: localToISO(e.target.value) })}
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="countdown-label">Label über dem Countdown</Label>
            <Input id="countdown-label" value={settings.countdown_label}
              onChange={e => updateSettings({ countdown_label: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={settings.show_countdown} onCheckedChange={v => updateSettings({ show_countdown: v })} />
            <Label>Countdown auf der Seite einblenden</Label>
          </div>
        </CardContent>
      </Card>

      {/* HERO TEXTE */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Hero-Texte
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
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone size={14} /> Telefonnummer im Header</Label>
            <Input id="phone" value={settings.phone_number}
              onChange={e => updateSettings({ phone_number: e.target.value })}
              placeholder="+49 170 123 45 67" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {([
              { key: "show_pain_points" as const, label: "„Erkennst du dich wieder?" },
              { key: "show_process" as const, label: "„In 3 Schritten zu deiner Vorschau" },
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
          {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Einstellungen speichern</>}
        </Button>
      </div>

      {/* DEMOS */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ImageIcon size={16} className="text-primary" /> Demo-Beispiele ({demos.length})
          </CardTitle>
          <Button variant="gradient" size="sm" onClick={openNewDemo}>
            <Plus size={14} /> Neue Demo
          </Button>
        </CardHeader>
        <CardContent>
          {demos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Noch keine Demos. Lege das erste Beispiel an.</p>
          ) : (
            <div className="grid gap-3">
              {demos.map((d, i) => (
                <div key={d.id} className={`flex items-center gap-3 rounded-lg border border-border p-3 ${!d.is_visible ? "opacity-60" : ""}`}>
                  <div className="w-16 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                    {d.image_url
                      ? <img src={d.image_url} alt={d.company} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{d.company}</h4>
                      {!d.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Versteckt</span>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{d.trade} {d.description && `· ${d.description}`}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => moveDemo(i, "up")} disabled={i === 0} className="h-8 w-8"><ChevronUp size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveDemo(i, "down")} disabled={i === demos.length - 1} className="h-8 w-8"><ChevronDown size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleDemoVisibility(d)} className="h-8 w-8">
                      {d.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDemo(d)} className="h-8 w-8"><Pencil size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteDemo(d.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 size={14} /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQS */}
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <HelpCircle size={16} className="text-primary" /> FAQs ({faqs.length})
          </CardTitle>
          <Button variant="gradient" size="sm" onClick={openNewFaq}>
            <Plus size={14} /> Neue Frage
          </Button>
        </CardHeader>
        <CardContent>
          {faqs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Noch keine FAQs.</p>
          ) : (
            <div className="grid gap-3">
              {faqs.map((f, i) => (
                <div key={f.id} className={`flex items-start gap-3 rounded-lg border border-border p-3 ${!f.is_visible ? "opacity-60" : ""}`}>
                  <MessageSquare size={16} className="text-primary mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{f.question}</h4>
                      {!f.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Versteckt</span>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => moveFaq(i, "up")} disabled={i === 0} className="h-8 w-8"><ChevronUp size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveFaq(i, "down")} disabled={i === faqs.length - 1} className="h-8 w-8"><ChevronDown size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleFaqVisibility(f)} className="h-8 w-8">
                      {f.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditFaq(f)} className="h-8 w-8"><Pencil size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteFaq(f.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 size={14} /></Button>
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
              <Label className="flex items-center gap-2"><Link2 size={14} /> Aus Portfolio übernehmen (optional)</Label>
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
              <Label>Beschreibung</Label>
              <Textarea rows={2} value={demoForm.description} onChange={e => setDemoForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Vorschaubild</Label>
              <Input type="file" accept="image/*" onChange={e => setDemoImageFile(e.target.files?.[0] || null)} />
              {editingDemo?.image_url && !demoImageFile && (
                <p className="text-xs text-muted-foreground mt-1">Aktuelles Bild bleibt bestehen.</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={demoForm.is_visible} onCheckedChange={v => setDemoForm(f => ({ ...f, is_visible: v }))} />
              <Label>Sichtbar</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDemoDialog(false)}>Abbrechen</Button>
            <Button variant="gradient" onClick={saveDemo} disabled={savingDemo}>
              {savingDemo ? <Loader2 className="animate-spin" size={16} /> : (editingDemo ? "Speichern" : "Erstellen")}
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
              {savingFaq ? <Loader2 className="animate-spin" size={16} /> : (editingFaq ? "Speichern" : "Erstellen")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}