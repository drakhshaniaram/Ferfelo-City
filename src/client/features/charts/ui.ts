import './ui.css';
import type { ChartPack, ChartTrack } from '../../../shared/charts';
import { h, openModal } from '../../ui/dom';

export interface ChartsUiOpts {
  pack: ChartPack;
  cityLabel: string;
  onPlay?(track: ChartTrack): void;
}

/** Top-30 board for the rooftop club. */
export function openCharts(opts: ChartsUiOpts) {
  const list = h(
    'ol.charts-list',
    {},
    ...opts.pack.tracks.map((t) => {
      const playable = !!(t.play?.track || t.play?.url);
      const row = h(
        'li.charts-row',
        {},
        h('span.charts-rank', {}, String(t.rank)),
        h('span.charts-meta', {}, h('strong', {}, t.title), h('small', {}, t.artist)),
        playable
          ? h(
              'button.btn',
              {
                type: 'button',
                onclick: () => opts.onPlay?.(t),
              },
              'Play',
            )
          : h('span.charts-hint', {}, 'Listen elsewhere'),
      );
      return row;
    }),
  );
  const close = h('button.btn.close', { type: 'button', 'aria-label': 'Close' }, '✕');
  const form = h(
    'div.modal.charts-modal',
    { role: 'dialog', 'aria-label': 'Top 30 near you' },
    h('header', {}, h('h2', {}, 'Top 30 near you'), close),
    h(
      'div.body',
      {},
      h('p.charts-blurb', {}, `${opts.pack.label}. Sky city: ${opts.cityLabel}. Hints for what locals are spinning — not a licensed stream.`),
      list,
    ),
    h('footer', {}, h('span.grow', {}, 'Esc to close')),
  );
  const modal = openModal(form, { backdropCloses: true, closeButton: false, doing: '📻 checking the charts' });
  close.addEventListener('click', () => modal.close());
}
