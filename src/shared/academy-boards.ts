/** Academy names for the wall boards and the agents who stand by them (coding mode keeps GitHub names). */
import type { StationKind } from './layout.js';
import { STATION_AGENT } from './layout.js';
import type { OfficeMode } from './mode.js';
import { isAcademyMode } from './mode.js';

export type BoardKey = 'issues' | 'pulls' | 'queue' | 'services';

export type StationInfo = { icon: string; offer: string; does: string; example: string };

export const ACADEMY_BOARD_LABELS: Record<BoardKey, string> = {
  issues: '🎭 Scenes',
  queue: '📋 Practice queue',
  pulls: '💬 Phrase wall',
  services: '🌐 Services',
};

export const CODING_BOARD_LABELS: Record<BoardKey, string> = {
  issues: 'Issues',
  queue: '📋 Task queue',
  pulls: 'Pull Requests',
  services: '🌐 Services',
};

export const ACADEMY_STATION_AGENT: Record<StationKind, { name: string; color: string }> = {
  issues: { name: 'Scenes guide', color: '#ef476f' },
  pulls: { name: 'Phrase coach', color: '#118ab2' },
  queue: { name: 'Practice guide', color: '#06d6a0' },
};

export const ACADEMY_STATION_INFO: Record<StationKind, StationInfo> = {
  issues: {
    icon: '🎭',
    offer: 'Ask me about scenes',
    does: 'I suggest practice scenes, pair you with a fellow, and keep the story moving',
    example: 'Suggest a rainy-day scene in this city for a newbie',
  },
  pulls: {
    icon: '💬',
    offer: 'Ask me about phrases',
    does: 'I hand you lines to try, explain them, and coach short exchanges',
    example: 'Give me three café phrases to try with a fellow',
  },
  queue: {
    icon: '📋',
    offer: 'Ask me to plan practice',
    does: 'I queue practice beats and help you pick what to do next',
    example: 'Queue a short practice loop: greet, order, pay',
  },
};

export const CODING_STATION_INFO: Record<StationKind, StationInfo> = {
  issues: { icon: '📌', offer: 'Ask me about issues', does: 'I file, find, triage, label and close them', example: 'File an issue: the dog walks straight through the jukebox' },
  pulls: { icon: '🔀', offer: 'Ask me about PRs', does: 'I sum up, review, comment on and merge them', example: 'Review the newest PR and tell me if it’s ready to merge' },
  queue: { icon: '📋', offer: 'Ask me to queue work', does: 'I turn it into tasks for fresh workers', example: 'Queue every open bug issue, most important first' },
};

export const ACADEMY_KIOSK_SIGN: Record<StationKind, string> = {
  issues: '🎭 Scenes',
  pulls: '💬 Phrases',
  queue: '📋 Practice',
};

export const CODING_KIOSK_SIGN: Record<StationKind, string> = {
  issues: '📌 Ask me',
  pulls: '🔀 Ask me',
  queue: '📋 Ask me',
};

const ACADEMY_BOARD: Record<StationKind, string> = {
  issues: 'the 🎭 Scenes board',
  pulls: 'the 💬 Phrase wall',
  queue: 'the 📋 Practice queue',
};

const ACADEMY_JOB: Record<StationKind, string> = {
  issues: `You help learners pick and start practice scenes for this city floor. Suggest scenes that fit their level, name a fellow who fits, and keep the story moving. You don't edit code or use the GitHub CLI unless they clearly ask for staff/coding help.`,
  pulls: `You coach short phrases and lines to try aloud with a fellow. Give a few options, explain meaning briefly in their native language when they ask, and keep turns short. You don't edit code or use the GitHub CLI unless they clearly ask for staff/coding help.`,
  queue: `You help plan practice: queue a short loop of beats (greet, order, pay…), suggest what to try next, and keep the learner moving. You don't edit code or use the GitHub CLI unless they clearly ask for staff/coding help.`,
};

export function boardLabelsFor(mode: OfficeMode | string | undefined): Record<BoardKey, string> {
  return isAcademyMode(mode as OfficeMode) ? ACADEMY_BOARD_LABELS : CODING_BOARD_LABELS;
}

export function stationAgentFor(mode: OfficeMode | string | undefined, kind: StationKind) {
  return isAcademyMode(mode as OfficeMode) ? ACADEMY_STATION_AGENT[kind] : STATION_AGENT[kind];
}

export function stationInfoFor(mode: OfficeMode | string | undefined, kind: StationKind): StationInfo {
  return isAcademyMode(mode as OfficeMode) ? ACADEMY_STATION_INFO[kind] : CODING_STATION_INFO[kind];
}

export function kioskSignFor(mode: OfficeMode | string | undefined, kind: StationKind) {
  return isAcademyMode(mode as OfficeMode) ? ACADEMY_KIOSK_SIGN[kind] : CODING_KIOSK_SIGN[kind];
}

/** First-prompt brief for an Academy board guide (coding mode keeps the editable GitHub briefs). */
export function academyStationBrief(kind: StationKind): string {
  return [
    `You're the ${ACADEMY_STATION_AGENT[kind].name} in Ferfelo Academy, a shared 3D language campus. You stand at a kiosk by ${ACADEMY_BOARD[kind]}, and whoever walks up types you a request. The first one is at the end of this message.`,
    ACADEMY_JOB[kind],
    `Answer in a few short lines. Then wait: the next request may come from someone else.`,
    `The request:`,
  ].join('\n\n');
}
