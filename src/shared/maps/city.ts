import type { MapConfig } from './types.js';
import { CASTLE } from './castle.js';

/**
 * Ferfelo City academy hall: same seat contract and castle kit as the great hall, dressed as a
 * civic learning plaza (concierge, tutoring tables, notice boards).
 */
export const CITY: MapConfig = {
  ...CASTLE,
  id: 'city',
  name: 'Ferfelo City',
  icon: '🌆',
  description:
    'An academy hall in the city: fellows sit at the long tables, line up when they need you, and the Concierge invites a new fellow when you speak to them. Same seats as every other map, so workers keep their places when you change buildings.',
  herald: {
    x: 3.3,
    z: -26.3,
    rotY: -0.35,
    name: 'Concierge',
    says: 'Speak to me to invite a language fellow',
    ask: 'Which scene should they open with?',
    button: 'Invite fellow 🎓',
  },
  boards: {
    issues: { ...CASTLE.boards!.issues, label: '📌 Notices' },
    queue: { ...CASTLE.boards!.queue, label: '📋 Scenes waiting' },
    pulls: { ...CASTLE.boards!.pulls, label: '📚 Reading list' },
    services: { ...CASTLE.boards!.services, label: '🌐 Campus services' },
  },
};
