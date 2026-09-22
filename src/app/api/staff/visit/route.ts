import { NextRequest } from "next/server";
import { extractCodeFromScan, isValidCode } from "@/lib/codes";
import { jsonError, jsonOk, requireStaff } from "@/lib/http";
import { customerVisitedToday, findCustomerByCode, getActivePromotion, mapRpcError, toCardSnapshot } from "@/lib/loyalty";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const staff = requireStaff(request);
  if (staff.error) return staff.error;
  const { session } = staff;

  const supabase = getSupabase();
  if (!supabase) {
    return jsonError("Club Nonna todavía no está conectado.", 503);
  }

  let body: { code?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError("Falta el código del cliente.", 400);
  }

  const code =
    typeof body.code === "string" ? extractCodeFromScan(body.code) : "";
  if (!isValidCode(code)) {
    return jsonError("Ese código no se ve válido.", 400);
  }

  const { data, error: rpcError } = await supabase.rpc("register_visit", {
    p_code: code,
    p_location_id: session.locationId,
  });

  if (rpcError) {
    const mapped = mapRpcError(rpcError.message);
    return jsonError(mapped.error, mapped.status);
  }

  const promotion = await getActivePromotion();
  const customer = await findCustomerByCode(code);
  if (!customer || !promotion) {
    return jsonOk({
      card: {
        code: data.code,
        name: data.name,
        whatsapp: data.whatsapp,
        whatsappDisplay: data.whatsapp,
        stamps: data.stamps,
        visitsRequired: data.visits_required,
        reward: data.reward,
        promotionName: data.promotion_name,
        visitedToday: true,
        canAddVisit: false,
        canRedeem: data.stamps >= data.visits_required,
      },
    });
  }

  const visitedToday = await customerVisitedToday(customer.id);
  return jsonOk({
    card: toCardSnapshot(customer, promotion, visitedToday),
    message:
      customer.stamps >= promotion.visits_required
        ? "Ya completó las visitas. Entrega el paste gratis."
        : "Visita sumada.",
  });
}
