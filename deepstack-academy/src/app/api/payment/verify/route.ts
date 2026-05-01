import { NextResponse } from 'next/server';
import { verifyPayment } from '@/services/payment';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reference } = body;

    const isVerified = await verifyPayment(reference);

    return NextResponse.json({ verified: isVerified });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
