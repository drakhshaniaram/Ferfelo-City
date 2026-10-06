import test from 'node:test';
import assert from 'node:assert/strict';
import {
  fellowReplyFromTerminal,
  isFellowChatChrome,
  parseFellowOptics,
  parseSpeechParts,
  practiceLinesFromReply,
  rejoinSoftWraps,
  stripFellowBriefEcho,
  textDirection,
} from '../src/shared/fellow-chat.js';
import { isRtlLanguage } from '../src/shared/fellows.js';

test('chrome lines from Cursor TUI are recognized', () => {
  assert.equal(isFellowChatChrome('⠛⠄ Working'), true);
  assert.equal(isFellowChatChrome('⠛⠄ Thinking'), true);
  assert.equal(isFellowChatChrome('⠛⠄ Working  122 tokens'), true);
  assert.equal(isFellowChatChrome('~ Use /mcp to connect Cursor to your tools and data sources.'), true);
  assert.equal(isFellowChatChrome('~ Use /plan to iterate on an implementation plan before code changes.'), true);
  assert.equal(isFellowChatChrome('→ Add a follow-up                                       ctrl+c to stop'), true);
  assert.equal(isFellowChatChrome('Cursor Agent'), true);
  assert.equal(isFellowChatChrome('v2026.10.01-e373342'), true);
  assert.equal(isFellowChatChrome('Tip: Use /run-everything to skip all approvals.'), true);
  assert.equal(isFellowChatChrome('→ Plan, search, build anything'), true);
  assert.equal(isFellowChatChrome('Auto'), true);
  assert.equal(isFellowChatChrome('>1u'), true);

  assert.equal(isFellowChatChrome('Auto · 7.2%'), true);
  assert.equal(isFellowChatChrome('~/agent-office/tst/drakhshaniaram/Alongside · main'), true);
  assert.equal(isFellowChatChrome('Hi! Welcome back to the kitchen.'), false);
  assert.equal(isFellowChatChrome('„Hallo! Bereit zum Kochen?“'), false);
});

test('fellowReplyFromTerminal keeps the spoken lines and drops redraw chrome', () => {
  const dump = [
    '⠆⠆ Working',
    '    ~ Use /mcp to connect Cursor to your tools and data sources.',
    '',
    '  → Add a follow-up                                       ctrl+c to stop',
    '',
    '  Auto · 7.2%',
    '  ~/agent-office/tst/drakhshaniaram/Alongside · main',
    '⠛⠄ Working',
    '    ~ Use /mcp to connect Cursor to your tools and data sources.',
    '  Hi! Welcome back to the kitchen.',
    '',
    '  We’re still on tonight’s plan: a simple dinner for your girlfriend.',
    '',
    '  Warm way to start:',
    '',
    '  „Hallo! Bereit zum Kochen?“',
    '  (Hi! Ready to cook?)',
    '',
    '⠛⠄ Working  122 tokens',
    '  Want to try „Hallo!“ or pick our dish — Nudeln, Hähnchen, or Salat?',
    '',
    '  → Add a follow-up',
    '',
    '  Auto · 7.3%',
    '  ~/agent-office/tst/drakhshaniaram/Alongside · main',
  ].join('\n');

  assert.equal(
    fellowReplyFromTerminal(dump),
    [
      'Hi! Welcome back to the kitchen.',
      '',
      'We’re still on tonight’s plan: a simple dinner for your girlfriend.',
      '',
      'Warm way to start:',
      '',
      '„Hallo! Bereit zum Kochen?“',
      '(Hi! Ready to cook?)',
      '',
      'Want to try „Hallo!“ or pick our dish — Nudeln, Hähnchen, or Salat?',
    ].join('\n'),
  );
});

test('screen clear keeps only the latest frame', () => {
  const raw = `old chrome\x1b[2JHi from Marco.\n→ Add a follow-up`;
  assert.equal(fellowReplyFromTerminal(raw), 'Hi from Marco.');
});

test('parseFellowOptics splits whisper and speech like Character.ai', () => {
  const segs = parseFellowOptics(
    '((Marco smiles and taps the pan.))\n„Hallo! Bereit zum Kochen?“\n((Soft tip — try repeating „Hallo“.))',
  );
  assert.deepEqual(segs, [
    { kind: 'whisper', text: 'Marco smiles and taps the pan.' },
    { kind: 'speech', parts: [{ kind: 'say', text: 'Hallo! Bereit zum Kochen?' }] },
    { kind: 'whisper', text: 'Soft tip — try repeating „Hallo“.' },
  ]);
  assert.deepEqual(parseSpeechParts('A wise choice. ((He traces a line.)) Will this help?'), [
    { kind: 'say', text: 'A wise choice. ' },
    { kind: 'aside', text: 'He traces a line.' },
    { kind: 'say', text: ' Will this help?' },
  ]);
  // Legacy *asterisks* still parse
  assert.deepEqual(parseFellowOptics('*Marco smiles.*\n„Hallo!“'), [
    { kind: 'whisper', text: 'Marco smiles.' },
    { kind: 'speech', parts: [{ kind: 'say', text: 'Hallo!' }] },
  ]);
});

test('optics accept German single quotes and heuristic stage when markers missing', () => {
  const segs = parseFellowOptics(
    [
      'Lena winkt dir zu — Festzelt, Brezelduft, Musik aus Hamburg.',
      '',
      'Willkommen! Ich bin Lena. Heute feiern wir Oktoberfest — hier in Hamburg, mit Einheimischen.',
      'Sie zeigt aufs Zelt.',
      '',
      'Komm mit. Sag einfach: ‚Hallo, ich bin …‘ — und deinen Namen.',
    ].join('\n'),
  );
  assert.deepEqual(
    segs.map((s) => s.kind),
    ['whisper', 'speech', 'whisper', 'speech'],
  );
  const last = segs[3] as { kind: 'speech'; parts: { text: string }[] };
  assert.match(last.parts.map((p) => p.text).join(''), /Komm mit.*Hallo, ich bin/);
});

test('drops rotating ~ Use /plan tip but keeps the greeting', () => {
  const dump = [
    '~ Use /plan to iterate on an implementation plan before code changes.',
    '',
    'Hi again!',
    '',
    'Nice and simple — Hallo works the same in German.',
    '',
    'Say it with me:',
    '',
    '„Hallo, Marco!“',
    '',
    'Then we cook. What’s for dinner — Nudeln, Hähnchen, or Salat?',
  ].join('\n');
  assert.equal(
    fellowReplyFromTerminal(dump),
    [
      'Hi again!',
      '',
      'Nice and simple — Hallo works the same in German.',
      '',
      'Say it with me:',
      '',
      '„Hallo, Marco!“',
      '',
      'Then we cook. What’s for dinner — Nudeln, Hähnchen, or Salat?',
    ].join('\n'),
  );
});

test('strips Cursor banner and echoed hire brief from Lena opening', () => {
  const dump = [
    '>1u',
    '',
    'Cursor Agent',
    '',
    'v2026.10.01-e373342',
    '',
    'Tip: Use /run-everything to skip all approvals.',
    '',
    '→ Plan, search, build anything',
    '',
    'Auto',
    '',
    'You are Lena, a language fellow in Ferfelo Academy — a lively 3D learning space, not a',
    'coding office.',
    '',
    'Your role: Oktoberfest / Hamburg celebration guide.',
    '',
    'The learner’s native language is German. Their target language is German. Level: Immersed.',
    '',
    'Language mix for this level: about 90% German and 10% German. Stay in the target language;',
    'convey meaning with simpler words and gesture cues.',
    '',
    'Today’s scene: Celebrate Oktoberfest-style in Hamburg with locals.',
    '',
    'Stay in character as a warm cultural guide. Teach through the scene — phrases, customs,',
    'small decisions — not through abstract grammar lectures unless asked.',
    '',
    'You are not a clinician. If the scene is emotional (check-in), stay supportive and',
    'non-clinical; suggest real help if they need it.',
    '',
    'Tools you may lean on when helpful (describe them in chat; the academy may wire real UI',
    'later): local-tips, phrase-cards.',
    '',
    'Keep turns short. Invite the learner to try saying something in German. Celebrate',
    'attempts. Correct gently.',
    '',
    'Format every reply for the academy chat UI in two layers:',
    '',
    '1. Stage direction, thinking, and scaffolding in',
    '',
    'asterisks',
    '',
    '(one short beat).',
    '',
    '2. Spoken lines in German quotation marks',
    '',
    'like this',
    '(English',
    '',
    'quotes',
    'ok too). You may',
    '',
    'put a brief',
    '',
    'aside',
    '',
    'inside a spoken line.',
    '',
    'Example:',
    '',
    'Marco smiles and taps the pan.',
    '',
    'Hallo! Bereit zum Kochen?',
    'Soft tip — try repeating „Hallo“.',
    '',
    'Open the scene now: greet them as Lena and start “Celebrate Oktoberfest-style in Hamburg',
    '',
    'with locals”.',
    '',
    'Lena winkt dir zu — Festzelt, Brezelduft, Musik aus Hamburg.',
    '',
    'Willkommen! Ich bin Lena. Heute feiern wir Oktoberfest — hier in Hamburg, mit Einheimischen.',
    'Sie zeigt aufs Zelt.',
    '',
    'Komm mit. Sag einfach: ‚Hallo, ich bin …‘ — und deinen Namen.',
  ].join('\n');

  const reply = fellowReplyFromTerminal(dump);
  assert.doesNotMatch(reply, /Cursor Agent/);
  assert.doesNotMatch(reply, /You are Lena/);
  assert.doesNotMatch(reply, /Open the scene now/);
  assert.doesNotMatch(reply, /language fellow in Ferfelo Academy/);
  assert.match(reply, /Lena winkt dir zu/);
  assert.match(reply, /Willkommen/);
  assert.match(reply, /Hallo, ich bin/);
});

test('textDirection and isRtlLanguage recognize Persian and Sorani', () => {
  assert.equal(textDirection('سلام، بیا برویم.'), 'rtl');
  assert.equal(textDirection('Joost schüttelt den Regen.'), 'ltr');
  assert.equal(textDirection('Salam! Ich bin Joost.'), 'ltr');
  assert.equal(isRtlLanguage('Persian'), true);
  assert.equal(isRtlLanguage('Central Kurdish (Sorani)'), true);
  assert.equal(isRtlLanguage('German'), false);
});

test('rejoinSoftWraps and stripFellowBriefEcho are composable', () => {
  const soft = rejoinSoftWraps(
    [
      'You are Lena, a language fellow in Ferfelo Academy — a lively 3D learning space, not a',
      'coding office.',
      '',
      'Open the scene now: greet them as Lena and start “Celebrate Oktoberfest-style in Hamburg',
      'with locals”.',
      '',
      '((Lena winkt.))',
      '„Willkommen!“',
    ].join('\n'),
  );
  assert.match(soft, /not a coding office/);
  assert.match(soft, /Hamburg with locals/);
  const cleaned = stripFellowBriefEcho(soft);
  assert.equal(cleaned, '((Lena winkt.))\n„Willkommen!“');
});

test('practiceLinesFromReply pulls spoken chunks for chips', () => {
  assert.deepEqual(practiceLinesFromReply('((winkt))\n„Prost!“\n„Noch eins?“'), ['Prost!', 'Noch eins?']);
  assert.deepEqual(practiceLinesFromReply('((only a stage tip — no spoken line yet))'), []);
});
