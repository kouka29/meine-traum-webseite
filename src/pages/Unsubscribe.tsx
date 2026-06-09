import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, MailX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type State =
  | { status: "loading" }
  | { status: "valid" }
  | { status: "already" }
  | { status: "invalid" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "invalid" });
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(
      `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
      { headers: { apikey: supabaseAnonKey } }
    )
      .then(async (r) => {
        const data = await r.json();
        if (data.valid) setState({ status: "valid" });
        else if (data.reason === "already_unsubscribed") setState({ status: "already" });
        else setState({ status: "invalid" });
      })
      .catch(() => setState({ status: "invalid" }));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ status: "submitting" });
    const { data, error } = await supabase.functions.invoke(
      "handle-email-unsubscribe",
      { body: { token } }
    );
    if (error) {
      setState({ status: "error", message: error.message });
      return;
    }
    if (data?.success) setState({ status: "success" });
    else if (data?.reason === "already_unsubscribed")
      setState({ status: "already" });
    else setState({ status: "error", message: "Unbekannter Fehler" });
  };

  return (
    <main id="main-content" className="pt-20 min-h-screen flex items-center">
      <div className="container-narrow px-4 w-full">
        <div className="max-w-md mx-auto bg-card rounded-2xl border border-border p-8 text-center">
          {state.status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Einen Moment...</h1>
              <p className="text-muted-foreground">Link wird geprüft.</p>
            </>
          )}
          {state.status === "valid" && (
            <>
              <MailX className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold mb-2">E-Mails abbestellen?</h1>
              <p className="text-muted-foreground mb-6">
                Klick auf bestätigen, um keine weiteren E-Mails von uns zu erhalten.
              </p>
              <Button variant="gradient" size="lg" onClick={confirm} className="w-full">
                Abbestellung bestätigen
              </Button>
            </>
          )}
          {state.status === "submitting" && (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-muted-foreground">Wird verarbeitet...</p>
            </>
          )}
          {state.status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold mb-2">Erfolgreich abgemeldet</h1>
              <p className="text-muted-foreground">
                Du erhältst keine weiteren E-Mails von uns.
              </p>
            </>
          )}
          {state.status === "already" && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h1 className="text-2xl font-bold mb-2">Bereits abgemeldet</h1>
              <p className="text-muted-foreground">
                Diese E-Mail-Adresse wurde bereits abgemeldet.
              </p>
            </>
          )}
          {state.status === "invalid" && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-bold mb-2">Ungültiger Link</h1>
              <p className="text-muted-foreground">
                Dieser Abmelde-Link ist ungültig oder abgelaufen.
              </p>
            </>
          )}
          {state.status === "error" && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
              <h1 className="text-2xl font-bold mb-2">Fehler</h1>
              <p className="text-muted-foreground">{state.message}</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Unsubscribe;