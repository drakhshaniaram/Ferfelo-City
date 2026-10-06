import test from 'node:test';
import assert from 'node:assert/strict';
import { CHARTS_WORLD, chartPackForCity } from '../src/shared/charts.js';

test('chartPackForCity matches Germany and falls back worldwide', () => {
  assert.equal(chartPackForCity('Hamburg, Germany').cityMatch.includes('hamburg'), true);
  assert.equal(chartPackForCity('Tehran').label.includes('Iran'), true);
  assert.equal(chartPackForCity('Nowhereville'), CHARTS_WORLD);
  assert.equal(chartPackForCity(undefined), CHARTS_WORLD);
  assert.equal(chartPackForCity('Berlin').tracks.length, 30);
});
