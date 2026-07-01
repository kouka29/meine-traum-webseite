# Telegram-Pings für die zwei fehlenden Formulare

Ziel: Beide Publikumsformulare senden ab sofort einen Telegram-Ping via zentraler `submitLead` → `notify-lead` Edge-Function. Bestehende Logik (Supabase-Insert, Formspree, Transaktionsmails) bleibt unangetastet.

## 1. `src/pages/KostenloseVorschauV2.tsx`

Drei Events, an denen Telegram informiert wird — alle als **fire-and-forget** *nach* dem bereits vorhandenen Supabase-Insert (damit der Erfolgs-Gate erhalten bleibt):

**a) Haupt-Formular (`handleSubmit`, Zeile ~976–1080)** — nach erfolgreichem `leads`-Insert:
```ts
void submitLead({
  name: state.firstName,
  phone: state.phone,
  email: state.email || undefined,
  company: state.company,
  message: state.notes || undefined,
  source_cta: "kostenlose-vorschau-v2:lead",
});
```

**b) Kontaktweg gewählt (`updateContactMethod`, Zeile ~1084 ff.)** — parallel zum Formspree-Call:
```ts
void submitLead({
  name: state.firstName,
  phone: state.phone,
  email: state.email || undefined,
  company: state.company,
  source_cta: `kostenlose-vorschau-v2:kontaktweg:${method}`,
});
```

**c) Termin gebucht (Booking-Handler, Zeile ~540–618)** — nach erfolgreichem Booking-Update, parallel zu Formspree/Mails:
```ts
void submitLead({
  name: firstName,
  phone: phone || "",
  email,
  company,
  message: `Termin: ${dateLabel} ${bookingTime} (${methodLabel})`,
  source_cta: "kostenlose-vorschau-v2:booking",
});
```

Import ergänzen: `import { submitLead } from "@/lib/submitLead";`

## 2. `src/pages/Premium.tsx`

Aktuell fake Submit (nur `setSubmitted(true)`). Umbau:

- `handleSubmit` → `async`, ruft `submitLead` mit Formulardaten (`name`, `email`, `phone`, `company`, `message`, `source_cta: "premium-form"`).
- Nur bei Erfolg (`ok === true`) `setSubmitted(true)`, sonst Fehler-State setzen und Button re-enable.
- Submit-Button-Loading-State (`submitting`) hinzufügen; Button während Request disablen.
- Validation (name/email/message) bleibt unverändert.

Import ergänzen: `import { submitLead } from "@/lib/submitLead";`

## Nicht angefasst

- `submitLead`, `notify-lead` Edge-Function, DB-Schema — funktionieren bereits (Telegram bestätigt Zustellung in Logs).
- Formspree-Calls (bewusst redundant als E-Mail-Backup).
- Supabase-Insert als Erfolgs-Gate in KostenloseVorschauV2.
- Booking/Checkout-Flows (`Angebot.tsx`, `CheckoutFunnel.tsx`) — eigener Prozess.

## Verifikation

Nach dem Build: manueller Test auf `/kostenlose-vorschau` (Formular absenden + Kontaktweg wählen + Termin buchen) und `/premium` (Formular absenden). Erwartet: 4 Telegram-Nachrichten mit unterschiedlichen `source_cta`-Kennungen.
