// Turn Cursor (and similar) agent TUI bytes into a chat-sized fellow reply: drop spinners,
// status bars, banner chrome, echoed hire briefs and redraw frames; keep the spoken lines.

const BRAILLE = /[\u2800-\u28FF]/;
/** Screen clears — a new frame replaces the previous one. */
const SCREEN_CLEAR = /\x1b\[(?:2J|3J)/;
/** Hire brief echoed back into the TUI before the fellow’s first in-character lines. */
const BRIEF_ECHO =
  /You are \S+, a language fellow in Ferfelo Academy[\s\S]*?Open the scene now:[^\n]*(?:\n+\s*[a-zäöü][^\n]*)?/u;

export function stripAnsi(raw: string): string {
  return raw
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '')
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, '')
    .replace(/\x1b./g, '');
}

/** True for Cursor CLI chrome the learner should never see in chat. */
export function isFellowChatChrome(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (BRAILLE.test(t) && /\b(Working|Thinking|Generating|Loading)\b/i.test(t)) return true;
  if (/^(Working|Thinking)(\s+\d[\d,]*\s+tokens?)?$/i.test(t)) return true;
  // Rotating Cursor tips: "~ Use /mcp …", "~ Use /plan …", etc.
  if (/^~\s*Use \//i.test(t)) return true;
  if (/^→\s*Add a follow-up/i.test(t)) return true;
  if (/^→\s*Plan,\s*search,\s*build/i.test(t)) return true;
  if (/^Tip:\s*Use \//i.test(t)) return true;
  if (/^Cursor Agent$/i.test(t)) return true;
  if (/^v\d{4}\.\d{2}\.\d{2}-[0-9a-f]+$/i.test(t)) return true;
  // Prompt crumbs / mode badge
  if (/^>\d+\w*$/i.test(t)) return true;
  if (/^Auto$/i.test(t)) return true;

  if (/ctrl\+c to stop/i.test(t)) return true;
  if (/^Auto\s*·/i.test(t)) return true;
  if (/^~\/|^\/(?:home|Users|var|tmp)\//.test(t) && /·/.test(t)) return true;
  if (/·\s*(main|master|HEAD)\s*$/i.test(t) && (t.includes('/') || t.includes('~'))) return true;
  if (/^\d[\d,]*\s+tokens?$/i.test(t)) return true;
  // Spinner-only / punctuation crumbs
  if (BRAILLE.test(t) && t.replace(BRAILLE, '').trim() === '') return true;
  return false;
}

/** Drop the hire brief when Cursor paints the first prompt into the terminal. */
export function stripFellowBriefEcho(text: string): string {
  let out = text.replace(BRIEF_ECHO, '').trim();
  // Soft-wrap crumbs left after a blank line inside the brief (e.g. "with locals”.")
  // Do not use the `i` flag — `[a-z]` with `i` also eats uppercase reply lines.
  out = out.replace(/^(?:[a-zäöü][^\n]{0,100}\n*)+/u, '').trim();
  return out;
}

/**
 * Rejoin soft-wrapped TUI lines (≈80 cols) so markers and sentences stay whole.
 * Keeps blank lines as paragraph breaks.
 */
export function rejoinSoftWraps(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  const out: string[] = [];
  for (const line of lines) {
    const t = line.replace(/\s+$/g, '');
    if (!t.trim()) {
      if (out.length && out[out.length - 1] !== '') out.push('');
      continue;
    }
    const prev = out[out.length - 1];
    if (
      prev &&
      prev !== '' &&
      prev.length >= 48 &&
      !/[.!?…:”»“)'\]）]$/.test(prev) &&
      !/^(→|~|Tip:|Auto|Cursor Agent|v\d{4})/i.test(t.trim())
    ) {
      out[out.length - 1] = `${prev} ${t.trim()}`;
      continue;
    }
    out.push(t.trim());
  }
  while (out.length && out[0] === '') out.shift();
  while (out.length && out[out.length - 1] === '') out.pop();
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Latest readable reply from a terminal stream. Full-screen redraws keep only the last frame;
 * chrome lines are dropped; duplicate lines from redraws are collapsed; hire-brief echoes go away.
 */
export function fellowReplyFromTerminal(raw: string): string {
  const frames = raw.split(SCREEN_CLEAR);
  const frame = frames[frames.length - 1] ?? '';
  const plain = stripAnsi(frame).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const kept: string[] = [];
  const seen = new Set<string>();
  for (const line of plain.split('\n')) {
    const trimmed = line.replace(/\s+$/g, '');
    if (isFellowChatChrome(trimmed)) continue;
    const body = trimmed.trim();
    if (!body) {
      if (kept.length && kept[kept.length - 1] !== '') kept.push('');
      continue;
    }
    if (seen.has(body)) continue;
    seen.add(body);
    kept.push(body);
  }
  while (kept.length && kept[0] === '') kept.shift();
  while (kept.length && kept[kept.length - 1] === '') kept.pop();
  const rejoined = rejoinSoftWraps(kept.join('\n'));
  return stripFellowBriefEcho(rejoined);
}

/** Whispered stage direction vs spoken line — for Character.ai-style chat optics. */
export type FellowOpticsSeg =
  | { kind: 'whisper'; text: string }
  | { kind: 'speech'; parts: { kind: 'say' | 'aside'; text: string }[] };

function unwrapQuotes(tok: string): string {
  const pairs: [string, string][] = [
    ['„', '“'],
    ['«', '»'],
    ['"', '"'],
    ['‚', '‘'],
    ['“', '”'],
    ["'", "'"],
  ];
  for (const [a, b] of pairs) {
    if (tok.startsWith(a) && tok.endsWith(b)) return tok.slice(a.length, tok.length - b.length).trim();
  }
  return tok.trim();
}

function unwrapWhisper(tok: string): string {
  if (tok.startsWith('((') && tok.endsWith('))')) return tok.slice(2, -2).trim();
  if (tok.startsWith('*') && tok.endsWith('*')) return tok.slice(1, -1).trim();
  return tok.trim();
}

/** Inside a spoken block, ((aside)) / *aside* stays whispered; the rest is the line said aloud. */
export function parseSpeechParts(inner: string): { kind: 'say' | 'aside'; text: string }[] {
  const parts: { kind: 'say' | 'aside'; text: string }[] = [];
  const re = /(\(\([^)\n]+\)\)|\*[^*\n]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner))) {
    const before = inner.slice(last, m.index);
    if (before) parts.push({ kind: 'say', text: before });
    parts.push({ kind: 'aside', text: unwrapWhisper(m[1]) });
    last = m.index + m[1].length;
  }
  const tail = inner.slice(last);
  if (tail) parts.push({ kind: 'say', text: tail });
  return parts.filter((p) => p.text.length > 0);
}

const OPTICS_TOKEN =
  /(\(\([^)\n]+\)\)|\*[^*\n]+\*|„[^“\n]+“|"[^"\n]+"|«[^»\n]+»|‚[^‘\n]+‘|“[^”\n]+”)/g;

/**
 * Split a fellow reply into whispered context (((stage)) / *stage*) and spoken
 * lines („…“ / "…" / «…» / ‚…‘), including asides inside speech.
 * Unmarked paragraphs: stage-like beats whisper; the rest speak.
 */
export function parseFellowOptics(text: string): FellowOpticsSeg[] {
  const segs: FellowOpticsSeg[] = [];
  for (const para of text.split(/\n+/)) {
    const p = para.trim();
    if (!p) continue;
    pushOpticsPara(segs, p);
  }
  if (!segs.length && text.trim()) segs.push({ kind: 'whisper', text: text.trim() });
  return segs;
}

function pushOpticsPara(segs: FellowOpticsSeg[], para: string) {
  OPTICS_TOKEN.lastIndex = 0;
  if (!OPTICS_TOKEN.test(para)) {
    if (looksLikeStage(para)) segs.push({ kind: 'whisper', text: para });
    else segs.push({ kind: 'speech', parts: [{ kind: 'say', text: para }] });
    return;
  }
  OPTICS_TOKEN.lastIndex = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  let speechBuf = '';
  const flushSpeech = () => {
    const inner = speechBuf.replace(/^\s+|\s+$/g, '');
    if (inner) segs.push({ kind: 'speech', parts: parseSpeechParts(inner) });
    speechBuf = '';
  };
  while ((m = OPTICS_TOKEN.exec(para))) {
    speechBuf += para.slice(last, m.index);
    const tok = m[1];
    if ((tok.startsWith('((') && tok.endsWith('))')) || (tok.startsWith('*') && tok.endsWith('*'))) {
      flushSpeech();
      segs.push({ kind: 'whisper', text: unwrapWhisper(tok) });
    } else {
      // Quoted speech: keep surrounding sentence as one spoken beat.
      speechBuf += unwrapQuotes(tok);
    }
    last = m.index + tok.length;
  }
  speechBuf += para.slice(last);
  flushSpeech();
}

function looksLikeStage(p: string): boolean {
  // Name + action, or parenthetical tip, without being a long spoken turn.
  if (/^\(.*\)$/.test(p)) return true;
  if (p.length <= 120 && /\b(winkt|zeigt|lächelt|smiles|taps|points|laughs|nods|leans|whispers)\b/i.test(p)) return true;
  if (p.length <= 90 && !/[?！？]/.test(p) && /[—–-]/.test(p) && !/^(Willkommen|Hallo|Hi|Hey|Guten)\b/i.test(p)) {
    return true;
  }
  return false;
}

/** Hebrew, Arabic, and Persian-block letters (covers Persian + Sorani). */
const RTL_CHAR = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LTR_CHAR = /[A-Za-z\u00C0-\u024F]/;

/** Paragraph direction for chat optics — RTL when the text has strong RTL letters. */
export function textDirection(text: string): 'rtl' | 'ltr' {
  if (RTL_CHAR.test(text)) return 'rtl';
  if (LTR_CHAR.test(text)) return 'ltr';
  return 'ltr';
}
