import './chat.css';
import type { Net } from '../../net';
import type { ServerMsg, WorkerInfo, WorkerStatus } from '../../../shared/protocol';
import { FELLOW_CATALOG, isRtlLanguage } from '../../../shared/fellows';
import { fellowReplyFromTerminal, parseFellowOptics, practiceLinesFromReply, textDirection } from '../../../shared/fellow-chat';
import { isAsleep, isBusy } from '../../../shared/status';
import { store } from '../../state';
import { loadLearner } from '../../state/learner';
import { h, openModal, STATUS_LABEL, type Modal } from '../../ui/dom';
import { dictateField } from '../../ui/dictate';
import {
  clearFellowChatHistory,
  loadFellowChatHistory,
  pruneFellowChatHistories,
  saveFellowChatHistory,
  type FellowChatBubble,
} from './chat-history';

/** Character.ai-style body: whispered context vs spoken lines with a left bar. */
function renderFellowOptics(text: string): HTMLElement {
  const root = h('div.fellow-optics');
  const segs = parseFellowOptics(text);
  if (!segs.length) {
    root.append(h('p.fellow-whisper', { dir: 'auto' }, '…'));
    return root;
  }
  for (const seg of segs) {
    if (seg.kind === 'whisper') {
      root.append(h('p.fellow-whisper', { dir: textDirection(seg.text) }, seg.text));
      continue;
    }
    const spoken = seg.parts.map((p) => p.text).join(' ');
    const quote = h('blockquote.fellow-speech', { dir: textDirection(spoken) });
    for (const part of seg.parts) {
      const dir = textDirection(part.text);
      quote.append(
        part.kind === 'aside' ? h('em.fellow-aside', { dir }, part.text) : h('span.fellow-say', { dir }, part.text),
      );
      quote.append(document.createTextNode(' '));
    }
    root.append(quote);
  }
  return root;
}

function bubbleBody(role: Role, text: string, live?: boolean): HTMLElement {
  if (role === 'fellow') return renderFellowOptics(text || (live ? '…' : ''));
  const body = text || (live ? '…' : '');
  return h('div.text', { dir: textDirection(body) }, body);
}

type Role = FellowChatBubble['role'];

interface Bubble extends FellowChatBubble {
  live?: boolean;
}

let current: { workerId: string; modal: Modal } | null = null;
const listeners = new Set<(msg: ServerMsg) => void>();

/** Main feeds every server message through here so open fellow chats can pick theirs. */
export function routeFellowChatMessage(msg: ServerMsg) {
  listeners.forEach((fn) => fn(msg));
}

function sceneFromBrief(prompt: string): string {
  const m = /Today’s scene:\s*(.+)/.exec(prompt) || /Today's scene:\s*(.+)/.exec(prompt);
  return (m?.[1] ?? prompt).split('\n')[0]!.trim().slice(0, 160);
}

function hookFromBrief(prompt: string): string | undefined {
  const m = /Scene hook \(feel this first\):\s*(.+)/.exec(prompt);
  return m?.[1]?.trim().slice(0, 180);
}

function seedBubbles(fellowName: string, fellowRole: string, prompt?: string): Bubble[] {
  const bubbles: Bubble[] = [
    {
      role: 'note',
      text: `${fellowName} · ${fellowRole}. You’re in the scene with them — choose, react, and steal their lines. Chips below jump you in.`,
    },
  ];
  if (prompt) {
    const scene = sceneFromBrief(prompt);
    const hook = hookFromBrief(prompt);
    bubbles.push({ role: 'note', text: hook ? `Scene: ${scene}\n${hook}` : `Scene: ${scene}` });
  }
  return bubbles;
}

export interface FellowChatOpts {
  openTerminal(workerId: string): void;
}

/** Modern chat with a language fellow: prompts go over the wire; replies stream from the terminal. */
export function openFellowChat(net: Net, workerId: string, opts: FellowChatOpts) {
  if (current?.workerId === workerId) return;
  current?.modal.close();
  const info = store.workers.get(workerId);
  if (!info?.fellowId) return;
  const fellow = FELLOW_CATALOG[info.fellowId];

  const saved = loadFellowChatHistory(workerId);
  const bubbles: Bubble[] = saved?.length ? saved.map((b) => ({ ...b })) : seedBubbles(fellow.name, fellow.role, info.prompt);
  const remember = () => saveFellowChatHistory(workerId, bubbles);

  const thread = h('div.fellow-chat-thread', { role: 'log', 'aria-live': 'polite', 'aria-relevant': 'additions' });
  const statusPill = h('span.pill', {});
  const typing = h('div.fellow-chat-typing.hidden', {}, `${fellow.name} is writing…`);
  const chips = h('div.fellow-chat-chips', { role: 'group', 'aria-label': 'Quick replies' });
  const learner = loadLearner();
  const preferRtl = isRtlLanguage(learner.nativeLanguage) || isRtlLanguage(learner.targetLanguage);
  const input = h('textarea', {
    rows: 2,
    placeholder: `Answer ${fellow.name} — try their line, or pick a chip…`,
    'aria-label': `Message ${fellow.name}`,
    dir: preferRtl ? 'rtl' : 'auto',
    lang: preferRtl && isRtlLanguage(learner.nativeLanguage) ? langTag(learner.nativeLanguage) : undefined,
  }) as HTMLTextAreaElement;
  const sendBtn = h('button.btn.primary', { type: 'submit' }, 'Send') as HTMLButtonElement;
  const termBtn = h('button.btn', { type: 'button', title: 'Open the raw agent terminal' }, '🖥️ Terminal');
  const closeBtn = h('button.btn.close', { type: 'button', 'aria-label': 'Close' }, '✕');

  let awaiting = false;
  let stream = '';
  let liveEl: HTMLElement | null = null;
  let ignoreUntil = 0;

  const lastFellowText = (): string => {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]!;
      if (b.role === 'fellow' && b.text && !b.live) return b.text;
    }
    return '';
  };

  const paintChips = () => {
    const asleep = (() => {
      const w = store.workers.get(workerId);
      return !w || isAsleep(w.status);
    })();
    const practice = practiceLinesFromReply(lastFellowText());
    const items: { label: string; fill: string; send?: boolean }[] = [];
    if (!bubbles.some((b) => b.role === 'you')) {
      items.push({ label: "👋 I'm in — let's go", fill: "I'm ready — let's jump into the scene.", send: true });
    }
    for (const line of practice) {
      items.push({ label: `🎤 ${line.length > 42 ? `${line.slice(0, 40)}…` : line}`, fill: line, send: true });
    }
    items.push({ label: '🔁 Say it slower', fill: 'Can you say that again, a bit slower?', send: true });
    items.push({ label: '❓ What does that mean?', fill: 'What does that mean? Explain in my native language.', send: true });
    items.push({ label: '➡️ Next beat', fill: "I'm ready for the next part of the scene.", send: true });
    chips.replaceChildren(
      ...items.map((item) => {
        const btn = h('button.fellow-chip', { type: 'button', disabled: asleep }, item.label) as HTMLButtonElement;
        btn.addEventListener('click', () => {
          if (asleep) return;
          input.value = item.fill;
          input.dir = textDirection(item.fill);
          sendBtn.disabled = false;
          if (item.send) send();
          else input.focus();
        });
        return btn;
      }),
    );
  };

  const paintThread = () => {
    thread.replaceChildren(
      ...bubbles.map((b) =>
        h(
          'div',
          { class: `fellow-bubble ${b.role}${b.live ? ' live' : ''}` },
          b.role === 'you' ? h('span.who', {}, 'You') : b.role === 'fellow' ? h('span.who', {}, fellow.name) : null,
          bubbleBody(b.role, b.text, b.live),
        ),
      ),
    );
    liveEl = thread.querySelector('.fellow-bubble.live .fellow-optics, .fellow-bubble.live .text');
    thread.scrollTop = thread.scrollHeight;
    paintChips();
  };
  paintThread();

  const paintStatus = (w: WorkerInfo) => {
    statusPill.className = `pill ${w.status}`;
    statusPill.textContent = STATUS_LABEL[w.status] ?? w.status;
    const asleep = isAsleep(w.status);
    typing.classList.toggle('hidden', !awaiting && !isBusy(w.status));
    sendBtn.disabled = asleep || !input.value.trim();
    input.disabled = asleep;
    paintChips();
  };
  paintStatus(info);

  const finishLive = () => {
    const text = fellowReplyFromTerminal(stream);
    stream = '';
    if (!bubbles.length || !bubbles[bubbles.length - 1]?.live) return;
    if (text) bubbles[bubbles.length - 1] = { role: 'fellow', text };
    else bubbles.pop();
    awaiting = false;
    remember();
    paintThread();
  };

  const paintLive = (text: string) => {
    if (!text) {
      // Still waiting — typing line covers it; don't dump chrome into a bubble.
      if (bubbles[bubbles.length - 1]?.live && !bubbles[bubbles.length - 1]!.text) return;
      return;
    }
    if (!bubbles[bubbles.length - 1]?.live) {
      bubbles.push({ role: 'fellow', text, live: true });
      paintThread();
      return;
    }
    bubbles[bubbles.length - 1] = { role: 'fellow', text, live: true };
    if (liveEl?.classList.contains('fellow-optics')) {
      liveEl.replaceWith(renderFellowOptics(text));
      liveEl = thread.querySelector('.fellow-bubble.live .fellow-optics');
      thread.scrollTop = thread.scrollHeight;
    } else paintThread();
  };

  const onTerm = (chunk: string) => {
    if (Date.now() < ignoreUntil) return;
    if (!chunk) return;
    awaiting = true;
    stream += chunk;
    paintLive(fellowReplyFromTerminal(stream));
    const w = store.workers.get(workerId);
    if (w) paintStatus(w);
  };

  const onMsg = (msg: ServerMsg) => {
    if (msg.t === 'term.data' && msg.workerId === workerId) onTerm(msg.data);
    else if (msg.t === 'term.snapshot' && msg.workerId === workerId) ignoreUntil = Date.now() + 400;
  };

  const send = () => {
    const text = input.value.trim();
    if (!text) return;
    const w = store.workers.get(workerId);
    if (!w || isAsleep(w.status)) return;
    finishLive();
    bubbles.push({ role: 'you', text });
    awaiting = true;
    stream = '';
    ignoreUntil = Date.now() + 600;
    remember();
    paintThread();
    input.value = '';
    sendBtn.disabled = true;
    net.send({ t: 'worker.prompt', workerId, prompt: text });
    paintStatus(w);
    input.focus();
  };

  const form = h(
    'form.modal.fellow-chat',
    { role: 'dialog', 'aria-label': `Chat with ${fellow.name}` },
    h(
      'header',
      {},
      h('span.fellow-dot', { style: `background:${fellow.color}` }),
      h('div.fellow-chat-title', {}, h('h2', {}, fellow.name), h('small', {}, fellow.role)),
      statusPill,
      termBtn,
      closeBtn,
    ),
    h('div.body.fellow-chat-body', {}, thread, typing, chips),
    h('footer.fellow-chat-compose', {}, dictateField(input), sendBtn),
  ) as HTMLFormElement;
  form.noValidate = true;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send();
  });
  input.addEventListener('input', () => {
    const w = store.workers.get(workerId);
    sendBtn.disabled = !w || isAsleep(w.status) || !input.value.trim();
    // Flip as they type so mixed sessions stay comfortable.
    if (input.value.trim()) input.dir = textDirection(input.value);
    else input.dir = preferRtl ? 'rtl' : 'auto';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send();
    }
  });

  let lastStatus: WorkerStatus = info.status;
  const unsub = store.on('workers', () => {
    pruneFellowChatHistories(store.workers.keys());
    const w = store.workers.get(workerId);
    if (!w) {
      clearFellowChatHistory(workerId);
      modal.close();
      return;
    }
    paintStatus(w);
    if (awaiting && lastStatus === 'working' && (w.status === 'done' || w.status === 'idle' || w.status === 'needs_input')) {
      finishLive();
      paintStatus(w);
    }
    lastStatus = w.status;
  });

  listeners.add(onMsg);
  net.send({ t: 'worker.attach', workerId });

  const modal = openModal(form, {
    backdropCloses: true,
    closeButton: false,
    doing: `💬 chatting with ${fellow.name}`,
    onClose: () => {
      finishLive();
      remember();
      unsub();
      listeners.delete(onMsg);
      net.send({ t: 'worker.detach', workerId });
      if (current?.modal === modal) current = null;
    },
  });
  current = { workerId, modal };
  closeBtn.addEventListener('click', () => modal.close());
  termBtn.addEventListener('click', () => {
    modal.close();
    opts.openTerminal(workerId);
  });
  setTimeout(() => {
    thread.scrollTop = thread.scrollHeight;
    input.focus();
  }, 30);
}

function langTag(language: string): string | undefined {
  if (language === 'Persian') return 'fa';
  if (language === 'Central Kurdish (Sorani)') return 'ckb';
  if (language === 'Arabic') return 'ar';
  if (language === 'Hebrew') return 'he';
  return undefined;
}
