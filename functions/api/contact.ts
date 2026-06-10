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

    // Build FormSubmit.co payload
    const formData = new URLSearchParams()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('subject', `[Contact] ${subject} — from ${name}`)
    formData.append('message', message)
    formData.append('_replyto', email)
    formData.append('_subject', `[Contact] ${subject} — from ${name}`)
    formData.append('_captcha', 'false')

    const submitRes = await fetch('https://formsubmit.co/support@homeofcalculators.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'manual',
    })

    // FormSubmit returns 302 on success (redirects to thank-you page)
    // or 200 if the confirmation email was just sent
    if (submitRes.status === 200 || submitRes.status === 302) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Message sent successfully. We will reply within 24-48 hours.',
          note: 'If this is your first submission, check support@homeofcalculators.com for a confirmation link.',
        }),
        { status: 200, headers: corsHeaders }
      )
    }

    const errorText = await submitRes.text().catch(() => 'Unknown error')
    console.error('FormSubmit error:', submitRes.status, errorText)

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
