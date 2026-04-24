import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Lock, Trash2, RefreshCw, Mail, Phone, User, Calendar, Loader2,
  Building2, BarChart3, Users, Eye, TrendingUp, Monitor, Smartphone,
  Tablet, Globe, Clock, FileDown, ArrowUpRight, Image, Plus, Pencil,
  ChevronUp, ChevronDown, EyeOff, FolderOpen, Star, MessageSquare, Sparkles,
  CheckCircle2, Briefcase, Target, Flame, Link as LinkIcon, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";
import AdminVorschauTab from "@/components/admin/AdminVorschauTab";

interface Lead {
  id: string;
  first_name: string;
  company_name: string;
  email: string;
  phone: string;
  created_at: string;
  booking_date: string | null;
  booking_time: string | null;
  contact_method: string | null;
  status: "new" | "qualified" | "rejected" | "customer";
  slot_reserved: boolean;
  trade: string | null;
  trade_other: string | null;
  has_website: string | null;
  goals: string[] | null;
  urgency: string | null;
  current_website: string | null;
  notes: string | null;
}

interface Analytics {
  totalViews: number;
  viewsToday: number;
  leadsCount: number;
  conversionRate: string;
  devices: Record<string, number>;
  topPages: { path: string; count: number }[];
  topSources: { source: string; count: number }[];
  hourly: number[];
  topRegions: { region: string; count: number }[];
  dailyData: { date: string; count: number }[];
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  result: string;
  image_url: string;
  external_url: string;
  mockup_desktop_url: string;
  mockup_mobile_url: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  result: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(250, 56%, 65%)",
  "hsl(250, 56%, 35%)",
  "hsl(200, 50%, 50%)",
];

const PAGE_NAMES: Record<string, string> = {
  "/": "Startseite",
  "/leistungen": "Leistungen",
  "/ueber-uns": "Über uns",
  "/portfolio": "Portfolio",
  "/kontakt": "Kontakt",
  "/webdesign-agentur": "Webdesign Agentur",
  "/website-erstellen-lassen": "Website erstellen",
  "/landingpage-erstellen-lassen": "Landingpage",
  "/website-relaunch": "Website Relaunch",
  "/conversion-optimierung": "Conversion Optimierung",
  "/kostenloser-website-check": "Website Check",
  "/webdesign-preise": "Webdesign Preise",
  "/datenschutz": "Datenschutz",
  "/impressum": "Impressum",
};

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === "mobile") return <Smartphone size={14} />;
  if (type === "tablet") return <Tablet size={14} />;
  return <Monitor size={14} />;
};

const AdminLeads = () => {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "portfolio" | "testimonials" | "vorschau">("dashboard");
  const [leadStatusFilter, setLeadStatusFilter] = useState<"all" | "new" | "qualified" | "rejected" | "customer">("all");
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Portfolio state
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "", category: "", description: "", result: "", external_url: "", is_visible: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  const [generatingMockup, setGeneratingMockup] = useState(false);

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "", role: "", text: "", result: "", is_visible: true,
  });
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  const parseInvokeError = async (error: any, data: any): Promise<string | null> => {
    if (data?.error) return data.error;
    if (error) {
      try {
        if (error.context?.body) {
          const text = await new Response(error.context.body).text();
          const parsed = JSON.parse(text);
          return parsed.error || error.message;
        }
      } catch {}
      return error.message || "Unbekannter Fehler";
    }
    return null;
  };

  const fetchLeads = useCallback(async (pw?: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password: pw || password, action: "list" },
    });
    setLoading(false);
    const errMsg = await parseInvokeError(error, data);
    if (errMsg) {
      toast.error(errMsg);
      if (errMsg === "Ungültiges Passwort") setAuthenticated(false);
      return;
    }
    setLeads(data.leads || []);
    setAuthenticated(true);
  }, [password]);

  const fetchAnalytics = useCallback(async (pw?: string) => {
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password: pw || password, action: "analytics" },
    });
    const errMsg = await parseInvokeError(error, data);
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setAnalytics(data.analytics);
  }, [password]);

  const fetchPortfolio = useCallback(async (pw?: string) => {
    setPortfolioLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password: pw || password, action: "portfolio-list" },
    });
    setPortfolioLoading(false);
    const errMsg = await parseInvokeError(error, data);
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setProjects(data.projects || []);
  }, [password]);

  const fetchTestimonials = useCallback(async (pw?: string) => {
    setTestimonialsLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password: pw || password, action: "testimonials-list" },
    });
    setTestimonialsLoading(false);
    const errMsg = await parseInvokeError(error, data);
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setTestimonials(data.testimonials || []);
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    sessionStorage.setItem("admin_pw", password);
    await Promise.all([fetchLeads(), fetchAnalytics(), fetchPortfolio(), fetchTestimonials()]);
    setLoading(false);
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm("Lead wirklich löschen?")) return;
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "delete", leadId },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Löschen");
      return;
    }
    toast.success("Lead gelöscht");
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  const updateLeadStatus = async (
    leadId: string,
    newStatus: "new" | "qualified" | "rejected" | "customer",
    sendEmail = false,
  ) => {
    setUpdatingLeadId(leadId);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "update-lead-status", leadId, newStatus, sendEmail },
    });
    setUpdatingLeadId(null);
    const errMsg = await parseInvokeError(error, data);
    if (errMsg) {
      toast.error(errMsg);
      return;
    }
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, ...data.lead } : l)));
    if (newStatus === "qualified") {
      toast.success(sendEmail ? "Platz reserviert & Bestätigung gesendet" : "Platz reserviert");
    } else if (newStatus === "rejected") {
      toast.success("Lead abgelehnt – Platz freigegeben");
    } else if (newStatus === "customer") {
      toast.success("Als Kunde markiert");
    } else {
      toast.success("Status zurückgesetzt");
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "Name", "Firma", "E-Mail", "Telefon", "Datum",
      "Branche", "Aktuelle Webseite vorhanden?", "Ziele", "Dringlichkeit",
      "Webseiten-URL", "Anmerkungen", "Termin-Datum", "Termin-Zeit", "Kontaktweg", "Status",
    ];
    const esc = (v: string) => `"${(v || "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    const rows = leads.map(l => [
      l.first_name, l.company_name || "", l.email, l.phone,
      new Date(l.created_at).toLocaleDateString("de-DE"),
      l.trade === "Sonstiges" && l.trade_other ? `Sonstiges: ${l.trade_other}` : (l.trade || ""),
      l.has_website || "",
      (l.goals || []).join(", "),
      l.urgency || "",
      l.current_website || "",
      l.notes || "",
      l.booking_date || "",
      l.booking_time || "",
      l.contact_method || "",
      l.status || "new",
    ].map(esc));
    const csv = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchLeads(), fetchAnalytics(), fetchPortfolio(), fetchTestimonials()]);
    setLoading(false);
  };

  // Portfolio actions
  const openNewProject = () => {
    setEditingProject(null);
    setProjectForm({ title: "", category: "", description: "", result: "", external_url: "", is_visible: true });
    setImageFile(null);
    setShowProjectDialog(true);
  };

  const openEditProject = (p: PortfolioProject) => {
    setEditingProject(p);
    setProjectForm({
      title: p.title, category: p.category, description: p.description,
      result: p.result, external_url: p.external_url || "", is_visible: p.is_visible,
    });
    setImageFile(null);
    setShowProjectDialog(true);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const saveProject = async () => {
    if (!projectForm.title.trim()) {
      toast.error("Bitte Titel eingeben");
      return;
    }
    setSavingProject(true);

    let image_base64: string | undefined;
    let image_name: string | undefined;
    if (imageFile) {
      image_base64 = await fileToBase64(imageFile);
      image_name = imageFile.name;
    }

    const action = editingProject ? "portfolio-update" : "portfolio-create";
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password, action,
        ...(editingProject ? { projectId: editingProject.id } : {}),
        ...projectForm,
        ...(image_base64 ? { image_base64, image_name } : {}),
      },
    });

    setSavingProject(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    toast.success(editingProject ? "Projekt aktualisiert" : "Projekt erstellt");
    setShowProjectDialog(false);
    fetchPortfolio();
  };

  const generateMockup = async (project: PortfolioProject) => {
    if (!project.external_url) {
      toast.error("Bitte zuerst einen externen Link eingeben");
      return;
    }
    setGeneratingMockup(true);
    toast.info("Mockup wird generiert... Das kann einige Sekunden dauern.");
    const { data, error } = await supabase.functions.invoke("generate-mockup", {
      body: { password, url: project.external_url, projectId: project.id },
    });
    setGeneratingMockup(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler bei der Mockup-Generierung");
      return;
    }
    toast.success("Mockup erfolgreich generiert!");
    setProjects(prev => prev.map(p => p.id === project.id ? {
      ...p,
      mockup_desktop_url: data.mockup_desktop_url,
      mockup_mobile_url: data.mockup_mobile_url,
    } : p));
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Projekt wirklich löschen?")) return;
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "portfolio-delete", projectId: id },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Löschen");
      return;
    }
    toast.success("Projekt gelöscht");
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleVisibility = async (p: PortfolioProject) => {
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "portfolio-update", projectId: p.id, is_visible: !p.is_visible },
    });
    if (error || data?.error) {
      toast.error("Fehler beim Aktualisieren");
      return;
    }
    setProjects(prev => prev.map(proj => proj.id === p.id ? { ...proj, is_visible: !proj.is_visible } : proj));
  };

  const moveProject = async (index: number, direction: "up" | "down") => {
    const newProjects = [...projects];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newProjects.length) return;

    const tempOrder = newProjects[index].sort_order;
    newProjects[index].sort_order = newProjects[swapIndex].sort_order;
    newProjects[swapIndex].sort_order = tempOrder;
    [newProjects[index], newProjects[swapIndex]] = [newProjects[swapIndex], newProjects[index]];

    setProjects(newProjects);
    await supabase.functions.invoke("admin-leads", {
      body: {
        password, action: "portfolio-reorder",
        projects: newProjects.map(p => ({ id: p.id, sort_order: p.sort_order })),
      },
    });
  };

  // Testimonial actions
  const openNewTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({ name: "", role: "", text: "", result: "", is_visible: true });
    setShowTestimonialDialog(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTestimonialForm({ name: t.name, role: t.role, text: t.text, result: t.result, is_visible: t.is_visible });
    setShowTestimonialDialog(true);
  };

  const saveTestimonial = async () => {
    if (!testimonialForm.name.trim() || !testimonialForm.text.trim()) {
      toast.error("Bitte Name und Text eingeben");
      return;
    }
    setSavingTestimonial(true);
    const action = editingTestimonial ? "testimonials-update" : "testimonials-create";
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: {
        password, action,
        ...(editingTestimonial ? { testimonialId: editingTestimonial.id } : {}),
        ...testimonialForm,
      },
    });
    setSavingTestimonial(false);
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Speichern");
      return;
    }
    toast.success(editingTestimonial ? "Referenz aktualisiert" : "Referenz erstellt");
    setShowTestimonialDialog(false);
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Referenz wirklich löschen?")) return;
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "testimonials-delete", testimonialId: id },
    });
    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Löschen");
      return;
    }
    toast.success("Referenz gelöscht");
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const toggleTestimonialVisibility = async (t: Testimonial) => {
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password, action: "testimonials-update", testimonialId: t.id, is_visible: !t.is_visible },
    });
    if (error || data?.error) {
      toast.error("Fehler beim Aktualisieren");
      return;
    }
    setTestimonials(prev => prev.map(item => item.id === t.id ? { ...item, is_visible: !item.is_visible } : item));
  };

  const moveTestimonial = async (index: number, direction: "up" | "down") => {
    const newList = [...testimonials];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newList.length) return;
    const tempOrder = newList[index].sort_order;
    newList[index].sort_order = newList[swapIndex].sort_order;
    newList[swapIndex].sort_order = tempOrder;
    [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
    setTestimonials(newList);
    await supabase.functions.invoke("admin-leads", {
      body: {
        password, action: "testimonials-reorder",
        testimonials: newList.map(t => ({ id: t.id, sort_order: t.sort_order })),
      },
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Admin-Bereich</h1>
            <p className="text-sm text-muted-foreground mt-1">Passwort eingeben, um zu verwalten</p>
          </div>
          <Input
            type="password"
            placeholder="Admin-Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12"
          />
          <Button type="submit" variant="gradient" className="w-full h-12" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Anmelden"}
          </Button>
        </form>
      </div>
    );
  }

  const deviceData = analytics
    ? Object.entries(analytics.devices).map(([name, value]) => ({
        name: name === "desktop" ? "Desktop" : name === "mobile" ? "Mobil" : "Tablet",
        value,
      }))
    : [];

  const hourlyData = analytics
    ? analytics.hourly.map((count, hour) => ({ hour: `${hour}:00`, besucher: count }))
    : [];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Übersicht, Leads & Portfolio</p>
          </div>
          <Button variant="outline-primary" size="sm" onClick={refreshAll} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Aktualisieren
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 mb-8 w-fit">
          {([
            { key: "dashboard" as const, icon: BarChart3, label: "Dashboard" },
            { key: "leads" as const, icon: Users, label: `Leads (${leads.length})` },
            { key: "portfolio" as const, icon: FolderOpen, label: `Portfolio (${projects.length})` },
            { key: "testimonials" as const, icon: MessageSquare, label: `Referenzen (${testimonials.length})` },
            { key: "vorschau" as const, icon: Sparkles, label: "Kostenlose Vorschau" },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Seitenaufrufe gesamt", value: analytics.totalViews.toLocaleString("de-DE"), icon: Eye },
                { label: "Aufrufe heute", value: analytics.viewsToday.toLocaleString("de-DE"), icon: TrendingUp },
                { label: "Leads gesamt", value: analytics.leadsCount, icon: Users },
                { label: "Conversion Rate", value: `${analytics.conversionRate}%`, icon: ArrowUpRight },
              ].map(kpi => (
                <Card key={kpi.label}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{kpi.label}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <kpi.icon size={20} className="text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Seitenaufrufe (letzte 30 Tage)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(d) => new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "13px" }} labelFormatter={(d) => new Date(d).toLocaleDateString("de-DE")} />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Aufrufe" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Endgeräte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {deviceData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    {deviceData.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i] }} />
                          <DeviceIcon type={d.name.toLowerCase()} />
                          {d.name}
                        </div>
                        <span className="font-medium text-foreground">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base font-semibold">Meistbesuchte Seiten</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topPages.map((p, i) => {
                      const maxCount = analytics.topPages[0]?.count || 1;
                      return (
                        <div key={p.path}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-foreground font-medium truncate max-w-[200px]">{PAGE_NAMES[p.path] || p.path}</span>
                            <span className="text-muted-foreground">{p.count} Aufrufe</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(p.count / maxCount) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                    {analytics.topPages.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Noch keine Daten</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Globe size={16} className="text-primary" />Traffic-Quellen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topSources.map((s, i) => {
                      const maxCount = analytics.topSources[0]?.count || 1;
                      return (
                        <div key={s.source}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-foreground font-medium truncate max-w-[200px]">{s.source}</span>
                            <span className="text-muted-foreground">{s.count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(s.count / maxCount) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                    {analytics.topSources.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Noch keine Daten</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Clock size={16} className="text-primary" />Besucherzeiten (Uhrzeit)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={2} />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Bar dataKey="besucher" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Besucher" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><Globe size={16} className="text-primary" />Regionen (Zeitzonen)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topRegions.map((r, i) => {
                      const maxCount = analytics.topRegions[0]?.count || 1;
                      return (
                        <div key={r.region}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-foreground font-medium truncate max-w-[200px]">{r.region.replace("_", " ")}</span>
                            <span className="text-muted-foreground">{r.count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(r.count / maxCount) * 100}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                          </div>
                        </div>
                      );
                    })}
                    {analytics.topRegions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Noch keine Daten</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && !analytics && (
          <div className="text-center py-20">
            <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
            <p className="text-muted-foreground">Lade Analytics...</p>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">{leads.length} Lead{leads.length !== 1 ? "s" : ""} insgesamt</p>
              <Button variant="outline-primary" size="sm" onClick={exportCSV} disabled={leads.length === 0}>
                <FileDown size={14} /> CSV Export
              </Button>
            </div>
            {/* Status-Filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              {([
                { key: "all", label: "Alle" },
                { key: "new", label: "Neu" },
                { key: "qualified", label: "Qualifiziert" },
                { key: "rejected", label: "Abgelehnt" },
                { key: "customer", label: "Kunden" },
              ] as const).map((f) => {
                const count = f.key === "all"
                  ? leads.length
                  : leads.filter((l) => (l.status || "new") === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setLeadStatusFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      leadStatusFilter === f.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {f.label} <span className="opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
            {leads.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground"><p className="text-lg">Noch keine Leads vorhanden.</p></div>
            ) : (
              <div className="grid gap-4">
                {leads
                  .filter((l) => leadStatusFilter === "all" || (l.status || "new") === leadStatusFilter)
                  .map((lead) => {
                  const status = lead.status || "new";
                  const statusMeta: Record<string, { label: string; cls: string }> = {
                    new: { label: "Neu", cls: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20" },
                    qualified: { label: "Qualifiziert", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" },
                    rejected: { label: "Abgelehnt", cls: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20" },
                    customer: { label: "Kunde", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20" },
                  };
                  const meta = statusMeta[status];
                  const isUpdating = updatingLeadId === lead.id;
                  return (
                  <div key={lead.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-shadow flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3">
                        <div className="flex items-center gap-2"><User size={15} className="text-primary shrink-0" /><span className="font-medium text-foreground truncate">{lead.first_name}</span></div>
                        <div className="flex items-center gap-2"><Building2 size={15} className="text-primary shrink-0" /><span className="text-sm text-muted-foreground truncate">{lead.company_name || "–"}</span></div>
                        <div className="flex items-center gap-2"><Mail size={15} className="text-primary shrink-0" /><a href={`mailto:${lead.email}`} className="text-sm text-muted-foreground hover:text-primary truncate transition-colors">{lead.email}</a></div>
                        <div className="flex items-center gap-2"><Phone size={15} className="text-primary shrink-0" /><a href={`tel:${lead.phone}`} className="text-sm text-muted-foreground hover:text-primary truncate transition-colors">{lead.phone}</a></div>
                        <div className="flex items-center gap-2"><Calendar size={15} className="text-muted-foreground shrink-0" /><span className="text-sm text-muted-foreground">{new Date(lead.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteLead(lead.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"><Trash2 size={16} /></Button>
                    </div>
                    {/* Status & Aktionen */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>
                        ● {meta.label}
                      </span>
                      {lead.slot_reserved && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                          <CheckCircle2 size={11} /> Platz reserviert
                        </span>
                      )}
                      <div className="ml-auto flex flex-wrap gap-1.5">
                        {status === "new" && (
                          <>
                            <Button size="sm" variant="default" disabled={isUpdating}
                              onClick={() => updateLeadStatus(lead.id, "qualified", true)}>
                              {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Platz reservieren + Mail"}
                            </Button>
                            <Button size="sm" variant="outline" disabled={isUpdating}
                              onClick={() => updateLeadStatus(lead.id, "qualified", false)}>
                              Nur reservieren
                            </Button>
                            <Button size="sm" variant="ghost" disabled={isUpdating}
                              onClick={() => updateLeadStatus(lead.id, "rejected")}>
                              Ablehnen
                            </Button>
                          </>
                        )}
                        {status === "qualified" && (
                          <>
                            <Button size="sm" variant="default" disabled={isUpdating}
                              onClick={() => updateLeadStatus(lead.id, "customer")}>
                              Zu Kunde machen
                            </Button>
                            <Button size="sm" variant="ghost" disabled={isUpdating}
                              onClick={() => updateLeadStatus(lead.id, "rejected")}>
                              Doch ablehnen
                            </Button>
                          </>
                        )}
                        {(status === "rejected" || status === "customer") && (
                          <Button size="sm" variant="ghost" disabled={isUpdating}
                            onClick={() => updateLeadStatus(lead.id, "new")}>
                            Zurück zu „Neu"
                          </Button>
                        )}
                      </div>
                    </div>
                    {/* Funnel-Antworten: Branche, Webseite, Ziele, Dringlichkeit, Notizen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t border-border text-sm">
                      <div className="flex items-start gap-2">
                        <Briefcase size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Branche</div>
                          <div className="text-foreground">
                            {lead.trade
                              ? lead.trade === "Sonstiges" && lead.trade_other
                                ? `Sonstiges: ${lead.trade_other}`
                                : lead.trade
                              : "Nicht angegeben"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Globe size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Aktuelle Webseite</div>
                          <div className="text-foreground">{lead.has_website || "Nicht angegeben"}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Wichtigste Ziele</div>
                          {lead.goals && lead.goals.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {lead.goals.map((g) => (
                                <span key={g} className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 text-xs">
                                  {g}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-foreground">Nicht angegeben</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Flame size={14} className="text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Dringlichkeit</div>
                          <div className="text-foreground">{lead.urgency || "Nicht angegeben"}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2">
                        <LinkIcon size={14} className="text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Webseiten-URL</div>
                          {lead.current_website ? (
                            <a
                              href={lead.current_website.startsWith("http") ? lead.current_website : `https://${lead.current_website}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-primary hover:underline break-all"
                            >
                              {lead.current_website}
                            </a>
                          ) : (
                            <div className="text-foreground">Nicht angegeben</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2">
                        <FileText size={14} className="text-primary mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground uppercase tracking-wide">Sonstige Anmerkungen</div>
                          <div className="text-foreground whitespace-pre-wrap break-words">{lead.notes || "Nicht angegeben"}</div>
                        </div>
                      </div>
                    </div>
                    {(lead.booking_date || lead.booking_time || lead.contact_method) ? (
                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold">
                          <CheckCircle2 size={12} /> Termin gebucht
                        </span>
                        {lead.booking_date && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                            <Calendar size={12} /> {new Date(lead.booking_date).toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" })}
                          </span>
                        )}
                        {lead.booking_time && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                            <Clock size={12} /> {lead.booking_time} Uhr
                          </span>
                        )}
                        {lead.contact_method && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 text-accent border border-accent/20 px-2.5 py-1 text-xs font-medium">
                            {lead.contact_method === "online" ? (<><Monitor size={12} /> Online-Meeting</>) : (<><Phone size={12} /> Telefonat</>)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="pt-3 border-t border-border">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted text-muted-foreground border border-border px-2.5 py-1 text-xs">
                          <Clock size={12} /> Kein Termin gebucht
                        </span>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">{projects.length} Projekt{projects.length !== 1 ? "e" : ""}</p>
              <Button variant="gradient" size="sm" onClick={openNewProject}>
                <Plus size={14} /> Neues Projekt
              </Button>
            </div>

            {portfolioLoading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                <p className="text-muted-foreground">Lade Projekte...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Noch keine Projekte vorhanden.</p>
                <p className="text-sm">Erstellen Sie Ihr erstes Portfolio-Projekt.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((p, i) => (
                  <div key={p.id} className={`bg-card rounded-xl border border-border p-4 flex items-center gap-4 transition-all ${!p.is_visible ? "opacity-60" : ""}`}>
                    {/* Image preview */}
                    <div className="w-20 h-15 rounded-lg overflow-hidden bg-muted shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Image size={20} className="text-muted-foreground" /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                        {!p.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Versteckt</span>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{p.category} {p.result && `• ${p.result}`}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => moveProject(i, "up")} disabled={i === 0} className="h-8 w-8">
                        <ChevronUp size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveProject(i, "down")} disabled={i === projects.length - 1} className="h-8 w-8">
                        <ChevronDown size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleVisibility(p)} className="h-8 w-8">
                        {p.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditProject(p)} className="h-8 w-8">
                        <Pencil size={14} />
                      </Button>
                      {p.external_url && (
                        <Button variant="ghost" size="icon" onClick={() => generateMockup(p)} disabled={generatingMockup} className="h-8 w-8" title="Mockup generieren">
                          {generatingMockup ? <Loader2 size={14} className="animate-spin" /> : <Monitor size={14} />}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => deleteProject(p.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === "testimonials" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">{testimonials.length} Referenz{testimonials.length !== 1 ? "en" : ""}</p>
              <Button variant="gradient" size="sm" onClick={openNewTestimonial}>
                <Plus size={14} /> Neue Referenz
              </Button>
            </div>

            {testimonialsLoading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={32} />
                <p className="text-muted-foreground">Lade Referenzen...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Noch keine Referenzen vorhanden.</p>
                <p className="text-sm">Erstellen Sie Ihre erste Kundenreferenz.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {testimonials.map((t, i) => (
                  <div key={t.id} className={`bg-card rounded-xl border border-border p-4 flex items-center gap-4 transition-all ${!t.is_visible ? "opacity-60" : ""}`}>
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
                      <Star size={16} className="text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{t.name}</h3>
                        {t.result && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.result}</span>}
                        {!t.is_visible && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Versteckt</span>}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{t.role}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate italic">„{t.text}"</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => moveTestimonial(i, "up")} disabled={i === 0} className="h-8 w-8">
                        <ChevronUp size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveTestimonial(i, "down")} disabled={i === testimonials.length - 1} className="h-8 w-8">
                        <ChevronDown size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => toggleTestimonialVisibility(t)} className="h-8 w-8">
                        {t.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditTestimonial(t)} className="h-8 w-8">
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTestimonial(t.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Kostenlose Vorschau Tab */}
        {activeTab === "vorschau" && (
          <AdminVorschauTab password={password} />
        )}
      </div>

      {/* Project Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Projekt bearbeiten" : "Neues Projekt"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="proj-title">Titel *</Label>
              <Input id="proj-title" value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} placeholder="z.B. TechStart GmbH" />
            </div>
            <div>
              <Label htmlFor="proj-category">Kategorie</Label>
              <Input id="proj-category" value={projectForm.category} onChange={e => setProjectForm(f => ({ ...f, category: e.target.value }))} placeholder="z.B. SaaS Landing Page" />
            </div>
            <div>
              <Label htmlFor="proj-result">Ergebnis</Label>
              <Input id="proj-result" value={projectForm.result} onChange={e => setProjectForm(f => ({ ...f, result: e.target.value }))} placeholder="z.B. +300% Anfragen" />
            </div>
            <div>
              <Label htmlFor="proj-desc">Beschreibung</Label>
              <Textarea id="proj-desc" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} placeholder="Kurze Projektbeschreibung..." rows={3} />
            </div>
            <div>
              <Label htmlFor="proj-url">Externer Link (URL)</Label>
              <Input id="proj-url" value={projectForm.external_url} onChange={e => setProjectForm(f => ({ ...f, external_url: e.target.value }))} placeholder="https://beispiel.de" />
            </div>
            <div>
              <Label htmlFor="proj-image">Bild</Label>
              <Input id="proj-image" type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              {editingProject?.image_url && !imageFile && (
                <p className="text-xs text-muted-foreground mt-1">Aktuelles Bild bleibt bestehen, wenn kein neues hochgeladen wird.</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={projectForm.is_visible} onCheckedChange={v => setProjectForm(f => ({ ...f, is_visible: v }))} />
              <Label>Sichtbar auf der Website</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProjectDialog(false)}>Abbrechen</Button>
            <Button variant="gradient" onClick={saveProject} disabled={savingProject}>
              {savingProject ? <Loader2 className="animate-spin" size={16} /> : (editingProject ? "Speichern" : "Erstellen")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Referenz bearbeiten" : "Neue Referenz"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-name">Name *</Label>
              <Input id="test-name" value={testimonialForm.name} onChange={e => setTestimonialForm(f => ({ ...f, name: e.target.value }))} placeholder="z.B. Thomas M." />
            </div>
            <div>
              <Label htmlFor="test-role">Rolle / Firma</Label>
              <Input id="test-role" value={testimonialForm.role} onChange={e => setTestimonialForm(f => ({ ...f, role: e.target.value }))} placeholder="z.B. Geschäftsführer, TechStart GmbH" />
            </div>
            <div>
              <Label htmlFor="test-result">Ergebnis</Label>
              <Input id="test-result" value={testimonialForm.result} onChange={e => setTestimonialForm(f => ({ ...f, result: e.target.value }))} placeholder="z.B. 3x mehr Anfragen" />
            </div>
            <div>
              <Label htmlFor="test-text">Bewertungstext *</Label>
              <Textarea id="test-text" value={testimonialForm.text} onChange={e => setTestimonialForm(f => ({ ...f, text: e.target.value }))} placeholder="Was sagt der Kunde über Sie?" rows={4} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={testimonialForm.is_visible} onCheckedChange={v => setTestimonialForm(f => ({ ...f, is_visible: v }))} />
              <Label>Sichtbar auf der Website</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestimonialDialog(false)}>Abbrechen</Button>
            <Button variant="gradient" onClick={saveTestimonial} disabled={savingTestimonial}>
              {savingTestimonial ? <Loader2 className="animate-spin" size={16} /> : (editingTestimonial ? "Speichern" : "Erstellen")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLeads;
