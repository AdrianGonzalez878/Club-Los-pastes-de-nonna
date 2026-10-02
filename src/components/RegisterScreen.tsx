import { ConfigBanner } from "@/components/ConfigBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { ArrowIcon, PasteIcon } from "@/components/LoyaltyIcons";
import { PageShell } from "@/components/PageShell";
import { RegisterForm } from "@/components/RegisterForm";
import { SavedCardLink } from "@/components/SavedCardLink";
import { StampCard } from "@/components/StampCard";

export function RegisterScreen({ configured }: { configured: boolean }) {
  return (
    <PageShell>
      <main className="cn-main" id="contenido">
        <section className="cn-hero">
          <div className="cn-hero-pat cn-hero-pat-t" aria-hidden="true" />
          <div className="cn-hero-pat cn-hero-pat-b" aria-hidden="true" />
          <div className="cn-hero-in">
            <div className="cn-hero-grid">
              <div>
                <p className="cn-eyebrow cn-label">Oaxaca de Juárez</p>
                <h1>
                  <span className="cn-hero-line">Junta visitas,</span>
                  <span className="cn-hero-line">llévate</span>
                  <span className="cn-script">premios</span>
                </h1>
                <p className="cn-lead">
                  En cualquier sucursal te sellamos la tarjeta. A la{" "}
                  <b>quinta visita</b> eliges una salsa, un café o un refresco. A
                  la <b>décima</b> te llevas un paste de regalo y el ciclo vuelve
                  a empezar.
                </p>
                <div className="cn-cta">
                  <a className="cn-btn cn-btn-cream" href="#registro">
                    Quiero mi tarjeta <ArrowIcon className="cn-ico" />
                  </a>
                  <SavedCardLink className="cn-btn cn-btn-ghost">
                    Abrir mi tarjeta
                  </SavedCardLink>
                </div>
              </div>
              <StampCard mode="preview" stamps={3} visitsRequired={10} />
            </div>
          </div>
        </section>

        <HowItWorks />

        <div className="cn-tex-band" aria-hidden="true" />

        <section className="cn-join" id="registro" aria-label="Empieza tu tarjeta">
          {!configured ? (
            <div className="cn-join-banner">
              <ConfigBanner />
            </div>
          ) : null}
          <div className="cn-join-in">
            <div className="cn-join-art">
              <div className="cn-sec-h">
                <span className="cn-label">Club Nonna</span>
                <h2>
                  Empieza
                  <br />
                  tu <span className="cn-script">tarjeta</span>
                </h2>
                <div className="cn-rule" aria-hidden="true">
                  <i />
                </div>
              </div>
              <PasteIcon className="cn-paste-art cn-ico" />
            </div>
            <div className="cn-sec-h cn-m-only">
              <span className="cn-label">Club Nonna</span>
              <h2>
                Empieza tu <span className="cn-script">tarjeta</span>
              </h2>
              <div className="cn-rule" aria-hidden="true">
                <i />
              </div>
            </div>
            <RegisterForm configured={configured} />
          </div>
        </section>
      </main>
    </PageShell>
  );
}
