/** Shared learner language / level controls for hire and Settings. */
import './hire.css';
import {
  LEARNER_LANGUAGES,
  isRtlLanguage,
  type LearnerLanguage,
  type LearnerProfile,
} from '../../../shared/fellows';
import { h } from '../../ui/dom';

function languageSelect(value: string, ariaLabel: string): HTMLSelectElement {
  const sel = h('select', { 'aria-label': ariaLabel, dir: isRtlLanguage(value) ? 'rtl' : 'ltr' }) as HTMLSelectElement;
  for (const lang of LEARNER_LANGUAGES) {
    const opt = h('option', { value: lang }, lang) as HTMLOptionElement;
    if (lang === value) opt.selected = true;
    sel.append(opt);
  }
  if (value && !(LEARNER_LANGUAGES as readonly string[]).includes(value)) {
    sel.prepend(h('option', { value, selected: 'true' }, value) as HTMLOptionElement);
  }
  sel.addEventListener('change', () => {
    sel.dir = isRtlLanguage(sel.value) ? 'rtl' : 'ltr';
  });
  return sel;
}

/** Native → learning languages and Newbie / Growing / Immersed. */
export function learnerFields(learner: LearnerProfile, onChange: (next: LearnerProfile) => void): HTMLElement {
  let current = learner;
  const native = languageSelect(current.nativeLanguage, 'Native language');
  const target = languageSelect(current.targetLanguage, 'Target language');
  const levels = h('div.seg.fellow-levels', { role: 'radiogroup', 'aria-label': 'Learner level' });
  const paint = () => {
    levels.replaceChildren(
      ...(['newbie', 'growing', 'immersed'] as const).map((level) =>
        h(
          'button.btn',
          {
            type: 'button',
            role: 'radio',
            'aria-checked': String(current.level === level),
            class: current.level === level ? 'on' : '',
            onclick: () => {
              current = { ...current, level };
              onChange(current);
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
    current = {
      ...current,
      nativeLanguage: (native.value || current.nativeLanguage) as LearnerLanguage,
      targetLanguage: (target.value || current.targetLanguage) as LearnerLanguage,
    };
    onChange(current);
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
