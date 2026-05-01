import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount } = await req.json();

    if (typeof amount !== 'number' || amount !== 50) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newXp = user.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        xp: newXp,
        level: newLevel,
      },
    });

    return NextResponse.json({ xp: updatedUser.xp, level: updatedUser.level });
  } catch (error: any) {
    console.error('Update XP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
