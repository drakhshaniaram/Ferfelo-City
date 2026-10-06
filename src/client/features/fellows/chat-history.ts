/** In-browser chat threads for language fellows — survives closing the modal. */

export type FellowChatRole = 'you' | 'fellow' | 'note';

export interface FellowChatBubble {
  role: FellowChatRole;
  text: string;
}

const MAX_BUBBLES = 100;
const byWorker = new Map<string, FellowChatBubble[]>();

export function loadFellowChatHistory(workerId: string): FellowChatBubble[] | undefined {
  const saved = byWorker.get(workerId);
  return saved ? saved.map((b) => ({ ...b })) : undefined;
}

/** Persist a thread (drops live/empty fellow stubs). */
export function saveFellowChatHistory(workerId: string, bubbles: readonly { role: FellowChatRole; text: string; live?: boolean }[]) {
  const next: FellowChatBubble[] = [];
  for (const b of bubbles) {
    if (b.live && !b.text.trim()) continue;
    const text = b.text.trim();
    if (!text) continue;
    next.push({ role: b.role, text: b.text });
  }
  if (!next.length) {
    byWorker.delete(workerId);
    return;
  }
  byWorker.set(workerId, next.slice(-MAX_BUBBLES));
}

export function clearFellowChatHistory(workerId: string) {
  byWorker.delete(workerId);
}

/** Drop threads for workers that left the floor. */
export function pruneFellowChatHistories(liveIds: Iterable<string>) {
  const live = new Set(liveIds);
  for (const id of byWorker.keys()) {
    if (!live.has(id)) byWorker.delete(id);
  }
}
