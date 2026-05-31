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
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <img src={logo} alt="Meine Traum Webseite" className="h-10 w-auto" />
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Meine Traum Webseite
            </span>
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