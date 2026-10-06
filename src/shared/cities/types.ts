import type { DecorPlacement } from '../decor.js';
import type { FloorPalette } from '../floors.js';
import type { LearnerLanguage } from '../fellows/languages.js';

/** A curated city floor learners can add in Academy mode. */
export interface CityDef {
  id: string;
  name: string;
  /** Short line on the elevator card. */
  blurb: string;
  /** Atmosphere on arrival and in the project corner. */
  mood: string;
  /** One-line welcome toast when you step onto the floor. */
  welcome: string;
  /** Fellows on this floor practice this language by default. */
  targetLanguage: LearnerLanguage;
  /** Sky / charts match string (e.g. "Amsterdam, Netherlands"). */
  skyCity: string;
  /** Preferred FLOOR_PALETTES index for elevator chips when free. */
  palette: number;
  /** Cartoon office paint: walls, trim, floor pattern. */
  look: FloorPalette;
  /** Emoji for the elevator list. */
  icon: string;
  /** Starter wall pictures (optional; city floors also get 3D murals). */
  pictures: DecorPlacement[];
}

/** Direct Wikimedia Commons image URL sized for wall hangings. */
export function commonsImage(file: string, width = 1200): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}
