export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '../../_lib/index'
import { ALL_TOOLS } from '@/lib/tools-registry'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'

interface GenerateRequest { slugs: string[] }
interface GeneratedMeta { slug: string; title: string; description: string }

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req)
  if (guard) return guard

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ message: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  }

  const { slugs } = await req.json() as GenerateRequest
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return NextResponse.json({ message: 'slugs array required' }, { status: 400 })
  }

  const tools = slugs.slice(0, 20).map(slug => ALL_TOOLS.find(t => t.slug === slug)).filter(Boolean)
  if (!tools.length) {
    return NextResponse.json({ message: 'No matching tools found' }, { status: 404 })
  }

  const toolList = tools.map(t =>
    `- slug: ${t!.slug}\n  name: ${t!.name}\n  category: ${t!.category}\n  keywords: ${t!.keywords.slice(0, 4).join(', ')}`
  ).join('\n')

  const prompt = `You are an SEO specialist writing page titles and meta descriptions for a free online tools platform called RoughTools (roughtools.com).

For each tool below, write:
1. A page title: 50–60 characters, format "[Tool Name] — Free Online Tool | RoughTools", descriptive and keyword-rich
2. A meta description: 145–160 characters, action-oriented, mentions what the tool does and that it is free and instant

Tools:
${toolList}

Return ONLY valid JSON as an array with this exact shape — no explanation, no markdown:
[{"slug":"slug-here","title":"title here","description":"description here"}]`

  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ message: `Anthropic error: ${err}` }, { status: 502 })
  }

  const data = await response.json()
  const raw = data?.content?.[0]?.text ?? '[]'

  let generated: GeneratedMeta[] = []
  try {
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim()
    generated = JSON.parse(clean)
  } catch {
    return NextResponse.json({ message: 'Failed to parse Anthropic response', raw }, { status: 502 })
  }

  return NextResponse.json({ generated, tokensUsed: data?.usage?.input_tokens + data?.usage?.output_tokens })
}
