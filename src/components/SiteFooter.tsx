import Image from "next/image";

const ARGA_SITE = "https://argaweb.com";

export function SiteFooter() {
  return (
    <footer className="cn-footer">
      <Image
        src="/logo.png"
        alt="Los Pastes de Nonna"
        width={168}
        height={168}
        className="cn-footer-logo cn-logo-on-dark"
      />
      <p className="cn-footer-p">Programa de visitas · Oaxaca de Juárez</p>
      <hr className="cn-footer-hr" />
      <p>
        <a
          href={ARGA_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="cn-by"
        >
          <span className="cn-by-badge" aria-hidden="true">
            <Image
              src="/arga-mark.png"
              alt=""
              width={88}
              height={88}
              className="cn-by-mark"
            />
          </span>
          <span>
            Powered by <b>ARGA</b> | Desarrollo de software
          </span>
        </a>
      </p>
    </footer>
  );
}
