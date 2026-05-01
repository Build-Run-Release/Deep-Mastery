import { NextResponse, NextRequest } from 'next/server';
import { verifyPayment } from '@/services/payment';
import { getSession } from '@/lib/session';
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

    const body = await req.json();
    const { reference, userId } = body;

    if (!reference || !userId) {
        return NextResponse.json({ error: 'Missing reference or userId' }, { status: 400 });
    }

    if (userId !== payload.userId) {
        return NextResponse.json({ error: 'Unauthorized User' }, { status: 403 });
    }

    const isVerified = await verifyPayment(reference);

    if (isVerified) {
      const session = await getSession();
      session.premiumUnlocked = true;
      await session.save();
    }

    return NextResponse.json({ verified: isVerified });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
