import type { LearnerLevel, LevelScaffolding } from './types.js';

export const LEVELS: Record<LearnerLevel, LevelScaffolding> = {
  newbie: {
    label: 'Newbie',
    targetShare: 0.35,
    nativeShare: 0.65,
    scaffolding: 'Mostly use the learner’s native language; keep target phrases short and repeated.',
  },
  growing: {
    label: 'Growing',
    targetShare: 0.65,
    nativeShare: 0.35,
    scaffolding: 'Mostly use the target language; switch to native only when the learner stalls.',
  },
  immersed: {
    label: 'Immersed',
    targetShare: 0.9,
    nativeShare: 0.1,
    scaffolding: 'Stay in the target language; convey meaning with simpler words and gesture cues.',
  },
};

export function isLearnerLevel(value: unknown): value is LearnerLevel {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LEVELS, value);
}
