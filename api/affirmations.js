const MODEL = 'claude-haiku-4-5-20251001'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { areas, userName, intention } = req.body ?? {}

    if (!Array.isArray(areas) || !userName || !intention) {
      return res.status(400).json({ error: 'Missing required fields: areas, userName, intention' })
    }

    const areaList = areas.map(a => `${a.number}. ${a.label}`).join('\n')

    const prompt = `You are generating 8 personal affirmations for a vision board mind movie.

User name: ${userName}
Their focus for the next 12 months: ${intention}

Areas (in order):
${areaList}

STARTER TOKENS — each affirmation MUST begin with exactly the token assigned to its position number:
1. I am
2. I'm
3. I have
4. I feel
5. I choose
6. I radiate
7. I embrace
8. My

Rules — these are hard constraints, not suggestions:
- Each affirmation MUST begin with its assigned starter token. No exceptions.
- Present tense only — NEVER "I will" or "I want"
- 5–12 words maximum per affirmation (count the starter token as part of the word count)
- No negations — never use: not, don't, never, stop, without
- Write each affirmation in the spirit of the area it is paired with
- Anchor to ${userName}'s focus: ${intention}

Return ONLY a raw JSON array of exactly 8 strings. No markdown, no backticks, no preamble, no explanation.
Example format: ["I am ...", "I'm ...", "I have ...", "I feel ...", "I choose ...", "I radiate ...", "I embrace ...", "My ..."]`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      return res.status(response.status).json({ error: `Anthropic ${response.status}: ${errBody?.error?.message ?? 'unknown'}` })
    }

    const data = await response.json()
    const raw = data.content[0].text.replace(/```json?|```/g, '').trim()
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      return res.status(500).json({ error: `Bad JSON from model: ${raw.slice(0, 100)}` })
    }
    res.status(200).json(parsed)
  } catch (err) {
    console.error('[affirmations] unhandled error:', err)
    res.status(500).json({ error: err.message ?? 'Internal server error' })
  }
}
