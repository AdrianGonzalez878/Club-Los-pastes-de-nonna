import { BrandMark } from "@/components/BrandMark";

type SiteHeaderProps = {
  href?: string;
};

export function SiteHeader({ href = "/lealtad" }: SiteHeaderProps) {
  return (
    <header className="cn-top">
      <div className="cn-top-in">
        <BrandMark href={href} />
        <p className="cn-top-pill cn-label">Oaxaca de Juárez</p>
      </div>
    </header>
  );
}
