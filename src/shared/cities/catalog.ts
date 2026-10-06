import { commonsImage, type CityDef } from './types.js';

/** Curated Academy city floors — add a city here to offer it in the elevator. */
export const CITY_CATALOG: Record<string, CityDef> = {
  amsterdam: {
    id: 'amsterdam',
    name: 'Amsterdam',
    icon: '🌷',
    blurb: 'Canals, flower markets, and boats — Dutch by default.',
    targetLanguage: 'Dutch',
    skyCity: 'Amsterdam, Netherlands',
    palette: 1, // Mint
    pictures: [
      {
        url: commonsImage('Amsterdam_canal_boat.jpg'),
        title: 'Canal boat',
        wall: 'north',
        u: -6,
        y: 2.4,
        w: 2.4,
        h: 1.6,
        frame: 5,
      },
      {
        url: commonsImage('Amsterdam-3176-Blumenmarkt-Tulpen-2008-gje.jpg'),
        title: 'Tulips at the flower market',
        wall: 'north',
        u: 6,
        y: 2.4,
        w: 2.4,
        h: 1.5,
        frame: 4,
      },
      {
        url: commonsImage('Amsterdam_Canal_Tour.jpg'),
        title: 'Canal tour',
        wall: 'west',
        u: 0,
        y: 2.6,
        w: 2.6,
        h: 1.7,
        frame: 2,
      },
    ],
  },
  hamburg: {
    id: 'hamburg',
    name: 'Hamburg',
    icon: '⚓',
    blurb: 'Harbor, Speicherstadt, Elbphilharmonie — German by default.',
    targetLanguage: 'German',
    skyCity: 'Hamburg, Germany',
    palette: 2, // Sky
    pictures: [
      {
        url: commonsImage('Hamburg_Elbphilharmonie_2016.jpg'),
        title: 'Elbphilharmonie',
        wall: 'north',
        u: -6,
        y: 2.4,
        w: 2.5,
        h: 1.5,
        frame: 1,
      },
      {
        url: commonsImage('Speicherstadt_(Hamburg-HafenCity).Zollkanal.14863.ajb.jpg'),
        title: 'Speicherstadt',
        wall: 'north',
        u: 6,
        y: 2.4,
        w: 2.5,
        h: 1.6,
        frame: 0,
      },
      {
        url: commonsImage('Elbphilharmonie,_Hamburg.jpg'),
        title: 'Harbor view',
        wall: 'west',
        u: 2,
        y: 2.5,
        w: 2.4,
        h: 1.8,
        frame: 3,
      },
    ],
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    icon: '🗼',
    blurb: 'Seine banks and café terraces — French by default.',
    targetLanguage: 'French',
    skyCity: 'Paris, France',
    palette: 4, // Peach
    pictures: [
      {
        url: commonsImage('Tour_Eiffel_Wikipedia.jpg'),
        title: 'Tour Eiffel',
        wall: 'north',
        u: 0,
        y: 2.5,
        w: 2.2,
        h: 2.8,
        frame: 3,
      },
      {
        url: commonsImage('Seine_and_Eiffel_Tower_from_the_Tour_Saint-Jacques_2013-08.jpg'),
        title: 'Seine & tower',
        wall: 'west',
        u: -2,
        y: 2.4,
        w: 2.6,
        h: 1.7,
        frame: 0,
      },
    ],
  },
  tehran: {
    id: 'tehran',
    name: 'Tehran',
    icon: '🏔️',
    blurb: 'City against the Alborz — Persian by default.',
    targetLanguage: 'Persian',
    skyCity: 'Tehran, Iran',
    palette: 6, // Walnut
    pictures: [
      {
        url: commonsImage('Milad_Tower.jpg'),
        title: 'Milad Tower',
        wall: 'north',
        u: -4,
        y: 2.5,
        w: 2.2,
        h: 2.6,
        frame: 1,
      },
      {
        url: commonsImage('Azadi_Tower.jpg'),
        title: 'Azadi Tower',
        wall: 'north',
        u: 5,
        y: 2.4,
        w: 2.4,
        h: 1.8,
        frame: 3,
      },
    ],
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
