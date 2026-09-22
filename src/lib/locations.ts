export const LOCATIONS = [
  { id: "centro", name: "Los Pastes de Nonna" },
  { id: "libelula", name: "Sucursal Libélula" },
] as const;

export type LocationId = (typeof LOCATIONS)[number]["id"];

export function isLocationId(value: string): value is LocationId {
  return LOCATIONS.some((location) => location.id === value);
}

export function getLocationName(id: string): string {
  return LOCATIONS.find((location) => location.id === id)?.name ?? id;
}
