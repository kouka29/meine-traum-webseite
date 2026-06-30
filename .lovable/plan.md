## Prompt 8/9 — DRY Routing für Trade-Hubs

In `src/App.tsx` Zeilen 191–221 ersetzen: 31 wiederholte `<Route>`-Zeilen → durch `tradeHubs`-Config + `.map()`.

### Config (oberhalb der Routes platzieren, z. B. nach `HandwerkerRoute`)
```ts
const tradeHubs = [
  { path: "elektriker", Hub: ElektrikerHub, Preise: ElektrikerPreise },
  { path: "maler",      Hub: MalerHub,      Preise: null },
  { path: "sanitaer",   Hub: SanitaerHub,   Preise: SanitaerPreise },
  { path: "dachdecker", Hub: DachdeckerHub, Preise: DachdeckerPreise },
] as const;

const subRedirects = ["leistungen", "portfolio", "ueber-uns", "kontakt"] as const;
```

### Generierte Routes (ersetzt Zeilen 191–221)
```tsx
{tradeHubs.flatMap(({ path, Hub, Preise }) => [
  <Route key={path} path={`/${path}`} element={<Hub />} />,
  <Route
    key={`${path}-preise`}
    path={`/${path}/preise`}
    element={Preise ? <Preise /> : <Navigate to="/handwerker/preise" replace />}
  />,
  ...subRedirects.map((sub) => (
    <Route
      key={`${path}-${sub}`}
      path={`/${path}/${sub}`}
      element={<Navigate to={`/handwerker/${sub}`} replace />}
    />
  )),
  <Route key={`${path}-wild`} path={`/${path}/*`} element={<Navigate to={`/${path}`} replace />} />,
])}
```

### Unverändert
- `/handwerker` mit `HandwerkerRoute` bleibt separat (Zeile 183).
- Alle 4 lazy-Imports (ElektrikerHub, MalerHub, SanitaerHub, DachdeckerHub) und `ElektrikerPreise`, `SanitaerPreise`, `DachdeckerPreise` bleiben.
- Identische URLs und Ziele zu vorher.

### Verifikation
- Stichproben: `/elektriker/preise` → `ElektrikerPreise`, `/maler/preise` → Redirect `/handwerker/preise`, `/sanitaer/kontakt` → Redirect `/handwerker/kontakt`.
- `npm run build` grün, `npm run lint` ≤ Baseline (92).