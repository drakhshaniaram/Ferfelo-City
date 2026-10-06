import './hire.css';
import type { AgentEffort, AgentProvider } from '../../../shared/protocol';
import {
  FELLOW_CATALOG,
  FELLOW_IDS,
  LEARNER_LANGUAGES,
  type FellowId,
  type LearnerLanguage,
  type LearnerProfile,
} from '../../../shared/fellows';
import { h, openModal } from '../../ui/dom';
import { dictateField } from '../../ui/dictate';
import { providerPicker, type ProviderPicker } from '../../ui/provider';
import { store } from '../../state';
import { loadLearner, saveLearner } from '../../state/learner';
import { pressureNote } from '../../../shared/machine';

export interface FellowHireOpts {
  deskLabel: string;
  onHire(fellowId: FellowId, sceneNote: string, opts: { provider?: AgentProvider; model?: string; effort?: AgentEffort }): void;
}

/** Pick a language fellow, optional scene note, and provider — then hire at the desk. */
export function openFellowHire(opts: FellowHireOpts) {
  let learner = loadLearner();
  let picked: FellowId | null = null;
  const list = h('div.fellow-list', { role: 'listbox', 'aria-label': 'Language fellows' });
  const scene = h('textarea', {
    rows: 3,
    placeholder: 'Optional scene note (defaults to this fellow’s usual scene)…',
    'aria-label': 'Scene note',
  }) as HTMLTextAreaElement;
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

  const form = h(
    'form.modal.fellow-hire',
    { role: 'dialog', 'aria-label': `Invite a fellow at ${opts.deskLabel}` },
    h('header', {}, h('h2', {}, `Invite a fellow · ${opts.deskLabel}`)),
    h(
      'div.body',
      {},
      warning ? h('p.setting-note.bad', { role: 'alert' }, warning) : null,
      h('p.fellow-blurb', {}, 'Cultural-context fellows help you live scenes in your new language. Set your learner level, pick a fellow, optionally tweak the scene.'),
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

function languageSelect(value: string, ariaLabel: string): HTMLSelectElement {
  const sel = h('select', { 'aria-label': ariaLabel }) as HTMLSelectElement;
  for (const lang of LEARNER_LANGUAGES) {
    const opt = h('option', { value: lang }, lang) as HTMLOptionElement;
    if (lang === value) opt.selected = true;
    sel.append(opt);
  }
  // Old free-text saves that aren’t in the catalog — keep them selectable until changed.
  if (value && !(LEARNER_LANGUAGES as readonly string[]).includes(value)) {
    sel.prepend(h('option', { value, selected: 'true' }, value) as HTMLOptionElement);
  }
  return sel;
}

function learnerFields(learner: LearnerProfile, onChange: (next: LearnerProfile) => void): HTMLElement {
  const native = languageSelect(learner.nativeLanguage, 'Native language');
  const target = languageSelect(learner.targetLanguage, 'Target language');
  const levels = h('div.seg.fellow-levels', { role: 'radiogroup', 'aria-label': 'Learner level' });
  const paint = () => {
    levels.replaceChildren(
      ...(['newbie', 'growing', 'immersed'] as const).map((level) =>
        h(
          'button.btn',
          {
            type: 'button',
            role: 'radio',
            'aria-checked': String(learner.level === level),
            class: learner.level === level ? 'on' : '',
            onclick: () => {
              learner = { ...learner, level };
              onChange(learner);
              paint();
            },
          },
          level === 'newbie' ? 'Newbie' : level === 'growing' ? 'Growing' : 'Immersed',
        ),
      ),
    );
  };
  paint();
  const commit = () => {
    learner = {
      ...learner,
      nativeLanguage: (native.value || learner.nativeLanguage) as LearnerLanguage,
      targetLanguage: (target.value || learner.targetLanguage) as LearnerLanguage,
    };
    onChange(learner);
  };
  native.addEventListener('change', commit);
  target.addEventListener('change', commit);
  return h(
    'div.fellow-learner',
    {},
    h('label', {}, 'Your languages'),
    h('div.fellow-langs', {}, native, h('span.fellow-lang-arrow', { 'aria-hidden': 'true' }, '→'), target),
    h('div.fellow-lang-hints', {}, h('small', {}, 'Native'), h('small', {}, 'Learning')),
    h('label', { style: 'margin-top:8px' }, 'Level'),
    levels,
  );
}
