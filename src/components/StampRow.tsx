type StampRowProps = {
  stamps: number;
  visitsRequired: number;
};

export function StampRow({ stamps, visitsRequired }: StampRowProps) {
  const total = Math.max(visitsRequired, 1);
  const filled = Math.min(stamps, total);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-sans text-3xl font-semibold tabular-nums text-navy">
        {filled}/{total}
      </p>
      <ol className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: total }, (_, index) => {
          const isFilled = index < filled;
          return (
            <li
              key={index}
              aria-label={isFilled ? `Visita ${index + 1} lista` : `Visita ${index + 1} pendiente`}
              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                isFilled
                  ? "border-navy bg-navy text-cream"
                  : "border-blue/30 bg-cream text-blue/50"
              }`}
            >
              {index + 1}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
