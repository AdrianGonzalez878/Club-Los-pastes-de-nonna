export const SAVED_CARD_KEY = "club_nonna_code";

export function readSavedCode(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(SAVED_CARD_KEY);
  return value && value.length >= 6 ? value : null;
}

export function saveCardCode(code: string) {
  window.localStorage.setItem(SAVED_CARD_KEY, code);
}
