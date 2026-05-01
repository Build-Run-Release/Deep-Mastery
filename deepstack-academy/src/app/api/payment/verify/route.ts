import { NextResponse } from 'next/server';
import { verifyPayment } from '@/services/payment';
import { createSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference } = body;

    const isVerified = await verifyPayment(reference);

    if (isVerified) {
      await createSession();
    }

    return NextResponse.json({ verified: isVerified });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment verification failed' },
      { status: 500 }
    );
  }
}
