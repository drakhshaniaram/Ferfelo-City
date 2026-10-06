import './hire.css';
import type { AgentEffort, AgentProvider } from '../../../shared/protocol';
import { FELLOW_CATALOG, FELLOW_IDS, type FellowId } from '../../../shared/fellows';
import { cityOf } from '../../../shared/cities';
import { h, openModal } from '../../ui/dom';
import { dictateField } from '../../ui/dictate';
import { providerPicker, type ProviderPicker } from '../../ui/provider';
import { store } from '../../state';
import { loadLearner, saveLearner } from '../../state/learner';
import { pressureNote } from '../../../shared/machine';
import { learnerFields } from './learner-ui';
import { applyCityFloorLanguage } from './city-language';
import { clearPendingScene, peekPendingScene } from '../../state/pending-scene';
import { isFellowId } from '../../../shared/fellows';

export interface FellowHireOpts {
  deskLabel: string;
  onHire(fellowId: FellowId, sceneNote: string, opts: { provider?: AgentProvider; model?: string; effort?: AgentEffort }): void;
}

/** Pick a language fellow, optional scene note, and provider — then hire at the desk. */
export function openFellowHire(opts: FellowHireOpts) {
  const cityFloor = store.floors.find((f) => f.id === store.floor);
  if (cityFloor?.cityId) applyCityFloorLanguage(cityFloor.cityId, { quiet: true });
  let learner = loadLearner();
  const city = cityOf(cityFloor?.cityId);
  const pending = peekPendingScene();
  let picked: FellowId | null = pending?.fellowId && isFellowId(pending.fellowId) ? pending.fellowId : null;
  const list = h('div.fellow-list', { role: 'listbox', 'aria-label': 'Language fellows' });
  const scene = h('textarea', {
    rows: 3,
    placeholder: 'Optional scene note (defaults to this fellow’s usual scene)…',
    'aria-label': 'Scene note',
  }) as HTMLTextAreaElement;
  if (pending?.sceneNote) {
    scene.value = pending.sceneNote;
    clearPendingScene();
  }
  const provider: ProviderPicker = providerPicker(store.project, 'fellow-provider', 'Fellow runs on', { provider: 'cursor' });
  const submit = h('button.btn.primary', { type: 'submit', disabled: true }, 'Invite fellow') as HTMLButtonElement;
  const cancel = h('button.btn', { type: 'button' }, 'Cancel');
  const warning = pressureNote(store.machine);
  const learnerRow = learnerFields(learner, (next) => {
    learner = next;
    saveLearner(learner);
    paintList();
  });

  const paintList = () => {
    list.replaceChildren(
      ...FELLOW_IDS.map((id) => {
        const f = FELLOW_CATALOG[id];
        const on = picked === id;
        return h(
          'button.fellow-card',
          {
            type: 'button',
            role: 'option',
            'aria-selected': String(on),
            class: on ? 'on' : '',
            onclick: () => {
              picked = id;
              if (!scene.value.trim()) scene.placeholder = f.defaultScene;
              submit.disabled = false;
              paintList();
            },
          },
          h('span.fellow-dot', { style: `background:${f.color}` }),
          h('span.fellow-meta', {}, h('strong', {}, f.name), h('small', {}, f.role)),
        );
      }),
    );
  };
  paintList();
  if (picked) submit.disabled = false;

  const form = h(
    'form.modal.fellow-hire',
    { role: 'dialog', 'aria-label': `Invite a fellow at ${opts.deskLabel}` },
    h('header', {}, h('h2', {}, `Invite a fellow · ${opts.deskLabel}`)),
    h(
      'div.body',
      {},
      warning ? h('p.setting-note.bad', { role: 'alert' }, warning) : null,
      city
        ? h('p.fellow-blurb', {}, `🌆 ${city.name} floor — fellows speak ${city.targetLanguage} by default (change Learner below if you want).`)
        : null,
      h('p.fellow-blurb', {}, 'Pick a fellow and drop into their scene. They’ll pull you in with stakes, choices, and one line to try each turn — set your level, then invite.'),
      learnerRow,
      h('label', {}, 'Fellow'),
      list,
      h('label', { style: 'margin-top:12px' }, 'Scene'),
      dictateField(scene),
      provider.element,
    ),
    h('footer', {}, h('span.grow', {}, 'Enter to invite · Esc to close'), cancel, submit),
  ) as HTMLFormElement;
  form.noValidate = true;

  const modal = openModal(form);
  cancel.addEventListener('click', () => modal.close());
  const send = () => {
    if (!picked) return;
    if (!provider.valid()) return;
    const note = scene.value.trim();
    modal.close();
    opts.onHire(picked, note, { provider: provider.value(), model: provider.model(), effort: provider.effort() });
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send();
  });
  scene.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && picked) {
      e.preventDefault();
      send();
    }
  });
}
