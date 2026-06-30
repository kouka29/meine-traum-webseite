import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, LockKeyhole, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function KundenportalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/kundenportal", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      toast.error("Bitte gültige E-Mail eingeben");
      return;
    }
    if (password.length < 6) {
      toast.error("Bitte gib dein Passwort ein");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: clean,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error("E-Mail oder Passwort stimmt nicht. Falls du noch kein Passwort hast, setze es über „Passwort vergessen“.");
      return;
    }

    navigate("/kundenportal", { replace: true });
  };

  const requestPasswordReset = async () => {
    const clean = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      toast.error("Bitte gib zuerst deine E-Mail-Adresse ein");
      return;
    }

    setResetting(true);
    const { error } = await supabase.functions.invoke("send-password-reset", {
      body: { email: clean },
    });
    setResetting(false);

    if (error) {
      toast.error("E-Mail zum Zurücksetzen konnte nicht gesendet werden");
      return;
    }

    setResetSent(true);
    toast.success("E-Mail zum Passwort setzen wurde versendet");
  };

  const signInGoogle = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/kundenportal`,
    });
    if (result.error) {
      setGoogleLoading(false);
      toast.error("Google-Login fehlgeschlagen. Bitte erneut versuchen.");
      return;
    }
    if (result.redirected) return; // Browser leitet weiter
    navigate("/kundenportal", { replace: true });
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="block mb-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="relative">
                <div className="absolute -inset-10 bg-primary opacity-10 blur-[80px] rounded-full" />
                <div className="relative w-32 h-32 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-2xl flex items-center justify-center border border-border/60 transition-transform duration-500 hover:scale-105">
                  <div className="absolute inset-2 border border-border/40 rounded-2xl" />
                  <img src={logo} alt="Meine Traum Webseite" className="relative z-10 w-20 h-20 object-contain" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-tr from-primary via-primary to-accent">
                    Meine Traum
                  </span>
                  <br />
                  <span className="relative text-foreground">
                    Webseite
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary/20 rounded-full" />
                  </span>
                </h1>
              </div>
            </div>
          </Link>
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="text-primary" size={32} aria-hidden={true} focusable={false} />
                </div>
                <h1 className="font-heading text-2xl font-bold">E-Mail versendet</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Wir haben dir eine E-Mail an <strong className="text-foreground">{email}</strong> geschickt,
                  damit du dein Passwort festlegen kannst.
                </p>
                <p className="text-xs text-muted-foreground">
                  Keine Mail erhalten? Schau in den Spam-Ordner oder{" "}
                  <button type="button" onClick={() => setResetSent(false)} className="text-primary underline">erneut versuchen</button>.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Mail className="text-primary" size={24} aria-hidden={true} focusable={false} />
                  </div>
                  <h1 className="font-heading text-2xl font-bold mb-2">Kundenportal</h1>
                  <p className="text-sm text-muted-foreground">
                    Melde dich mit deiner E-Mail und deinem Passwort an.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@beispiel.de"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Passwort</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} aria-hidden={true} focusable={false} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Dein Passwort"
                      className="pl-9 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Passwort ausblenden" : "Passwort anzeigen"}
                    >
                      {showPassword ? <EyeOff size={16} aria-hidden={true} focusable={false} /> : <Eye size={16} aria-hidden={true} focusable={false} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} /> : "Einloggen"}
                </Button>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">oder</span></div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  disabled={googleLoading}
                  onClick={signInGoogle}
                >
                  {googleLoading ? (
                    <Loader2 className="animate-spin" size={16} aria-hidden={true} focusable={false} />
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                      </svg>
                      Mit Google anmelden
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={requestPasswordReset}
                  disabled={resetting}
                  className="w-full text-sm text-primary underline disabled:opacity-60"
                >
                  {resetting ? "E-Mail wird gesendet…" : "Passwort vergessen oder erstes Passwort setzen"}
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  Noch kein Zugang? Dein Portal wird automatisch nach deiner Buchung erstellt –
                  oder <Link to="/kontakt" className="text-primary underline">kontaktiere uns</Link>.
                </p>
              </form>
            )}
          </div>
        </div>
    </main>
  );
}