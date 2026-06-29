## Ziel
Die Projekt-Beschreibungen im Homepage-Portfolio-Karussell (`IndexPortfolio.tsx`) werden auf Desktop aktuell vollständig angezeigt (`md:line-clamp-none`). Sie sollen stattdessen auf max. 3 Zeilen gekürzt werden – mit einem "Weiterlesen"-Toggle, um den vollen Text einzublenden (wie auf Mobile bereits vorhanden).

## Änderungen

### 1. Zeilenbegrenzung auf Desktop anwenden
In `src/components/IndexPortfolio.tsx`:
- Den Beschreibungs-`<p>` von `line-clamp-2` auf `line-clamp-3` ändern.
- Den Override `md:line-clamp-none` entfernen, damit die Begrenzung auch auf Desktop gilt.

### 2. "Weiterlesen"-Toggle auf Desktop sichtbar machen
- Den aktuell nur mobile sichtbaren Toggle-Button (`md:hidden`) anpassen, sodass er auf allen Viewports erscheint.
- Beim Desktop-Klick darf das Carousel-Item nicht als Link-Click gewertet werden (`stopPropagation` / `preventDefault` bleibt erhalten).

### 3. Optional: Fallback-Beschreibungen prüfen
Falls einzelne Einträge keine Datenbank-Beschreibung haben und auf den Fallback-Text zurückgreifen, bleibt der Toggle korrekt funktionsfähig (State `expandedDescs` ist bereits implementiert).

## Ergebnis
- Konsistentes Verhalten zwischen Mobile und Desktop.
- Kürzere, übersichtlichere Karten im Karussell.
- Nutzer können per Klick den vollständigen Text lesen.