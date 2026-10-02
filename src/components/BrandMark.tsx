import Image from "next/image";
import Link from "next/link";

const NONNA_SITE = "https://www.lospastesdenona.com";

type BrandMarkProps = {
  href?: string;
  size?: "sm" | "md";
};

export function BrandMark({ href = "/lealtad", size = "md" }: BrandMarkProps) {
  const px = size === "sm" ? 100 : 124;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Link href={href} className="shrink-0 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue">
        <Image
          src="/logo.png"
          alt="Los Pastes de Nonna"
          width={px}
          height={px}
          priority
          className="cn-top-logo"
        />
      </Link>
      <div className="min-w-0">
        <Link
          href={href}
          className="cn-brand block rounded-sm no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          Club Nonna
        </Link>
        <a
          href={NONNA_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="cn-brand-sub"
        >
          Los Pastes de Nonna
        </a>
      </div>
    </div>
  );
}
