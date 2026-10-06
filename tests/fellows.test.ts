import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_LEARNER, FELLOW_CATALOG, FELLOW_IDS, fellowBrief, isFellowId, sanitizeLearner } from '../src/shared/fellows.js';

test('catalog has the seed fellows', () => {
  assert.equal(FELLOW_IDS.length, 7);
  assert.equal(FELLOW_CATALOG.oktoberfest.name, 'Lena');
  assert.equal(FELLOW_CATALOG.chef.name, 'Marco');
  assert.ok(isFellowId('youtube'));
  assert.equal(isFellowId('coder'), false);
});

test('sanitizeLearner fills defaults and clamps', () => {
  assert.deepEqual(sanitizeLearner(null), DEFAULT_LEARNER);
  assert.equal(sanitizeLearner({ level: 'growing' }).level, 'growing');
  assert.equal(sanitizeLearner({ level: 'nope' as 'newbie' }).level, 'newbie');
  assert.equal(sanitizeLearner({ nativeLanguage: '  Persian  ' }).nativeLanguage, 'Persian');
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
});
