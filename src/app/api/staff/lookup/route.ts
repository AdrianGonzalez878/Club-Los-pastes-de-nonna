import { NextRequest } from "next/server";
import { extractCodeFromScan, isValidCode } from "@/lib/codes";
import { jsonError, jsonOk, requireStaff } from "@/lib/http";
import { getCardByCode } from "@/lib/loyalty";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const staff = requireStaff(request);
  if (staff.error) return staff.error;

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Escribe o escanea un código.", 400);
  }

  const code =
    typeof body.code === "string" ? extractCodeFromScan(body.code) : "";
  if (!isValidCode(code)) {
    return jsonError("Ese código no se ve válido.", 400);
  }

  try {
    const card = await getCardByCode(code);
    if (!card) {
      return jsonError("No encontramos esa tarjeta.", 404);
    }
    return jsonOk({ card });
  } catch {
    return jsonError("No se pudo buscar la tarjeta.", 500);
  }
}
