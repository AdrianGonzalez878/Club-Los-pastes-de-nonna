import type { Metadata } from "next";
import { ConfigBanner } from "@/components/ConfigBanner";
import { PageShell } from "@/components/PageShell";
import { ScanDesk } from "@/components/ScanDesk";
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
    <PageShell headerHref="/scan">
      <main className="cn-main" id="contenido">
        <div className="cn-simple">
          {!configured ? <ConfigBanner /> : null}
          <section className="cn-panel">
            <h1 className="font-serif text-3xl text-blue">Caja Club Nonna</h1>
            <p className="mt-2 text-sm leading-6 text-navy">
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
        </div>
      </main>
    </PageShell>
  );
}
