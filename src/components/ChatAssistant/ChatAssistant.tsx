import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Send, X, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { submitLead, honeypotFieldProps } from "@/lib/submitLead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import MascotAvatar from "./MascotAvatar";
import { useChatTriggers } from "@/hooks/useChatTriggers";

type ChatMsg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "mtw_chat_messages_v1";
const OPENED_KEY = "mtw_chat_opened_v1";
const LEAD_KEY = "mtw_chat_lead_submitted_v1";

const INITIAL_GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Hi 👋 Ich bin Mia, der KI-Assistent von MTW. Frag mich alles zu Websites, Preisen oder unserem Ablauf.",
};

const HIDE_ON_ROUTES = [
  "/kundenportal",
  "/admin",
  "/angebot",
  "/a/",
  "/kauf-erfolgreich",
  "/zahlung-erfolgreich",
  "/1euro-angebot",
];

const ChatAssistant = () => {
  const { pathname } = useLocation();

  const shouldHide = useMemo(
    () =>
      pathname === "/a" ||
      HIDE_ON_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p)),
 [pathname],
 );

 const [open, setOpen] = useState(false);
 const [messages, setMessages] = useState<ChatMsg[]>(() => {
    if (typeof window === "undefined") return [INITIAL_GREETING];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMsg[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [INITIAL_GREETING];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<{ available: number; isFull: boolean } | null>(
 null,
 );
 const [showLeadForm, setShowLeadForm] = useState(false);
 const [leadSubmitted, setLeadSubmitted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(LEAD_KEY) === "1";
  });
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadHoney, setLeadHoney] = useState("");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

 const scrollRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages, showLeadForm, loading]);

  useEffect(() => {
    if (open) {
      sessionStorage.setItem(OPENED_KEY, "1");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Auto-show lead form after 2 assistant answers (excl. greeting)
  useEffect(() => {
    const assistantCount = messages.filter((m) => m.role === "assistant").length;
    if (assistantCount >= 3 && !leadSubmitted) setShowLeadForm(true);
  }, [messages, leadSubmitted]);

  const openWithOpener = useCallback((opener?: string) => {
    setOpen(true);
    if (opener) {
      setMessages((prev) => {
        const hasOpener = prev.some((m) => m.role === "assistant" && m.content === opener);
        if (hasOpener) return prev;
        return [...prev, { role: "assistant", content: opener }];
      });
    }
  }, []);

  useChatTriggers({ enabled: !shouldHide && !open, onTrigger: openWithOpener, pathname });

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat-assistant", {
        body: { messages: next, page: pathname },
      });
      if (error) throw error;
      const reply = (data as { reply?: string })?.reply ?? "Entschuldige, versuch es bitte gleich nochmal.";
      const avail = data as { available?: number; isFull?: boolean };
      if (typeof avail.available === "number") {
        setAvailability({ available: avail.available, isFull: !!avail.isFull });
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error("chat-assistant error", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Da ist gerade was schiefgelaufen. Ruf uns gern direkt an: 06131 3076498.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, messages, pathname]);

  const handleLeadSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLeadError(null);
      if (!leadName.trim() || !leadPhone.trim()) {
        setLeadError("Bitte Name und Telefon angeben.");
        return;
      }
      setLeadLoading(true);
      const isFull = availability?.isFull ?? false;
      const ok = await submitLead({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        source_cta: isFull ? "chatbot-rueckruf" : "chatbot-vorschau",
        message: "Anfrage über KI-Assistent (Mia)",
        company: leadHoney,
      });
      setLeadLoading(false);
      if (ok) {
        setLeadSubmitted(true);
        sessionStorage.setItem(LEAD_KEY, "1");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: isFull
              ? "Danke! Wir rufen dich schnellstmöglich zurück. 📞"
              : "Perfekt, danke! Wir melden uns kurz, um deine kostenlose Vorschau abzustimmen. ✅",
          },
        ]);
      } else {
        setLeadError("Konnten die Anfrage nicht senden. Bitte ruf uns direkt an: 06131 3076498.");
      }
    },
    [availability, leadName, leadPhone, leadHoney],
  );

  if (shouldHide) return null;

  const ctaLabel = availability?.isFull ? "Rückruf anfordern" : "Kostenlose Vorschau sichern";

  return (
    <>
      {/* Floating trigger */}
      {!open && (
        <button
          type="button"
          aria-label="Chat mit Mia öffnen"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all",
            "px-4 py-3 md:px-5 md:py-3",
          )}
        >
          <MascotAvatar size={28} className="text-primary-foreground" />
          <span className="hidden md:inline text-sm font-medium">Frag Mia</span>
          <MessageCircle size={18} className="md:hidden" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          className={cn(
            "fixed z-[60] bg-background border border-border shadow-2xl flex flex-col",
            "inset-0 md:inset-auto md:bottom-5 md:right-5 md:w-[380px] md:h-[600px] md:rounded-xl overflow-hidden",
          )}
          role="dialog"
          aria-label="KI-Assistent Chat"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-primary/5">
            <MascotAvatar size={36} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight">Mia — KI von MTW</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
 Online — antwortet meist in Sekunden
 </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Schließen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
 <div
                key={i}
                className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" && (
                  <MascotAvatar size={28} className="shrink-0 mt-0.5" />
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap break-words",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <MascotAvatar size={28} className="shrink-0 mt-0.5" />
                <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                </div>
              </div>
            )}

            {showLeadForm && !leadSubmitted && (
              <div className="border border-primary/30 bg-primary/5 rounded-xl p-3 space-y-2">
                <div className="text-sm font-semibold">{ctaLabel}</div>
                <div className="text-xs text-muted-foreground">
                  {availability?.isFull
                    ? "Alle Vorschau-Plätze diesen Monat sind vergeben. Wir rufen dich gern zurück."
                    : `Noch ${availability?.available ?? ""} Plätze frei diesen Monat. Kurz Name + Telefon — wir kümmern uns um den Rest.`}
                </div>
                <form onSubmit={handleLeadSubmit} className="space-y-2">
                  <input {...honeypotFieldProps} value={leadHoney} onChange={(e) => setLeadHoney(e.target.value)} />
                  <Input
                    placeholder="Dein Name"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    required
                    className="h-9"
                  />
                  <Input
                    type="tel"
                    placeholder="Telefon"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    required
                    className="h-9"
                  />
                  {leadError && <div className="text-xs text-destructive">{leadError}</div>}
                  <Button type="submit" size="sm" className="w-full" disabled={leadLoading}>
                    {leadLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      ctaLabel
                    )}
                  </Button>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    Mit Absenden stimmst du zu, dass wir dich kontaktieren dürfen. Details in der{" "}
                    <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.
 </p>
                </form>
              </div>
            )}

            {leadSubmitted && (
              <div className="border border-green-500/30 bg-green-500/5 rounded-xl p-3 text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 size={18} />
 Anfrage erhalten — wir melden uns.
 </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3 bg-background">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                rows={1}
                placeholder="Frag mich etwas…"
                className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
                disabled={loading}
              />
              <Button
                type="button"
                size="icon"
                onClick={() => void sendMessage()}
                disabled={loading || !input.trim()}
                aria-label="Nachricht senden"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
              </Button>
            </div>
            {!showLeadForm && !leadSubmitted && (
              <button
                type="button"
                onClick={() => setShowLeadForm(true)}
                className="mt-2 text-xs text-primary hover:underline"
              >
                {availability?.isFull ? "Rückruf anfordern →" : "Kostenlose Vorschau sichern →"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;