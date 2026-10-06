import type { CityId } from './catalog.js';
import type { FellowId } from '../fellows/index.js';

/** A practice scene pinned on the Scenes board (academy stand-in for Issues). */
export interface CityScene {
  id: string;
  title: string;
  /** Sticky-note blurb on the wall board. */
  blurb: string;
  /** Prefills the fellow hire scene note. */
  sceneNote: string;
  /** Suggested fellow when starting from the board. */
  fellowId?: FellowId;
  /** City this scene belongs to; omit for campus-wide. */
  cityId?: CityId;
}

/** Curated immersive scenes per city — the Scenes board’s sticky notes. */
export const CITY_SCENES: CityScene[] = [
  // Amsterdam
  { id: 'ams-market', cityId: 'amsterdam', title: 'Flower market', blurb: 'Buy tulips & banter', sceneNote: 'At the floating flower market: pick a bunch, haggle lightly, ask where to get coffee after', fellowId: 'amsterdam' },
  { id: 'ams-bike', cityId: 'amsterdam', title: 'Bike bell chaos', blurb: 'Ring, weave, apologize', sceneNote: 'Rent a bike and ride along a canal — ding the bell, dodge tourists, ask a local for the way to a café', fellowId: 'amsterdam' },
  { id: 'ams-rain', cityId: 'amsterdam', title: 'Rainy afternoon', blurb: 'Museum or brown café?', sceneNote: 'Plan a rainy afternoon in Amsterdam: museum queue vs brown café with apple pie', fellowId: 'amsterdam' },
  { id: 'ams-ferry', cityId: 'amsterdam', title: 'North ferry', blurb: 'Free ferry chat', sceneNote: 'Ride the free ferry to Amsterdam Noord; small talk with someone on deck about the skyline', fellowId: 'amsterdam' },
  // Hamburg
  { id: 'ham-oktober', cityId: 'hamburg', title: 'Oktoberfest table', blurb: 'Prost & songs', sceneNote: 'Celebrate Oktoberfest-style in Hamburg with locals — order a Maß, join a toast, learn one song line', fellowId: 'oktoberfest' },
  { id: 'ham-harbor', cityId: 'hamburg', title: 'Harbor walk', blurb: 'Elbphilharmonie view', sceneNote: 'Walk the harbor at Landungsbrücken, point out ships, ask about the Elbphilharmonie concert hall', fellowId: 'oktoberfest' },
  { id: 'ham-speicher', cityId: 'hamburg', title: 'Speicherstadt', blurb: 'Brick & canals', sceneNote: 'Wander Speicherstadt’s brick warehouses; ask for a coffee spot with a canal view', fellowId: 'oktoberfest' },
  { id: 'ham-fish', cityId: 'hamburg', title: 'Fischbrötchen', blurb: 'Order at the stand', sceneNote: 'Order a Fischbrötchen at a harbor stand — toppings, size, and where to sit and eat', fellowId: 'chef' },
  // Paris
  { id: 'par-cafe', cityId: 'paris', title: 'Café terrace', blurb: 'Un café, s’il vous plaît', sceneNote: 'Sit on a Paris café terrace: order coffee and a pastry, people-watch, ask for the wifi', fellowId: 'checkin' },
  { id: 'par-seine', cityId: 'paris', title: 'Seine stroll', blurb: 'Booksellers & bridges', sceneNote: 'Stroll the Seine past bouquinistes; ask which bridge has the best sunset', fellowId: 'checkin' },
  { id: 'par-market', cityId: 'paris', title: 'Fromagerie', blurb: 'Cheese for a picnic', sceneNote: 'At a fromagerie, pick cheese and bread for a picnic near the Eiffel Tower', fellowId: 'chef' },
  { id: 'par-metro', cityId: 'paris', title: 'Metro ticket', blurb: 'Which line?', sceneNote: 'Buy a metro ticket and ask which line goes toward the Tour Eiffel — confirm the stop', fellowId: 'checkin' },
  // Tehran
  { id: 'teh-tea', cityId: 'tehran', title: 'Tea house', blurb: 'Chai & small talk', sceneNote: 'In a Tehran tea house: order chai, talk about the mountains, ask what to see this evening', fellowId: 'checkin' },
  { id: 'teh-bazaar', cityId: 'tehran', title: 'Grand bazaar', blurb: 'Spice & carpets', sceneNote: 'Wander the bazaar: ask the price of saffron, smell spices, find a carpet stall', fellowId: 'chef' },
  { id: 'teh-tochal', cityId: 'tehran', title: 'Tochal day', blurb: 'Cable car plans', sceneNote: 'Plan a trip up Tochal — cable car times, what to wear, where to eat afterward', fellowId: 'news' },
  { id: 'teh-azadi', cityId: 'tehran', title: 'Azadi Square', blurb: 'Photo & directions', sceneNote: 'Meet at Azadi Tower; ask a passerby for the best photo angle and a nearby café', fellowId: 'checkin' },
];

export function scenesForCity(cityId: string | undefined): CityScene[] {
  if (!cityId) return CITY_SCENES.filter((s) => !s.cityId).slice(0, 6);
  return CITY_SCENES.filter((s) => s.cityId === cityId);
}

/** Starter phrase-wall lines (academy stand-in for Pull requests). */
export interface CityPhrase {
  id: string;
  line: string;
  gloss: string;
  cityId?: CityId;
}

export const CITY_PHRASES: CityPhrase[] = [
  { id: 'ams-1', cityId: 'amsterdam', line: 'Mag ik een kopje koffie?', gloss: 'Can I have a cup of coffee?' },
  { id: 'ams-2', cityId: 'amsterdam', line: 'Waar is het station?', gloss: 'Where is the station?' },
  { id: 'ams-3', cityId: 'amsterdam', line: 'Lekker weer vandaag!', gloss: 'Nice weather today!' },
  { id: 'ams-4', cityId: 'amsterdam', line: 'Fietsen is hier normaal.', gloss: 'Cycling is normal here.' },
  { id: 'ham-1', cityId: 'hamburg', line: 'Moin! Wie geht’s?', gloss: 'Hi! How’s it going?' },
  { id: 'ham-2', cityId: 'hamburg', line: 'Einmal Fischbrötchen, bitte.', gloss: 'One fish sandwich, please.' },
  { id: 'ham-3', cityId: 'hamburg', line: 'Prost!', gloss: 'Cheers!' },
  { id: 'ham-4', cityId: 'hamburg', line: 'Wo ist die Elbphilharmonie?', gloss: 'Where is the Elbphilharmonie?' },
  { id: 'par-1', cityId: 'paris', line: 'Un café, s’il vous plaît.', gloss: 'A coffee, please.' },
  { id: 'par-2', cityId: 'paris', line: 'Excusez-moi, où est le métro?', gloss: 'Excuse me, where is the metro?' },
  { id: 'par-3', cityId: 'paris', line: 'C’est délicieux!', gloss: 'It’s delicious!' },
  { id: 'par-4', cityId: 'paris', line: 'À demain!', gloss: 'See you tomorrow!' },
  { id: 'teh-1', cityId: 'tehran', line: 'چای لطفاً', gloss: 'Tea, please' },
  { id: 'teh-2', cityId: 'tehran', line: 'ببخشید، ایستگاه مترو کجاست؟', gloss: 'Excuse me, where is the metro station?' },
  { id: 'teh-3', cityId: 'tehran', line: 'خیلی ممنون', gloss: 'Thank you so much' },
  { id: 'teh-4', cityId: 'tehran', line: 'هوای خوبی است امروز', gloss: 'The weather is nice today' },
];

export function phrasesForCity(cityId: string | undefined): CityPhrase[] {
  if (!cityId) return CITY_PHRASES.slice(0, 4);
  return CITY_PHRASES.filter((p) => p.cityId === cityId);
}
