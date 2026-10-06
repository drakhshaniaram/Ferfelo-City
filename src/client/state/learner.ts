// Learner profile for language fellows: native/target language and scaffolding level.
// Kept in this browser (like settings), sent with each fellow hire as part of the brief.

import { DEFAULT_LEARNER, sanitizeLearner, type LearnerProfile } from '../../shared/fellows';

const KEY = 'ferfelo.learner';

export function loadLearner(): LearnerProfile {
  try {
    return sanitizeLearner(JSON.parse(localStorage.getItem(KEY) ?? 'null'));
  } catch {
    return { ...DEFAULT_LEARNER };
  }
}

export function saveLearner(profile: LearnerProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sanitizeLearner(profile)));
  } catch {
    // storage blocked
  }
}
