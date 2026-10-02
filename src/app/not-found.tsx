import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <main className="cn-main" id="contenido">
        <div className="cn-simple flex-1 items-center justify-center text-center">
          <section className="cn-panel w-full">
            <h1 className="font-serif text-4xl text-blue">No está esa página</h1>
            <p className="mt-3 text-base leading-7 text-navy">
              Vuelve al Club Nonna para abrir o crear tu tarjeta.
            </p>
            <Link href="/lealtad" className="cn-btn cn-btn-blue mt-8">
              Ir al registro
            </Link>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
