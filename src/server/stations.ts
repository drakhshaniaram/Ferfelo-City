// What the board agents are told when they're hired: the agents standing by the Issues board, the PR
// board and the task queue (STATIONS in shared/layout.ts). Whoever walks up types them a request; the
// first one follows this brief in the same prompt. The briefs themselves are prompts the office can
// rewrite in ⚙️ Settings (shared/prompts.ts). Academy mode uses learning guides instead of GitHub briefs.

import { academyStationBrief } from '../shared/academy-boards.js';
import type { StationKind } from '../shared/layout.js';
import { isAcademyMode, type OfficeMode } from '../shared/mode.js';
import { officePrompt, type PromptSource } from './prompts.js';

export function stationBrief(kind: StationKind, prompts?: PromptSource, mode: OfficeMode = 'coding'): string {
  if (isAcademyMode(mode)) return academyStationBrief(kind);
  return officePrompt(prompts, `station.${kind}`);
}

/** Claude Code tools the queue agent is launched without, so it can't edit the checkout even by mistake. */
export const QUEUE_AGENT_DISALLOWED_TOOLS = ['Edit', 'Write', 'NotebookEdit'];
