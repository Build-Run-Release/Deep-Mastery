import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";

export async function POST() {
  // In a real application, you would verify email/password against the DB here.
  // For this fix, we are issuing a secure HTTP-Only cookie.
  const payload = {
    userId: "mock-user-id", // mock user id
    xp: 0,
    level: 1,
  };

  const token = signToken(payload);

  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  return response;
}
