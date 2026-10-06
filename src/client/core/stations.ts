/** The board agents: what each is for, and the ones waiting by their boards before anyone has asked them anything. */
import { stationAgentFor, stationInfoFor, type StationInfo } from '../../shared/academy-boards';
import type { StationKind } from '../../shared/layout';
import type { OfficeMode } from '../../shared/mode';
import { Worker } from '../world/character';
import type { DeskView } from '../world/types';
import type { World } from '../world/world';
import { noOutline } from './outline';
import { store } from '../state';

/** What each board agent is for (coding defaults; Academy overrides via stationInfoFor). */
export const STATION_INFO: Record<StationKind, StationInfo> = {
  issues: { icon: '📌', offer: 'Ask me about issues', does: 'I file, find, triage, label and close them', example: 'File an issue: the dog walks straight through the jukebox' },
  pulls: { icon: '🔀', offer: 'Ask me about PRs', does: 'I sum up, review, comment on and merge them', example: 'Review the newest PR and tell me if it’s ready to merge' },
  queue: { icon: '📋', offer: 'Ask me to queue work', does: 'I turn it into tasks for fresh workers', example: 'Queue every open bug issue, most important first' },
};

/** A board agent waiting by its board before anyone has asked it anything (see buildKiosk), and where. */
export interface IdleAgent {
  model: Worker;
  view: DeskView;
}

/** The board agents waiting by their boards in `w`. */
export function idleAgentsIn(w: World): IdleAgent[] {
  return w.plan.stations.map((def) => {
    const kind = def.station!;
    const agent = stationAgentFor(store.mode, kind);
    const info = stationInfoFor(store.mode, kind);
    const model = new Worker(agent.name, agent.color);
    model.setStatus('idle', false);
    model.setTask({ name: info.offer, summary: info.does });
    model.setOutfit(w.plan.agents.outfit === 'peasant' ? 'peasant' : null);
    const view = w.desks.get(def.id)!;
    view.vacancy.children[0].add(model.root);
    noOutline(model.root);
    return { model, view };
  });
}

/** Rename idle board agents when the office switches Academy ↔ coding. */
export function skinIdleAgents(idle: IdleAgent[], mode: OfficeMode | string | undefined) {
  for (const a of idle) {
    const kind = a.view.def.station;
    if (!kind) continue;
    const agent = stationAgentFor(mode, kind);
    const info = stationInfoFor(mode, kind);
    a.model.setName(agent.name);
    a.model.setTask({ name: info.offer, summary: info.does });
  }
}
