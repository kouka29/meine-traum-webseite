## Ziel
Sicherstellen, dass `order_verifications` ausschließlich vom Service-Role (Edge Functions) gelesen/geschrieben werden kann — kein Zugriff für `anon` oder `authenticated`.

## Ist-Zustand (aus den bisherigen Migrationen)
- RLS ist aktiviert (`ENABLE ROW LEVEL SECURITY` in der Ursprungsmigration).
- Es existiert genau eine Policy: `order_verifications_service_role_only` mit `TO service_role`, `USING (true) WITH CHECK (true)`.
- GRANTs: nur `GRANT ALL ... TO service_role`. Keine Grants an `anon`/`authenticated`.

Technisch ist Client-Zugriff damit bereits blockiert (RLS + fehlende Grants). Die Absicherung soll aber explizit und idempotent in einer eigenen Migration festgehalten werden, damit sie auch bei späteren Schema-Änderungen (z. B. jemand fügt „nebenbei" einen Grant hinzu) bestehen bleibt.

## Änderungen

### Neue Migration `harden_order_verifications_rls.sql`
1. `REVOKE ALL ON public.order_verifications FROM PUBLIC, anon, authenticated;`
   (entfernt jeden versehentlich vergebenen Zugriff und die Default-Rechte von `PUBLIC`).
2. `ALTER TABLE public.order_verifications FORCE ROW LEVEL SECURITY;`
   (RLS gilt dann auch für Table-Owner-Rollen — sicherheitshalber, falls die Tabelle in einem Kontext ohne `service_role` angesprochen wird).
3. Sicherstellen, dass RLS aktiv ist: `ENABLE ROW LEVEL SECURITY` (idempotent).
4. Alle vorhandenen Policies droppen und die eine gewünschte neu anlegen:
   - `DROP POLICY IF EXISTS "order_verifications_service_role_only" ON public.order_verifications;`
   - `CREATE POLICY "order_verifications_service_role_only" ON public.order_verifications FOR ALL TO service_role USING (true) WITH CHECK (true);`
5. Explizit nur `GRANT ALL ON public.order_verifications TO service_role;` wiederherstellen.

### Keine Änderungen an
- Edge Functions `send-verification-code` / `verify-verification-code` — nutzen bereits den Service-Role-Key.
- Frontend — greift ausschließlich über die Edge Functions zu, nie direkt auf die Tabelle.
- `types.ts` — wird automatisch regeneriert.

## Verifikation nach dem Migrationslauf
- `supabase--linter` laufen lassen; erwartet keine Findings zu `order_verifications`.
- `supabase--read_query` mit einer Prüfung, dass für `order_verifications` keine Policies außer `order_verifications_service_role_only` existieren und keine Grants an `anon`/`authenticated` vorhanden sind.
