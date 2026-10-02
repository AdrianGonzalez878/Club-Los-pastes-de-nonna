import Image from "next/image";
import { StampRow } from "@/components/StampRow";

type StampCardProps = {
  mode?: "preview" | "live";
  stamps?: number;
  visitsRequired?: number;
  subtitle?: string;
  legend?: { tone: "visit" | "mid" | "final"; text: string }[];
  showBubble?: boolean;
  flat?: boolean;
};

const PREVIEW_LEGEND = [
  { tone: "visit" as const, text: "Un sello por visita, en cualquier sucursal" },
  { tone: "mid" as const, text: "5ª visita: salsa, café o refresco" },
  { tone: "final" as const, text: "10ª visita: paste de regalo" },
];

export function StampCard({
  mode = "preview",
  stamps = 3,
  visitsRequired = 10,
  subtitle,
  legend,
  showBubble = true,
  flat = false,
}: StampCardProps) {
  const preview = mode === "preview";
  const filled = Math.min(stamps, visitsRequired);
  const rows = legend ?? (preview ? PREVIEW_LEGEND : undefined);
  const label = preview
    ? "Tarjeta de sellos con 10 casillas: sello 5 premio salsa, café o refresco; sello 10 paste de regalo"
    : `Tarjeta de sellos: ${filled} de ${visitsRequired} visitas`;

  return (
    <div className="cn-cardwrap">
      {showBubble ? (
        <p className="cn-bubble">
          ¡Paste
          <br />
          gratis!
        </p>
      ) : null}
      <div className={`cn-card${flat ? " cn-card-flat" : ""}`} aria-label={label}>
        <div className="cn-card-h">
          <div>
            <h2 className="cn-card-title">Tu tarjeta</h2>
            <span className="cn-label">
              {subtitle ??
                (preview ? "10 visitas · 2 premios" : `${filled}/${visitsRequired} visitas`)}
            </span>
          </div>
          <Image
            src="/logo.png"
            alt=""
            width={92}
            height={92}
            className="cn-card-logo"
          />
        </div>
        <StampRow stamps={stamps} visitsRequired={visitsRequired} preview={preview} />
        {rows ? (
          <ul className="cn-legend">
            {rows.map((item) => (
              <li key={item.text}>
                <i
                  className={
                    item.tone === "mid"
                      ? "cn-dot cn-dot-g"
                      : item.tone === "final"
                        ? "cn-dot cn-dot-g2"
                        : "cn-dot"
                  }
                  aria-hidden="true"
                />
                {item.text}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
