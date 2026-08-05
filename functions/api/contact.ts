// Cloudflare Pages Function — Contact Form Handler
// Endpoint: POST /api/contact
//
// This handler validates the form and returns a structured payload.
// The frontend opens a mailto: link so the user's email client sends the message directly.
// No third-party email service (Resend, etc.) is required.

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

export async function onRequestPost(context: { request: Request }) {
  const { request } = context

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

    const timestamp = new Date().toISOString()
    const ip = request.headers.get('cf-connecting-ip') || 'unknown'
    const country = request.headers.get('cf-ipcountry') || 'unknown'

    // The AJAX endpoint returns JSON; the plain one returns an HTML page whose
    // status code says nothing useful — the old code treated any 2xx/3xx as a
    // success, so it reported "sent" even when FormSubmit had served its own
    // landing page and delivered nothing.
    //
    // Origin is required: without it FormSubmit replies "Make sure you open this
    // page through a web server". The old request set only Referer, which is not
    // enough.
    //
    // NOTE: this path is a fallback. FormSubmit blocks datacenter IPs, and
    // Cloudflare Workers egress from exactly those ranges, so it may still be
    // refused here. The contact page therefore calls FormSubmit directly from
    // the visitor's browser, which uses their own IP.
    const submitRes = await fetch('https://formsubmit.co/ajax/support@homeofcalculators.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://homeofcalculators.com',
        Referer: 'https://homeofcalculators.com/contact',
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _replyto: email,
        _subject: `[Contact] ${subject} — from ${name}`,
        _captcha: 'false',
        _template: 'table',
      }),
    })

    const result = (await submitRes.json().catch(() => null)) as { success?: string; message?: string } | null

    // FormSubmit reports success as the string "true", not a boolean.
    if (submitRes.ok && result && String(result.success) === 'true') {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Message sent successfully. We will reply within 24-48 hours.',
        }),
        { status: 200, headers: corsHeaders }
      )
    }

    // Log enough to recover the message by hand if delivery was refused.
    console.error('FormSubmit rejected submission:', submitRes.status, result?.message ?? 'no message', {
      name,
      email,
      subject,
      message,
      timestamp,
      ip,
      country,
    })

    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send message. Please try again later.' }),
      { status: 502, headers: corsHeaders }
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
