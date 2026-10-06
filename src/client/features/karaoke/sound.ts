import type { AudioCore } from '../../sound/core';
import { rand } from '../../sound/dsp';

/** Short mic-on tap when someone takes the karaoke stage. */
export function karaokeMic(a: AudioCore) {
  a.unlock();
  const ctx = a.ctx;
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();
  a.count('karaoke.mic');
  const t0 = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(660 + rand(0, 40), t0);
  o.frequency.exponentialRampToValueAtTime(220, t0 + 0.12);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.08, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
  o.connect(g);
  g.connect(a.ambience);
  o.start(t0);
  o.stop(t0 + 0.2);
}
