// Cloudflare Pages Function — AI Calculator Builder Backend
// Endpoint: POST /api/build-calculator
//
// Turns a plain-English description ("a quote calculator for my roofing
// business") into a CustomCalculatorConfig — the same JSON the visual builder
// at /builder produces and that CustomCalculatorRenderer draws. The user can
// then save it to their profile and embed it on their own site.
//
// Two modes, both on this one endpoint:
//   create — { prompt, business?, image? }              → a brand new config
//   refine — { instruction, config, prompt?, business? } → an edited config
//
// An optional image (base64 data URL) lets the user photograph or screenshot
// an existing calculator / spreadsheet / price sheet to be rebuilt; that path
// uses the vision model, exactly like the AI Math Solver at /api/solve.
//
// Env vars (set in Cloudflare Pages dashboard → Settings → Environment):
//   LLM_BASE_URL       = https://ollama.com/v1
//   LLM_API_KEY        = <your Ollama Cloud key>
//   LLM_MODEL          = gpt-oss:120b   (text descriptions)
//   VISION_LLM_MODEL   = gemma4:31b     (when an image is attached)
//
// Returns: { config, notes, suggestions, model }
// The browser re-validates `config` through lib/ai-calc-schema.ts before it is
// ever rendered — this endpoint is a generator, not a trust boundary.

// The schema contract. This has to stay in step with CustomCalculatorConfig in
// components/calculators/shared/CustomCalculatorRenderer.tsx and with the
// expression grammar in lib/formula-parser.ts.
const SCHEMA_SPEC = `Return a JSON object with EXACTLY this shape:

{
  "name": "string — the calculator title, max 80 chars",
  "description": "string — one sentence explaining what it works out, max 300 chars",
  "brandName": "string — short brand/label shown in the widget header, max 40 chars, optional",
  "theme": "retro" | "dark" | "modern" | "pastel" | "cyberpunk" | "custom",
  "customColors": { "primary": "#rrggbb", "secondary": "#rrggbb", "background": "#rrggbb", "text": "#rrggbb", "lcdBg": "#rrggbb", "lcdText": "#rrggbb" },
  "layout": "stacked" | "grid",
  "requireSubmit": boolean,
  "components": [ ...input fields... ],
  "formulas": [ ...results... ],
  "notes": "string — 1-2 sentences to the user about what you built and any assumption you made",
  "suggestions": ["string", "string", "string"]
}

COMPONENT (an input field):
{
  "id": "unique-kebab-id",
  "name": "variable_name",          // lowercase snake_case, used in formulas
  "type": "number" | "slider" | "select" | "radio" | "checkbox" | "header" | "text",
  "label": "Human readable label",
  "placeholder": "e.g. 1200",       // optional
  "helpText": "short hint",         // optional
  "unit": "kg",                     // optional, short, shown next to the input
  "defaultValue": "100",            // string; boolean for checkbox
  "min": 0, "max": 1000, "step": 1, // number/slider only; slider REQUIRES min+max
  "options": [{ "value": "1.5", "label": "Premium (+50%)" }]  // select/radio only
}

FORMULA (a result the calculator displays):
{
  "id": "unique-kebab-id",
  "label": "What this number is",
  "formula": "price * qty * (1 + tax_rate / 100)",
  "decimalPlaces": 2,
  "prefix": "$",                    // optional, max 8 chars
  "suffix": " kg"                   // optional, max 8 chars
}

FORMULA LANGUAGE — this is a strict, small expression grammar. Anything outside
it is rejected and the result is dropped:
- Operators: + - * / % ^ and parentheses. NOTHING else.
- Functions: pow(a,b) sqrt(x) abs(x) round(x) ceil(x) floor(x) sin(x) cos(x)
  tan(x) log(x) log10(x) ln(x). NO other function exists.
- Constants: pi, e.
- Variables: ONLY the "name" of a component you defined in this same config.
- There are NO comparisons, NO if/else, NO ternaries, NO min/max, NO && or ||,
  NO string values. A formula must evaluate to a single number.
- Trig functions take RADIANS. Convert degrees yourself: sin(deg * pi / 180).

MODELLING CONDITIONAL LOGIC WITHOUT IF:
Because there is no if(), express choices as a "select" or "radio" input whose
option VALUES are the numbers you want to multiply or add. Example — shipping
speed changing a fee:
  { "type": "select", "name": "speed", "label": "Shipping speed",
    "options": [{ "value": "0", "label": "Standard (free)" },
                { "value": "9.95", "label": "Express (+$9.95)" }] }
then use: subtotal + speed
A checkbox behaves as 1 when ticked and 0 when unticked, so
  base * (1 + rush * 0.25)
adds 25% only when the "rush" checkbox is on.

HARD RULES
1. Output ONLY the JSON object. No prose, no markdown, no code fences.
2. Every variable used in every formula MUST be the "name" of a component in
   the same config. Never reference a variable you did not define.
3. "name" values must be unique, lowercase snake_case, and must NEVER be one of:
   pi, e, pow, sqrt, abs, round, ceil, floor, sin, cos, tan, log, log10, ln.
4. Give every input a sensible defaultValue so the calculator shows a real
   result the moment it loads. Never leave the widget showing 0.
5. 2-6 input fields and 1-4 results is the sweet spot. Never exceed 24 fields
   or 8 results.
6. Prefer "number" inputs. Use "slider" only for a bounded percentage or rating,
   "select"/"radio" for a fixed set of choices, "checkbox" for a yes/no that
   changes the maths.
7. "header" and "text" components are labels only — they take no value and are
   never referenced in a formula. Use them sparingly to group long forms.
8. Use prefix for currency ("$", "£", "€") and suffix for units ("%", " kg",
   " hrs"). decimalPlaces 2 for money, 0 for counts.`

const SYSTEM_PROMPT = `You are the AI Calculator Builder for Home of Calculators (homeofcalculators.com).

A visitor describes a calculator in plain English — often for their own business, to embed on their own website. You design it: the input fields, the maths, the wording, and the look. You are a domain expert as well as a builder: if they say "roofing quote calculator" you already know it needs area, pitch factor, material rate, waste allowance and labour.

${SCHEMA_SPEC}

QUALITY BAR
- Get the maths RIGHT. Use the real, standard formula for the domain (compound
  interest, BMI, VAT, margin vs markup, mortgage payment, unit conversions).
  Markup and margin are not the same thing; simple and compound interest are not
  the same thing. Double-check before you commit.
- Label fields the way the user's customers would say it, not the way a
  developer would ("Roof area", not "area_input").
- Write helpText only where a field is genuinely ambiguous.
- If the request is vague, pick the most common interpretation, build a complete
  working calculator, and state the assumption in "notes". Never return an empty
  or placeholder calculator, and never ask a clarifying question instead of
  building — the user can refine it afterwards.
- If the user supplies business details, use them: put their brand in
  "brandName", their currency in the prefixes, their units in the suffixes, and
  match "theme" to their brand feel. If they give brand colours, set
  "theme": "custom" and fill "customColors" with them.
- "suggestions" must be 3 short, concrete next steps phrased as instructions the
  user could send straight back, e.g. "Add a bulk discount for orders over 100"
  or "Switch it to euros".`

const REFINE_PROMPT = `You are the AI Calculator Builder for Home of Calculators.

The user already has a working calculator and wants it CHANGED. You are given the current config as JSON and an instruction.

${SCHEMA_SPEC}

REFINEMENT RULES
- Apply the requested change and return the COMPLETE updated config, not a diff
  and not just the changed part.
- Keep everything the user did not ask you to change: same field ids, same
  variable names, same labels, same theme, same defaults. Stability matters —
  they are iterating on something they already like.
- If you add an input, you must also use it in a formula, or explain in "notes"
  why it is display-only.
- If you remove or rename an input, fix every formula that referenced it.
- "notes" says what you changed, in one sentence.
- "suggestions" offers 3 further refinements.`

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function onRequestPost({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  const baseUrl = (env && env.LLM_BASE_URL) || 'https://ollama.com/v1'
  const apiKey = (env && env.LLM_API_KEY) || ''
  const textModel = (env && env.LLM_MODEL) || 'gpt-oss:120b'
  const visionModel = (env && env.VISION_LLM_MODEL) || 'gemma4:31b'

  if (!apiKey) {
    return json({ error: 'The AI Calculator Builder is not configured (missing LLM_API_KEY on the server).' }, 503)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const prompt = String(body?.prompt || '').slice(0, 4000)
  const instruction = String(body?.instruction || '').slice(0, 2000)
  const imageDataUrl = String(body?.image || '').slice(0, 4_000_000) // cap 4MB
  const existingConfig = body?.config && typeof body.config === 'object' ? body.config : null
  const business = body?.business && typeof body.business === 'object' ? body.business : null

  const isRefine = !!(instruction && existingConfig)

  if (!isRefine && !prompt.trim() && !imageDataUrl) {
    return json({ error: 'Describe the calculator you want, or upload a picture of one to rebuild.' }, 400)
  }

  const useVision = !!imageDataUrl
  const model = useVision ? visionModel : textModel

  // Build the user turn.
  const parts = []

  if (isRefine) {
    parts.push('CURRENT CALCULATOR CONFIG:')
    parts.push(JSON.stringify(compactConfig(existingConfig)))
    parts.push('')
    parts.push(`CHANGE REQUESTED: ${instruction}`)
  } else {
    parts.push(`CALCULATOR REQUEST: ${prompt || 'Rebuild the calculator shown in the attached image.'}`)
  }

  const businessBlock = formatBusiness(business)
  if (businessBlock) {
    parts.push('')
    parts.push('BUSINESS CONTEXT SUPPLIED BY THE USER — use this to name, brand, price and style the calculator:')
    parts.push(businessBlock)
  }

  if (useVision) {
    parts.push('')
    parts.push('An image is attached. Read the fields, labels and numbers in it and reproduce that calculator faithfully.')
  }

  parts.push('')
  parts.push('Return the JSON object now. No prose, no code fences.')

  const textContent = parts.join('\n')

  const userContent = useVision
    ? [
        { type: 'text', text: textContent },
        {
          type: 'image_url',
          image_url: imageDataUrl.startsWith('data:') ? imageDataUrl : `data:image/png;base64,${imageDataUrl}`,
        },
      ]
    : textContent

  const messages = [
    { role: 'system', content: isRefine ? REFINE_PROMPT : SYSTEM_PROMPT },
    { role: 'user', content: userContent },
  ]

  let llmRes
  try {
    llmRes = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.25, // low — the maths has to be right, not creative
        max_tokens: 4000,
        stream: false,
        ...(useVision ? { modalities: ['text', 'image'] } : {}),
      }),
    })
  } catch (e) {
    return json({ error: 'Could not reach the AI service.' }, 502)
  }

  if (!llmRes.ok) {
    const text = await llmRes.text().catch(() => '')
    return json({ error: `AI service error (${llmRes.status}).`, detail: text.slice(0, 500) }, 502)
  }

  let data
  try {
    data = await llmRes.json()
  } catch {
    return json({ error: 'Invalid AI response.' }, 502)
  }

  const choice = data?.choices?.[0]?.message
  // gpt-oss:120b is a reasoning model and sometimes answers in `reasoning`.
  const raw = String(choice?.content || choice?.reasoning || '').trim()

  if (!raw) {
    return json({ error: 'The AI returned an empty response. Please try again.' }, 502)
  }

  const parsed = extractJson(raw)
  if (!parsed) {
    return json(
      { error: 'The AI did not return a valid calculator. Try describing it in a bit more detail.' },
      502
    )
  }

  const notes = String(parsed.notes || '').slice(0, 600)
  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions.slice(0, 4).map((s) => String(s).slice(0, 140)).filter(Boolean)
    : []

  // Strip the meta fields so what we hand back is purely the config; the
  // browser normalises it before rendering.
  delete parsed.notes
  delete parsed.suggestions

  return json({ config: parsed, notes, suggestions, model }, 200)
}

/**
 * Trims the config we echo back to the model. Logos are base64 blobs that can
 * be hundreds of KB — they blow the context window and the model never needs
 * to see the bytes.
 */
function compactConfig(config) {
  const copy = { ...config }
  if (copy.logo) copy.logo = '<user logo, preserved separately>'
  delete copy.createdAt
  delete copy.createdWith
  delete copy.aiPrompt
  return copy
}

function formatBusiness(business) {
  if (!business) return ''
  const fields = [
    ['Business name', business.name],
    ['Industry / what they do', business.industry],
    ['Website', business.website],
    ['Who will use the calculator', business.audience],
    ['Currency', business.currency],
    ['Units', business.units],
    ['Brand colours', business.brandColors],
    ['Preferred look', business.tone],
    ['Pricing, rates and other details', business.notes],
  ]
  return fields
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${String(v).slice(0, 800)}`)
    .join('\n')
}

/**
 * Pulls a JSON object out of a model response that may be fenced, prefixed with
 * prose, or followed by an explanation. Falls back to brace matching so a
 * nested object inside the config doesn't truncate the match.
 */
function extractJson(raw) {
  const cleaned = raw
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()

  try {
    const obj = JSON.parse(cleaned)
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj
  } catch {
    // fall through to brace scanning
  }

  const start = cleaned.indexOf('{')
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escaped = false

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i]

    if (escaped) {
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === '"') {
      inString = !inString
      continue
    }
    if (inString) continue

    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) {
        try {
          const obj = JSON.parse(cleaned.slice(start, i + 1))
          if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj
        } catch {
          return null
        }
        return null
      }
    }
  }

  return null
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}
