import { NextResponse } from 'next/server';
import { initializePayment } from '@/services/payment';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, amount, userId, planId } = body;

    const paymentResponse = await initializePayment({
      email,
      amount,
      userId,
      planId,
    });

    return NextResponse.json(paymentResponse);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
