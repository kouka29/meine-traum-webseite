

# Plan: Externer Link für Portfolio-Projekte

## Übersicht
Portfolio-Projekte sollen einen optionalen externen Link (`external_url`) erhalten. Klickt ein Besucher auf ein Projekt, öffnet sich der Link in einem neuen Tab.

## Schritte

### 1. Datenbank: Spalte `external_url` hinzufügen
- Migration: `ALTER TABLE portfolio_projects ADD COLUMN external_url text DEFAULT '';`

### 2. Edge Function aktualisieren (`admin-leads/index.ts`)
- `portfolio-create`: `external_url` Feld beim Insert berücksichtigen
- `portfolio-update`: `external_url` in die Updates aufnehmen

### 3. Admin-Bereich (`AdminLeads.tsx`)
- `PortfolioProject` Interface um `external_url` erweitern
- Im Portfolio-Formular (Create/Edit Dialog) ein neues Input-Feld "Externer Link (URL)" hinzufügen
- Beim Speichern/Aktualisieren `external_url` mitsenden

### 4. Portfolio-Seite (`Portfolio.tsx`)
- `external_url` aus der DB laden (bereits `select("*")`)
- Projekt-Karte in einen `<a href={p.external_url} target="_blank" rel="noopener noreferrer">` wrappen (nur wenn URL vorhanden)
- Ohne URL bleibt die Karte nicht klickbar (oder ohne Link)

### 5. Index-Portfolio (`IndexPortfolio.tsx`)
- `external_url` im Select hinzufügen
- Gleiche Link-Logik wie auf der Portfolio-Seite

