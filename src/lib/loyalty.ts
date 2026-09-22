import "server-only";

import { getSupabase } from "@/lib/supabase";
import { isMexicoCityToday } from "@/lib/mexico-city";
import { formatWhatsApp } from "@/lib/whatsapp";
import { isValidCode, normalizeCode } from "@/lib/codes";
import type { CardSnapshot } from "@/lib/types";

export type { CardSnapshot } from "@/lib/types";

export type PromotionRow = {
  id: string;
  slug: string;
  name: string;
  visits_required: number;
  reward: string;
  active: boolean;
};

export type CustomerRow = {
  id: string;
  code: string;
  name: string;
  whatsapp: string;
  stamps: number;
};

export const FALLBACK_PROMOTION = {
  visitsRequired: 5,
  reward: "Un paste gratis",
  promotionName: "5 visitas, un paste de regalo",
};

export function toCardSnapshot(
  customer: Pick<CustomerRow, "code" | "name" | "whatsapp" | "stamps">,
  promotion: Pick<PromotionRow, "name" | "visits_required" | "reward">,
  visitedToday: boolean,
): CardSnapshot {
  const canRedeem = customer.stamps >= promotion.visits_required;
  return {
    code: customer.code,
    name: customer.name,
    whatsapp: customer.whatsapp,
    whatsappDisplay: formatWhatsApp(customer.whatsapp),
    stamps: customer.stamps,
    visitsRequired: promotion.visits_required,
    reward: promotion.reward,
    promotionName: promotion.name,
    visitedToday,
    canAddVisit: !visitedToday && !canRedeem,
    canRedeem,
  };
}

export async function getActivePromotion(): Promise<PromotionRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("promotions")
    .select("id, slug, name, visits_required, reward, active")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function findCustomerByCode(code: string): Promise<CustomerRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const normalized = normalizeCode(code);
  if (!isValidCode(normalized)) return null;

  const { data, error } = await supabase
    .from("customers")
    .select("id, code, name, whatsapp, stamps")
    .eq("code", normalized)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function findCustomerByWhatsApp(
  whatsapp: string,
): Promise<CustomerRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("customers")
    .select("id, code, name, whatsapp, stamps")
    .eq("whatsapp", whatsapp)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function customerVisitedToday(customerId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("visits")
    .select("created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return false;
  return isMexicoCityToday(String(data.created_at));
}

export async function getCardByCode(code: string): Promise<CardSnapshot | null> {
  const customer = await findCustomerByCode(code);
  const promotion = await getActivePromotion();
  if (!customer || !promotion) return null;
  const visitedToday = await customerVisitedToday(customer.id);
  return toCardSnapshot(customer, promotion, visitedToday);
}

export function mapRpcError(message: string): { status: number; error: string } {
  if (message.includes("NO_PROMOTION")) {
    return {
      status: 503,
      error: "No hay una promoción activa. Revisa la tabla promotions.",
    };
  }
  if (message.includes("NOT_FOUND")) {
    return { status: 404, error: "No encontramos esa tarjeta." };
  }
  if (message.includes("REWARD_PENDING")) {
    return {
      status: 409,
      error: "Ya tiene el premio listo. Primero entrega el paste gratis.",
    };
  }
  if (message.includes("ALREADY_TODAY")) {
    return {
      status: 409,
      error: "Hoy ya registramos una visita. Mañana se puede sumar otra.",
    };
  }
  if (message.includes("NOT_ENOUGH")) {
    return {
      status: 409,
      error: "Todavía le faltan visitas para el premio.",
    };
  }
  return { status: 500, error: "No se pudo completar la operación." };
}
