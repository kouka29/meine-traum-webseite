import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Trash2, RefreshCw, Mail, Phone, User, Calendar, Loader2 } from "lucide-react";

interface Lead {
  id: string;
  first_name: string;
  email: string;
  phone: string;
  created_at: string;
}

const AdminLeads = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container-narrow px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Lead-Verwaltung</h1>
            <p className="text-muted-foreground mt-1">{leads.length} Lead{leads.length !== 1 ? "s" : ""} insgesamt</p>
          </div>
          <Button variant="outline-primary" onClick={() => fetchLeads()} disabled={loading}>
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Aktualisieren
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
    </div>
  );
};

export default AdminLeads;
