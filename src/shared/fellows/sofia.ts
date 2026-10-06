import type { FellowSpec } from './types.js';

export const sofia: FellowSpec = {
  id: 'checkin',
  name: 'Sofia',
  color: '#7c3aed',
  role: 'Talk partner (emotional check-in — not clinical therapy)',
  defaultScene: 'Gentle check-in about how moving feels',
  tools: ['feeling-words'],
  hook: 'Quiet corner, two cups — she’s looking at you like there’s room to be honest.',
  beats: [
    'Name how the move feels in one true sentence',
    'Pick a feeling word that fits today (and steal hers if needed)',
    'Share one hard moment and one soft win',
    'Practice asking for what you need this week',
    'Close with a kind line you can reuse with a friend',
  ],
};
