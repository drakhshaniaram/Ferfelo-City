import './academy-ui.css';
import type { CityPhrase, CityScene } from '../../../shared/cities/scenes';
import { h, openModal, toast } from '../../ui/dom';
import { setPendingScene } from '../../state/pending-scene';

/** Scenes board window — pick a scene, then invite a fellow at a desk. */
export function openScenesBoard(scenes: CityScene[], cityName: string) {
  const body = h('div.academy-board-body');
  const el = h('div.modal.academy-board', {}, h('header', {}, h('h2', {}, `🎭 Scenes · ${cityName}`)), body);
  const modal = openModal(el, { doing: 'at the scenes board', closeButton: true });
  for (const s of scenes) {
    const start = h('button.btn.primary', { type: 'button' }, 'Start');
    start.addEventListener('click', () => {
      setPendingScene({ sceneNote: s.sceneNote, fellowId: s.fellowId, title: s.title });
      modal.close();
      toast(`🎭 “${s.title}” ready — walk to an empty desk and press E to invite a fellow`, 'info');
    });
    body.append(
      h('div.academy-card', {}, h('div.academy-card-title', {}, s.title), h('div.academy-card-meta', {}, s.blurb), h('p.academy-card-note', {}, s.sceneNote), start),
    );
  }
  if (!scenes.length) body.append(h('p.note', {}, 'Add a city floor for local scenes.'));
}

/** Phrase wall window. */
export function openPhrasesBoard(phrases: CityPhrase[], cityName: string) {
  const body = h('div.academy-board-body');
  const el = h('div.modal.academy-board', {}, h('header', {}, h('h2', {}, `💬 Phrase wall · ${cityName}`)), body);
  const modal = openModal(el, { doing: 'at the phrase wall', closeButton: true });
  for (const p of phrases) {
    const tryBtn = h('button.btn.primary', { type: 'button' }, 'Practice this');
    tryBtn.addEventListener('click', () => {
      setPendingScene({
        sceneNote: `Help me practice saying: «${p.line}» (${p.gloss}). Make me use it in a short exchange.`,
        title: p.line,
      });
      modal.close();
      toast('💬 Phrase queued — empty desk → E to practice with a fellow', 'info');
    });
    const copy = h('button.btn', { type: 'button' }, 'Copy');
    copy.addEventListener('click', () => {
      void navigator.clipboard?.writeText(p.line).then(
        () => toast('Copied', 'info'),
        () => toast(p.line, 'info'),
      );
    });
    body.append(
      h('div.academy-card', {}, h('div.academy-card-title', {}, p.line), h('div.academy-card-meta', {}, p.gloss), h('div.academy-card-actions', {}, tryBtn, copy)),
    );
  }
}

/** Practice queue window. */
export function openPracticeQueue(opts: {
  cityName: string;
  active: { name: string; scene: string }[];
  upNext: CityScene[];
  onStartScene: (s: CityScene) => void;
}) {
  const body = h('div.academy-board-body');
  const el = h('div.modal.academy-board', {}, h('header', {}, h('h2', {}, `📋 Practice queue · ${opts.cityName}`)), body);
  const modal = openModal(el, { doing: 'at the practice queue', closeButton: true });
  body.append(h('h3', {}, 'Now'));
  if (!opts.active.length) body.append(h('p.note', {}, 'No fellows mid-scene yet.'));
  for (const a of opts.active) {
    body.append(h('div.academy-card', {}, h('div.academy-card-title', {}, `▶ ${a.name}`), h('div.academy-card-meta', {}, a.scene)));
  }
  body.append(h('h3', {}, 'Up next'));
  for (const s of opts.upNext) {
    const go = h('button.btn.primary', { type: 'button' }, 'Queue');
    go.addEventListener('click', () => {
      opts.onStartScene(s);
      modal.close();
    });
    body.append(h('div.academy-card', {}, h('div.academy-card-title', {}, s.title), h('div.academy-card-meta', {}, s.blurb), go));
  }
}
