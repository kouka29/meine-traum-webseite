

# Plan: Portfolio-Verwaltung im Admin-Bereich

## Aktueller Stand
Portfolio-Projekte sind hardcoded in `Portfolio.tsx` und `IndexPortfolio.tsx` mit statischen Bildern aus `/src/assets/portfolio/`. Es gibt keine Möglichkeit, diese über den Admin-Bereich zu verwalten.

## Umsetzung

### 1. Datenbank: `portfolio_projects` Tabelle erstellen
- Felder: id, title, category, description, result, image_url, sort_order, is_visible, created_at
- RLS: Nur INSERT/SELECT für anon (öffentlich lesbar), Verwaltung über Edge Function mit service_role
- Storage Bucket `portfolio-images` für Bild-Uploads erstellen

### 2. Edge Function erweitern (`admin-leads`)
Neue Actions hinzufügen:
- `portfolio-list` -- alle Projekte laden
- `portfolio-create` -- neues Projekt anlegen (mit Bild-Upload als Base64)
- `portfolio-update` -- bestehendes Projekt bearbeiten
- `portfolio-delete` -- Projekt löschen
- `portfolio-reorder` -- Reihenfolge ändern

### 3. Admin-Seite: Portfolio-Tab hinzufügen
- Neuer Tab "Portfolio" neben Dashboard und Leads
- Tabelle mit allen Projekten (Titel, Kategorie, Ergebnis, sichtbar/unsichtbar)
- "Neues Projekt" Button mit Formular-Dialog (Titel, Kategorie, Beschreibung, Ergebnis, Bild-Upload)
- Bearbeiten- und Löschen-Buttons pro Eintrag
- Sichtbarkeit per Toggle ein/ausschalten
- Drag & Drop oder Pfeile für Reihenfolge

### 4. Portfolio-Seite und Index-Komponente aktualisieren
- `Portfolio.tsx` und `IndexPortfolio.tsx` laden Daten aus der Datenbank statt hardcoded
- Fallback auf bestehende hardcoded Daten falls DB leer
- IndexPortfolio zeigt die ersten 3 sichtbaren Projekte

### Technische Details
- Bilder werden als Base64 an die Edge Function geschickt und dort in den Storage Bucket hochgeladen
- Die Edge Function gibt die öffentliche URL zurück
- SELECT-Policy auf `portfolio_projects` erlaubt öffentliches Lesen (für die Website)
- Alle Admin-Operationen laufen über die Edge Function mit Passwort-Schutz

