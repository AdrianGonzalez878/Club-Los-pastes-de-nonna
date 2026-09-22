import { BrandMark } from "@/components/BrandMark";
import { ConfigBanner } from "@/components/ConfigBanner";
import { RegisterForm } from "@/components/RegisterForm";
import { SiteFooter } from "@/components/SiteFooter";

export function RegisterScreen({ configured }: { configured: boolean }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-10">
      <BrandMark />
      <main className="mt-8 flex flex-1 flex-col gap-6">
        {!configured ? <ConfigBanner /> : null}
        <section className="rounded-[2rem] border border-blue/10 bg-white/70 px-5 py-6">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-blue">
            Oaxaca de Juárez
          </p>
          <h1 className="mt-2 text-center font-serif text-4xl leading-tight">
            Junta visitas, llévate un paste
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-blue">
            En cualquier sucursal te sellamos la tarjeta. A la quinta visita te
            llevas un paste de regalo. El ciclo vuelve a empezar.
          </p>
          <div className="mt-6">
            <RegisterForm configured={configured} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
