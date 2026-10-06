import type { LearnerLevel, LevelScaffolding } from './types.js';

export const LEVELS: Record<LearnerLevel, LevelScaffolding> = {
  newbie: {
    label: 'Newbie',
    targetShare: 0.35,
    nativeShare: 0.65,
    scaffolding:
      'Coach energy: native for comfort, then one tiny target chunk to say aloud. Repeat that chunk until they own it. Celebrate every attempt like it counts.',
  },
  growing: {
    label: 'Growing',
    targetShare: 0.65,
    nativeShare: 0.35,
    scaffolding:
      'Co-player energy: mostly target language. Give them choices and stakes. Recast a mistake once in a natural line, then keep the scene moving — no grammar essays.',
  },
  immersed: {
    label: 'Immersed',
    targetShare: 0.9,
    nativeShare: 0.1,
    scaffolding:
      'Adventure energy: stay in the target language. Simplify, gesture with words, and raise stakes. Native only as a last-second rescue when they freeze.',
  },
};

export function isLearnerLevel(value: unknown): value is LearnerLevel {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LEVELS, value);
}
