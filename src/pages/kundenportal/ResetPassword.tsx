import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LockKeyhole, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export default function KundenportalResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !cancelled) setReady(true);
    });

    if (tokenHash && type === "recovery") {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" }).then(({ error }) => {
        if (cancelled) return;
        if (error) {
          toast.error("Der Link ist ungültig oder abgelaufen");
          navigate("/kundenportal/login", { replace: true });
          return;
        }
        window.history.replaceState({}, document.title, window.location.pathname);
        setReady(true);
      });
      return () => {
        cancelled = true;
        sub.subscription.unsubscribe();
      };
    }

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        setReady(true);
      } else {
        window.setTimeout(async () => {
          const { data: delayed } = await supabase.auth.getSession();
          if (cancelled) return;
          if (delayed.session) setReady(true);
          else navigate("/kundenportal/login", { replace: true });
        }, 1000);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Bitte nutze mindestens 8 Zeichen");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Die Passwörter stimmen nicht überein");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error("Passwort konnte nicht gespeichert werden");
      return;
    }

    setDone(true);
    toast.success("Passwort gespeichert");
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block mb-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-primary opacity-10 blur-[80px] rounded-full" />
              <div className="relative w-32 h-32 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-center border border-border/60">
                <div className="absolute inset-2 border border-border/40 rounded-[1.5rem]" />
                <img src={logo} alt="Meine Traum Webseite" className="relative z-10 w-20 h-20 object-contain" />
              </div>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-tr from-primary via-primary to-accent">Meine Traum</span>
              <br />
              <span className="text-foreground">Webseite</span>
            </h1>
          </div>
        </Link>

        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {!ready ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="text-primary animate-spin" size={32} />
              </div>
              <h2 className="font-heading text-2xl font-bold">Link wird geprüft</h2>
              <p className="text-muted-foreground text-sm">Einen Moment bitte.</p>
            </div>
          ) : done ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="text-primary" size={32} />
              </div>
              <h2 className="font-heading text-2xl font-bold">Passwort gespeichert</h2>
              <p className="text-muted-foreground text-sm">Du kannst dich jetzt im Kundenportal anmelden.</p>
              <Button className="w-full" onClick={() => navigate("/kundenportal", { replace: true })}>
                Zum Kundenportal
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <LockKeyhole className="text-primary" size={24} />
                </div>
                <h2 className="font-heading text-2xl font-bold mb-2">Passwort setzen</h2>
                <p className="text-sm text-muted-foreground">Wähle ein neues Passwort für dein Kundenportal.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Neues Passwort</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Passwort ausblenden" : "Passwort anzeigen"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort wiederholen</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Passwort erneut eingeben"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : "Passwort speichern"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}