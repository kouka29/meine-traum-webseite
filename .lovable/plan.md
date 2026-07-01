## Ziel
Sparsame verhaltensbasierte Auto-Öffner im bestehenden `src/components/ChatAssistant.tsx`. Additiv, keine Änderung am Layout, an Edge-Functions oder anderen Komponenten.

## Datei
Nur `src/components/ChatAssistant.tsx`.

## Neue Konstanten & State
- `AUTOOPEN_KEY = "chat_autoopened"` — globaler Session-Flag (`sessionStorage`), gesetzt sobald IRGENDEIN Auto-Öffner gefeuert hat.
- `USER_TOUCHED_KEY = "chat_user_touched"` — wird gesetzt, sobald der Nutzer den Widget-Button selbst geöffnet oder das Panel geschlossen hat. Ist er einmal gesetzt, feuert kein Auto-Öffner mehr.
- Konsumiert bestehende `nudgeAvatar` (07) sowie `getGreeting`-Muster.

## Verhalten
Ein einziger `useEffect`, der beim Mount:
1. Abbricht, wenn `shouldHide`, `open`, `sessionStorage[AUTOOPEN_KEY]` oder `sessionStorage[USER_TOUCHED_KEY]` gesetzt sind.
2. Auf Mobil (`window.matchMedia("(max-width: 768px)").matches`) abbricht, wenn ein aktives Formular sichtbar ist. Heuristik: irgendein `input`/`textarea`/`select` innerhalb `[data-funnel], form` hat gerade Fokus, ODER ein Element mit `[data-funnel-active]` existiert. Robust: einfach `document.activeElement` ist `INPUT|TEXTAREA|SELECT` → Trigger überspringen. Zusätzlich Route-Guard: startsWith `/angebot`, `/checkout`, `/kostenlose-vorschau` — dort keine Auto-Öffner.
3. Registriert je nach Route bis zu drei Trigger, deren Cleanup beim Unmount/Route-Wechsel läuft.

Gemeinsame Helper (in Komponente, nicht exportiert):
- `autoOpen(message: string)`:
  - Prüft nochmals Guards (nicht `open`, kein `AUTOOPEN_KEY`, kein `USER_TOUCHED_KEY`, `document.activeElement` kein Text-Input).
  - Setzt `sessionStorage[AUTOOPEN_KEY] = "1"`.
  - `setAvatarState("nudge")` (Timeout 4s → zurück auf `idle`).
  - Ersetzt/erweitert `messages`: wenn leer, initialisiert mit `[{role:"assistant", content: message}]`. Ist bereits Greeting drin, hängt Nudge-Message nur an, wenn nicht identisch.
  - `setOpen(true)`.

### Trigger 1 — `/preise` Timer (30 s)
- Guard: `pathname.startsWith("/preise") || pathname.startsWith("/webdesign-preise")`.
- `setTimeout(() => autoOpen("Fragen zu den Paketen? Ich helf dir das passende zu finden."), 30_000)`.
- Cleanup: `clearTimeout`.

### Trigger 2 — Exit-Intent (Desktop)
- Nur wenn `!window.matchMedia("(max-width: 768px)").matches`.
- Listener `mouseout` auf `document`: wenn `e.clientY <= 0` und `!e.relatedTarget` und `!e.toElement` → `autoOpen("Bevor du gehst — hol dir die kostenlose Strategie-Vorschau.")` und `setShowLeadForm(true)`, damit der Handoff-CTA/Formular direkt sichtbar ist.
- Cleanup: Listener entfernen.

### Trigger 3 — `/portfolio` Scroll (>60 % + 20 s ohne Interaktion)
- Guard: `pathname.startsWith("/portfolio")`.
- Interaktions-Flag `interacted = false` — setzt sich bei `click`, `keydown`, `touchstart`.
- `setTimeout(fire, 20_000)`; `fire()` prüft:
  - `!interacted`
  - Scroll-Prozentsatz `(scrollY + innerHeight) / documentHeight >= 0.6`
  - dann `autoOpen("Soll ich dir ein Beispiel für deine Branche zeigen?")`
- Cleanup: `clearTimeout` + Listener entfernen.

### User-Touched-Erkennung
- Floating-Button `onClick`: setzt `USER_TOUCHED_KEY` bevor `setOpen(true)`.
- Close-Button `onClick`: setzt `USER_TOUCHED_KEY` und `AUTOOPEN_KEY` (Sicherheit, damit nichts nachfeuert).
- Escape-Handler: setzt beim Schließen ebenfalls beide Flags.

### Avatar-Reset
Bestehendes „nach Erfolgs-/Idle-Reset"-Verhalten bleibt. Neuer Auto-Timeout setzt `avatarState` nach 4 s zurück auf `idle`, falls in der Zwischenzeit nicht `thinking`/`success` gesetzt wurde.

## Nicht-Änderungen
- `App.tsx`, Edge Functions, andere Komponenten: unverändert.
- Kein neuer Hook, kein neues Modul.
- `useChatTriggers.ts` bleibt weiter unbenutzt.

## Verifikation
1. `bunx tsgo --noEmit` grün.
2. `bun run build` grün.
3. Kurzer Smoke-Check per Playwright optional: auf `/` Session-Storage setzen und prüfen, dass Auto-Open nicht feuert; auf `/preise` mit gemocktem Timer prüfen, dass `open=true`.
