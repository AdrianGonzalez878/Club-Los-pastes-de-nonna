import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { ConfigBanner } from "@/components/ConfigBanner";
import { RememberCard } from "@/components/RememberCard";
import { SiteFooter } from "@/components/SiteFooter";
import { StampRow } from "@/components/StampRow";
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

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-8">
      <BrandMark href="/lealtad" size="sm" />

      <main className="mt-6 flex flex-1 flex-col gap-5">
        {!configured ? <ConfigBanner /> : null}

        {missing && configured ? (
          <section className="rounded-3xl bg-cream-dark px-5 py-8 text-center">
            <h1 className="font-serif text-3xl">No encontramos esa tarjeta</h1>
            <p className="mt-3 text-sm leading-6 text-blue">
              Revisa el código o vuelve a registrarte con el mismo WhatsApp.
            </p>
            <Link
              href="/lealtad"
              className="mt-6 inline-flex rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream"
            >
              Ir al registro
            </Link>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-blue/10 bg-white/70 px-5 py-6 shadow-[0_12px_40px_rgba(58,85,112,0.08)]">
            <p className="text-center text-xs uppercase tracking-[0.2em] text-blue">
              Tu tarjeta
            </p>
            <h1 className="mt-2 text-center font-serif text-3xl text-navy">
              {name ?? "Cliente Club Nonna"}
            </h1>

            <div
              className="qr-wrap mx-auto mt-5 w-56 rounded-3xl bg-cream p-3"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />

            <p className="mt-4 text-center font-sans text-2xl font-semibold tracking-[0.22em] text-navy tabular-nums">
              {formatCode(code)}
            </p>
            <p className="mt-1 text-center text-xs text-blue">
              El personal escanea este QR. Tú no sumas las visitas.
            </p>

            <div className="mt-6 rounded-3xl bg-cream px-4 py-5">
              <StampRow stamps={stamps} visitsRequired={visitsRequired} />
              <p className="mt-4 text-center text-sm leading-6 text-blue">
                {ready
                  ? `¡Ya puedes llevarte ${reward.toLowerCase()}!`
                  : promotionName}
              </p>
            </div>
          </section>
        )}

        <p className="text-center text-sm leading-6 text-blue">
          El conteo vive en Club Nonna, no en este celular.
        </p>
      </main>

      <RememberCard code={code} />
      <SiteFooter />
    </div>
  );
}
