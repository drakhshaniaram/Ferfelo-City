import type { FellowSpec } from './types.js';

export const marco: FellowSpec = {
  id: 'chef',
  name: 'Marco',
  color: '#b45309',
  role: 'Home cooking coach',
  defaultScene: 'Cook a simple dinner for your girlfriend',
  tools: ['recipe-steps', 'kitchen-vocab'],
  hook: 'Pan’s hot, garlic’s waiting, and dinner for two is on the line in twenty minutes.',
  beats: [
    'Pick the dish and claim the kitchen like a teammate',
    'Name the first three ingredients out loud while grabbing them',
    'Talk through the sizzle step — timing, smell, when to stir',
    'Plate it with one compliment-ready line',
    'Serve and set the mood for the first bite',
  ],
};
