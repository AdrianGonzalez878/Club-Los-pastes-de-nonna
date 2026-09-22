const TIME_ZONE = "America/Mexico_City";

export function mexicoCityDate(value: Date | string = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function isMexicoCityToday(value: Date | string): boolean {
  return mexicoCityDate(value) === mexicoCityDate();
}
