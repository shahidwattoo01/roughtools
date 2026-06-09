export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, username } = await request.json() as { name?: string; username?: string };

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(username !== undefined ? { username } : {}),
      },
      select: { id: true, name: true, email: true, username: true, avatarUrl: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2002') {
      return NextResponse.json({ message: 'Username already taken' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
