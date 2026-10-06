import type { FellowSpec } from './types.js';

export const maya: FellowSpec = {
  id: 'youtube',
  name: 'Maya',
  color: '#be123c',
  role: 'YouTube shadowing coach',
  defaultScene: 'Shadow a short clip on the screen',
  tools: ['youtube-stub', 'shadow-loop'],
  hook: 'Clip’s paused on a juicy line — headphones on, you’ve got three listens to nail the rhythm.',
  beats: [
    'Listen once for the vibe, then steal the first short chunk',
    'Shadow the line with her — timing over perfection',
    'Slow it, then speed it: same chunk, cleaner mouth',
    'Swap roles: you lead, she echoes',
    'Drop the line into a tiny improvised reply',
  ],
};
