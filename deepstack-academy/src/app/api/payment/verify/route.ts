import { NextResponse } from 'next/server';
import { verifyPayment } from '@/services/payment';
import { getSession } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference } = body;

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
