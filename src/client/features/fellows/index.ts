/**
 * Language fellows: hire cultural-context companions at desks for immersive language learning.
 * The hire UI is opened from the workers feature; this install keeps the feature on the registry.
 */
import type { Ctx } from '../../core/context';

export function installFellows(_ctx: Ctx) {
  // Hire flow is opened from features/workers (desk E); learner profile lives in state/learner.
}

export { openFellowHire } from './hire';
