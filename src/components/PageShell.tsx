import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type PageShellProps = {
  children: React.ReactNode;
  headerHref?: string;
};

export function PageShell({ children, headerHref = "/lealtad" }: PageShellProps) {
  return (
    <div className="cn-page">
      <a className="cn-skip" href="#contenido">
        Saltar al contenido
      </a>
      <SiteHeader href={headerHref} />
      {children}
      <SiteFooter />
    </div>
  );
}
