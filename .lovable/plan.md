

# Plan: Automatische Website-Mockups für Portfolio-Projekte

## Übersicht
Wenn im Admin-Bereich ein externer Link für ein Portfolio-Projekt eingefügt wird, soll automatisch ein Screenshot der Website erstellt und als Laptop/Smartphone-Mockup dargestellt werden. Da serverseitiges Browser-Rendering (Puppeteer etc.) in Edge Functions nicht möglich ist, nutzen wir einen externen Screenshot-API-Dienst.

## Ansatz

Wir verwenden die kostenlose **Screenshot Machine API** oder alternativ die **Lovable AI Image Generation** (Gemini), um aus einem einfachen Screenshot ein Device-Mockup zu erstellen. Realistischer und zuverlässiger ist folgender Ansatz:

### Schritt 1: Edge Function für Screenshot-Generierung
Neue Edge Function `generate-mockup` erstellen:
- Nimmt eine URL entgegen
- Ruft einen kostenlosen Screenshot-Dienst auf (z.B. `https://image.thum.io/get/width/1280/` + URL für Desktop, `https://image.thum.io/get/width/375/` + URL für Mobile)
- Speichert die Screenshots in Supabase Storage
- Gibt die URLs der gespeicherten Bilder zurück

### Schritt 2: Storage Bucket erstellen
- Migration/Setup für einen `mockups` Storage Bucket (public)
- RLS Policy: öffentliches Lesen, Schreiben nur via Service Role

### Schritt 3: Admin-Bereich erweitern (`AdminLeads.tsx`)
- Button "Mockup generieren" neben dem externen Link-Feld
- Beim Klick wird die Edge Function aufgerufen
- Zeigt Ladeindikator während der Generierung
- Speichert die generierten Mockup-URLs im Portfolio-Projekt (neue DB-Spalten)

### Schritt 4: Datenbank erweitern
- `ALTER TABLE portfolio_projects ADD COLUMN mockup_desktop_url text DEFAULT '';`
- `ALTER TABLE portfolio_projects ADD COLUMN mockup_mobile_url text DEFAULT '';`

### Schritt 5: Portfolio-Darstellung (`Portfolio.tsx` & `IndexPortfolio.tsx`)
- Wenn Mockup-URLs vorhanden sind, diese als Projektbild anzeigen
- Optional: CSS-basiertes Device-Frame-Overlay (Laptop-Rahmen, Smartphone-Rahmen) um die Screenshots

## Technische Details

- **Screenshot-API**: `thum.io` (kostenlos, kein API-Key nötig, Limitierungen bei Traffic)
- **Storage**: Supabase Storage Bucket `mockups`
- **Neue DB-Spalten**: `mockup_desktop_url`, `mockup_mobile_url`
- **CSS Device Frames**: Reine CSS-Lösung mit Border-Radius, Schatten und Proportionen für Laptop/Smartphone-Look
- **Fallback**: Wenn Mockup-Generierung fehlschlägt, wird das bestehende Projektbild verwendet

