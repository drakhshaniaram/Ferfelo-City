import { alex } from './alex.js';
import { joost } from './joost.js';
import { lena } from './lena.js';
import { marco } from './marco.js';
import { maya } from './maya.js';
import { park } from './park.js';
import { sofia } from './sofia.js';
import type { FellowId, FellowSpec } from './types.js';

/** One line per fellow definition — add a new file and list it here. */
const DEFS: FellowSpec[] = [lena, marco, sofia, joost, park, alex, maya];

export const FELLOW_CATALOG: Record<FellowId, FellowSpec> = Object.fromEntries(DEFS.map((f) => [f.id, f])) as Record<FellowId, FellowSpec>;

export const FELLOW_IDS = Object.keys(FELLOW_CATALOG) as FellowId[];

export function isFellowId(value: unknown): value is FellowId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(FELLOW_CATALOG, value);
}
