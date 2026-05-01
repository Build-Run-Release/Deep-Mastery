import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        subscriptions: {
          where: {
            status: 'active',
            OR: [
              { expiryDate: null },
              { expiryDate: { gt: new Date() } }
            ]
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const isPremium = user.subscriptions.length > 0;

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        isPremium
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Me error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
