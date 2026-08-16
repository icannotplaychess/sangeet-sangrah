import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE_NAME = "ss_admin_session";
const SESSION_DAYS = 7;

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (expected.startsWith("$2")) {
    return bcrypt.compare(password, expected);
  }
  return password === expected;
}

export async function createAdminSession(): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecret());

  await prisma.adminSession.create({
    data: { token, expiresAt },
  });

  return token;
}

export async function validateSessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    const session = await prisma.adminSession.findUnique({ where: { token } });
    if (!session || session.expiresAt < new Date()) return false;
    return true;
  } catch {
    return false;
  }
}

export async function destroySession(token: string): Promise<void> {
  await prisma.adminSession.deleteMany({ where: { token } });
}

export async function setSessionCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(COOKIE_NAME)?.value;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  if (!token) return false;
  return validateSessionToken(token);
}

export async function requireAdmin(): Promise<void> {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("UNAUTHORIZED");
}
