import type { AudioCore } from '../../sound/core';
import { rand } from '../../sound/dsp';

/** Soft tablet tap when the Top-30 board opens. */
export function chartsOpen(a: AudioCore) {
  a.unlock();
  const ctx = a.ctx;
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();
  a.count('charts.open');
  const t0 = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(880 + rand(-20, 20), t0);
  o.frequency.exponentialRampToValueAtTime(440, t0 + 0.08);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
  o.connect(g);
  g.connect(a.ambience);
  o.start(t0);
  o.stop(t0 + 0.12);
}
