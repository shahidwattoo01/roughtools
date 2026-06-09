export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS_CAP = 2000;
// Only allow cost-effective models; never let clients escalate to Opus
const ALLOWED_MODELS = new Set([
  'claude-haiku-4-5-20251001',
  'claude-haiku-4-5',
  'claude-3-haiku-20240307',
]);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, resetAt } = rateLimit(`ai:${ip}`, 20, 60 * 1000); // 20 req/min per IP
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
  }

  let body: { prompt?: string; messages?: unknown[]; model?: string; max_tokens?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const prompt = body.prompt;
  if (!prompt && !body.messages) {
    return NextResponse.json({ error: 'prompt or messages required' }, { status: 400 });
  }

  const messages = body.messages ?? [{ role: 'user', content: prompt }];

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ALLOWED_MODELS.has(body.model ?? '') ? body.model : MODEL,
        max_tokens: Math.min(body.max_tokens ?? 1500, MAX_TOKENS_CAP),
        messages,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: (err as { error?: { message?: string } }).error?.message ?? 'AI service error' },
        { status: res.status }
      );
    }

    const data = await res.json() as { content?: { type: string; text: string }[] };
    const text = data.content?.find((c) => c.type === 'text')?.text ?? '';
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: 'Failed to reach AI service' }, { status: 502 });
  }
}
