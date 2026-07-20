'use client'

/**
 * ChatWidget — cute, modern, bottom-right customer-support widget.
 *
 * Features (chatbast.io-style):
 *  - Floating launcher bubble (with unread dot + online pulse)
 *  - Animated open/close panel (framer-motion)
 *  - Header: avatar, name, status, clear + close buttons
 *  - Message list: user + assistant bubbles, markdown rendering, links
 *    open in a new tab, auto-scroll to bottom
 *  - Typing indicator (three bouncing dots)
 *  - Quick-reply suggestion chips on first open
 *  - Composer: textarea + send button, Enter to send, Shift+Enter newline
 *  - Persists conversation to localStorage so reloads keep context
 *  - Works on mobile (responsive, full-width on small screens)
 *  - Auto-notifies on new blog posts / calculators via the build-time
 *    site-index (the backend Function fetches /site-index.json live)
 *  - Gracefully degrades if /api/chat is unreachable
 *
 * Talks to the Cloudflare Pages Function at /api/chat (see functions/api/chat.js).
 * The Ollama API key lives only on the server — never shipped to the browser.
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, RotateCcw, Bot } from 'lucide-react'

interface Msg {
  role: 'user' | 'assistant'
  content: string
  ts: number
}

const STORAGE_KEY = 'hoc-chat-history-v1'
const MAX_HISTORY = 40

// Quick replies shown when the panel first opens and there's no history yet.
const QUICK_REPLIES = [
  'What calculators do you have?',
  'Help me find a mortgage calculator',
  'How does the Visual Builder work?',
  'Latest blog posts?',
]

/** Very small, safe markdown → HTML renderer for chat content.
 *  Supports: links [text](url), bold **x**, italic *x*, code `x`, line breaks.
 *  All rendered links get target="_blank" rel="noopener". */
function renderMarkdownToHtml(md: string): string {
  // Escape HTML first to avoid injection.
  const esc = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  let s = esc
  // Markdown links [text](url) — must run before inline code escaping below
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, txt, url) => {
    const safeUrl = url.replace(/["'\\]/g, '')
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="hoc-chat-link">${txt}</a>`
  })
  // Bare URLs (not already in a link) — linkify
  s = s.replace(
    /(^|[\s(])(https?:\/\/[^\s<)]+)(?![^<]*>|[^<]*<\/a>)/g,
    (_m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer" class="hoc-chat-link">${url}</a>`
  )
  // Inline code
  s = s.replace(/`([^`]+)`/g, '<code class="hoc-chat-code">$1</code>')
  // Bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Italic (avoid touching ** that we already handled)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  // Line breaks
  s = s.replace(/\n/g, '<br/>')
  return s
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Load saved history once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Msg[]
        if (Array.isArray(parsed)) setMessages(parsed.slice(-MAX_HISTORY))
      }
    } catch {}
  }, [])

  // Persist history whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)))
    } catch {}
  }, [messages])

  // Auto-scroll to bottom on new message / typing.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  // Unread dot: when closed and a new assistant message arrives.
  useEffect(() => {
    if (!open && messages.length > 0 && messages[messages.length - 1]?.role === 'assistant') {
      setUnread(true)
    }
    if (open) setUnread(false)
  }, [messages, open])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      setError(null)
      const userMsg: Msg = { role: 'user', content: trimmed, ts: Date.now() }
      const newMessages = [...messages, userMsg]
      setMessages(newMessages)
      setInput('')
      setLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            // Send a compact history (role + content only).
            history: newMessages.slice(-13, -1).map((m) => ({ role: m.role, content: m.content })),
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err?.error || `Request failed (${res.status})`)
        }
        const data = await res.json()
        const reply = data?.reply || data?.error || 'Sorry, I could not get a reply.'
        setMessages((m) => [...m, { role: 'assistant', content: reply, ts: Date.now() }])
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Network error.'
        setError(msg)
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content:
              "I'm having trouble connecting right now. Please try again in a moment, or visit our [Contact page](https://homeofcalculators.com/contact).",
            ts: Date.now(),
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [loading, messages]
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  const onInputKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const showQuickReplies = messages.length === 0

  return (
    <>
      {/* ─── Launcher bubble ─── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat with HoC Bot'}
        className="fixed bottom-5 right-5 z-[60] flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="relative">
              <MessageCircle className="w-6 h-6" />
              {/* Online pulse */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
              {/* Unread dot */}
              {unread && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                  •
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ─── Chat panel ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-[5.5rem] right-5 z-[59] w-[calc(100vw-2.5rem)] sm:w-[380px] h-[min(70vh,560px)] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden font-sans"
            role="dialog"
            aria-label="Home of Calculators chat"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-primary-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight">HoC Bot</p>
                <p className="text-[11px] text-white/80 leading-tight">Support assistant • online</p>
              </div>
              <button
                onClick={clearChat}
                aria-label="Clear conversation"
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50 space-y-3">
              {messages.length === 0 && (
                <div className="text-center px-3 py-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-700 mb-2">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Hi! I'm HoC Bot 👋</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ask me to find a calculator, explain a feature, or check our latest posts.
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <MessageBubble key={i} msg={m} />
              ))}

              {loading && (
                <div className="flex items-center gap-2 max-w-[80%]">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary-700" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
                    <Dot delay="0ms" />
                    <Dot delay="150ms" />
                    <Dot delay="300ms" />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-[11px] text-red-500 text-center px-2">{error}</p>
              )}
            </div>

            {/* Quick replies */}
            {showQuickReplies && !loading && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-gray-50">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <div className="flex items-end gap-2 px-3 py-3 border-t border-gray-200 bg-white">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                rows={1}
                placeholder="Type your message…"
                aria-label="Type your message"
                className="flex-1 resize-none max-h-28 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                style={{ minHeight: '38px' }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="shrink-0 w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline styles scoped to this widget (avoid Tailwind purge issues). */}
      <style jsx global>{`
        .hoc-chat-link {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 600;
          word-break: break-word;
        }
        .hoc-chat-link:hover {
          color: #1d4ed8;
        }
        .hoc-chat-code {
          background: rgba(0, 0, 0, 0.06);
          padding: 0 4px;
          border-radius: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.85em;
        }
      `}</style>
    </>
  )
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user'
  const html = useMemo(
    () => (isUser ? '' : renderMarkdownToHtml(msg.content)),
    [isUser, msg.content]
  )
  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-primary-700" />
        </div>
      )}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-primary-600 text-white rounded-2xl rounded-tr-sm'
            : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm'
        }`}
        {...(isUser ? { children: msg.content } : { dangerouslySetInnerHTML: { __html: html } })}
      />
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
      style={{ animationDelay: delay }}
    />
  )
}