import Image from "next/image";
import Link from "next/link";

const NONNA_SITE = "https://www.lospastesdenona.com";

type BrandMarkProps = {
  href?: string;
  size?: "sm" | "md";
};

export function BrandMark({ href = "/", size = "md" }: BrandMarkProps) {
  const logo = size === "sm" ? 112 : 156;

  return (
    <div className="flex flex-col items-center gap-2">
      <Link href={href} className="flex flex-col items-center gap-2">
        <Image
          src="/logo.png"
          alt="Los Pastes de Nonna"
          width={logo}
          height={logo}
          priority
          className="h-auto w-auto"
        />
        <p
          className={`font-serif tracking-wide text-navy ${
            size === "sm" ? "text-2xl" : "text-4xl"
          }`}
        >
          Club Nonna
        </p>
      </Link>
      <a
        href={NONNA_SITE}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] uppercase tracking-[0.22em] text-blue underline-offset-2 hover:underline"
      >
        Los Pastes de Nonna
      </a>
    </div>
  );
}
