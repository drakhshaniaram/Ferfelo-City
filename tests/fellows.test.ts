import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LEARNER,
  FELLOW_CATALOG,
  FELLOW_IDS,
  LEARNER_LANGUAGES,
  fellowBrief,
  isFellowId,
  resolveLearnerLanguage,
  sanitizeLearner,
} from '../src/shared/fellows.js';

test('catalog has the seed fellows', () => {
  assert.equal(FELLOW_IDS.length, 7);
  assert.equal(FELLOW_CATALOG.oktoberfest.name, 'Lena');
  assert.equal(FELLOW_CATALOG.chef.name, 'Marco');
  assert.ok(isFellowId('youtube'));
  assert.equal(isFellowId('coder'), false);
});

test('learner language catalog covers Persian, Sorani, and European defaults', () => {
  assert.ok(LEARNER_LANGUAGES.includes('Persian'));
  assert.ok(LEARNER_LANGUAGES.includes('Central Kurdish (Sorani)'));
  assert.ok(LEARNER_LANGUAGES.includes('English'));
  assert.ok(LEARNER_LANGUAGES.includes('German'));
  assert.ok(LEARNER_LANGUAGES.includes('French'));
  assert.equal(resolveLearnerLanguage('farsi', 'English'), 'Persian');
  assert.equal(resolveLearnerLanguage('sorani', 'English'), 'Central Kurdish (Sorani)');
  assert.equal(resolveLearnerLanguage('Deutsch', 'English'), 'German');
  assert.equal(resolveLearnerLanguage('nope', 'French'), 'French');
});

test('sanitizeLearner fills defaults and clamps', () => {
  assert.deepEqual(sanitizeLearner(null), DEFAULT_LEARNER);
  assert.equal(sanitizeLearner({ level: 'growing' }).level, 'growing');
  assert.equal(sanitizeLearner({ level: 'nope' as 'newbie' }).level, 'newbie');
  assert.equal(sanitizeLearner({ nativeLanguage: '  Persian  ' }).nativeLanguage, 'Persian');
  assert.equal(sanitizeLearner({ targetLanguage: 'ckb' }).targetLanguage, 'Central Kurdish (Sorani)');
});

test('fellowBrief names the fellow, languages, and scene', () => {
  const text = fellowBrief('oktoberfest', { ...DEFAULT_LEARNER, level: 'newbie' }, 'Toast at a Hamburg tent');
  assert.match(text, /Lena/);
  assert.match(text, /German/);
  assert.match(text, /English/);
  assert.match(text, /Newbie/);
  assert.match(text, /Toast at a Hamburg tent/);
  assert.match(text, /Ferfelo Academy/);
  assert.match(text, /local-tips/);
  assert.match(text, /Hard language rules/);
  assert.match(text, /short stage beat in English/);
  assert.doesNotMatch(text, /Hallo! Bereit zum Kochen/);
});

test('fellowBrief pins scaffolding to a non-English native language', () => {
  const text = fellowBrief(
    'amsterdam',
    { nativeLanguage: 'Persian', targetLanguage: 'Dutch', level: 'newbie' },
    'Rainy canals',
  );
  assert.match(text, /native language is Persian/);
  assert.match(text, /target language is Dutch/);
  assert.match(text, /MUST be written in Persian only/);
  assert.match(text, /MUST be in Dutch/);
  assert.match(text, /فارسی/);
  assert.match(text, /short stage beat in Persian/);
  assert.match(text, /one short phrase in Dutch/);
  assert.doesNotMatch(text, /Soft tip — try repeating/);
});
