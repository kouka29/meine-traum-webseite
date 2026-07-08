import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const CODE_TTL_MIN = 10

async function sha256(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function generateCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000
  return n.toString().padStart(6, '0')
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

  const angebots_id = body?.angebots_id ? String(body.angebots_id) : null

  // Authorization: caller must be authenticated + customer_accounts.invoice_allowed = true
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const { data: userData } = await supabase.auth.getUser(token)
  const user = userData?.user
  if (!user) {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const { data: account } = await supabase
    .from('customer_accounts')
    .select('invoice_allowed, email, first_name')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!account?.invoice_allowed) {
    return new Response(JSON.stringify({ error: 'Rechnungszahlung ist für dieses Konto nicht freigeschaltet.' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // ALWAYS send to the account's stored business email, never free-text from the popup
  const email = String(account.email || '').trim().toLowerCase()
  if (!email || !/.+@.+\..+/.test(email)) {
    return new Response(JSON.stringify({ error: 'Keine gültige Geschäfts-E-Mail hinterlegt.' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const code = generateCode()
  const codeHash = await sha256(code)
  const expiresAt = new Date(Date.now() + CODE_TTL_MIN * 60_000).toISOString()

  // Invalidate previous unused codes for this email
  await supabase
    .from('order_verifications')
    .update({ consumed_at: new Date().toISOString() })
    .eq('email', email)
    .is('consumed_at', null)

  const { error: insErr } = await supabase.from('order_verifications').insert({
    email, angebots_id, code_hash: codeHash, expires_at: expiresAt, verified: false,
  })
  if (insErr) {
    console.error('insert code failed', insErr)
    return new Response(JSON.stringify({ error: 'Konnte Code nicht speichern' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { error: mailErr } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'invoice-confirmation-code',
      recipientEmail: email,
      templateData: {
        code,
        firstName: account.first_name ?? undefined,
        expiresInMinutes: CODE_TTL_MIN,
      },
    },
  })
  if (mailErr) {
    console.error('mail send failed', mailErr)
    return new Response(JSON.stringify({ error: 'Konnte E-Mail nicht senden' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true, email, expiresInMinutes: CODE_TTL_MIN }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})