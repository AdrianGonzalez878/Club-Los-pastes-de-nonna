import type { NextRequest } from "next/server";

export function isSameOrigin(request: NextRequest): boolean {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    return hostsMatch(origin, host);
  }

  const referer = request.headers.get("referer");
  if (referer) {
    return hostsMatch(referer, host);
  }

  return false;
}

function hostsMatch(urlValue: string, host: string): boolean {
  try {
    return new URL(urlValue).host === host;
  } catch {
    return false;
  }
}

export async function getAppBaseUrl(): Promise<string> {
  const { headers } = await import("next/headers");
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const proto =
    headerStore.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
