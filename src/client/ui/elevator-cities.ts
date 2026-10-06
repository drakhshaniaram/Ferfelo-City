import { CITY_CATALOG, CITY_IDS, cityOf, type CityId } from '../../shared/cities';
import type { Net } from '../net';
import { store } from '../state';
import { applyCityFloorLanguage } from '../features/fellows/city-language';
import { h } from './dom';

type AddedMsg = { t: 'floor.added'; repo: string; floor?: string; error?: string };

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
      });
      return btn;
    });
    const kids: (HTMLElement | string)[] = [
      h('h3', {}, '🌆 Add a city'),
      h('p.note', {}, 'City floors hang themed pictures from the web and set the practice language (Amsterdam → Dutch, Hamburg → German). Fellows on that floor speak it by default.'),
      h('div.floors', {}, ...rows),
    ];
    if (error) kids.push(h('p.err', {}, error));
    if (adding) kids.push(h('p.note.busy', {}, `⏳ Opening ${cityOf(adding)?.name ?? adding}…`));
    root.replaceChildren(...kids);
  };

  const offAdded = waitAdded((msg) => {
    if (!adding || msg.repo !== adding) return false;
    const id = adding;
    adding = null;
    if (msg.error) {
      error = msg.error;
      paint();
      return true;
    }
    applyCityFloorLanguage(id);
    if (msg.floor) {
      close();
      ride(msg.floor);
    } else paint();
    return true;
  });
  const offFloors = store.on('floors', paint);
  paint();
  return () => {
    offAdded();
    offFloors();
  };
}
