import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { isLocationId, type LocationId } from "@/lib/locations";

export const STAFF_COOKIE = "club_staff";
export const STAFF_SESSION_HOURS = 12;
const STAFF_SESSION_MS = STAFF_SESSION_HOURS * 60 * 60 * 1000;

export type StaffSession = {
  locationId: LocationId;
  iat: number;
  exp: number;
};

export function pinsMatch(provided: string, expected: string): boolean {
  const left = createHmac("sha256", "club-nonna-pin").update(provided).digest();
  const right = createHmac("sha256", "club-nonna-pin").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function signStaffSession(
  locationId: LocationId,
  secret: string,
  now = Date.now(),
): string {
  const session: StaffSession = {
    locationId,
    iat: now,
    exp: now + STAFF_SESSION_MS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyStaffSession(
  token: string,
  secret: string,
): StaffSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as StaffSession;
    if (!isLocationId(session.locationId)) return null;
    if (typeof session.exp !== "number" || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function staffCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: STAFF_SESSION_HOURS * 60 * 60,
  };
}

export function applyStaffCookie(response: NextResponse, token: string) {
  response.cookies.set(STAFF_COOKIE, token, staffCookieOptions());
}

export function clearStaffCookie(response: NextResponse) {
  response.cookies.set(STAFF_COOKIE, "", {
    ...staffCookieOptions(),
    maxAge: 0,
  });
}

export function readStaffSessionFromRequest(
  request: NextRequest,
  secret: string,
): StaffSession | null {
  const token = request.cookies.get(STAFF_COOKIE)?.value;
  if (!token) return null;
  return verifyStaffSession(token, secret);
}

export async function readStaffSessionFromCookies(): Promise<StaffSession | null> {
  const env = getEnv();
  if (!env) return null;
  const jar = await cookies();
  const token = jar.get(STAFF_COOKIE)?.value;
  if (!token) return null;
  return verifyStaffSession(token, env.loyaltySecret);
}
