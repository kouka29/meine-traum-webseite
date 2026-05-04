## Ziel

Rechtlich saubere und vertrauensbildende MwSt.-Kennzeichnung auf der Preisseite – ohne den visuellen Fluss der Cards zu stören.

## Experten-Empfehlung: 3-Ebenen-Ansatz

Statt nur stumpf "zzgl. 19% MwSt." unter jeden Preis zu kleben, arbeite ich mit **drei Ebenen**, die zusammen professionell wirken:

### Ebene 1: Direkt unter jedem Preis (sehr klein, grau)

Direkt unter dem großen Preis in jeder Card – kleinste sinnvolle Größe (`text-xs`), gedämpfte Farbe (`text-muted-foreground`), kein Fettdruck. So nimmt es keine Aufmerksamkeit vom Preis weg, ist aber für jeden sichtbar der hinschaut.

Format: `zzgl. 19 % MwSt.`

Gilt für:
- Alle 3 Miete-Cards (Starter, Pro, Premium) → `zzgl. 19 % MwSt.`
- Enterprise-Card Miete → `zzgl. 19 % MwSt.`
- Alle 3 Einmalkauf-Cards → `zzgl. 19 % MwSt.`
- Enterprise-Card Einmalkauf → `zzgl. 19 % MwSt.`

### Ebene 2: Bei "monatliche Äquivalenz" im Einmalkauf

Beim Einmalkauf wird "≈ nur 41 €/Monat über 2 Jahre" angezeigt. Hier MwSt.-Hinweis weglassen (wäre doppelt-gemoppelt), da die Zeile darüber schon den Hauptpreis netto deklariert hat.

### Ebene 3: Globaler Hinweis am Ende der Tabs

Ein dezenter, zentrierter Satz unterhalb der Preis-Cards (vor dem "Mieten oder kaufen"-Vergleichsblock):

> _Alle Preise verstehen sich netto zzgl. der gesetzlichen Mehrwertsteuer. Für Gewerbetreibende voll absetzbar._

Der Zusatz **"Für Gewerbetreibende voll absetzbar"** ist der Verkaufspsychologie-Trick: Handwerker (Zielgruppe) sind Gewerbetreibende → MwSt. ist für sie ein Durchlaufposten. Diese Erinnerung relativiert den "Mehrpreis" sofort und entschärft Preis-Einwände.

## Warum diese Lösung?

- **Rechtssicher**: PAngV-konform, B2B-typische Netto-Auszeichnung sauber gekennzeichnet
- **Nicht aufdringlich**: Der große Preis bleibt der Held der Card
- **Vertrauensbildend**: Transparenz statt versteckter Kosten – passt zum bestehenden "Keine versteckten Kosten"-Trust-Element
- **Verkaufsförderlich**: Der "voll absetzbar"-Hinweis macht aus einer Pflichtangabe einen subtilen Verkaufsbooster

## Technische Umsetzung

Datei: `src/pages/WebdesignPreise.tsx`

1. In `PackageCard`: Unter dem `<p>` mit `pkg.price` ein neues `<p className="text-xs text-muted-foreground -mt-1 mb-2">zzgl. 19 % MwSt.</p>` einfügen (bei Enterprise mit "Auf Anfrage" weglassen oder anders formulieren → `zzgl. MwSt.`).
2. In `BuyCard`: Identisch unter `pkg.price`.
3. In den beiden Enterprise-Inline-Blöcken (Miete + Einmalkauf): Gleicher kleiner Hinweis unter dem Preis.
4. Globaler Hinweis als zentrierter `<p className="text-xs text-muted-foreground text-center mt-8 italic">` direkt nach dem `</Tabs>`-Schließtag, vor dem "Mieten oder kaufen"-Vergleichsblock.

## Ergebnis (Beispiel Card)

```text
Pro
99 €/Monat
zzgl. 19 % MwSt.
Mindestlaufzeit: 12 Monate, …
```

Klein, sauber, professionell – wie bei Stripe, Personio oder anderen B2B-Profis.
