import { FELLOW_CATALOG, isFellowId, type FellowId } from '../../shared/fellows.js';
import type { WorkerKind } from '../../shared/protocol.js';

export type { FellowId };

/** Why a fellow hire is refused, or undefined when it's fine. */
export function fellowSpawnError(
  fellowId: FellowId | undefined,
  opts: { station?: unknown; meeting?: unknown; kind: WorkerKind; worktree: boolean; repos: number },
): string | undefined {
  if (fellowId === undefined) return undefined;
  if (!isFellowId(fellowId)) return 'Unknown language fellow';
  if (opts.station || opts.meeting || opts.kind !== 'agent' || opts.worktree || opts.repos) {
    return 'A language fellow sits at a desk as an agent, without a worktree';
  }
  return undefined;
}

/** Catalog name and color for a fellow hire. */
export function fellowLook(fellowId: FellowId | undefined): { name: string; color: string } | undefined {
  return fellowId && isFellowId(fellowId) ? { name: FELLOW_CATALOG[fellowId].name, color: FELLOW_CATALOG[fellowId].color } : undefined;
}
