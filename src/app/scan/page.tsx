import type { Metadata } from "next";
import { BrandMark } from "@/components/BrandMark";
import { ConfigBanner } from "@/components/ConfigBanner";
import { ScanDesk } from "@/components/ScanDesk";
import { SiteFooter } from "@/components/SiteFooter";
import { readStaffSessionFromCookies } from "@/lib/auth";
import { isConfigured } from "@/lib/env";
import { getLocationName } from "@/lib/locations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Caja",
  robots: { index: false, follow: false },
};

export default async function ScanPage() {
  const configured = isConfigured();
  const session = await readStaffSessionFromCookies();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-8">
      <BrandMark href="/scan" size="sm" />
      <main className="mt-6 flex flex-1 flex-col gap-5">
        {!configured ? <ConfigBanner /> : null}
        <section className="rounded-[2rem] border border-blue/10 bg-white/70 px-5 py-6">
          <h1 className="font-serif text-3xl">Caja Club Nonna</h1>
          <p className="mt-2 text-sm leading-6 text-blue">
            Elige sucursal, entra con el PIN y escanea la tarjeta. Las dos
            sucursales comparten el mismo contador.
          </p>
          <div className="mt-5">
            <ScanDesk
              configured={configured}
              initialSession={
                session
                  ? {
                      locationId: session.locationId,
                      locationName: getLocationName(session.locationId),
                    }
                  : null
              }
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
