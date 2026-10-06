import type { CityDef } from './types.js';

/** Curated Academy city floors — add a city here to offer it in the elevator. */
export const CITY_CATALOG: Record<string, CityDef> = {
  amsterdam: {
    id: 'amsterdam',
    name: 'Amsterdam',
    icon: '🌷',
    blurb: 'Canal houses, bikes, tulips — Dutch by default.',
    mood: 'Canal light, bike bells, coffee by the window',
    welcome: 'Welkom in Amsterdam — canals, tulips, and Dutch on every desk.',
    targetLanguage: 'Dutch',
    skyCity: 'Amsterdam, Netherlands',
    palette: 1,
    look: {
      name: 'Canal mint',
      wall: '#9aefc8',
      trim: '#ff5a1f',
      floor: '#5ec4e0',
      floorAlt: '#3aafd4',
      seam: '#1f5f78',
      pattern: 'tiles',
    },
    // Murals carry the cartoon look; keep walls free of photo clutter.
    pictures: [],
  },
  hamburg: {
    id: 'hamburg',
    name: 'Hamburg',
    icon: '⚓',
    blurb: 'Harbor brick, ships, Elphi curves — German by default.',
    mood: 'Harbor mist, brick warehouses, Elbe under grey sky',
    welcome: 'Moin from Hamburg — harbor air and German at every seat.',
    targetLanguage: 'German',
    skyCity: 'Hamburg, Germany',
    palette: 2,
    look: {
      name: 'Harbor brick',
      wall: '#f6d0bc',
      trim: '#c43b1a',
      floor: '#6e7f99',
      floorAlt: '#556780',
      seam: '#2a3444',
      pattern: 'bricks',
    },
    pictures: [],
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    icon: '🗼',
    blurb: 'Café awnings, the tower, cream stone — French by default.',
    mood: 'Café chatter, limestone light, evening on the Seine',
    welcome: 'Bienvenue à Paris — terraces, the tower, and French by default.',
    targetLanguage: 'French',
    skyCity: 'Paris, France',
    palette: 4,
    look: {
      name: 'Café cream',
      wall: '#ffe8d2',
      trim: '#e6b422',
      floor: '#f0b8a8',
      floorAlt: '#e09a88',
      seam: '#9a5f52',
      pattern: 'checkers',
    },
    pictures: [],
  },
  tehran: {
    id: 'tehran',
    name: 'Tehran',
    icon: '🏔️',
    blurb: 'Turquoise tile, mountains, warm brick — Persian by default.',
    mood: 'Mountain air, tea steam, evening light on the Alborz',
    welcome: 'خوش آمدید to Tehran — mountains at the edge, Persian on the floor.',
    targetLanguage: 'Persian',
    skyCity: 'Tehran, Iran',
    palette: 6,
    look: {
      name: 'Alborz terracotta',
      wall: '#f3e0c8',
      trim: '#0f9b8e',
      floor: '#c86a3a',
      floorAlt: '#a85428',
      seam: '#5c2e16',
      pattern: 'tiles',
    },
    pictures: [],
  },
};

export const CITY_IDS = Object.keys(CITY_CATALOG) as CityId[];

export type CityId = keyof typeof CITY_CATALOG;

export function isCityId(value: unknown): value is CityId {
  return typeof value === 'string' && value in CITY_CATALOG;
}

export function cityOf(id: string | undefined): CityDef | undefined {
  return id && isCityId(id) ? CITY_CATALOG[id] : undefined;
}
