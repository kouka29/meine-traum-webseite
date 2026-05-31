import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
export default function KundenportalLogin() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/kundenportal", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      toast.error("Bitte gültige E-Mail eingeben");
      return;
    }
    setSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: {
        emailRedirectTo: `${window.location.origin}/kundenportal`,
        shouldCreateUser: false,
      },
    });
    setSending(false);
    if (error) {
      toast.error(error.message.includes("not found") || error.message.includes("Signups")
        ? "Für diese E-Mail wurde noch kein Portal-Zugang erstellt. Bitte kontaktiere uns."
        : "Login-Link konnte nicht gesendet werden");
      return;
    }
    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="block mb-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="relative">
                <div className="absolute -inset-10 bg-primary opacity-10 blur-[80px] rounded-full" />
                <div className="relative w-32 h-32 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2rem] flex items-center justify-center border border-border/60 transition-transform duration-500 hover:scale-105">
                  <div className="absolute inset-2 border border-border/40 rounded-[1.5rem]" />
                  <img src={logo} alt="Meine Traum Webseite" className="relative z-10 w-20 h-20 object-contain" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
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
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="text-primary" size={32} />
                </div>
                <h1 className="font-heading text-2xl font-bold">Check deine E-Mails</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Wir haben dir einen Login-Link an <strong className="text-foreground">{email}</strong> geschickt.
                  Klicke einfach auf den Link in der Mail – fertig.
                </p>
                <p className="text-xs text-muted-foreground">
                  Keine Mail erhalten? Schau in den Spam-Ordner oder{" "}
                  <button onClick={() => setSent(false)} className="text-primary underline">erneut anfordern</button>.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <h1 className="font-heading text-2xl font-bold mb-2">Kundenportal</h1>
                  <p className="text-sm text-muted-foreground">
                    Login per E-Mail-Link – kein Passwort nötig.
                  </p>
                </div>
                <div>
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
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? <Loader2 className="animate-spin" size={16} /> : "Login-Link senden"}
                </Button>
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