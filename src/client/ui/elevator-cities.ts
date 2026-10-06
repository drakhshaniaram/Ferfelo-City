import { CITY_CATALOG, CITY_IDS, cityOf, type CityId } from '../../shared/cities';
import type { Net } from '../net';
import { store } from '../state';
import { applyCityFloorLanguage } from '../features/fellows/city-language';
import { h } from './dom';

type AddedMsg = { t: 'floor.added'; repo: string; floor?: string; error?: string };

const OPEN_MS = 12_000;

/** Academy elevator panel: curated cities with language + wall themes. */
export function mountCityAdd(opts: {
  net: Net;
  root: HTMLElement;
  ride(floorId: string): void;
  close(): void;
  waitAdded(fn: (msg: AddedMsg) => boolean): () => void;
}): () => void {
  const { net, root, ride, close, waitAdded } = opts;
  let adding: CityId | null = null;
  let error = '';
  let openTimer: number | undefined;

  const finish = (cityId: CityId, floorId?: string, why?: string) => {
    clearTimeout(openTimer);
    adding = null;
    if (why) {
      error = why;
      paint();
      return;
    }
    applyCityFloorLanguage(cityId);
    if (floorId) {
      close();
      ride(floorId);
      return;
    }
    paint();
  };

  const paint = () => {
    const have = new Set(store.floors.map((f) => f.cityId).filter(Boolean));
    const rows = CITY_IDS.map((id) => {
      const c = CITY_CATALOG[id];
      const on = have.has(id);
      const btn = h(
        'button.floor-btn',
        { type: 'button', disabled: on || !!adding, title: on ? `${c.name} is already a floor` : `Add ${c.name} — practice ${c.targetLanguage}` },
        h('span.floor-no', {}, c.icon),
        h('span.floor-text', {}, h('span.floor-name', {}, c.name, on ? h('span.here-tag', {}, 'already here') : null), h('span.floor-sub', {}, `${c.blurb}`)),
      );
      btn.addEventListener('click', () => {
        if (on || adding) return;
        adding = id;
        error = '';
        paint();
        net.send({ t: 'floor.addCity', city: id });
        clearTimeout(openTimer);
        openTimer = window.setTimeout(() => {
          if (adding !== id) return;
          const floor = store.floors.find((f) => f.cityId === id);
          if (floor) finish(id, floor.id);
          else finish(id, undefined, `Couldn't open ${c.name} — restart the office so it knows about city floors, then try again`);
        }, OPEN_MS);
      });
      return btn;
    });
    const kids: (HTMLElement | string)[] = [
      h('h3', {}, '🌆 Add a city'),
      h('p.note', {}, 'Each city gets its own cartoon look — walls, floor pattern, and wall props (canal houses, harbor brick, café awnings…). Fellows there speak that language by default.'),
      h('div.floors', {}, ...rows),
    ];
    if (error) kids.push(h('p.err', {}, error));
    if (adding) kids.push(h('p.note.busy', {}, `⏳ Opening ${cityOf(adding)?.name ?? adding}…`));
    root.replaceChildren(...kids);
  };

  const offAdded = waitAdded((msg) => {
    if (!adding || msg.repo !== adding) return false;
    finish(adding, msg.error ? undefined : msg.floor, msg.error);
    return true;
  });
  // floors broadcast often arrives before floor.added; finish as soon as the city is listed.
  const offFloors = store.on('floors', () => {
    if (adding) {
      const floor = store.floors.find((f) => f.cityId === adding);
      if (floor) {
        finish(adding, floor.id);
        return;
      }
    }
    paint();
  });
  paint();
  return () => {
    clearTimeout(openTimer);
    offAdded();
    offFloors();
  };
}
