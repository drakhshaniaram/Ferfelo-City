import './ui.css';
import { h, openModal } from '../../ui/dom';

const LINES = [
  'Feel the city lights — sing it out',
  'One more chorus under the stars',
  'Hold the mic, don’t overthink',
  'Locals know this one — join in',
  'Last line — big finish!',
];

/** Guided sing-along sheet for the rooftop stage (no licensed lyric catalogs). */
export function openKaraoke(onClose?: () => void) {
  let i = 0;
  const line = h('p.karaoke-line', {}, LINES[0]);
  const next = h('button.btn.primary', { type: 'button' }, 'Next line');
  const close = h('button.btn.close', { type: 'button', 'aria-label': 'Close' }, '✕');
  next.addEventListener('click', () => {
    i = (i + 1) % LINES.length;
    line.textContent = LINES[i];
  });
  const form = h(
    'div.modal.karaoke-modal',
    { role: 'dialog', 'aria-label': 'Karaoke' },
    h('header', {}, h('h2', {}, 'Karaoke stage'), close),
    h(
      'div.body',
      {},
      h('p.karaoke-blurb', {}, 'Guided sing-along prompts while the DJ runs. Not a licensed karaoke catalog — make up the words or hum along.'),
      line,
    ),
    h('footer', {}, h('span.grow', {}, 'Esc leaves the stage'), next),
  );
  const modal = openModal(form, {
    backdropCloses: true,
    closeButton: false,
    doing: '🎤 on the karaoke stage',
    onClose: () => onClose?.(),
  });
  close.addEventListener('click', () => modal.close());
}
