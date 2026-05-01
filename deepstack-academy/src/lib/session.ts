import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  premiumUnlocked: boolean;
}

export const defaultSession: SessionData = {
  premiumUnlocked: false,
};

// Security: Enforce that the application must have a secure cookie password configured
let password = process.env.SECRET_COOKIE_PASSWORD;

if (!password) {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("SECRET_COOKIE_PASSWORD environment variable is not defined");
  } else {
    console.warn("WARNING: SECRET_COOKIE_PASSWORD environment variable is not defined. Falling back to an insecure default for development only. Do NOT use this in production.");
    password = "super-secret-cookie-password-that-is-at-least-32-characters-long";
  }
}

export const sessionOptions = {
  password,
  cookieName: "deepstack_premium_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.premiumUnlocked) {
    session.premiumUnlocked = defaultSession.premiumUnlocked;
  }

  return session;
}
