// Language fellow types: catalog entries and learner profile.

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
  /** Optional spoken-style hints for briefs / TTS later. */
  voiceHints?: string[];
  /** Optional locale / dialect bias for scene copy. */
  localeBias?: string;
  /** Sensory / social hook that pulls the learner into the scene on turn one. */
  hook: string;
  /** Ordered micro-beats for a lively session (agent picks the next open one). */
  beats: readonly string[];
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
