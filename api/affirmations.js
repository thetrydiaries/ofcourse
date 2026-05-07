const MODEL = 'claude-haiku-4-5-20251001'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { areas, userName, intention } = req.body
  const areaList = areas.map(a => `${a.number}. ${a.label}`).join('\n')

  const prompt = `You are generating 8 personal affirmations for a vision board mind movie.

User name: ${userName}
Their focus for the next 12 months: ${intention}

Areas (in order):
${areaList}

Rules — these are hard constraints, not suggestions:
- Present tense only: "I am", "I have", "I'm" — NEVER "I will" or "I want"
- 5–12 words maximum per affirmation
- No negations — never use: not, don't, never, stop, without
- Use emotionally loaded vocabulary: thriving, radiant, easeful, magnetic, alive, steady, grateful, abundant, whole, grounded
- Anchor to ${userName}'s focus: ${intention}
- One affirmation per area, in the same order as the list above

Return ONLY a raw JSON array of exactly 8 strings. No markdown, no backticks, no preamble, no explanation.
Example format: ["I am...", "I have...", "I'm...", ...]`

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

  if (!response.ok) return res.status(response.status).json({ error: 'Anthropic API error' })

  const data = await response.json()
  const raw = data.content[0].text.replace(/```json?|```/g, '').trim()
  res.status(200).json(JSON.parse(raw))
}
