// Language fellows: cultural-context companions that help a newbie experience life in a target
// language. Hired at desks instead of coding workers; each has a scene, scaffolding by learner
// level, and a brief the agent is told on launch.

export type FellowId = 'oktoberfest' | 'chef' | 'checkin' | 'amsterdam' | 'biology' | 'news' | 'youtube';

export type LearnerLevel = 'newbie' | 'growing' | 'immersed';

export interface FellowSpec {
  id: FellowId;
  name: string;
  color: string;
  role: string;
  defaultScene: string;
  /** Scene tools this fellow may use (product stubs for now; the brief names them). */
  tools: string[];
}

export interface LearnerProfile {
  nativeLanguage: string;
  targetLanguage: string;
  level: LearnerLevel;
}

export interface LevelScaffolding {
  label: string;
  targetShare: number;
  nativeShare: number;
  scaffolding: string;
}

export const FELLOW_CATALOG: Record<FellowId, FellowSpec> = {
  oktoberfest: {
    id: 'oktoberfest',
    name: 'Lena',
    color: '#c2410c',
    role: 'Oktoberfest / Hamburg celebration guide',
    defaultScene: 'Celebrate Oktoberfest-style in Hamburg with locals',
    tools: ['local-tips', 'phrase-cards'],
  },
  chef: {
    id: 'chef',
    name: 'Marco',
    color: '#b45309',
    role: 'Home cooking coach',
    defaultScene: 'Cook a simple dinner for your girlfriend',
    tools: ['recipe-steps', 'kitchen-vocab'],
  },
  checkin: {
    id: 'checkin',
    name: 'Sofia',
    color: '#7c3aed',
    role: 'Talk partner (emotional check-in — not clinical therapy)',
    defaultScene: 'Gentle check-in about how moving feels',
    tools: ['feeling-words'],
  },
  amsterdam: {
    id: 'amsterdam',
    name: 'Joost',
    color: '#0369a1',
    role: 'Rainy-day Amsterdam itinerary guide',
    defaultScene: 'Plan a rainy afternoon in Amsterdam',
    tools: ['tripadvisor-stub', 'transit-hints'],
  },
  biology: {
    id: 'biology',
    name: 'Dr. Park',
    color: '#15803d',
    role: 'Curious science explainer',
    defaultScene: 'Understand what Cola Zero does in the body',
    tools: ['simple-diagram'],
  },
  news: {
    id: 'news',
    name: 'Alex',
    color: '#1d4ed8',
    role: 'US news hangout pal',
    defaultScene: 'Skim cool US news together in the target language',
    tools: ['headline-digest'],
  },
  youtube: {
    id: 'youtube',
    name: 'Maya',
    color: '#be123c',
    role: 'YouTube shadowing coach',
    defaultScene: 'Shadow a short clip on the screen',
    tools: ['youtube-stub', 'shadow-loop'],
  },
};

export const FELLOW_IDS = Object.keys(FELLOW_CATALOG) as FellowId[];

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

export function isFellowId(value: unknown): value is FellowId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(FELLOW_CATALOG, value);
}

export function isLearnerLevel(value: unknown): value is LearnerLevel {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(LEVELS, value);
}

export function isLearnerLanguage(value: unknown): value is LearnerLanguage {
  return typeof value === 'string' && (LEARNER_LANGUAGES as readonly string[]).includes(value);
}

/** Map free text / old saves onto a catalog label when we recognize it. */
export function resolveLearnerLanguage(raw: string | undefined | null, fallback: LearnerLanguage): LearnerLanguage {
  if (typeof raw !== 'string') return fallback;
  const trimmed = raw.trim().slice(0, 40);
  if (!trimmed) return fallback;
  if (isLearnerLanguage(trimmed)) return trimmed;
  const alias = LANGUAGE_ALIASES[trimmed.toLowerCase()];
  if (alias) return alias;
  // Exact catalog match ignoring case
  const hit = LEARNER_LANGUAGES.find((l) => l.toLowerCase() === trimmed.toLowerCase());
  return hit ?? fallback;
}

export function sanitizeLearner(raw: Partial<LearnerProfile> | null | undefined): LearnerProfile {
  const native = resolveLearnerLanguage(raw?.nativeLanguage, DEFAULT_LEARNER.nativeLanguage as LearnerLanguage);
  const target = resolveLearnerLanguage(raw?.targetLanguage, DEFAULT_LEARNER.targetLanguage as LearnerLanguage);
  const level = isLearnerLevel(raw?.level) ? raw.level : DEFAULT_LEARNER.level;
  return { nativeLanguage: native, targetLanguage: target, level };
}

/** Brief told to the agent when a fellow is hired (first launch message). */
export function fellowBrief(fellowId: FellowId, learner: LearnerProfile, sceneNote?: string): string {
  const fellow = FELLOW_CATALOG[fellowId];
  const level = LEVELS[learner.level];
  const scene = sceneNote?.trim() || fellow.defaultScene;
  const native = learner.nativeLanguage;
  const target = learner.targetLanguage;
  const targetPct = Math.round(level.targetShare * 100);
  const nativePct = Math.round(level.nativeShare * 100);
  const rtlNative = native === 'Persian' || native === 'Central Kurdish (Sorani)' || native === 'Arabic' || native === 'Hebrew';
  return [
    `You are ${fellow.name}, a language fellow in Ferfelo Academy — a lively 3D learning space, not a coding office.`,
    `Your role: ${fellow.role}.`,
    `The learner’s native language is ${native}. Their target language is ${target}. Level: ${level.label}.`,
    `Language mix for this level: about ${targetPct}% ${target} and ${nativePct}% ${native}. ${level.scaffolding}`,
    `Hard language rules — follow every turn:
- Stage directions, soft tips, explanations, and scaffolding MUST be written in ${native} only. Do not use English or German for tips unless that language is ${native}.
- Spoken practice lines the learner should hear or try MUST be in ${target}, inside „…“ (or "…" / ‚…‘).
- Never default to English scaffolding when native is ${native}. Never invent a third teaching language.
- The practice language is ${target} even if this fellow’s cultural setting is another country.
${rtlNative ? `- Write ${native} scaffolding in its usual script (e.g. فارسی / سۆرانی), not Latin transliteration, unless the learner asks.` : ''}`.trim(),
    `Today’s scene: ${scene}.`,
    `Stay in character as a warm cultural guide. Teach through the scene — phrases, customs, small decisions — not through abstract grammar lectures unless asked.`,
    `You are not a clinician. If the scene is emotional (check-in), stay supportive and non-clinical; suggest real help if they need it.`,
    `Tools you may lean on when helpful (describe them in chat; the academy may wire real UI later): ${fellow.tools.join(', ')}.`,
    `Keep turns short. Invite the learner to try saying something in ${target}. Celebrate attempts. Correct gently.`,
    `Format every reply for the academy chat UI in exactly two layers (keep markers on one line each; do not wrap mid-marker):
1. Stage / thinking / scaffolding in ${native}: ((one short beat)).
2. Spoken lines in ${target}: „like this“ (English "quotes" or ‚single‘ ok). A brief ((aside in ${native})) may sit inside a spoken line.
Example shape for THIS learner — invent real wording in ${native} / ${target}; do not copy German or English from any template unless those are their languages:
((short stage beat in ${native}))
„one short phrase in ${target}“
((soft tip in ${native} inviting them to try that ${target} phrase))`,
    `Open the scene now: greet them as ${fellow.name} and start “${scene}”.`,
  ].join('\n\n');
}
