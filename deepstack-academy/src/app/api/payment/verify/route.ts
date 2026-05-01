import { NextResponse } from 'next/server';
import { verifyPayment } from '@/services/payment';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import { NextRequest } from 'next/server';

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
        // Create or update subscription
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1); // 1 year access

        await prisma.subscription.create({
            data: {
                userId: userId,
                plan: "premium_fullstack",
                status: "active",
                expiryDate: expiry
            }
        });

        return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
