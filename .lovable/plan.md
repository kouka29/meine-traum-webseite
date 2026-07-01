## Ziel
"Flash of Fallback" auf `/portfolio` eliminieren. Beim ersten Laden (leerer Cache) werden momentan kurz die 6 hartcodierten `fallbackProjects` angezeigt, bevor Supabase-Daten eintreffen. Stukomponente soll stattdessen zuerst ein Skeleton-Grid zeigen und Fallbacks nur als letzten Ausweg verwenden.

## Änderungen

### 1. State-Initialisierung (`src/pages/Portfolio.tsx`)
- `useState`-Init ersetzen: Nicht mehr mit `fallbackProjects` starten.
- Stattdessen `getCachedPortfolio()` auslesen. Falls Cache vorhanden → damit initialisieren.
- Falls kein Cache → `[]` (leeres Array).
- Neuer State `loading` (boolean), initial `true` wenn kein Cache vorhanden.

### 2. `useEffect` anpassen
- `fetchPortfolio()` aufrufen.
- Wenn echte Daten kommen → `setProjects(mappedData)`.
- Wenn **keine** echten Daten kommen UND `projects.length === 0` → `setProjects(fallbackProjects)` als letzten Ausweg.
- In allen Fällen `setLoading(false)` setzen (auch bei Fehler/Abbruch).
- `catch` handler hinzufügen, der `setLoading(false)` sicherstellt.

### 3. Render-Logik: Skeleton-Grid
- Solange `loading === true` UND `projects.length === 0`: Ein Skeleton-Grid rendern.
- 6 graue Platzhalter im selben Layout (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7`).
- Jeder Platzhalter: `<div className="rounded-2xl bg-muted/60 h-80 animate-pulse" />`.
- Sobald `projects.length > 0`: normale `projects.map(...)` rendern.
- Keine Änderungen am Card-Markup, an `portfolioCache.ts`, Supabase-Funktionen oder Routing.

## Verifikation
- `tsc --noEmit` grün.
- `vite build` grün.
- Keine sichtbaren Fallback-Karten beim ersten Laden ohne Cache (nur Skeletons).