import type { Metadata } from "next";
import { LoyaltyCard } from "@/components/LoyaltyCard";
import { isValidCode, normalizeCode } from "@/lib/codes";
import { isConfigured } from "@/lib/env";
import { FALLBACK_PROMOTION, getCardByCode } from "@/lib/loyalty";
import { getAppBaseUrl } from "@/lib/origin";
import { generateQrSvg } from "@/lib/qr";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Tarjeta ${normalizeCode(code)}`,
    robots: { index: false, follow: false },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = normalizeCode(rawCode);
  const configured = isConfigured();
  const appUrl = await getAppBaseUrl();
  const cardUrl = `${appUrl}/lealtad/${code || "TARJETA"}`;
  const qrSvg = await generateQrSvg(cardUrl);

  if (!isValidCode(code)) {
    return (
      <LoyaltyCard
        code={rawCode.toUpperCase()}
        stamps={0}
        visitsRequired={FALLBACK_PROMOTION.visitsRequired}
        reward={FALLBACK_PROMOTION.reward}
        promotionName={FALLBACK_PROMOTION.promotionName}
        qrSvg={qrSvg}
        configured={configured}
        missing
      />
    );
  }

  if (!configured) {
    return (
      <LoyaltyCard
        code={code}
        stamps={0}
        visitsRequired={FALLBACK_PROMOTION.visitsRequired}
        reward={FALLBACK_PROMOTION.reward}
        promotionName={FALLBACK_PROMOTION.promotionName}
        qrSvg={qrSvg}
        configured={false}
      />
    );
  }

  const card = await getCardByCode(code);
  if (!card) {
    return (
      <LoyaltyCard
        code={code}
        stamps={0}
        visitsRequired={FALLBACK_PROMOTION.visitsRequired}
        reward={FALLBACK_PROMOTION.reward}
        promotionName={FALLBACK_PROMOTION.promotionName}
        qrSvg={qrSvg}
        configured
        missing
      />
    );
  }

  return (
    <LoyaltyCard
      code={card.code}
      name={card.name}
      stamps={card.stamps}
      visitsRequired={card.visitsRequired}
      reward={card.reward}
      promotionName={card.promotionName}
      qrSvg={qrSvg}
      configured
    />
  );
}
