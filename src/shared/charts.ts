/** Curated Top-30 listening packs keyed by office sky city (AGENT_OFFICE_CITY). */

export interface ChartTrack {
  rank: number;
  title: string;
  artist: string;
  /** Optional jukebox tune id or stream URL when playable in-office. */
  play?: { track?: string; url?: string };
}

export interface ChartPack {
  /** Match against sky city (case-insensitive substring). */
  cityMatch: string[];
  label: string;
  tracks: ChartTrack[];
}

/** Fallback when no city pack matches. */
export const CHARTS_WORLD: ChartPack = {
  cityMatch: ['*'],
  label: 'Worldwide listening hints',
  tracks: [
    { rank: 1, title: 'Blinding Lights', artist: 'The Weeknd' },
    { rank: 2, title: 'As It Was', artist: 'Harry Styles' },
    { rank: 3, title: 'Levitating', artist: 'Dua Lipa' },
    { rank: 4, title: 'good 4 u', artist: 'Olivia Rodrigo' },
    { rank: 5, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber' },
    { rank: 6, title: 'Heat Waves', artist: 'Glass Animals' },
    { rank: 7, title: 'drivers license', artist: 'Olivia Rodrigo' },
    { rank: 8, title: 'Peaches', artist: 'Justin Bieber' },
    { rank: 9, title: 'Save Your Tears', artist: 'The Weeknd' },
    { rank: 10, title: 'Montero', artist: 'Lil Nas X' },
    { rank: 11, title: 'Kiss Me More', artist: 'Doja Cat' },
    { rank: 12, title: 'Industry Baby', artist: 'Lil Nas X' },
    { rank: 13, title: 'Bad Habit', artist: 'Steve Lacy' },
    { rank: 14, title: 'About Damn Time', artist: 'Lizzo' },
    { rank: 15, title: 'Anti-Hero', artist: 'Taylor Swift' },
    { rank: 16, title: 'Unholy', artist: 'Sam Smith & Kim Petras' },
    { rank: 17, title: 'Flowers', artist: 'Miley Cyrus' },
    { rank: 18, title: 'Kill Bill', artist: 'SZA' },
    { rank: 19, title: 'Calm Down', artist: 'Rema & Selena Gomez' },
    { rank: 20, title: 'Die For You', artist: 'The Weeknd' },
    { rank: 21, title: 'Creepin’', artist: 'Metro Boomin' },
    { rank: 22, title: 'Shakira: Bzrp Music Sessions', artist: 'Bizarrap & Shakira' },
    { rank: 23, title: 'TQG', artist: 'Karol G & Shakira' },
    { rank: 24, title: 'Ella Baila Sola', artist: 'Eslabon Armado & Peso Pluma' },
    { rank: 25, title: 'Paint The Town Red', artist: 'Doja Cat' },
    { rank: 26, title: 'Cruel Summer', artist: 'Taylor Swift' },
    { rank: 27, title: 'vampire', artist: 'Olivia Rodrigo' },
    { rank: 28, title: 'Seven', artist: 'Jung Kook & Latto' },
    { rank: 29, title: 'greedy', artist: 'Tate McRae' },
    { rank: 30, title: 'Lovin On Me', artist: 'Jack Harlow' },
  ],
};

export const CHART_PACKS: ChartPack[] = [
  {
    cityMatch: ['hamburg', 'berlin', 'munich', 'köln', 'cologne', 'frankfurt', 'germany'],
    label: 'Germany — what people are spinning',
    tracks: [
      { rank: 1, title: 'Atemlos durch die Nacht', artist: 'Helene Fischer' },
      { rank: 2, title: 'L’Amour Toujours', artist: 'Gigi D’Agostino' },
      { rank: 3, title: 'Freed from Desire', artist: 'Gala' },
      { rank: 4, title: 'Das ist dein Leben', artist: 'SDP' },
      { rank: 5, title: 'Auf uns', artist: 'Andreas Bourani' },
      { rank: 6, title: 'Major Tom', artist: 'Peter Schilling' },
      { rank: 7, title: '99 Luftballons', artist: 'Nena' },
      { rank: 8, title: 'Irgendwie, irgendwo, irgendwann', artist: 'Nena' },
      { rank: 9, title: 'Marmor, Stein und Eisen bricht', artist: 'Drafi Deutscher' },
      { rank: 10, title: 'Skandal im Sperrbezirk', artist: 'Spider Murphy Gang' },
      { rank: 11, title: 'Blitzkrieg Bop', artist: 'Ramones' },
      { rank: 12, title: 'Around the World', artist: 'Daft Punk' },
      { rank: 13, title: 'Blue (Da Ba Dee)', artist: 'Eiffel 65' },
      { rank: 14, title: 'Dragostea Din Tei', artist: 'O-Zone' },
      { rank: 15, title: 'Barbie Girl', artist: 'Aqua' },
      { rank: 16, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { rank: 17, title: 'Shape of You', artist: 'Ed Sheeran' },
      { rank: 18, title: 'Despacito', artist: 'Luis Fonsi' },
      { rank: 19, title: 'Blinding Lights', artist: 'The Weeknd' },
      { rank: 20, title: 'As It Was', artist: 'Harry Styles' },
      { rank: 21, title: 'Anti-Hero', artist: 'Taylor Swift' },
      { rank: 22, title: 'Flowers', artist: 'Miley Cyrus' },
      { rank: 23, title: 'Dance Monkey', artist: 'Tones and I' },
      { rank: 24, title: 'Bad Guy', artist: 'Billie Eilish' },
      { rank: 25, title: 'Someone You Loved', artist: 'Lewis Capaldi' },
      { rank: 26, title: 'Believer', artist: 'Imagine Dragons' },
      { rank: 27, title: 'Thunder', artist: 'Imagine Dragons' },
      { rank: 28, title: 'Counting Stars', artist: 'OneRepublic' },
      { rank: 29, title: 'Viva La Vida', artist: 'Coldplay' },
      { rank: 30, title: 'Yellow', artist: 'Coldplay' },
    ],
  },
  {
    cityMatch: ['tehran', 'iran', 'isfahan', 'shiraz'],
    label: 'Iran — popular listening hints',
    tracks: [
      { rank: 1, title: 'Gole Yakh', artist: 'Kourosh Yaghmaei' },
      { rank: 2, title: 'Soltane Ghalbha', artist: 'Aref' },
      { rank: 3, title: 'Gole Sangam', artist: 'Ebi' },
      { rank: 4, title: 'Ghebleh', artist: 'Googoosh' },
      { rank: 5, title: 'Hamsafar', artist: 'Dariush' },
      { rank: 6, title: 'Ashegh Shodam', artist: 'Hassan Shamaizadeh' },
      { rank: 7, title: 'Shabeh Mahtab', artist: 'Faramarz Aslani' },
      { rank: 8, title: 'Age Ye Rooz', artist: 'Ebi' },
      { rank: 9, title: 'Gheseh Man', artist: 'Mohsen Chavoshi' },
      { rank: 10, title: 'Jadeye Yek Tarafeh', artist: 'Mohsen Yeganeh' },
      { rank: 11, title: 'Behet Ghol Midam', artist: 'Mohsen Yeganeh' },
      { rank: 12, title: 'Nafas', artist: 'Reza Pishro' },
      { rank: 13, title: 'Bia Berim', artist: 'Sasy' },
      { rank: 14, title: 'Dokhtare Khan', artist: 'Black Cats' },
      { rank: 15, title: 'Tehran', artist: 'Shadmehr Aghili' },
      { rank: 16, title: 'Blinding Lights', artist: 'The Weeknd' },
      { rank: 17, title: 'As It Was', artist: 'Harry Styles' },
      { rank: 18, title: 'Levitating', artist: 'Dua Lipa' },
      { rank: 19, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber' },
      { rank: 20, title: 'Shape of You', artist: 'Ed Sheeran' },
      { rank: 21, title: 'Despacito', artist: 'Luis Fonsi' },
      { rank: 22, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { rank: 23, title: 'Bad Guy', artist: 'Billie Eilish' },
      { rank: 24, title: 'Dance Monkey', artist: 'Tones and I' },
      { rank: 25, title: 'Believer', artist: 'Imagine Dragons' },
      { rank: 26, title: 'Someone You Loved', artist: 'Lewis Capaldi' },
      { rank: 27, title: 'Sunflower', artist: 'Post Malone & Swae Lee' },
      { rank: 28, title: 'Senorita', artist: 'Shawn Mendes & Camila Cabello' },
      { rank: 29, title: 'Perfect', artist: 'Ed Sheeran' },
      { rank: 30, title: 'Counting Stars', artist: 'OneRepublic' },
    ],
  },
  {
    cityMatch: ['amsterdam', 'rotterdam', 'utrecht', 'netherlands', 'holland'],
    label: 'Netherlands — what people queue',
    tracks: [
      { rank: 1, title: 'Zeven Dagen Lang', artist: 'BZN' },
      { rank: 2, title: 'Het is een nacht', artist: 'Guus Meeuwis' },
      { rank: 3, title: '15 miljoen mensen', artist: 'Fluitsma & Van Tijn' },
      { rank: 4, title: 'Vluchten kan niet meer', artist: 'Frans Bauer' },
      { rank: 5, title: 'Mag ik dan bij jou', artist: 'Claudia de Breij' },
      { rank: 6, title: 'Zij gelooft in mij', artist: 'André Hazes' },
      { rank: 7, title: 'Bloed, zweet en tranen', artist: 'André Hazes' },
      { rank: 8, title: 'Dromen zijn hypotheken', artist: 'Acda en De Munnik' },
      { rank: 9, title: 'Vriendschap', artist: 'Het Goede Doel' },
      { rank: 10, title: 'Ik hou van u', artist: 'Raymond van het Groenewoud' },
      { rank: 11, title: 'Blinding Lights', artist: 'The Weeknd' },
      { rank: 12, title: 'As It Was', artist: 'Harry Styles' },
      { rank: 13, title: 'Levitating', artist: 'Dua Lipa' },
      { rank: 14, title: 'Flowers', artist: 'Miley Cyrus' },
      { rank: 15, title: 'Anti-Hero', artist: 'Taylor Swift' },
      { rank: 16, title: 'Shape of You', artist: 'Ed Sheeran' },
      { rank: 17, title: 'Dance Monkey', artist: 'Tones and I' },
      { rank: 18, title: 'Bad Guy', artist: 'Billie Eilish' },
      { rank: 19, title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
      { rank: 20, title: 'Despacito', artist: 'Luis Fonsi' },
      { rank: 21, title: 'Stay', artist: 'The Kid LAROI & Justin Bieber' },
      { rank: 22, title: 'Heat Waves', artist: 'Glass Animals' },
      { rank: 23, title: 'Believer', artist: 'Imagine Dragons' },
      { rank: 24, title: 'Thunder', artist: 'Imagine Dragons' },
      { rank: 25, title: 'Counting Stars', artist: 'OneRepublic' },
      { rank: 26, title: 'Viva La Vida', artist: 'Coldplay' },
      { rank: 27, title: 'Yellow', artist: 'Coldplay' },
      { rank: 28, title: 'Someone You Loved', artist: 'Lewis Capaldi' },
      { rank: 29, title: 'Perfect', artist: 'Ed Sheeran' },
      { rank: 30, title: 'Sunflower', artist: 'Post Malone & Swae Lee' },
    ],
  },
  CHARTS_WORLD,
];

/** Pick the pack for the office sky city (or worldwide). */
export function chartPackForCity(city: string | undefined | null): ChartPack {
  const needle = (city ?? '').trim().toLowerCase();
  if (!needle) return CHARTS_WORLD;
  for (const pack of CHART_PACKS) {
    if (pack.cityMatch.includes('*')) continue;
    if (pack.cityMatch.some((m) => needle.includes(m))) return pack;
  }
  return CHARTS_WORLD;
}
