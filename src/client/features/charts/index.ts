/**
 * Rooftop Top-30 board: curated packs for the office sky city (see shared/charts.ts).
 * On a city floor, prefers that floor's city over the building sky place.
 */
import { chartPackForCity } from '../../../shared/charts';
import { cityOf } from '../../../shared/cities';
import { DJ_BOOTH, STAGE } from '../../../shared/layout';
import type { Ctx } from '../../core/context';
import { aside, hintTitle, key, onE } from '../../core/hint';
import { store } from '../../state';
import { toast } from '../../ui/dom';
import type { Rooftop } from '../rooftop/world';
import { openCharts } from './ui';

declare module '../../world/types' {
  interface InteractKinds {
    charts: true;
  }
}

export interface ChartsDeps {
  onReady(fn: (r: Rooftop) => void): void;
}

function chartsCity(): string | undefined {
  return cityOf(store.floors.find((f) => f.id === store.floor)?.cityId)?.skyCity ?? store.sky?.city;
}

export function installCharts(ctx: Ctx, deps: ChartsDeps) {
  function show() {
    ctx.sound.chartsOpen();
    const raw = chartsCity();
    const city = raw?.trim() || 'your sky city (set Outside in Settings)';
    const pack = chartPackForCity(raw);
    openCharts({
      pack,
      cityLabel: city,
      onPlay: (t) => {
        if (t.play?.track) ctx.net.send({ t: 'jukebox.play', track: t.play.track });
        else if (t.play?.url) ctx.net.send({ t: 'jukebox.play', url: t.play.url });
        else toast(`♪ ${t.title} — ${t.artist}. No in-office stream for this one.`, 'info');
      },
    });
  }

  ctx.interactions.define('charts', {
    reach: 4,
    hint: () => {
      const pack = chartPackForCity(chartsCity());
      return { k: pack.label, parts: [hintTitle('📻 Top 30 near you'), aside(pack.label), key('E', 'Open the charts')] };
    },
    use: onE(() => show()),
  });

  deps.onReady((r) => {
    r.interactables.push({ kind: 'charts', x: DJ_BOOTH.x + 1.8, z: STAGE.maxZ + 0.2, radius: 1.4 });
  });

  return { show };
}
