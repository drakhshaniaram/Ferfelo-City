import type { MapConfig } from './types.js';
import { STATION } from './station.js';

/**
 * City-ship academy deck: station kit and seats, dressed as a self-contained vessel with classrooms
 * on the benches and a Steward who invites fellows aboard.
 */
export const SHIP: MapConfig = {
  ...STATION,
  id: 'ship',
  name: 'City-ship',
  icon: '🚢',
  description:
    'A self-contained academy vessel in orbit: fellows at the benches, a line before the bridge chair, and the Steward bringing new fellows aboard. Same seats as every map; the airlock still sends someone home when you dismiss them.',
  herald: {
    x: 3.2,
    z: -23.2,
    rotY: -0.35,
    name: 'Steward',
    says: 'Speak to me to bring a language fellow aboard',
    ask: 'What’s their scene, Captain?',
    button: 'Invite fellow 🎓',
  },
  boards: {
    issues: { ...STATION.boards!.issues, label: '📡 Incoming scenes' },
    queue: { ...STATION.boards!.queue, label: '📋 Mission queue' },
    pulls: { ...STATION.boards!.pulls, label: '📚 Deck library' },
    services: { ...STATION.boards!.services, label: '🌐 Subsystems' },
  },
};
