/** Pending scene from the Scenes board → fellow hire. */
import type { FellowId } from '../../shared/fellows';

const KEY = 'ferfelo.pendingScene';

export interface PendingScene {
  sceneNote: string;
  fellowId?: FellowId;
  title?: string;
}

export function setPendingScene(p: PendingScene) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    //
  }
}

export function peekPendingScene(): PendingScene | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as PendingScene;
    if (typeof o?.sceneNote !== 'string' || !o.sceneNote.trim()) return null;
    return o;
  } catch {
    return null;
  }
}

export function clearPendingScene() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    //
  }
}
