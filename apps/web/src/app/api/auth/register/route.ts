export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

/** Generate a unique username — tries email prefix then appends random suffix on collision */
async function generateUniqueUsername(emailPrefix: string): Promise<string> {
  const base = emailPrefix.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20) || 'user'
  let candidate = base
  for (let i = 0; i < 10; i++) {
    const exists = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } })
    if (!exists) return candidate
    candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`
  }
  // Final fallback: timestamp suffix (effectively unique)
  return `${base}${Date.now().toString(36)}`
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, resetAt } = rateLimit(ip, 5, 15 * 60 * 1000); // 5 attempts per 15 min

  if (!allowed) {
    return NextResponse.json(
      { message: 'Too many registration attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const username = await generateUniqueUsername(email.split('@')[0]);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        username,
        passwordHash,
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2002') {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
