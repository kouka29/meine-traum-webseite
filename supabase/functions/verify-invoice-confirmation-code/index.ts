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

  const email = String(body?.email || '').trim().toLowerCase()
  const code = String(body?.code || '').replace(/\D/g, '')
  if (!email || code.length !== 6) {
    return new Response(JSON.stringify({ error: 'Ungültige Eingabe' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Auth check (same as send)
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  const { data: userData } = await supabase.auth.getUser(token)
  const user = userData?.user
  if (!user) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: row } = await supabase
    .from('invoice_confirmation_codes')
    .select('*')
    .eq('email', email)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
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
    await supabase.from('invoice_confirmation_codes').update({ consumed_at: new Date().toISOString() }).eq('id', row.id)
    return new Response(JSON.stringify({ error: 'Zu viele Versuche. Bitte neuen Code anfordern.' }), {
      status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const submittedHash = await sha256(code)
  if (submittedHash !== row.code_hash) {
    await supabase.from('invoice_confirmation_codes')
      .update({ attempts: row.attempts + 1 }).eq('id', row.id)
    return new Response(JSON.stringify({ error: 'Falscher Code', attemptsRemaining: MAX_ATTEMPTS - row.attempts - 1 }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  await supabase.from('invoice_confirmation_codes')
    .update({ consumed_at: new Date().toISOString() }).eq('id', row.id)

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
