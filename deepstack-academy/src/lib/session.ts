import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  premiumUnlocked: boolean;
}

export const defaultSession: SessionData = {
  premiumUnlocked: false,
};

// Security: Enforce that the application must have a secure cookie password configured
if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error("SECRET_COOKIE_PASSWORD environment variable is not defined");
}

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
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
