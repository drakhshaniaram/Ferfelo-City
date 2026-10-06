import test from 'node:test';
import assert from 'node:assert/strict';
import { isAcademyMode, parseOfficeMode } from '../src/shared/mode.js';

test('parseOfficeMode defaults to academy', () => {
  assert.equal(parseOfficeMode(undefined), 'academy');
  assert.equal(parseOfficeMode('coding'), 'coding');
  assert.equal(parseOfficeMode('CODE'), 'coding');
  assert.equal(parseOfficeMode('academy'), 'academy');
  assert.equal(isAcademyMode('academy'), true);
  assert.equal(isAcademyMode('coding'), false);
});
