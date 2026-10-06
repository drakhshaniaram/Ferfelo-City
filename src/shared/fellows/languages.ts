import type { LearnerProfile } from './types.js';
import { isLearnerLevel } from './levels.js';

/** Languages offered for native or target — same list on both sides. */
export const LEARNER_LANGUAGES = [
  'English',
  'Persian',
  'Central Kurdish (Sorani)',
  'German',
  'French',
  'Dutch',
  'Spanish',
  'Arabic',
  'Turkish',
  'Italian',
  'Portuguese',
  'Russian',
  'Hindi',
  'Korean',
  'Japanese',
  'Chinese (Mandarin)',
  'Polish',
  'Swedish',
  'Greek',
  'Hebrew',
] as const;

export type LearnerLanguage = (typeof LEARNER_LANGUAGES)[number];

const LANGUAGE_ALIASES: Record<string, LearnerLanguage> = {
  en: 'English',
  english: 'English',
  fa: 'Persian',
  farsi: 'Persian',
  persian: 'Persian',
  فارسی: 'Persian',
  ckb: 'Central Kurdish (Sorani)',
  sorani: 'Central Kurdish (Sorani)',
  'central kurdish': 'Central Kurdish (Sorani)',
  'central kurdish (sorani)': 'Central Kurdish (Sorani)',
  کوردی: 'Central Kurdish (Sorani)',
  de: 'German',
  german: 'German',
  deutsch: 'German',
  fr: 'French',
  french: 'French',
  français: 'French',
  francais: 'French',
  nl: 'Dutch',
  dutch: 'Dutch',
  nederlands: 'Dutch',
  es: 'Spanish',
  spanish: 'Spanish',
  español: 'Spanish',
  espanol: 'Spanish',
  ar: 'Arabic',
  arabic: 'Arabic',
  العربية: 'Arabic',
  tr: 'Turkish',
  turkish: 'Turkish',
  it: 'Italian',
  italian: 'Italian',
  pt: 'Portuguese',
  portuguese: 'Portuguese',
  ru: 'Russian',
  russian: 'Russian',
  hi: 'Hindi',
  hindi: 'Hindi',
  ko: 'Korean',
  korean: 'Korean',
  ja: 'Japanese',
  japanese: 'Japanese',
  zh: 'Chinese (Mandarin)',
  chinese: 'Chinese (Mandarin)',
  mandarin: 'Chinese (Mandarin)',
  'chinese (mandarin)': 'Chinese (Mandarin)',
  pl: 'Polish',
  polish: 'Polish',
  sv: 'Swedish',
  swedish: 'Swedish',
  el: 'Greek',
  greek: 'Greek',
  he: 'Hebrew',
  hebrew: 'Hebrew',
};

export const DEFAULT_LEARNER: LearnerProfile = {
  nativeLanguage: 'English',
  targetLanguage: 'German',
  level: 'newbie',
};

export function isLearnerLanguage(value: unknown): value is LearnerLanguage {
  return typeof value === 'string' && (LEARNER_LANGUAGES as readonly string[]).includes(value);
}

/** Languages that read right-to-left in the academy UI. */
export function isRtlLanguage(language: string): boolean {
  return (
    language === 'Persian' ||
    language === 'Central Kurdish (Sorani)' ||
    language === 'Arabic' ||
    language === 'Hebrew'
  );
}

/** Map free text / old saves onto a catalog label when we recognize it. */
export function resolveLearnerLanguage(raw: string | undefined | null, fallback: LearnerLanguage): LearnerLanguage {
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim().slice(0, 40);
  if (!trimmed) return fallback;
  if (isLearnerLanguage(trimmed)) return trimmed;
  const alias = LANGUAGE_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;
  const hit = LEARNER_LANGUAGES.find((l) => l.toLowerCase() === trimmed.toLowerCase());
  return hit ?? fallback;
}

export function sanitizeLearner(raw: Partial<LearnerProfile> | null | undefined): LearnerProfile {
  const native = resolveLearnerLanguage(raw?.nativeLanguage, DEFAULT_LEARNER.nativeLanguage as LearnerLanguage);
  const target = resolveLearnerLanguage(raw?.targetLanguage, DEFAULT_LEARNER.targetLanguage as LearnerLanguage);
  const level = isLearnerLevel(raw?.level) ? raw.level : DEFAULT_LEARNER.level;
  return { nativeLanguage: native, targetLanguage: target, level };
}
