## Finding 2 — Weg A: Operativer Fix in Stripe

### Was du im Stripe-Dashboard machst
1. Stripe-Dashboard → Produkte → Gutscheine.
2. Coupon **CBI-Y1** öffnen → „Applies to" / „Gilt für" von „Specific products" auf **„All products"** ändern → speichern.
3. Coupon **CBI-KAUF25** öffnen → gleiche Änderung → speichern.

Falls Stripe kein direktes Bearbeiten der „applies_to"-Einschränkung erlaubt (das ist bei bestehenden Coupons oft der Fall): Coupon archivieren und neu anlegen — diesmal ohne Produkt-Einschränkung:
- CBI-Y1: „Fester Betrag 40,00 €", Dauer „Mehrere Monate = 12", **keine** Produkt-Einschränkung.
- CBI-KAUF25: „Prozent 25 %", Dauer „Einmalig", **keine** Produkt-Einschränkung.

### Was ich danach tue
- Finding 2 als „fixed" markieren.
- Kein Code-Change nötig — der bestehende Server-Flow (`session.discounts = [{ coupon }]`) funktioniert dann, weil die Coupons auf alle Line-Items (inkl. MwSt-Position) angewendet werden dürfen.

### Verifikation
Nach der Umstellung eine Testbuchung über `/preise?demo=CBI` → Popup → Miete oder Kauf wählen → Checkout sollte ohne 500-Fehler laden und den rabattierten Betrag anzeigen (Stripe zeigt „−40 € / −25 %" als eigene Zeile).

Sag mir Bescheid, sobald die Coupons umgestellt sind — dann schließe ich Finding 2.
