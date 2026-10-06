/**
 * Language fellows: hire cultural-context companions at desks for immersive language learning.
 * The hire UI is opened from the workers feature; this install keeps the feature on the registry.
 */
import type { Ctx } from '../../core/context';
import { routeFellowChatMessage } from './chat';

export function installFellows(ctx: Ctx) {
  ctx.messages.onAny(routeFellowChatMessage);
}

export { openFellowHire } from './hire';
export { openFellowChat, routeFellowChatMessage } from './chat';
