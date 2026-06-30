## Prompt 6/9 — Ungenutzte npm-Dependencies entfernen

Grep-Verifikation in `src/**`: alle Kandidaten haben **0 Importe**.

### Entfernen aus `package.json`
- `@hookform/resolvers`
- `date-fns`
- `@radix-ui/react-avatar`
- `@radix-ui/react-aspect-ratio`
- `@radix-ui/react-collapsible`
- `@radix-ui/react-context-menu`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-hover-card`
- `@radix-ui/react-menubar`
- `@radix-ui/react-navigation-menu`
- `@radix-ui/react-scroll-area`
- `@radix-ui/react-slider`
- `@radix-ui/react-toggle-group`
- `input-otp`
- `cmdk`
- `vaul`

### Behalten
- `tailwindcss-animate` (Plugin in tailwind.config.ts)
- `zod` (3 Importe in src/)
- alle nicht in Kandidatenliste genannten Pakete

### Hinweis
`react-hook-form` ist ebenfalls 0× importiert, steht aber nicht auf der Kandidatenliste → bleibt unverändert.

### Ablauf
1. `npm uninstall` der 16 Pakete (aktualisiert package.json + Lockfile).
2. `npm run build` muss grün sein.
3. `npm run lint` ≤ Baseline (~92 nach Prompt 5).