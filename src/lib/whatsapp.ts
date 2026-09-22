export function normalizeWhatsApp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 10) {
    return `52${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("52")) {
    return digits;
  }

  if (digits.length === 13 && digits.startsWith("521")) {
    return `52${digits.slice(3)}`;
  }

  return null;
}

export function isMexicanMobileInput(raw: string): boolean {
  return /^\d{10}$/.test(raw.replace(/\D/g, "")) || normalizeWhatsApp(raw) !== null;
}

export function formatWhatsApp(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("52")) {
    return `+52 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return whatsapp;
}
