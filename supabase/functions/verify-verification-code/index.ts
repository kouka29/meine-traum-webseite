import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_ATTEMPTS = 5

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  let body: any
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const code = String(body?.code || '').replace(/\D/g, '')
  const checkoutSessionId = String(body?.checkoutSessionId || '').trim()
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (code.length !== 6 || !UUID_RE.test(checkoutSessionId)) {
    return new Response(JSON.stringify({ error: 'Ungültige Eingabe' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const { data: userData } = await supabase.auth.getUser(token)
  const user = userData?.user
  if (!user) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const { data: account } = await supabase
    .from('customer_accounts')
    .select('email, invoice_allowed')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!account?.invoice_allowed || !account.email) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const email = String(account.email).trim().toLowerCase()

  const { data: row } = await supabase
    .from('order_verifications')
    .select('*')
    .eq('checkout_session_id', checkoutSessionId)
    .eq('email', email)
    .is('consumed_at', null)
    .maybeSingle()

  if (!row) {
    return new Response(JSON.stringify({ error: 'Kein aktiver Code. Bitte neu anfordern.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    return new Response(JSON.stringify({ error: 'Code abgelaufen. Bitte neu anfordern.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    await supabase.from('order_verifications').update({ consumed_at: new Date().toISOString() }).eq('id', row.id)
    return new Response(JSON.stringify({ error: 'Zu viele Versuche. Bitte neuen Code anfordern.' }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const submittedHash = await sha256(code)
  if (submittedHash !== row.code_hash) {
    await supabase.from('order_verifications')
      .update({ attempts: row.attempts + 1 }).eq('id', row.id)
    return new Response(JSON.stringify({ error: 'Falscher Code', attemptsRemaining: MAX_ATTEMPTS - row.attempts - 1 }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  await supabase.from('order_verifications')
    .update({ consumed_at: new Date().toISOString(), verified: true }).eq('id', row.id)

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})