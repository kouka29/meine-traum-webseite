import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM = "Meine Traum Webseite <noreply@meine-traum-webseite.de>";
const SITE_URL = "https://meine-traum-webseite.de";
const RESET_PATH = "/kundenportal/passwort-zuruecksetzen";

function isValidEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function getTokenHash(actionLink: string) {
  const url = new URL(actionLink);
  const tokenHash = url.searchParams.get("token_hash") || url.searchParams.get("token");

  if (!tokenHash) {
    throw new Error("Reset-Link konnte nicht erzeugt werden");
  }

  return tokenHash;
}

function buildResetLink(tokenHash: string) {
  const url = new URL(RESET_PATH, SITE_URL);
  url.searchParams.set("token_hash", tokenHash);
  url.searchParams.set("type", "recovery");
  return url.toString();
}

function resetEmailHtml(resetLink: string) {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Passwort festlegen</title>
  </head>
  <body style="margin:0;background:#ffffff;font-family:Inter,Arial,sans-serif;color:#1E1B4B">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;padding:32px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border:1px solid #E6E2FF;border-radius:18px;overflow:hidden">
            <tr>
              <td style="background:#4F3FF0;padding:30px 28px;text-align:center">
                <h1 style="margin:0;color:#ffffff;font-family:Poppins,Arial,sans-serif;font-size:24px;line-height:1.25">Passwort festlegen</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:30px 28px">
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6">Hallo,</p>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#5B5875">über den folgenden Button kannst du dein Passwort für das Kundenportal festlegen oder zurücksetzen.</p>
                <p style="margin:0 0 26px;text-align:center">
                  <a href="${resetLink}" style="display:inline-block;background:#4F3FF0;color:#ffffff;text-decoration:none;border-radius:12px;padding:14px 24px;font-weight:700;font-size:15px">Passwort setzen</a>
                </p>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#77738F">Falls der Button nicht funktioniert, kopiere diesen kurzen Link in deinen Browser:</p>
                <p style="margin:0;font-size:13px;line-height:1.6;word-break:break-all"><a href="${resetLink}" style="color:#4F3FF0">${resetLink}</a></p>
              </td>
            </tr>
            <tr>
              <td style="background:#F7F5FF;padding:20px 28px;text-align:center;color:#77738F;font-size:12px;line-height:1.6">Meine Traum Webseite · QK Marketing Group</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function resetEmailText(resetLink: string) {
  return `Passwort festlegen\n\nHallo,\n\nüber diesen Link kannst du dein Passwort für das Kundenportal festlegen oder zurücksetzen:\n${resetLink}\n\nMeine Traum Webseite`;
}

async function sendEmail(email: string, resetLink: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) throw new Error("E-Mail-Versand ist nicht konfiguriert");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: "Passwort festlegen",
      html: resetEmailHtml(resetLink),
      text: resetEmailText(resetLink),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Resend password reset failed", { status: response.status, body });
    throw new Error("E-Mail konnte nicht versendet werden");
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email: rawEmail } = await req.json();
    const email = String(rawEmail || "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Ungültige E-Mail" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) throw new Error("Backend ist nicht konfiguriert");

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${SITE_URL}${RESET_PATH}` },
    });

    if (error) {
      console.error("Generate password reset link failed", error);
      throw new Error("Reset-Link konnte nicht erzeugt werden");
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) throw new Error("Reset-Link konnte nicht erzeugt werden");

    await sendEmail(email, buildResetLink(getTokenHash(actionLink)));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
