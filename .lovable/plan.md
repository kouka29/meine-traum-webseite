## Ziel
Die gesamte Website (alle Seiten, Komponenten, Popups, E-Mail-Templates) auf Rechtschreibung, Grammatik, Typografie und stilistische Konsistenz prüfen — aus der Perspektive eines erfahrenen deutschen Copywriters.

## Vorgehen eines Experten-Copywriters

Ein professioneller Copywriter prüft nicht "von oben nach unten", sondern in **mehreren Durchgängen mit unterschiedlichem Fokus**. Jeder Durchgang fängt andere Fehlerklassen:

### Durchgang 1 — Rechtschreibung & Tippfehler
- Standard-Duden-Rechtschreibung (z. B. „Webseite" vs. „Website" — beides erlaubt, aber konsistent halten)
- Häufige Tippfehler: „seit/seid", „das/dass", „wieder/wider", „Standart/Standard"
- Anglizismen korrekt (z. B. „Website", nicht „Webseite" wenn die ganze Site gemeint ist)

### Durchgang 2 — Grammatik & Satzbau
- Kongruenz Subjekt/Prädikat
- Falsche Kasus nach Präpositionen („wegen dem" → „wegen des")
- Komma-Setzung bei Nebensätzen, Infinitivgruppen, Aufzählungen
- Bezug von Pronomen (worauf bezieht sich „dieser/das"?)

### Durchgang 3 — Typografie (deutscher Standard)
- Anführungszeichen: „deutsch" statt "englisch" oder ‚gemischt'
- Bindestrich vs. Gedankenstrich: – (Halbgeviert) statt -
- Auslassungspunkte: … statt ...
- Geschützte Leerzeichen vor Einheiten, z. B. „1.500 €" (NBSP)
- Prozent, €, Zahlen: „48 h" statt „48h", „2–4 Wochen" mit Halbgeviertstrich
- „z. B.", „u. a." mit Leerzeichen

### Durchgang 4 — Konsistenz (Brand Voice)
- Sie-Anrede durchgängig (bereits erledigt — final verifizieren)
- Schreibweise von Eigennamen: „Meine Traum Webseite" vs. „Meine Traum-Website" vs. „meine-traum-website.de" — eine Variante festlegen
- „Website" vs. „Webseite" konsistent (Empfehlung: „Website" für ganzen Auftritt, „Seite/Unterseite" für einzelne)
- Begriffe wie „Conversion", „Landingpage", „SEO" — Groß-/Kleinschreibung einheitlich
- CTA-Wording vereinheitlichen („Kostenlose Vorschau sichern" vs. „Kostenlose Website-Vorschau sichern" vs. „Kostenlose Strategie-Vorschau sichern")

### Durchgang 5 — Stil & Klarheit
- Füllwörter raus („eigentlich", „natürlich", „wirklich")
- Nominalstil → Verbalstil („zur Umsetzung bringen" → „umsetzen")
- Doppelte Verneinungen, Schachtelsätze
- Werbliche Übertreibungen prüfen (z. B. „bis zu 400 % mehr" — Quelle?)

### Durchgang 6 — SEO-Texte & Meta
- Title-Tags und Meta-Descriptions auf Tippfehler
- Alt-Texte
- JSON-LD-Strings

## Scope
Geprüft werden:
- Alle Seiten in `src/pages/` (~25 Dateien)
- Alle Komponenten in `src/components/` mit sichtbarem Text
- Popups: `LeadCaptureModal`, `PricingLeadPopup`, `GlobalCtaPopup`, `CookieBanner`
- Footer, Navbar, PageMeta (SEO-Texte)
- E-Mail-Templates in `supabase/functions/_shared/transactional-email-templates/`
- Strukturierte Daten (`StructuredData.tsx`)

Nicht geprüft: `IndexOriginal.tsx` (offenbar Backup), Admin-Bereich (interne UI).

## Deliverable

Ich liefere die Korrekturen **direkt als Code-Änderungen** in einem Durchgang, gruppiert nach Datei. Vor dem Patchen erhalten Sie zusätzlich eine **kurze Zusammenfassung der wichtigsten gefundenen Fehlerkategorien** (z. B. „12× fehlendes NBSP vor €", „3× ‚dass' falsch geschrieben", „uneinheitliche Schreibweise Markenname"), damit Sie nachvollziehen können, was geändert wurde.

## Offene Frage vor Umsetzung

Damit ich konsistent korrigieren kann, brauche ich **eine Entscheidung** zu zwei Punkten:

1. **Markenname**: Wie soll er einheitlich geschrieben werden?
   - „Meine Traum Webseite" (aktuell teilweise)
   - „Meine Traum-Website"
   - „meine-traum-website" (klein, wie Domain)

2. **Website vs. Webseite**: Streng trennen (Website = ganzer Auftritt, Webseite = Einzelseite) — oder beides synonym beibehalten wie bisher?

Wenn Sie hier keine Präferenz haben, entscheide ich nach Duden-Empfehlung: **„Meine Traum-Website"** und **strikte Trennung Website/Webseite**.