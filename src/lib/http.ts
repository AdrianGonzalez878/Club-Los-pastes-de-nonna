import type { NextRequest } from "next/server";
import { getEnv, type AppEnv } from "@/lib/env";
import { isSameOrigin } from "@/lib/origin";
import {
  readStaffSessionFromRequest,
  type StaffSession,
} from "@/lib/auth";

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export function jsonOk<T extends Record<string, unknown>>(body: T, status = 200) {
  return Response.json(body, { status });
}

export function rejectIfCrossOrigin(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return jsonError("Esta petición no viene de Club Nonna.", 403);
  }
  return null;
}

export function requireEnv():
  | { env: AppEnv; error?: undefined }
  | { env?: undefined; error: Response } {
  const env = getEnv();
  if (!env) {
    return {
      error: jsonError(
        "Club Nonna todavía no está conectado. Falta configurar las variables de entorno.",
        503,
      ),
    };
  }
  return { env };
}

export function requireStaff(request: NextRequest):
  | { env: AppEnv; session: StaffSession; error?: undefined }
  | { env?: undefined; session?: undefined; error: Response } {
  const originError = rejectIfCrossOrigin(request);
  if (originError) return { error: originError };

  const configured = requireEnv();
  if (configured.error) return configured;

  const session = readStaffSessionFromRequest(
    request,
    configured.env.loyaltySecret,
  );
  if (!session) {
    return {
      error: jsonError("Inicia sesión en caja para continuar.", 401),
    };
  }

  return { env: configured.env, session };
}
