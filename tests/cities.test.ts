import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Building } from '../src/server/building.js';
import { addCityFloor } from '../src/server/city-floors.js';
import { CITY_CATALOG, CITY_IDS, cityOf } from '../src/shared/cities.js';

test('city catalog has Amsterdam (Dutch) and Hamburg (German) with unique vibes', () => {
  assert.equal(cityOf('amsterdam')?.targetLanguage, 'Dutch');
  assert.equal(cityOf('hamburg')?.targetLanguage, 'German');
  assert.ok(CITY_IDS.includes('amsterdam'));
  assert.ok(CITY_CATALOG.amsterdam.pictures.length >= 2);
  assert.ok(cityOf('amsterdam')?.mood.includes('Canal'));
  assert.ok(cityOf('paris')?.welcome.toLowerCase().includes('paris'));
  assert.notEqual(cityOf('amsterdam')?.palette, cityOf('hamburg')?.palette);
});

test('addCityFloor seeds Amsterdam under projects/cities and refuses duplicates', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'agent-office-city-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dataDir = path.join(root, '.agent-office');
  mkdirSync(dataDir);
  const building = new Building(dataDir, root);
  const first = addCityFloor(building, 'amsterdam', 'Sam');
  assert.equal(typeof first, 'object');
  const def = first as Exclude<typeof first, string>;
  assert.equal(def.cityId, 'amsterdam');
  assert.equal(def.name, 'Amsterdam');
  assert.ok(existsSync(path.join(def.dir, 'README.md')));
  assert.equal(addCityFloor(building, 'amsterdam', 'Sam'), 'Amsterdam is already a floor');
  assert.equal(addCityFloor(building, 'nope', 'Sam'), 'Pick a city from the academy list');
  const saved = JSON.parse(readFileSync(path.join(dataDir, 'floors.json'), 'utf8')) as { cityId?: string }[];
  assert.equal(saved[0]?.cityId, 'amsterdam');
});
