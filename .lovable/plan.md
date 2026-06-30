## Prompt 5/9 — Ungenutzte shadcn/ui-Dateien löschen

Grep-Prüfung abgeschlossen: Alle 23 Kandidaten haben **0 Referenzen** in `src/` (weder in App-Code noch innerhalb von `src/components/ui/`).

### Aktion
Lösche aus `src/components/ui/`:

alert.tsx, aspect-ratio.tsx, avatar.tsx, badge.tsx, breadcrumb.tsx, calendar.tsx, collapsible.tsx, command.tsx, context-menu.tsx, drawer.tsx, dropdown-menu.tsx, form.tsx, hover-card.tsx, input-otp.tsx, menubar.tsx, navigation-menu.tsx, pagination.tsx, resizable.tsx, scroll-area.tsx, sidebar.tsx, slider.tsx, table.tsx, toggle-group.tsx

### Verifikation
- `npm run build` muss grün sein
- `npm run lint` Fehlerzahl ≤ Baseline (~71)
- Keine weiteren Änderungen, Tabu-Zonen unberührt

Keine Ausnahmen — alle 23 Dateien werden gelöscht.