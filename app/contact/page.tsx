'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, MapPin, Clock, Globe, CheckCircle2, Sparkles, Calculator, Briefcase, Shield, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const REASONS = [
  { icon: Calculator, title: 'Question about a calculator', email: 'support@homeofcalculators.com', desc: 'Found a bug, an inaccurate result, or a feature request? Use this.' },
  { icon: Briefcase, title: 'Partnership & business', email: 'partnerships@homeofcalculators.com', desc: 'Press, integrations, custom work, or large-scale licensing inquiries.' },
  { icon: Shield, title: 'Privacy & legal', email: 'privacy@homeofcalculators.com', desc: 'Data requests, GDPR/CCPA inquiries, terms clarification.' },
]

const FAQ = [
  { q: 'How fast will I get a response?', a: 'Most support emails are answered within 24-48 hours, Monday through Friday.' },
  { q: 'Do you offer phone support?', a: 'No — we keep costs low by handling support over email. This lets us keep the entire platform free.' },
  { q: 'Can I suggest a new calculator?', a: 'Absolutely. Use the suggestion form below or email us. We add new calculators monthly based on user feedback.' },
  { q: 'Is there a bug bounty program?', a: 'Not formally, but we reward responsible disclosure of security issues. Email security@homeofcalculators.com.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Question about a calculator', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email, and message')
      return
    }
    if (!form.email.includes('@') || !form.email.includes('.')) {
      setError('Please enter a valid email address')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({ success: false, error: 'Unexpected server response.' }))
      if (res.ok && data.success) {
        setSubmitted(true)
      } else {
        setError(data.error || `Something went wrong (status ${res.status}). Please try again.`)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main id="main-content" role="main" aria-label="Contact Home of Calculators" className="min-h-screen bg-white">
        {/* ───────── HERO ───────── */}
        <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 overflow-hidden bg-gradient-to-b from-white via-neutral-50/40 to-white">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[440px] bg-primary-100/30 blur-3xl rounded-full" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] font-bold font-mono uppercase tracking-wider mb-5 text-dark-700 shadow-sm">
              <Mail className="w-3.5 h-3.5 text-primary-600" /> Contact
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-dark-900 mb-5 leading-[1.05]">
              Let&apos;s talk
            </h1>
            <p className="text-base sm:text-lg text-dark-500 max-w-2xl mx-auto leading-relaxed">
              Found a bug? Have a feature request? Want to partner with us? Pick a topic below and we&apos;ll route your message to the right person.
            </p>
          </div>
        </section>

        {/* ───────── REASONS ───────── */}
        <section className="py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-3">
              {REASONS.map((r) => (
                <a
                  key={r.title}
                  href={`mailto:${r.email}`}
                  className="group p-4 sm:p-5 bg-white border border-neutral-200 hover:border-primary-400 hover:shadow-lg rounded-2xl transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center mb-3 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <r.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-dark-900 mb-1">{r.title}</h3>
                  <p className="text-xs text-dark-500 leading-relaxed mb-2">{r.desc}</p>
                  <div className="text-[10px] font-mono text-primary-600 font-bold group-hover:underline">{r.email}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── FORM + INFO ───────── */}
        <section className="py-10 sm:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_360px] gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-5 sm:p-7"
            >
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-900 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-dark-900 mb-2">Message sent</h2>
                  <p className="text-sm text-dark-500 max-w-md mx-auto mb-5">
                    Thanks for reaching out. We&apos;ll get back to you at <strong>{form.email}</strong> within 24-48 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: 'Question about a calculator', message: '' }) }}
                    className="text-sm font-bold text-primary-600 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-xl font-extrabold text-dark-900 mb-1">Send us a message</h2>
                  <p className="text-sm text-dark-500 mb-5">We respond to all legitimate inquiries within 1-2 business days.</p>

                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-dark-600 font-mono tracking-wider mb-1">Your name *</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Jane Smith"
                          className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-dark-600 font-mono tracking-wider mb-1">Email *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="jane@example.com"
                          className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-dark-600 font-mono tracking-wider mb-1">Topic</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                      >
                        <option>Question about a calculator</option>
                        <option>Bug report</option>
                        <option>Feature request</option>
                        <option>Custom calculator help</option>
                        <option>Embed & integration help</option>
                        <option>Partnership opportunity</option>
                        <option>Press inquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-dark-600 font-mono tracking-wider mb-1">Message *</label>
                      <textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={6}
                        placeholder="Tell us what's on your mind…"
                        className="w-full p-3 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                        required
                      />
                    </div>
                    {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-dark-900 hover:bg-black text-white rounded-lg text-sm font-bold active:scale-95 transition-all disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Send message
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-dark-400">
                      By submitting, you agree to our <Link href="/privacy-policy" className="underline hover:text-dark-700">Privacy Policy</Link>. We never share your details.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Info side */}
            <aside className="space-y-3">
              <div className="p-5 bg-dark-900 text-white rounded-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/30 rounded-full blur-3xl" />
                <h3 className="text-sm font-extrabold mb-3 relative">Quick facts</h3>
                <ul className="space-y-2 text-xs text-white/80 relative">
                  <li className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 text-primary-300 shrink-0" /> Response within 24-48 hours, Mon-Fri</li>
                  <li className="flex items-start gap-2"><Globe className="w-3.5 h-3.5 mt-0.5 text-primary-300 shrink-0" /> Global team, GMT-8 to GMT+1</li>
                  <li className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 text-primary-300 shrink-0" /> 100% remote, no physical office</li>
                </ul>
              </div>

              <div className="p-5 bg-primary-50 border border-primary-100 rounded-2xl">
                <Sparkles className="w-5 h-5 text-primary-600 mb-2" />
                <h3 className="text-sm font-extrabold text-primary-900 mb-1">Quick start</h3>
                <p className="text-xs text-primary-800/80 leading-relaxed mb-2">Looking for a specific calculator?</p>
                <Link href="/calculators" className="text-xs font-bold text-primary-900 hover:underline">
                  Browse the library →
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        <section className="py-12 sm:py-16 bg-neutral-50/50 border-t border-neutral-200/60" itemScope itemType="https://schema.org/FAQPage">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 mb-6 text-center tracking-tight">Quick answers</h2>
            <div className="space-y-2">
              {FAQ.map((qa, i) => (
                <details key={i} className="group p-4 bg-white border border-neutral-200 rounded-2xl hover:border-neutral-300" itemScope itemType="https://schema.org/Question">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="text-sm font-bold text-dark-900 pr-3" itemProp="name">{qa.q}</h3>
                    <span className="text-dark-400 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-dark-600 leading-relaxed" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <span itemProp="text">{qa.a}</span>
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
