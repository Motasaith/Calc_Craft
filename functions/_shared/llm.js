// Shared Ollama Cloud client with automatic API-key failover.
//
// Used by every AI endpoint on the site:
//   functions/api/chat.js              — chat widget
//   functions/api/solve.js             — AI Math Solver
//   functions/api/build-calculator.js  — AI Calculator Builder
//
// ─────────────────────────────────────────────────────────────────────────
//  WHY
// ─────────────────────────────────────────────────────────────────────────
//  Free Ollama Cloud accounts have a daily quota. When one key runs out the
//  API starts returning 429 and every AI feature on the site goes dark until
//  the quota resets. This module lets you add spare keys as extra environment
//  variables and rotates to the next one automatically.
//
// ─────────────────────────────────────────────────────────────────────────
//  HOW TO ADD A KEY
// ─────────────────────────────────────────────────────────────────────────
//  Cloudflare Pages dashboard → Settings → Environment Variables. Add:
//
//      LLM_API_KEY       ← the primary (already set)
//      LLM_API_KEY_01    ← first spare
//      LLM_API_KEY_02    ← second spare
//      LLM_API_KEY_03    ← ...and so on, no upper limit
//
//  Nothing else to change — they are discovered at request time, so a new key
//  is live as soon as the deployment picks up the variable. Numbering may skip
//  (01, 02, 05 is fine) and leading zeros are optional (_1 and _01 both work).
//
//  Keys are tried in order: LLM_API_KEY first, then ascending by number.
//  Duplicate values are collapsed, so pasting the same key twice is harmless.

/**
 * HTTP statuses that mean "this key is no good right now, try another".
 *
 * 429 is the quota case we actually care about. 401/402/403 cover a revoked,
 * unpaid, or mistyped key. 5xx and 408 are provider-side blips where a retry on
 * a different key costs nothing.
 *
 * Deliberately NOT included: 400 and 404. Those mean our payload or model name
 * is wrong, which every key would reject identically — retrying would just burn
 * quota on all of them and slow the error down.
 */
const FAILOVER_STATUSES = new Set([401, 402, 403, 408, 425, 429, 500, 502, 503, 504])

/**
 * Index of the key that last succeeded, remembered for the lifetime of this
 * isolate. Purely an optimisation: once the primary is exhausted for the day we
 * stop paying a wasted round-trip to it on every single request. Correctness
 * never depends on it — the rotation still tries every key.
 */
let preferredIndex = 0

/**
 * Finds every configured API key in the environment.
 *
 * @param {Record<string, unknown>} env
 * @returns {{ label: string, key: string }[]} Ordered, deduplicated.
 */
export function collectApiKeys(env) {
  if (!env) return []

  const numbered = []
  let primary = null

  for (const name of Object.keys(env)) {
    if (!name.startsWith('LLM_API_KEY')) continue

    const value = typeof env[name] === 'string' ? env[name].trim() : ''
    if (!value) continue

    if (name === 'LLM_API_KEY') {
      primary = { label: name, key: value }
      continue
    }

    const match = name.match(/^LLM_API_KEY_(\d+)$/)
    if (match) {
      numbered.push({ label: name, key: value, order: parseInt(match[1], 10) })
    }
    // Anything else starting with LLM_API_KEY (LLM_API_KEY_BACKUP, say) is
    // ignored on purpose — silently trusting arbitrary names makes it too easy
    // for an unrelated variable to be treated as a credential.
  }

  numbered.sort((a, b) => a.order - b.order)

  const ordered = primary ? [primary, ...numbered] : numbered

  // Collapse duplicate values, keeping the first label that used them.
  const seen = new Set()
  const unique = []
  for (const entry of ordered) {
    if (seen.has(entry.key)) continue
    seen.add(entry.key)
    unique.push({ label: entry.label, key: entry.key })
  }

  return unique
}

/**
 * POSTs a chat-completion payload to Ollama Cloud, rotating through the
 * configured keys until one works.
 *
 * @param {Record<string, unknown>} env      Cloudflare env bindings.
 * @param {object} payload                   OpenAI-compatible request body.
 * @param {object} [options]
 * @param {number} [options.timeoutMs]       Per-attempt timeout. Default 60s.
 * @param {string} [options.serviceLabel]    Name used in the "not configured" error.
 *
 * @returns {Promise<
 *   | { ok: true,  data: object, keyLabel: string, attempts: object[] }
 *   | { ok: false, status: number, error: string, detail?: string, attempts: object[] }
 * >}
 */
export async function callLLM(env, payload, options = {}) {
  const { timeoutMs = 60000, serviceLabel = 'This AI feature' } = options

  const baseUrl = ((env && env.LLM_BASE_URL) || 'https://ollama.com/v1').replace(/\/$/, '')
  const keys = collectApiKeys(env)
  const attempts = []

  if (keys.length === 0) {
    return {
      ok: false,
      status: 503,
      error: `${serviceLabel} is not configured (no LLM_API_KEY on the server).`,
      attempts,
    }
  }

  // Start from whichever key last worked, then wrap around through the rest.
  const start = preferredIndex < keys.length ? preferredIndex : 0
  const order = []
  for (let i = 0; i < keys.length; i++) {
    order.push((start + i) % keys.length)
  }

  let lastStatus = 502
  let lastError = 'Could not reach the AI service.'
  let lastDetail = ''

  for (const index of order) {
    const { label, key } = keys[index]

    let res
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch (e) {
      clearTimeout(timer)
      const aborted = e && e.name === 'AbortError'
      attempts.push({ key: label, outcome: aborted ? 'timeout' : 'network-error' })
      lastStatus = 502
      lastError = aborted
        ? 'The AI service took too long to respond.'
        : 'Could not reach the AI service.'
      continue // a dead socket on one key says nothing about the next
    }

    clearTimeout(timer)

    if (res.ok) {
      let data
      try {
        data = await res.json()
      } catch {
        attempts.push({ key: label, outcome: 'bad-json' })
        lastStatus = 502
        lastError = 'Invalid AI response.'
        continue
      }

      preferredIndex = index
      attempts.push({ key: label, outcome: 'ok' })
      return { ok: true, data, keyLabel: label, attempts }
    }

    const detail = await res.text().catch(() => '')
    attempts.push({ key: label, outcome: `http-${res.status}` })

    if (!FAILOVER_STATUSES.has(res.status)) {
      // Our request is malformed — every key would reject it the same way.
      return {
        ok: false,
        status: 502,
        error: `AI service error (${res.status}).`,
        detail: detail.slice(0, 500),
        attempts,
      }
    }

    lastStatus = 502
    lastError = `AI service error (${res.status}).`
    lastDetail = detail.slice(0, 500)

    console.log(
      `[llm] ${label} returned ${res.status}; failing over (${attempts.length}/${keys.length} tried)`
    )
  }

  // Every key is exhausted or broken. 429 across the board is the common case
  // and deserves a message a visitor can act on.
  const allRateLimited = attempts.length > 0 && attempts.every((a) => a.outcome === 'http-429')

  console.log(`[llm] all ${keys.length} key(s) failed: ${attempts.map((a) => `${a.key}=${a.outcome}`).join(', ')}`)

  return {
    ok: false,
    status: allRateLimited ? 429 : lastStatus,
    error: allRateLimited
      ? 'Our AI service has hit its daily limit. Please try again later.'
      : lastError,
    detail: lastDetail || undefined,
    attempts,
  }
}

/**
 * Pulls the answer out of a chat-completion response.
 *
 * gpt-oss:120b is a reasoning model that sometimes puts the reply in
 * `reasoning` instead of `content`; gemma4:31b always uses `content`.
 */
export function extractMessage(data) {
  const choice = data && data.choices && data.choices[0] && data.choices[0].message
  if (!choice) return ''
  return String(choice.content || choice.reasoning || '').trim()
}
