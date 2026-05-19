
# Diskussion & Plan — 3 Conversion-Probleme auf /a/[slug]

Als Team aus **Conversion-Stratege + Senior Copywriter + UX/UI Designer + Branchenexperte** — hier die Analyse und Empfehlung pro Punkt.

---

## PROBLEM 1 — Paket-Wahl zeigt nur Kaufpreis (2.490 € / 3.900 €)

**Diagnose:**
Der Kunde sieht sofort den vollen Kaufpreis ohne zu wissen, dass es auch eine Mietoption ab 139 €/Monat gibt. Wer mit so einer Summe nicht gerechnet hat, scrollt nicht weiter — er schließt. Wir verlieren ihn 3 Sekunden bevor wir unser stärkstes Argument zeigen konnten.

**Was die Rollen sagen:**

- **Conversion-Stratege:** "Price anchoring zu früh auf den höchsten Wert killt die Conversion. Wir müssen die niedrigste Einstiegshürde zuerst kommunizieren."
- **Copywriter:** "Niemand kauft eine Zahl. Sie kaufen eine Entscheidung. Gib ihnen zwei Wege, nicht einen Preis."
- **UX-Designer:** "Dual-Pricing direkt auf der Card — gleich sichtbar, gleichwertig dargestellt."
- **Branchenexperte:** "Im Webdesign-Markt erwartet der Kunde heute beide Modelle. Wer nur Kauf zeigt, wirkt teuer und unflexibel."

**Empfehlung — Dual-Price Toggle auf jeder Paket-Card:**

```
┌────────────────────────────────┐
│  EINSTIEG                      │
│  E-COMMERCE PAKET S            │
│  Professioneller Online-Shop…  │
│                                │
│  ┌──────────┬──────────────┐   │
│  │ MIETEN   │  KAUFEN      │   │  ← Toggle
│  └──────────┴──────────────┘   │
│                                │
│  ab  139 €/Monat               │  ← große Zahl
│  oder einmalig 2.490 €         │  ← kleine Zeile
│                                │
│  ✓ Keine hohe Anfangsinvestition│
│  ✓ Monatlich kündbar nach 12 M.│
│                                │
│  [ Alle 7 Leistungen anzeigen ]│
│  [ Dieses Paket wählen      ]  │
└────────────────────────────────┘
```

Dazu **über den Paketen** ein kurzer Hinweis-Streifen:
> "Zwei Wege zu Ihrer Website — mieten ab 139 €/Monat oder einmalig kaufen. Sie entscheiden später."

Effekt: Der erste Preis, den der Kunde sieht, ist **139 €**, nicht 2.490 €. Die Kaufoption bleibt prominent — aber sie schreckt nicht mehr ab.

---

## PROBLEM 2 — "Was wir gemeinsam umsetzen" zeigt Leistungen ein zweites Mal

**Diagnose:**
Die Leistungen stehen bereits ausklappbar auf der Paket-Card oben. Sie nochmal als 7 große Cards mit identischem Inhalt zu wiederholen, wirkt redundant — und die generischen lila ✦-Icons machen es visuell unruhig ohne Information hinzuzufügen.

**Was die Rollen sagen:**

- **UX-Designer:** "Doppelte Information = kognitive Last. Entweder weglassen oder neu framen."
- **Copywriter:** "Wenn wir es nochmal zeigen, dann mit **anderem Blickwinkel** — nicht 'was' sondern 'warum es Ihnen hilft'."
- **Conversion-Stratege:** "Die zweite Wiederholung sollte den **Wert** verkaufen, nicht das Feature."

**Zwei Optionen — bitte wählen:**

**Option A (radikal, empfohlen):** Section komplett entfernen. Stattdessen direkt unter den Paketen ein **"So läuft Ihr Projekt"** Block (Timeline) — das beantwortet die Frage, die jetzt offen ist: "Wie geht es weiter, wenn ich buche?"

**Option B (sanft):** Section umbauen zu **"Was Sie davon haben"** — keine Feature-Liste mehr, sondern 4–5 **Benefit-Statements** mit Mini-Icons:
> "Kunden bestellen auch nachts" · "Sie wirken sofort professionell" · "Sie sparen Stunden manueller Arbeit" · "Sie brauchen kein Technik-Wissen"

Keine Card-Wiederholung der Features oben.

---

## PROBLEM 3 — "Kauf oder Miete" wird nicht als Entscheidung kommuniziert

**Diagnose:**
Die zwei Preis-Karten stehen nebeneinander, aber es ist nicht visuell klar: **"Das ist ein ODER — Sie wählen eines von beidem."** Es sieht aus wie zwei getrennte Angebote oder gar wie eine Addition.

**Was die Rollen sagen:**

- **UX-Designer:** "Es fehlt das visuelle Verbindungs-Element zwischen den Karten — ein 'ODER' in der Mitte."
- **Copywriter:** "Headline muss die Entscheidung framen: nicht 'Investitionsvolumen' (analytisch), sondern 'Wie möchten Sie zahlen?' (handlungsorientiert)."
- **Branchenexperte:** "Kunden kennen das Muster von Streaming-Abos: 'Monatlich vs. Jährlich'. Das gleiche Muster funktioniert hier."

**Empfehlung:**

1. **Neue Headline:** "Wie möchten Sie zahlen?" + Subtext: "Beide Wege — gleiches Ergebnis. Sie entscheiden."
2. **"ODER"-Badge** zwischen den Karten (Kreis, weiß, Border, absolut positioniert in der Mitte)
3. **Visuelle Hierarchie aufbrechen** — eine Karte aktiv hervorgehoben (Miete, da Einstiegshürde niedriger = mehr Conversions), die andere zurückgenommen
4. **Comparison-Row darunter:** Mini-Tabelle die zeigt was identisch ist ("Beide enthalten: alles aus dem Paket, 2 Korrekturrunden, DSGVO, …")

```
       Wie möchten Sie zahlen?
       Beide Wege — gleiches Ergebnis.

  ┌──────────────┐  ╭───╮  ┌──────────────┐
  │ EINMAL KAUFEN│  │ODER│  │ MONATLICH    │ ★ EMPFOHLEN
  │              │  ╰───╯  │              │
  │   2.490 €    │         │  139 €/Monat │
  │              │         │              │
  └──────────────┘         └──────────────┘

  Beides enthält: alles aus Paket S · 2 Korrekturen · DSGVO · Hosting
```

---

## ENTSCHEIDUNGEN — bitte bestätigen

1. **Problem 1:** Dual-Price-Toggle auf Paket-Cards einbauen + Hinweis-Streifen darüber? **(empfohlen: ja)**
2. **Problem 2:** Option A (Section ersetzen durch Timeline) oder Option B (zu Benefits umbauen)?
3. **Problem 3:** "ODER"-Badge + neue Headline + Comparison-Row? **(empfohlen: ja)**

Sobald Du die 3 Punkte bestätigst (oder Variationen wünschst), setze ich es um.
