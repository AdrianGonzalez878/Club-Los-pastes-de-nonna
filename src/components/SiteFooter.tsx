import Image from "next/image";

const ARGA_SITE = "https://argaweb.com";

export function SiteFooter() {
  return (
    <footer className="mt-auto shrink-0 px-5 py-8 text-center text-xs leading-5 text-blue">
      <p>Programa de visitas · Oaxaca de Juárez</p>
      <p className="mt-4">
        <a
          href={ARGA_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-navy"
        >
          <span>Powered by</span>
          <Image
            src="/arga.png"
            alt=""
            width={631}
            height={527}
            className="h-10 w-auto shrink-0 object-contain"
          />
          <span>ARGA | Desarrollo de software</span>
        </a>
      </p>
    </footer>
  );
}
