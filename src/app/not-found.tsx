import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center px-5 py-16">
      <BrandMark />
      <h1 className="mt-8 font-serif text-3xl">No está esa página</h1>
      <p className="mt-3 text-center text-sm text-blue">
        Vuelve al Club Nonna para abrir o crear tu tarjeta.
      </p>
      <Link
        href="/lealtad"
        className="mt-6 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream"
      >
        Ir al registro
      </Link>
      <SiteFooter />
    </div>
  );
}
