
# MTW KI-Verkaufsassistent — Bau-Paket

Baut einen proaktiven Chat-Verkaufsassistenten mit Maskottchen, der qualifiziert und Leads via Formular (Name + Telefon) an die bestehende `notify-lead` Pipeline übergibt. Handoff-Logik richtet sich nach der Verfügbarkeit der kostenlosen Vorschau.

**Tabu (nicht anfassen):** bestehende Edge Functions, Stripe, Meta Pixel, Kundenportal, `notify-lead`, `submitLead.ts`, `check-vorschau-availability`.

---

## Phase A — Edge Function `chat-assistant`

**Neu:** `supabase/functions/chat-assistant/index.ts` — exakt der vom User bereitgestellte Code (Lovable AI Gateway, Gemini 2.5 Flash, System-Prompt mit Live-Verfügbarkeit aus `vorschau_settings` page_key `global`, 20-Message-Cap, 2000-Zeichen-Cap pro Message).

**Config:** `supabase/config.toml` erweitern:
```toml
[functions.chat-assistant]
  verify_jwt = false
```

**Secrets:** `LOVABLE_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` sind bereits vorhanden — kein neuer Secret nötig.

---

## Phase B — Chat-Widget mit Maskottchen

**Neu:** `src/components/ChatAssistant/` mit
- `ChatAssistant.tsx` — Floating-Button unten rechts + Chat-Panel (Sheet-artig, mobile-first). Poppins/Inter, Primary-Farbe, `rounded-xl`, konsistent mit Design-System.
- `ChatMessages.tsx` — Message-Liste mit `react-markdown` Rendering (bereits im Projekt via prose-Klassen möglich), Typing-Indikator, Auto-Scroll.
- `ChatComposer.tsx` — Textarea + Send-Button, Enter=send, Shift+Enter=newline, Focus-Restore nach Send.
- `ChatLeadForm.tsx` — Inline-Formular (Name + Telefon + Honeypot) mit CTA-Label je nach Verfügbarkeit:
  - `isFull=false` → "Kostenlose Vorschau sichern" (source_cta="chatbot-vorschau")
  - `isFull=true` → "Rückruf anfordern" (source_cta="chatbot-rueckruf")
  Ruft `submitLead()` aus `src/lib/submitLead.ts` — keine Duplikation der Notification-Logik.
- `useChatAssistant.ts` — Hook: State (messages, isOpen, loading, leadSubmitted, availability), Persistenz in `sessionStorage` (nur Session, nicht dauerhaft), `sendMessage()` ruft `supabase.functions.invoke("chat-assistant", { body: { messages, page: location.pathname }})`.
- `mascotAvatar.tsx` — kleines SVG-Maskottchen (freundliches Roboter-Icon in Brand-Farbe) als Avatar für den Bot und Floating-Button-Icon. Reines Inline-SVG, keine neue Asset-Datei nötig.

**System-Trigger im Widget:**
- Assistant-Erstnachricht (client-seitig, nicht vom Modell): "Hi 👋 Ich bin Mia, der KI-Assistent von MTW. Frag mich alles zu Websites, Preisen oder unserem Ablauf."
- Nach 2 Assistenten-Antworten: CTA-Karte einblenden mit Verfügbarkeits-Info + Formular.

**Integration:** Global in `src/App.tsx` unterhalb `<Routes>` einbinden, aber:
- Nicht auf `/kundenportal/*`, `/admin*`, `/checkout*`, `/angebot/*`, `/kauf-erfolgreich`, `/zahlung-erfolgreich` (via `useLocation` ausblenden).
- Cookie-Consent respektieren: nur laden wenn `essential`-Consent (immer true — der Bot ist funktional, kein Tracking).

---

## Phase C — Proaktive Trigger

**Neu:** `src/hooks/useChatTriggers.ts` — beobachtet folgende Signale und öffnet das Widget mit vorgefüllter kontextueller Erstnachricht (einmal pro Session, `sessionStorage`-Flag `mtw_chat_triggered`):

| Trigger | Bedingung | Bot-Opener |
|---|---|---|
| **Exit-Intent Desktop** | `mouseout` an Viewport-Oberkante, `clientY <= 0`, min. 15 s auf Seite | "Warte kurz 👋 Hast du noch eine Frage bevor du gehst?" |
| **Scroll-Depth** | 70 % Seite gescrollt, min. 30 s | "Sieht so aus als würde dich das Thema interessieren — soll ich dir zeigen wie wir starten würden?" |
| **Idle** | 45 s ohne Interaktion auf Preis-/Leistungs-/Portfolio-Seiten | "Kann ich dir bei der Auswahl helfen?" |
| **Preis-Seiten** | Route matched `/preise`, `/webdesign-preise`, `/*/preise` | "Fragen zum Paket? Ich erklär's dir kurz." (nach 20 s) |

Trigger sind additiv (der erste gewinnt). Mobile: nur Scroll-Depth + Idle, kein Exit-Intent.

---

## Rendering / Design-Details

- Floating Button: `fixed bottom-6 right-6`, 56×56, `bg-primary text-primary-foreground shadow-lg rounded-full`, Badge mit Punkt bei Trigger-Open.
- Chat-Panel: Desktop 380×560, Mobile Fullscreen-Sheet. Header mit Maskottchen + "Mia — KI von MTW" + Close.
- Messages: User rechts (`bg-primary/10`), Bot links (`bg-muted`), Avatar nur beim Bot.
- Lead-Formular als eigene Karte im Chat-Flow (nicht Modal), disabled nach Erfolg mit Bestätigung.

---

## Verifikation

1. Edge Function lokal via `supabase--test_edge_functions` mit Sample-Payload testen.
2. Playwright: Widget öffnen → Nachricht senden → Bot antwortet → Formular ausfüllen → Telegram-Ping prüfen (`supabase--edge_function_logs` für `notify-lead`).
3. Trigger: Scroll 70 % simulieren, prüfen dass Widget öffnet.
4. Build grün.

---

## Files touched

**Neu:** `supabase/functions/chat-assistant/index.ts`, `src/components/ChatAssistant/{ChatAssistant,ChatMessages,ChatComposer,ChatLeadForm,mascotAvatar}.tsx`, `src/components/ChatAssistant/useChatAssistant.ts`, `src/hooks/useChatTriggers.ts`.

**Geändert (minimal):** `supabase/config.toml` (function-Block), `src/App.tsx` (Widget-Mount mit Route-Blacklist).

**Nicht geändert:** `notify-lead`, `submitLead.ts`, `check-vorschau-availability`, alle bestehenden Formulare, Stripe, Pixel, Kundenportal.
