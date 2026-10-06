import type { DecorPlacement } from '../decor.js';
import type { LearnerLanguage } from '../fellows/languages.js';

/** A curated city floor learners can add in Academy mode. */
export interface CityDef {
  id: string;
  name: string;
  /** Short line on the elevator card. */
  blurb: string;
  /** Fellows on this floor practice this language by default. */
  targetLanguage: LearnerLanguage;
  /** Sky / charts match string (e.g. "Amsterdam, Netherlands"). */
  skyCity: string;
  /** Preferred FLOOR_PALETTES index when free. */
  palette: number;
  /** Emoji for the elevator list. */
  icon: string;
  /** Starter wall pictures (Wikimedia / public web images). */
  pictures: DecorPlacement[];
}

/** Direct Wikimedia Commons image URL sized for wall hangings. */
export function commonsImage(file: string, width = 1200): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}
