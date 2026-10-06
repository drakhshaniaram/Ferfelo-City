/**
 * Rooftop karaoke stage: guided sing-along sheet (activity-lite modal).
 */
import { STAGE } from '../../../shared/layout';
import type { Ctx } from '../../core/context';
import { aside, hintTitle, key, onE } from '../../core/hint';
import type { Rooftop } from '../rooftop/world';
import { openKaraoke } from './ui';

declare module '../../world/types' {
  interface InteractKinds {
    karaoke: true;
  }
}

export interface KaraokeDeps {
  onReady(fn: (r: Rooftop) => void): void;
}

export function installKaraoke(ctx: Ctx, deps: KaraokeDeps) {
  function show() {
    ctx.sound.karaokeMic();
    openKaraoke();
  }

  ctx.interactions.define('karaoke', {
    reach: 5,
    hint: () => ({ k: 'karaoke', parts: [hintTitle('🎤 Karaoke stage'), aside('guided sing-along'), key('E', 'Take the mic')] }),
    use: onE(() => show()),
  });

  deps.onReady((r) => {
    r.interactables.push({
      kind: 'karaoke',
      x: STAGE.minX + (STAGE.maxX - STAGE.minX) / 2,
      z: (STAGE.minZ + STAGE.maxZ) / 2,
      radius: 2.2,
    });
  });

  return { show };
}
