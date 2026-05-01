import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { amount } = await request.json();

    if (typeof amount !== "number") {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const currentXp = payload.xp ?? 0;
    const newXp = currentXp + amount;
    const newLevel = Math.floor(newXp / 100) + 1;

    const newPayload = {
      ...payload,
      xp: newXp,
      level: newLevel,
    };

    const newToken = signToken(newPayload);

    const response = NextResponse.json({
      success: true,
      xp: newXp,
      level: newLevel,
    });

    response.cookies.set({
      name: "auth_token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return response;
  } catch (_error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
