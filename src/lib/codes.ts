const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_LENGTH = 8;

export function generateCustomerCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

export function normalizeCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^2-9A-HJ-NP-Z]/g, "")
    .slice(0, CODE_LENGTH);
}

export function isValidCode(code: string): boolean {
  return new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`).test(code);
}

export function formatCode(code: string): string {
  const normalized = normalizeCode(code);
  if (normalized.length !== CODE_LENGTH) return normalized;
  return `${normalized.slice(0, 4)} ${normalized.slice(4)}`;
}

export function extractCodeFromScan(raw: string): string {
  const trimmed = raw.trim();
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    const loyaltyIndex = parts.findIndex(
      (part) => part.toLowerCase() === "lealtad",
    );
    if (loyaltyIndex >= 0 && parts[loyaltyIndex + 1]) {
      return normalizeCode(parts[loyaltyIndex + 1]);
    }
    const last = parts[parts.length - 1];
    if (last) return normalizeCode(last);
  } catch {
    // El cajero puede escribir solo el código.
  }
  return normalizeCode(trimmed);
}
