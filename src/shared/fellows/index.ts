// Language fellows: cultural-context companions for Ferfelo Academy.
// Add a new definition as its own file and one line in catalog.ts.

export type { FellowId, FellowSpec, LearnerLevel, LearnerProfile, LevelScaffolding } from './types.js';
export { FELLOW_CATALOG, FELLOW_IDS, isFellowId } from './catalog.js';
export { LEVELS, isLearnerLevel } from './levels.js';
export {
  DEFAULT_LEARNER,
  LEARNER_LANGUAGES,
  isLearnerLanguage,
  isRtlLanguage,
  resolveLearnerLanguage,
  sanitizeLearner,
  type LearnerLanguage,
} from './languages.js';
export { fellowBrief } from './brief.js';
