import { NextRequest, NextResponse } from "next/server";
import { clearStaffCookie } from "@/lib/auth";
import { rejectIfCrossOrigin } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const originError = rejectIfCrossOrigin(request);
  if (originError) return originError;

  const response = NextResponse.json({ ok: true });
  clearStaffCookie(response);
  return response;
}
