## KI-Bot auf `/vorschau-start` ausblenden + Overlap fixen

### Analyse
- Der KI-Bot (`ChatAssistant`) wird global in `src/App.tsx` in der `Layout`-Komponente gemountet — also auf jeder Route sichtbar. Position: `fixed`, `right: 1.25rem`, `bottom: 4rem`, `z-index: 50`.
- Der einzige „floating" WhatsApp-Button liegt in `Step5Danke.tsx` (`fixed bottom-6 right-6`) — genau dort überlappen sich Bot und WA-FAB. Alle anderen WhatsApp-Vorkommen sind inline im Content (keine Overlap-Gefahr).

### Änderungen

**1. `src/App.tsx` — Bot auf Funnel-Route unterdrücken**
- `useLocation()` in `Layout` bereits vorhanden (wird für `standalone` genutzt).
- Neue Bedingung: `const hideChatBot = pathname.startsWith("/vorschau-start");`
- `<ChatAssistant />` nur rendern, wenn `!hideChatBot`.

**2. `src/pages/vorschau-start/steps/Step5Danke.tsx` — WhatsApp-FAB anheben**
Auch wenn der Bot auf dieser Route nicht mehr rendert, für zukünftige Fälle sauber:
- WA-FAB von `bottom-6 right-6` auf `bottom-6 right-6` belassen — nichts überschneidet mehr. (Kein Change nötig auf dieser Route.)

**3. Globale Sicherheit gegen künftige Overlaps**
Da nur diese eine Kombination existiert und wir sie über Punkt 1 lösen, sind keine weiteren Anpassungen nötig. Falls später weitere Floating-WA-Buttons hinzukommen, sollten sie generell `bottom-24` (statt `bottom-6`) verwenden, damit sie über dem 4rem-Bot sitzen — das kann bei Bedarf pro Fall geregelt werden.

### Betroffene Datei
- `src/App.tsx` (ein zusätzlicher Zeilen-Check + Conditional Render)

Keine Backend-, State- oder Style-Token-Änderungen.