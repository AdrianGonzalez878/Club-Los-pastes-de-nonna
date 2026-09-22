import { NextRequest, NextResponse } from "next/server";
import {
  applyStaffCookie,
  pinsMatch,
  signStaffSession,
} from "@/lib/auth";
import { jsonError, rejectIfCrossOrigin, requireEnv } from "@/lib/http";
import { getLocationName, isLocationId } from "@/lib/locations";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const originError = rejectIfCrossOrigin(request);
  if (originError) return originError;

  const configured = requireEnv();
  if (configured.error) return configured.error;
  const env = configured.env;

  let body: { locationId?: unknown; pin?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("No se pudo leer el inicio de sesión.", 400);
  }

  const locationId = typeof body.locationId === "string" ? body.locationId : "";
  const pin = typeof body.pin === "string" ? body.pin.trim() : "";

  if (!isLocationId(locationId)) {
    return jsonError("Elige una sucursal.", 400);
  }
  if (!pin) {
    return jsonError("Escribe el PIN de caja.", 400);
  }
  if (!pinsMatch(pin, env.staffPin)) {
    return jsonError("El PIN no es correcto.", 401);
  }

  const token = signStaffSession(locationId, env.loyaltySecret);
  const response = NextResponse.json({
    ok: true,
    locationId,
    locationName: getLocationName(locationId),
  });
  applyStaffCookie(response, token);
  return response;
}
