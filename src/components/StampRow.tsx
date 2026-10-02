import { CafeIcon, InkPasteIcon, PasteIcon, SalsaIcon } from "@/components/LoyaltyIcons";

type StampRowProps = {
  stamps: number;
  visitsRequired: number;
  preview?: boolean;
};

const ROTATIONS = [-7, 5, -3, 4, -5, 6, -4, 3, -6, 5];

function prizeKind(index: number, total: number, preview: boolean) {
  const n = index + 1;
  if (preview || total >= 10) {
    if (n === 5) return "mid" as const;
    if (n === total) return "final" as const;
    return null;
  }
  if (n === total) return "final" as const;
  return null;
}

export function StampRow({ stamps, visitsRequired, preview = false }: StampRowProps) {
  const total = Math.max(visitsRequired, 1);
  const filled = Math.min(stamps, total);

  return (
    <ol className="cn-grid">
      {Array.from({ length: total }, (_, index) => {
        const n = index + 1;
        const isFilled = index < filled;
        const prize = prizeKind(index, total, preview);
        const classes = [
          "cn-st",
          isFilled && !prize ? "cn-st-on" : "",
          prize ? "cn-st-prize" : "",
          prize === "final" ? "cn-st-big" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const label = prize
          ? isFilled
            ? `Premio de la visita ${n} listo`
            : `Premio en la visita ${n}`
          : isFilled
            ? `Visita ${n} lista`
            : `Visita ${n} pendiente`;

        return (
          <li
            key={n}
            className={classes}
            style={
              isFilled && !prize
                ? ({ ["--r" as string]: `${ROTATIONS[index % ROTATIONS.length]}deg` })
                : undefined
            }
            aria-label={label}
          >
            <span className="cn-st-n" style={!isFilled && !prize ? { opacity: 0.8 } : undefined}>
              {n}
            </span>
            {prize === "mid" ? (
              <span className="cn-duo">
                <SalsaIcon className="cn-salsa" />
                <CafeIcon className="cn-cafe" />
              </span>
            ) : prize === "final" ? (
              <PasteIcon />
            ) : isFilled ? (
              <InkPasteIcon />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
