import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Lock, Trash2, RefreshCw, Mail, Phone, User, Calendar, Loader2,
  Building2, BarChart3, Users, Eye, TrendingUp, Monitor, Smartphone,
  Tablet, Globe, Clock, FileDown, ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from "recharts";

interface Lead {
  id: string;
  first_name: string;
  company_name: string;
  email: string;
  phone: string;
  created_at: string;
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
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads">("dashboard");

  const fetchLeads = useCallback(async (pw?: string) => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password: pw || password, action: "list" },
    });
    setLoading(false);

    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Laden der Leads");
      if (data?.error === "Ungültiges Passwort") setAuthenticated(false);
      return;
    }

    setLeads(data.leads || []);
    setAuthenticated(true);
  }, [password]);

  const fetchAnalytics = useCallback(async (pw?: string) => {
    const { data, error } = await supabase.functions.invoke("admin-leads", {
      body: { password: pw || password, action: "analytics" },
    });

    if (error || data?.error) {
      toast.error(data?.error || "Fehler beim Laden der Analytics");
      return;
    }

    setAnalytics(data.analytics);
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await Promise.all([fetchLeads(), fetchAnalytics()]);
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

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Name", "Firma", "E-Mail", "Telefon", "Datum"];
    const rows = leads.map(l => [
      l.first_name,
      l.company_name || "",
      l.email,
      l.phone,
      new Date(l.created_at).toLocaleDateString("de-DE"),
    ]);
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
    await Promise.all([fetchLeads(), fetchAnalytics()]);
    setLoading(false);
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
            <p className="text-sm text-muted-foreground mt-1">Passwort eingeben, um Leads zu verwalten</p>
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
    ? analytics.hourly.map((count, hour) => ({
        hour: `${hour}:00`,
        besucher: count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Übersicht & Lead-Verwaltung</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline-primary" size="sm" onClick={refreshAll} disabled={loading}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Aktualisieren
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 size={16} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "leads"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={16} />
            Leads ({leads.length})
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && analytics && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Seitenaufrufe gesamt</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{analytics.totalViews.toLocaleString("de-DE")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye size={20} className="text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Aufrufe heute</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{analytics.viewsToday.toLocaleString("de-DE")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp size={20} className="text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Leads gesamt</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{analytics.leadsCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users size={20} className="text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{analytics.conversionRate}%</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ArrowUpRight size={20} className="text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Views Chart */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Seitenaufrufe (letzte 30 Tage)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          tickFormatter={(d) => new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "13px",
                          }}
                          labelFormatter={(d) => new Date(d).toLocaleDateString("de-DE")}
                        />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Aufrufe" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Endgeräte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {deviceData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
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

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Meistbesuchte Seiten</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topPages.map((p, i) => {
                      const maxCount = analytics.topPages[0]?.count || 1;
                      return (
                        <div key={p.path}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-foreground font-medium truncate max-w-[200px]">
                              {PAGE_NAMES[p.path] || p.path}
                            </span>
                            <span className="text-muted-foreground">{p.count} Aufrufe</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(p.count / maxCount) * 100}%`,
                                background: CHART_COLORS[i % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {analytics.topPages.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Noch keine Daten</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Sources */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Globe size={16} className="text-primary" />
                    Traffic-Quellen
                  </CardTitle>
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
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(s.count / maxCount) * 100}%`,
                                background: CHART_COLORS[i % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {analytics.topSources.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Noch keine Daten</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hourly Distribution */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    Besucherzeiten (Uhrzeit)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="hour"
                          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                          interval={2}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="besucher" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Besucher" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Regions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Globe size={16} className="text-primary" />
                    Regionen (Zeitzonen)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topRegions.map((r, i) => {
                      const maxCount = analytics.topRegions[0]?.count || 1;
                      return (
                        <div key={r.region}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-foreground font-medium truncate max-w-[200px]">
                              {r.region.replace("_", " ")}
                            </span>
                            <span className="text-muted-foreground">{r.count}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(r.count / maxCount) * 100}%`,
                                background: CHART_COLORS[i % CHART_COLORS.length],
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {analytics.topRegions.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Noch keine Daten</p>
                    )}
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
                <FileDown size={14} />
                CSV Export
              </Button>
            </div>

            {leads.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">Noch keine Leads vorhanden.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-shadow flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate">{lead.first_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 size={15} className="text-primary shrink-0" />
                        <span className="text-sm text-muted-foreground truncate">{lead.company_name || "–"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={15} className="text-primary shrink-0" />
                        <a href={`mailto:${lead.email}`} className="text-sm text-muted-foreground hover:text-primary truncate transition-colors">
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={15} className="text-primary shrink-0" />
                        <a href={`tel:${lead.phone}`} className="text-sm text-muted-foreground hover:text-primary truncate transition-colors">
                          {lead.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(lead.created_at).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteLead(lead.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeads;
