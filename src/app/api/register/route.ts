import { NextRequest } from "next/server";
import { generateCustomerCode, isValidCode } from "@/lib/codes";
import { jsonError, jsonOk, rejectIfCrossOrigin, requireEnv } from "@/lib/http";
import { findCustomerByWhatsApp, getActivePromotion } from "@/lib/loyalty";
import { getSupabase } from "@/lib/supabase";
import { normalizeWhatsApp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function normalizeName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60) return null;
  if (!/^[\p{L}\s.'´-]+$/u.test(name)) return null;
  return name;
}

export async function POST(request: NextRequest) {
  const originError = rejectIfCrossOrigin(request);
  if (originError) return originError;

  const configured = requireEnv();
  if (configured.error) return configured.error;

  const supabase = getSupabase();
  if (!supabase) {
    return jsonError("Club Nonna todavía no está conectado.", 503);
  }

  let body: { name?: unknown; whatsapp?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("El formulario no se pudo leer.", 400);
  }

  const name = normalizeName(body.name);
  const whatsapp = typeof body.whatsapp === "string" ? normalizeWhatsApp(body.whatsapp) : null;

  if (!name) {
    return jsonError("Escribe tu nombre como aparece en la vida real.", 400);
  }
  if (!whatsapp) {
    return jsonError("El WhatsApp debe tener 10 dígitos de México.", 400);
  }

  const existing = await findCustomerByWhatsApp(whatsapp);
  if (existing) {
    return jsonOk({
      code: existing.code,
      existing: true,
      message: "Este WhatsApp ya tiene tarjeta. Te la volvemos a abrir.",
    });
  }

  const promotion = await getActivePromotion();
  if (!promotion) {
    return jsonError("No hay una promoción activa. Revisa la tabla promotions.", 503);
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = generateCustomerCode();
    if (!isValidCode(code)) continue;

    const { error: insertError } = await supabase.from("customers").insert({
      code,
      name,
      whatsapp,
      stamps: 0,
    });

    if (!insertError) {
      return jsonOk({ code, existing: false }, 201);
    }

    if (insertError.code === "23505") {
      if (insertError.message.includes("whatsapp")) {
        const again = await findCustomerByWhatsApp(whatsapp);
        if (again) {
          return jsonOk({
            code: again.code,
            existing: true,
            message: "Este WhatsApp ya tiene tarjeta. Te la volvemos a abrir.",
          });
        }
      }
      continue;
    }

    return jsonError("No se pudo crear la tarjeta. Inténtalo de nuevo.", 500);
  }

  return jsonError("No se pudo crear un código único. Inténtalo de nuevo.", 500);
}
