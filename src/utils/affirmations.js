const MODEL = 'claude-haiku-4-5-20251001'

export async function fetchAffirmations(areas, userName, intention) {
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

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`)

  const data = await res.json()
  const raw = data.content[0].text.replace(/```json?|```/g, '').trim()
  return JSON.parse(raw)
}
