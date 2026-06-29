## Ziel
Auf der Portfolio-Seite (`/portfolio`) sollen Projektbeschreibungen in der mobilen Ansicht (unterhalb des Breakpoints `md`) nur in den ersten zwei Zeilen angezeigt werden. Ein "Weiterlesen"-Link expandiert den Text auf die volle Beschreibung; ein "Weniger anzeigen"-Link klappt ihn wieder ein.

## Umsetzung

### 1. State pro Karte
- Ein Record-State `expandedDescriptions: Record<string, boolean>` in `src/pages/Portfolio.tsx`.
- Initialwert: alle IDs auf `false`.

### 2. Beschreibung kürzen (nur Mobile)
- Die Beschreibungs-`<p>` erhält zusätzlich die Tailwind-Klasse `md:line-clamp-none line-clamp-2`.
- Damit ist der Text auf mobilen Viewports auf 2 Zeilen begrenzt; auf Desktop (`md` und größer) bleibt er voll sichtbar.

### 3. Toggle-Button
- Unterhalb der Beschreibung wird ein Button/Link gerendert (nur auf mobilen Viewports, d. h. `md:hidden`), der den Expand-Status umschaltet.
- Text: **„Weiterlesen"** (wenn gekürzt) bzw. **„Weniger anzeigen"** (wenn expandiert).
- Der Button verwendet `text-xs font-semibold text-primary` und ist per `onClick` an den lokalen State gebunden.
- Beim Expandieren wird `line-clamp-2` entfernt (durch Klassen-Conditional), beim Kollabieren wieder hinzugefügt.

### 4. Keine Änderung an Desktop
- Der Button ist nur auf kleinen Viewports sichtbar (`md:hidden`).
- Auf Desktop bleibt die Beschreibung weiterhin ungekürzt.

### 5. Keine Änderung an Daten oder Business-Logik
- Die Beschreibungstexte kommen weiterhin aus `projects` bzw. dem Fallback.
- Keine Datenbank- oder Edge-Function-Änderungen nötig.

## Technische Details
- **Datei:** `src/pages/Portfolio.tsx`
- **Tailwind:** Nutzt `line-clamp-2` (Tailwind Core seit v3.3) und `md:line-clamp-none`.
- **Zugänglichkeit:** Der Toggle-Button erhält kein `href`, sondern ein `<button>`-Element mit `type="button"`, um Semantik zu wahren.