// Cloudflare Pages Function — AI Math Solver Backend
// Endpoint: POST /api/solve
//
// Accepts either a typed math/text question, an uploaded image (base64
// data URL), or both. Uses the Ollama Cloud VISION model (gemma4:31b) when
// an image is present, otherwise falls back to the chat model.
//
// Env vars (set in Cloudflare Pages dashboard):
//   LLM_BASE_URL        = https://ollama.com/v1
//   LLM_API_KEY         = <your Ollama Cloud key>
//   LLM_MODEL           = gpt-oss:120b  (used for text-only questions)
//   VISION_LLM_MODEL    = gemma4:31b    (used when an image is attached)
//
// Returns: { answer: string, steps: string, model: string }
//   - answer:  the final, concise answer (number + units if applicable)
//   - steps:   detailed step-by-step explanation (markdown)
// The widget renders both, plus a "AI can make mistakes" disclaimer.

const SOLVER_SYSTEM = `You are an expert mathematics tutor. The user gives you a math problem — either as text or a photo of a handwritten/printed question.

Your job:
1. Carefully read the problem. If it's an image, identify the equation, expression, or word problem shown.
2. Solve it with 100% accuracy. Double-check the arithmetic.
3. Return your response as STRICT JSON with exactly two string fields:
   {
     "answer": "the final answer, concise, with units if applicable. e.g. \\"x = 3\\" or \\"42 m/s\\"",
     "steps": "a clear, detailed, step-by-step explanation in markdown of HOW you solved it. Use numbered steps, show every substitution, and explain the reasoning. End with the final answer line."
   }

Rules:
- Only output the JSON object. No prose before or after. No code fences.
- If the image is unreadable or not a math problem, return {"answer":"I couldn't read a math problem in that image.","steps":"Please upload a clearer photo of the math question."}
- If the text is not a math problem, return {"answer":"That doesn't look like a math problem.","steps":"Ask me a math question and I'll solve it step by step."}
- Always show units. Always simplify. Use LaTeX-style notation only where helpful (e.g. \\\\frac{a}{b}).
- If multiple valid answers exist, give the principal one and note alternatives in steps.
- Be honest if you cannot solve it; do not guess.`

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
    return json({ error: 'Solver is not configured (missing LLM_API_KEY on the server).' }, 503)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400)
  }

  const question = String(body?.question || '').slice(0, 4000)
  const imageDataUrl = String(body?.image || '').slice(0, 4_000_000) // cap 4MB
  const history = Array.isArray(body?.history) ? body.history.slice(-6) : []

  if (!question.trim() && !imageDataUrl) {
    return json({ error: 'Please provide a question or upload an image.' }, 400)
  }

  const useVision = !!imageDataUrl
  const model = useVision ? visionModel : textModel

  // Build OpenAI-compatible messages.
  // For vision, the user message is a 2-part array: text + image_url.
  const userContent = useVision
    ? [
        { type: 'text', text: question || 'Solve the math problem shown in this image. Return strict JSON.' },
        { type: 'image_url', image_url: imageDataUrl.startsWith('data:') ? imageDataUrl : `data:image/png;base64,${imageDataUrl}` },
      ]
    : question

  const messages = [
    { role: 'system', content: SOLVER_SYSTEM },
    ...history.map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
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
        temperature: 0.2, // low temp for accuracy
        max_tokens: 1600,
        stream: false,
        // Some OpenAI-compatible endpoints want this for vision:
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
  const raw = String(choice?.content || choice?.reasoning || '').trim()

  if (!raw) {
    return json({ error: 'The AI returned an empty answer. Please try again.' }, 502)
  }

  // Parse the strict JSON. If the model wrapped it in fences or prose,
  // try to recover the JSON object.
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    const m = raw.match(/\{[\s\S]*\}/)
    if (m) {
      try {
        parsed = JSON.parse(m[0])
      } catch {
        parsed = null
      }
    }
  }

  if (parsed && (parsed.answer || parsed.steps)) {
    return json(
      {
        answer: String(parsed.answer || '').slice(0, 2000),
        steps: String(parsed.steps || '').slice(0, 8000),
        model,
      },
      200
    )
  }

  // Fallback: model didn't follow the JSON instruction — show raw text as steps.
  return json(
    {
      answer: 'See the step-by-step solution below.',
      steps: raw.slice(0, 8000),
      model,
    },
    200
  )
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  })
}