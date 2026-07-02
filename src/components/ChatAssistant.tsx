import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Send, X, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { honeypotFieldProps } from "@/lib/submitLead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import idleAvatar from "@/assets/mascot/MTW-Bot-Brand-01.png";
import successAvatar from "@/assets/mascot/MTW-Bot-Brand-04.png";
import thinkingAvatar from "@/assets/mascot/MTW-Bot-Brand-06.png";
import nudgeAvatar from "@/assets/mascot/MTW-Bot-Brand-07.png";
import greetingAvatar from "@/assets/mascot/MTW-Bot-Brand-09.png";

type ChatMsg = { role: "user" | "assistant"; content: string };
type AvatarState = "idle" | "greeting" | "thinking" | "success" | "nudge";

const AVATARS: Record<AvatarState, string> = {
  idle: idleAvatar,
  greeting: greetingAvatar,
  thinking: thinkingAvatar,
  success: successAvatar,
  nudge: nudgeAvatar,
};

const BRAND_GRADIENT = "linear-gradient(135deg,#8441E3 0%,#3488DF 100%)";

const MSGS_KEY = "mtw_chat_msgs_v2";
const OPEN_KEY = "mtw_chat_open";
const CONSENT_KEY = "mtw_chat_consent_v1";
const LEAD_KEY = "mtw_chat_lead_v1";
const AUTOOPEN_KEY = "chat_autoopened";
const USER_TOUCHED_KEY = "chat_user_touched";

const AUTOOPEN_BLOCK_PREFIXES = ["/angebot", "/checkout", "/kostenlose-vorschau"];

function isTypingInField(): boolean {
  const el = typeof document !== "undefined" ? document.activeElement : null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
    (el as HTMLElement).isContentEditable === true;
}

const HIDE_PREFIXES = [
  "/kundenportal",
  "/admin",
  "/angebot",
  "/a/",
  "/kauf-erfolgreich",
  "/zahlung-erfolgreich",
  "/1euro-angebot",
];

function getGreeting(pathname: string): string {
  if (pathname.startsWith("/preise") || pathname.startsWith("/webdesign-preise")) {
    return "Fragen zu den Paketen? Ich helf dir das passende zu finden.";
  }
  if (pathname.startsWith("/portfolio")) {
    return "Suchst du ein Beispiel für deine Branche?";
  }
  return "Hi! Ich bin dein Assistent von MTW. Was möchtest du weißt?";
}

const DEFAULT_CHIPS = [
  "Was kostet eine Webseite?",
  "Wie lange dauert ein Projekt?",
  "Haben Sie Referenzen?",
  "Kostenloser Rückruf?",
];

const SUGGESTIONS: Record<string, string[]> = {
  "/preise": ["Welches Paket passt zu mir?", "Was ist im Starter-Paket?", "Wie lange dauert es?", "Gibt es Ratenzahlung?"],
  "/webdesign-preise": ["Welches Paket passt zu mir?", "Was ist im Starter-Paket?", "Wie lange dauert es?", "Gibt es Ratenzahlung?"],
  "/portfolio": ["Haben Sie Beispiele für meine Branche?", "Wie sieht das auf Mobil aus?", "Kann ich Referenzen anrufen?", "Wie starten wir?"],
  "/leistungen": ["Was ist SEO-Optimierung?", "Enthalten Updates?", "Wie lange dauert ein Projekt?", "Was ist Responsive Design?"],
};

function getSuggestions(pathname: string): string[] {
  for (const [key, chips] of Object.entries(SUGGESTIONS)) {
    if (pathname.startsWith(key)) return chips;
  }
  return DEFAULT_CHIPS;
}

const ChatAssistant = () => {
  const { pathname } = useLocation();

  const shouldHide = useMemo(
    () =>
      pathname === "/a" ||
      HIDE_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p),
      ),
    [pathname],
  );

  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(OPEN_KEY) === "1";
  });
  const [messages, setMessages] = useState<ChatMsg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem(MSGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMsg[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* ignore */
    }
    return [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<{ available: number; isFull: boolean } | null>(
    null,
  );
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [consentDismissed, setConsentDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(CONSENT_KEY) === "1";
  });
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
  const [showExtraSuggestions, setShowExtraSuggestions] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const availLoadedRef = useRef(false);

  // Persist messages
  useEffect(() => {
    try {
      sessionStorage.setItem(MSGS_KEY, JSON.stringify(messages));
    } catch {
      /* ignore */
    }
  }, [messages]);

  // Persist open state
  useEffect(() => {
    try {
      sessionStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [open]);

  // Auto-scroll
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages, loading, showLeadForm]);

  // On open: seed greeting + focus + load availability
  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 100);

    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: getGreeting(pathname) }]);
      setAvatarState("greeting");
      const t = setTimeout(() => setAvatarState("idle"), 2500);
      return () => clearTimeout(t);
    }

    if (!availLoadedRef.current) {
      availLoadedRef.current = true;
      supabase.functions
        .invoke("check-vorschau-availability", { body: {} })
        .then(({ data }) => {
          const d = data as { available?: number; isFull?: boolean } | null;
          if (d && typeof d.available === "number") {
            setAvailability({ available: d.available, isFull: !!d.isFull });
          }
        })
        .catch(() => {
          /* silent */
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        try {
          sessionStorage.setItem(USER_TOUCHED_KEY, "1");
          sessionStorage.setItem(AUTOOPEN_KEY, "1");
        } catch {
          /* ignore */
        }
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Behavioral auto-openers — max 1x/session, respects user-touched flag.
  useEffect(() => {
    if (shouldHide) return;
    if (typeof window === "undefined") return;
    if (open) return;
    if (AUTOOPEN_BLOCK_PREFIXES.some((p) => pathname.startsWith(p))) return;
    try {
      if (sessionStorage.getItem(AUTOOPEN_KEY) === "1") return;
      if (sessionStorage.getItem(USER_TOUCHED_KEY) === "1") return;
    } catch {
      return;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const autoOpen = (message: string, opts?: { openLeadForm?: boolean }) => {
      try {
        if (sessionStorage.getItem(AUTOOPEN_KEY) === "1") return;
        if (sessionStorage.getItem(USER_TOUCHED_KEY) === "1") return;
      } catch {
        return;
      }
      if (isTypingInField()) return;
      try {
        sessionStorage.setItem(AUTOOPEN_KEY, "1");
      } catch {
        /* ignore */
      }
      setMessages((prev) => {
        if (prev.some((m) => m.role === "assistant" && m.content === message)) return prev;
        return [...prev, { role: "assistant", content: message }];
      });
      setAvatarState("nudge");
      setTimeout(() => {
        setAvatarState((s) => (s === "nudge" ? "idle" : s));
      }, 4000);
      if (opts?.openLeadForm) setShowLeadForm(true);
      setOpen(true);
    };

    const cleanups: Array<() => void> = [];

    // Trigger 1 — /preise Timer (30s)
    if (pathname.startsWith("/preise") || pathname.startsWith("/webdesign-preise")) {
      const t = window.setTimeout(
        () => autoOpen("Fragen zu den Paketen? Ich helf dir das passende zu finden."),
        30_000,
      );
      cleanups.push(() => window.clearTimeout(t));
    }

    // Trigger 2 — Exit-Intent (Desktop only)
    if (!isMobile) {
      const onMouseOut = (e: MouseEvent) => {
        if (e.clientY > 0) return;
        if (e.relatedTarget) return;
        autoOpen("Bevor du gehst — hol dir die kostenlose Strategie-Vorschau.", {
          openLeadForm: true,
        });
      };
      document.addEventListener("mouseout", onMouseOut);
      cleanups.push(() => document.removeEventListener("mouseout", onMouseOut));
    }

    // Trigger 3 — /portfolio scroll >60% + 20s idle
    if (pathname.startsWith("/portfolio")) {
      let interacted = false;
      const markInteracted = () => {
        interacted = true;
      };
      document.addEventListener("click", markInteracted, { once: true });
      document.addEventListener("keydown", markInteracted, { once: true });
      document.addEventListener("touchstart", markInteracted, { once: true });
      const t = window.setTimeout(() => {
        if (interacted) return;
        const docHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        );
        const scrolled = (window.scrollY + window.innerHeight) / docHeight;
        if (scrolled >= 0.6) {
          autoOpen("Soll ich dir ein Beispiel für deine Branche zeigen?");
        }
      }, 20_000);
      cleanups.push(() => {
        window.clearTimeout(t);
        document.removeEventListener("click", markInteracted);
        document.removeEventListener("keydown", markInteracted);
        document.removeEventListener("touchstart", markInteracted);
      });
    }

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, shouldHide]);

  const submitChat = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setShowExtraSuggestions(false);
    if (!consentDismissed) {
      setConsentDismissed(true);
      sessionStorage.setItem(CONSENT_KEY, "1");
    }
    const next: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setAvatarState("thinking");
    try {
      const { data, error } = await supabase.functions.invoke("chat-assistant", {
        body: { messages: next, page: pathname },
      });
      if (error) throw error;
      const d = data as { reply?: string; available?: number; isFull?: boolean } | null;
      const reply = d?.reply ?? "Entschuldige, versuch es bitte gleich nochmal.";
      if (d && typeof d.available === "number") {
        setAvailability({ available: d.available, isFull: !!d.isFull });
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
      setAvatarState(leadSubmitted ? "success" : "idle");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [loading, messages, pathname, consentDismissed, leadSubmitted]);

  const sendMessage = useCallback(() => {
    void submitChat(input);
  }, [input, submitChat]);

  const handleLeadSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLeadError(null);

      // Honeypot filled -> silently show thanks, no network
      if (leadHoney) {
        setLeadSubmitted(true);
        sessionStorage.setItem(LEAD_KEY, "1");
        setShowLeadForm(false);
        return;
      }
      if (!leadName.trim() || !leadPhone.trim()) {
        setLeadError("Bitte Name und Telefon angeben.");
        return;
      }
      setLeadLoading(true);
      try {
        const { error } = await supabase.functions.invoke("notify-lead", {
          body: {
            name: leadName.trim(),
            phone: leadPhone.trim(),
            company: leadHoney,
            source_page: pathname,
            source_cta: "chatbot",
            message: "Chatbot-Lead",
          },
        });
        if (error) throw error;
        setLeadSubmitted(true);
        sessionStorage.setItem(LEAD_KEY, "1");
        setShowLeadForm(false);
        setAvatarState("success");
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Danke! Muad meldet sich." },
        ]);
      } catch (err) {
        console.error("notify-lead error", err);
        setLeadError(
          "Konnten die Anfrage nicht senden. Bitte ruf uns direkt an: 06131 3076498.",
        );
      } finally {
        setLeadLoading(false);
      }
    },
    [leadHoney, leadName, leadPhone, pathname],
  );

  if (shouldHide) return null;

  const ctaLabel = availability?.isFull
    ? "Rückruf anfordern"
    : availability
      ? `Kostenlose Vorschau sichern (${availability.available} frei)`
      : "Kostenlose Vorschau sichern";

  const headerAvatar = AVATARS[avatarState];

  return createPortal(
    <>
      <style>{`
        @keyframes mtw-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        .mtw-float { animation: mtw-float 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .mtw-float { animation: none; } }
        @keyframes mtw-dot { 0%,80%,100%{opacity:.2} 40%{opacity:1} }
        .mtw-dot { animation: mtw-dot 1.2s infinite ease-in-out; }
        .mtw-fab{position:fixed!important;right:1.25rem!important;left:auto!important;bottom:4rem!important;z-index:50!important}
        @media(min-width:768px){.mtw-fab{bottom:1.25rem!important}}
        .mtw-panel{position:fixed!important;left:1rem!important;right:1rem!important;bottom:4rem!important;z-index:50!important;width:auto!important;max-width:calc(100vw - 2rem)!important}
        @media(min-width:768px){.mtw-panel{left:auto!important;right:1.25rem!important;bottom:1.25rem!important;width:360px!important}}
      `}</style>

      {/* Floating trigger */}
      {!open && (
        <button
          type="button"
          aria-label="KI-Assistent öffnen"
          onClick={() => {
            try {
              sessionStorage.setItem(USER_TOUCHED_KEY, "1");
            } catch {
              /* ignore */
            }
            setOpen(true);
          }}
          className={cn(
            "mtw-fab flex items-center justify-center hover:scale-105 transition-transform",
            "w-[84px] h-[84px] md:w-[92px] md:h-[92px]",
          )}
        >
          <img
            src={idleAvatar}
            alt=""
            aria-hidden
            className="mtw-float w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.20)]"
            draggable={false}
          />
          <span className="sr-only">Chat öffnen</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="KI-Assistent"
          data-apple-skip
          className={cn(
            "mtw-panel bg-background border border-border shadow-2xl flex flex-col overflow-hidden",
            "max-h-[70vh] rounded-2xl",
          )}
        >
          {/* Header */}
          <div
            style={{ background: BRAND_GRADIENT }}
            className="flex items-center gap-3 px-4 py-3 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={headerAvatar}
                alt="MTW Maskottchen"
                className="w-11 h-11 object-contain"
                draggable={false}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold font-poppins text-sm leading-tight flex items-center gap-2">
                KI-Assistent
                <span className="text-[10px] font-medium bg-white/20 rounded px-1.5 py-0.5 tracking-wide">
                  KI
                </span>
              </div>
              <div className="text-xs text-white/80">Antwortet in Sekunden</div>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.setItem(USER_TOUCHED_KEY, "1");
                  sessionStorage.setItem(AUTOOPEN_KEY, "1");
                } catch {
                  /* ignore */
                }
                setOpen(false);
              }}
              className="p-1.5 rounded-md hover:bg-white/15 transition-colors"
              aria-label="Schließen"
            >
              <X size={18} />
            </button>
          </div>

          {/* Consent */}
          {!consentDismissed && (
            <div className="text-[11px] text-muted-foreground bg-muted/50 px-3 py-2 border-b border-border leading-snug">
              Dieser Chat wird KI-gestützt verarbeitet (Google Gemini via Lovable). Mit dem
              Senden stimmst du zu. Mehr:{" "}
              <a href="/datenschutz" className="underline text-primary">
                Datenschutz
              </a>
              .
            </div>
          )}

          {/* Messages */}
          <div
            ref={scrollRef}
            aria-live="polite"
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5 bg-background"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-2",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                {m.role === "assistant" && (
                  <img
                    src={idleAvatar}
                    alt=""
                    aria-hidden
                    className="w-7 h-7 rounded-full object-contain bg-muted shrink-0"
                  />
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <img
                  src={thinkingAvatar}
                  alt=""
                  aria-hidden
                  className="w-7 h-7 rounded-full object-contain bg-muted shrink-0"
                />
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm flex items-center gap-1">
                  <span className="mtw-dot w-1.5 h-1.5 rounded-full bg-foreground/50" />
                  <span
                    className="mtw-dot w-1.5 h-1.5 rounded-full bg-foreground/50"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="mtw-dot w-1.5 h-1.5 rounded-full bg-foreground/50"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            )}

            {/* Quick-reply chips */}
            {(() => {
              const hasUserMessage = messages.some((m) => m.role === "user");
              const showChips = !hasUserMessage || showExtraSuggestions;
              const chips = getSuggestions(pathname).slice(0, 4);
              if (!showChips || chips.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-2 mt-1">
                  {chips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setShowExtraSuggestions(false);
                        void submitChat(chip);
                      }}
                      aria-label={`Frage vorschlagen: ${chip}`}
                      className="rounded-full border border-border text-sm px-3 py-1.5 hover:bg-muted hover:border-primary hover:text-primary transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              );
            })()}

            {/* "Weitere Fragen" link */}
            {(() => {
              const hasUserMessage = messages.some((m) => m.role === "user");
              const lastIsAssistant = messages[messages.length - 1]?.role === "assistant";
              if (!hasUserMessage || !lastIsAssistant || loading || showExtraSuggestions) return null;
              return (
                <div className="flex justify-start mt-1">
                  <button
                    type="button"
                    onClick={() => setShowExtraSuggestions(true)}
                    className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2"
                  >
                    Weitere Fragen
                  </button>
                </div>
              );
            })()}

            {/* Inline lead form */}
            {showLeadForm && !leadSubmitted && (
              <form
                onSubmit={handleLeadSubmit}
                className="border border-primary/30 bg-primary/5 rounded-xl p-3 space-y-2"
              >
                <div className="text-xs text-muted-foreground">
                  {availability?.isFull
                    ? "Alle Vorschau-Plätze diesen Monat vergeben. Wir rufen dich zurück."
                    : "Kurz Name + Telefon — wir melden uns."}
                </div>
                <input
                  {...honeypotFieldProps}
                  value={leadHoney}
                  onChange={(e) => setLeadHoney(e.target.value)}
                />
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
                {leadError && (
                  <div className="text-xs text-destructive">{leadError}</div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLeadForm(false)}
                    className="flex-1"
                  >
                    Abbrechen
                  </Button>
                  <Button type="submit" size="sm" disabled={leadLoading} className="flex-1">
                    {leadLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Senden"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-2.5 bg-background">
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
          </div>

          {/* Handoff footer */}
          <div className="border-t border-border px-3 py-2.5 bg-muted/30">
            {leadSubmitted ? (
              <div className="text-xs text-center text-muted-foreground">
                ✓ Anfrage erhalten — wir melden uns.
              </div>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowLeadForm(true)}
                style={showLeadForm ? undefined : { background: BRAND_GRADIENT }}
                className="w-full text-white hover:opacity-90"
                variant={showLeadForm ? "outline" : "default"}
              >
                {ctaLabel}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Preload nudge asset to avoid flash later */}
      <link rel="preload" as="image" href={nudgeAvatar} />
    </>,
    document.body
  );
};

export default ChatAssistant;