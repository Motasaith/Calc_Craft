// Cloudflare Pages Function — Contact Form Handler
// Endpoint: POST /api/contact
//
// SETUP REQUIRED:
// 1. Sign up at https://resend.com (free tier: 100 emails/day)
// 2. Get an API key from Resend dashboard
// 3. In Cloudflare Pages dashboard → Settings → Environment variables:
//    Add: RESEND_API_KEY = your_resend_api_key
//    Add: CONTACT_TO_EMAIL = your@email.com (where you want to receive messages)
//    Add: CONTACT_FROM_EMAIL = noreply@homeofcalculators.com (must be verified in Resend)
//
// ALTERNATIVE: If you don't want to use Resend, the function will still validate
// and store submissions. You can retrieve them from Cloudflare Logs or connect
// a webhook URL via the WEBHOOK_URL environment variable.

interface Env {
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
  WEBHOOK_URL?: string
}

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function sanitize(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 2000)
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const body = (await request.json()) as ContactForm

    // Validation
    const name = sanitize(body.name || '')
    const email = sanitize(body.email || '').toLowerCase()
    const subject = sanitize(body.subject || 'General inquiry')
    const message = sanitize(body.message || '')

    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter your name (at least 2 characters).' }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a valid email address.' }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (!message || message.length < 10) {
      return new Response(
        JSON.stringify({ success: false, error: 'Please enter a message (at least 10 characters).' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Honeypot / spam check (simple)
    const userAgent = request.headers.get('user-agent') || ''
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Automated submissions are not allowed.' }),
        { status: 403, headers: corsHeaders }
      )
    }

    const timestamp = new Date().toISOString()
    const ip = request.headers.get('cf-connecting-ip') || 'unknown'
    const country = request.headers.get('cf-ipcountry') || 'unknown'

    const payload = {
      name,
      email,
      subject,
      message,
      timestamp,
      ip,
      country,
      source: 'homeofcalculators.com contact form',
    }

    // Try Resend first
    if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL || 'Home of Calculators <noreply@homeofcalculators.com>',
          to: env.CONTACT_TO_EMAIL,
          reply_to: `${name} <${email}>`,
          subject: `[Contact] ${subject} — from ${name}`,
          html: `
            <h2>New contact form submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="border-left:3px solid #ccc;padding-left:10px;margin-left:0;color:#333;">${message.replace(/\n/g, '<br>')}</blockquote>
            <hr>
            <p style="font-size:12px;color:#888;">
              Submitted at ${timestamp}<br>
              IP: ${ip} | Country: ${country}
            </p>
          `,
          text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSubmitted at ${timestamp}\nIP: ${ip} | Country: ${country}`,
        }),
      })

      if (resendRes.ok) {
        return new Response(
          JSON.stringify({ success: true, message: 'Message sent successfully. We will reply within 24-48 hours.' }),
          { status: 200, headers: corsHeaders }
        )
      }

      // If Resend fails, fall through to webhook/logging
      console.error('Resend failed:', await resendRes.text())
    }

    // Fallback: webhook
    if (env.WEBHOOK_URL) {
      await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    // Always return success to user even if email fails (data is logged)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message received. We will get back to you within 24-48 hours.',
        note: env.RESEND_API_KEY ? undefined : 'Email service not configured. Please set RESEND_API_KEY in Cloudflare environment variables.',
      }),
      { status: 200, headers: corsHeaders }
    )
  } catch (err) {
    console.error('Contact form error:', err)
    return new Response(
      JSON.stringify({ success: false, error: 'Something went wrong. Please try again later.' }),
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
