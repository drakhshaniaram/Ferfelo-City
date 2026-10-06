/**
 * Academy wall-board textures: Scenes (cork), Phrase wall (cork), Practice queue (whiteboard).
 * Stand-ins for Issues / PRs / Task queue while learning.
 */
import * as THREE from 'three';
import type { CityPhrase, CityScene } from '../../../shared/cities/scenes';
import { NOTE_COLORS, PINS, wrap } from '../boards/world';

function canvasTex(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return { canvas, ctx: canvas.getContext('2d')!, texture };
}

/** Sticky notes for practice scenes. */
export class ScenesBoardTexture {
  private c = canvasTex(1200, 600);
  readonly texture = this.c.texture;

  render(scenes: CityScene[], cityName: string) {
    const { ctx: g, canvas } = this.c;
    const W = canvas.width;
    const H = canvas.height;
    g.fillStyle = '#c4a574';
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = i % 2 ? '#b8956a' : '#d4b896';
      g.fillRect((i * 97) % W, (i * 53) % H, 8, 8);
    }
    g.fillStyle = '#2b2d42';
    g.font = 'bold 42px system-ui,sans-serif';
    g.fillText(`🎭 Scenes · ${cityName}`, 40, 56);
    g.font = '22px system-ui,sans-serif';
    g.fillStyle = '#5c4033';
    g.fillText('Pick a scene · walk to an empty desk · invite a fellow', 40, 92);

    const list = scenes.slice(0, 8);
    const cols = 4;
    const noteW = 240;
    const noteH = 160;
    list.forEach((s, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = 80 + col * (noteW + 30) + noteW / 2;
      const y = 200 + row * (noteH + 40) + noteH / 2;
      const tilt = ((i % 5) - 2) * 0.04;
      g.save();
      g.translate(x, y);
      g.rotate(tilt);
      g.fillStyle = NOTE_COLORS[i % NOTE_COLORS.length];
      g.fillRect(-noteW / 2, -noteH / 2, noteW, noteH);
      g.fillStyle = PINS[i % PINS.length];
      g.beginPath();
      g.arc(0, -noteH / 2 + 14, 8, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#2b2d42';
      g.font = 'bold 22px system-ui,sans-serif';
      const title = wrap(g, s.title, noteW - 28, 2);
      title.forEach((line, li) => g.fillText(line, -noteW / 2 + 14, -noteH / 2 + 48 + li * 26));
      g.font = '18px system-ui,sans-serif';
      g.fillStyle = '#4a5568';
      wrap(g, s.blurb, noteW - 28, 3).forEach((line, li) => g.fillText(line, -noteW / 2 + 14, -noteH / 2 + 100 + li * 22));
      g.restore();
    });
    if (!list.length) {
      g.fillStyle = '#5c4033';
      g.font = '28px system-ui,sans-serif';
      g.fillText('Add a city floor for local scenes', W / 2 - 200, H / 2);
    }
    this.texture.needsUpdate = true;
  }
}

/** Phrase wall — lines to try aloud. */
export class PhrasesBoardTexture {
  private c = canvasTex(1200, 600);
  readonly texture = this.c.texture;

  render(phrases: CityPhrase[], cityName: string) {
    const { ctx: g, canvas } = this.c;
    const W = canvas.width;
    const H = canvas.height;
    g.fillStyle = '#c4a574';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#2b2d42';
    g.font = 'bold 42px system-ui,sans-serif';
    g.fillText(`💬 Phrase wall · ${cityName}`, 40, 56);
    g.font = '22px system-ui,sans-serif';
    g.fillStyle = '#5c4033';
    g.fillText('Lines to steal · try them with a fellow', 40, 92);

    phrases.slice(0, 8).forEach((p, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 70 + col * 280;
      const y = 140 + row * 200;
      g.fillStyle = NOTE_COLORS[(i + 2) % NOTE_COLORS.length];
      g.fillRect(x, y, 250, 160);
      g.fillStyle = PINS[i % PINS.length];
      g.beginPath();
      g.arc(x + 125, y + 14, 8, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#2b2d42';
      g.font = 'bold 20px system-ui,sans-serif';
      wrap(g, p.line, 220, 3).forEach((line, li) => g.fillText(line, x + 16, y + 50 + li * 24));
      g.font = '16px system-ui,sans-serif';
      g.fillStyle = '#6b7280';
      wrap(g, p.gloss, 220, 2).forEach((line, li) => g.fillText(line, x + 16, y + 120 + li * 20));
    });
    this.texture.needsUpdate = true;
  }
}

/** Practice queue — who’s mid-scene and what’s up next. */
export class PracticeQueueTexture {
  private c = canvasTex(1200, 600);
  readonly texture = this.c.texture;

  render(opts: { cityName: string; active: { name: string; scene: string }[]; upNext: CityScene[] }) {
    const { ctx: g, canvas } = this.c;
    const W = canvas.width;
    const H = canvas.height;
    g.fillStyle = '#e8eef4';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#2b2d42';
    g.font = 'bold 42px system-ui,sans-serif';
    g.fillText('📋 Practice queue', 40, 56);
    g.font = '22px system-ui,sans-serif';
    g.fillStyle = '#4a5568';
    g.fillText(`${opts.cityName} · who’s in a scene · what’s up next`, 40, 92);

    g.font = 'bold 26px system-ui,sans-serif';
    g.fillStyle = '#118ab2';
    g.fillText('Now', 40, 150);
    if (!opts.active.length) {
      g.font = '22px system-ui,sans-serif';
      g.fillStyle = '#6b7280';
      g.fillText('No fellows mid-scene — invite one from the Scenes board', 40, 190);
    } else {
      opts.active.slice(0, 4).forEach((a, i) => {
        g.font = 'bold 22px system-ui,sans-serif';
        g.fillStyle = '#2b2d42';
        g.fillText(`▶ ${a.name}`, 40, 190 + i * 48);
        g.font = '18px system-ui,sans-serif';
        g.fillStyle = '#4a5568';
        g.fillText(a.scene.slice(0, 60), 200, 190 + i * 48);
      });
    }

    g.font = 'bold 26px system-ui,sans-serif';
    g.fillStyle = '#06d6a0';
    g.fillText('Up next', 40, 400);
    opts.upNext.slice(0, 3).forEach((s, i) => {
      g.font = '22px system-ui,sans-serif';
      g.fillStyle = '#2b2d42';
      g.fillText(`${i + 1}. ${s.title} — ${s.blurb}`, 40, 440 + i * 40);
    });
    this.texture.needsUpdate = true;
  }
}
