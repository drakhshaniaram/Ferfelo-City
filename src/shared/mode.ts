/** Product skin: coding office vs Ferfelo Academy. */

export type OfficeMode = 'coding' | 'academy';

export function parseOfficeMode(raw: unknown): OfficeMode {
  if (typeof raw !== 'string') return 'academy';
  const v = raw.trim().toLowerCase();
  if (v === 'coding' || v === 'code' || v === 'office') return 'coding';
  return 'academy';
}

export function isAcademyMode(mode: OfficeMode): boolean {
  return mode === 'academy';
}
