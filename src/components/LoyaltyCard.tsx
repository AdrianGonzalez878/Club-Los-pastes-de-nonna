import Link from "next/link";
import { ConfigBanner } from "@/components/ConfigBanner";
import { PageShell } from "@/components/PageShell";
import { RememberCard } from "@/components/RememberCard";
import { StampCard } from "@/components/StampCard";
import { formatCode } from "@/lib/codes";

type LoyaltyCardProps = {
  code: string;
  name?: string;
  stamps: number;
  visitsRequired: number;
  reward: string;
  promotionName: string;
  qrSvg: string;
  configured: boolean;
  missing?: boolean;
};

export function LoyaltyCard({
  code,
  name,
  stamps,
  visitsRequired,
  reward,
  promotionName,
  qrSvg,
  configured,
  missing = false,
}: LoyaltyCardProps) {
  const ready = stamps >= visitsRequired && !missing && configured;
  const liveLegend = [
    { tone: "visit" as const, text: "Un sello por visita, en cualquier sucursal" },
    ...(visitsRequired >= 10
      ? [
          { tone: "mid" as const, text: "5ª visita: salsa, café o refresco" },
          { tone: "final" as const, text: `Premio: ${reward}` },
        ]
      : [{ tone: "final" as const, text: ready ? `¡Ya puedes llevarte ${reward.toLowerCase()}!` : promotionName }]),
  ];

  return (
    <PageShell>
      <main className="cn-main" id="contenido">
        <div className="cn-wide">
          {!configured ? <ConfigBanner /> : null}

          {missing && configured ? (
            <section className="cn-panel mx-auto max-w-lg text-center">
              <h1 className="font-serif text-4xl text-blue">No encontramos esa tarjeta</h1>
              <p className="mt-3 text-base leading-7 text-navy">
                Revisa el código o vuelve a registrarte con el mismo WhatsApp.
              </p>
              <Link href="/lealtad" className="cn-btn cn-btn-blue mt-8">
                Ir al registro
              </Link>
            </section>
          ) : (
            <section className="cn-card-page">
              <div className="cn-panel text-center">
                <p className="cn-label text-gold-dark">Tu tarjeta</p>
                <h1 className="mt-2 font-serif text-4xl leading-none text-blue">
                  {name ?? "Cliente Club Nonna"}
                </h1>
                <div
                  className="qr-wrap cn-qr-box"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <p className="cn-code">{formatCode(code)}</p>
                <p className="mt-2 text-sm text-blue">
                  El personal escanea este QR. Tú no sumas las visitas.
                </p>
                {ready ? (
                  <p className="mt-4 font-serif text-2xl text-gold-dark">
                    ¡Ya puedes llevarte {reward.toLowerCase()}!
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-blue">{promotionName}</p>
                )}
              </div>

              <StampCard
                mode="live"
                stamps={stamps}
                visitsRequired={visitsRequired}
                subtitle={`${stamps}/${visitsRequired} visitas · ${promotionName}`}
                legend={liveLegend}
                showBubble
                flat
              />
            </section>
          )}

          <p className="mt-8 text-center text-sm leading-6 text-blue">
            El conteo vive en Club Nonna, no en este celular.
          </p>
        </div>
      </main>
      <RememberCard code={code} />
    </PageShell>
  );
}
