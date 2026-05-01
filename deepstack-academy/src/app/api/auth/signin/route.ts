import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth/jwt';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email });

    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    const userWithSub = await prisma.user.findUnique({
      where: { email },
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

    const isPremium = userWithSub?.subscriptions && userWithSub.subscriptions.length > 0;

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, xp: user.xp, level: user.level, isPremium } }, {
      status: 200,
      headers: {
        'Set-Cookie': cookie,
      },
    });
  } catch (error: any) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
