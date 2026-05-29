import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, Receipt, MessageSquare, Settings, LogOut, Loader2, Menu, X, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/kundenportal", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/kundenportal/vertrag", label: "Vertrag & Paket", icon: FileText },
  { to: "/kundenportal/rechnungen", label: "Rechnungen", icon: Receipt },
  { to: "/kundenportal/wuensche", label: "Wünsche & Support", icon: MessageSquare },
  { to: "/kundenportal/angebote", label: "Angebote", icon: FileCheck },
  { to: "/kundenportal/einstellungen", label: "Einstellungen", icon: Settings },
];

export default function KundenportalLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!session) navigate("/kundenportal/login", { replace: true });
      else setEmail(session.user.email || "");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/kundenportal/login", { replace: true });
      else setEmail(data.session.user.email || "");
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/kundenportal/login", { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const SidebarContent = (
    <>
      <Link to="/" className="block px-6 py-5 border-b border-border">
        <span className="font-heading text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          QK Marketing
        </span>
        <p className="text-xs text-muted-foreground mt-0.5">Kundenportal</p>
      </Link>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 mb-2 text-xs text-muted-foreground truncate" title={email}>{email}</div>
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut size={16} className="mr-2" /> Abmelden
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r border-border sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col">
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-card border-b border-border sticky top-0 z-30">
          <Link to="/kundenportal" className="font-heading font-bold">Kundenportal</Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}