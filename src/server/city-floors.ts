import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { MAX_FLOORS } from '../shared/floors.js';
import { cityOf, isCityId, type CityId } from '../shared/cities.js';
import type { Building, FloorDef } from './building.js';

/**
 * Academy: add a curated city as a floor (no GitHub clone). Folder lives under
 * <projectsDir>/cities/<id>/ with a small README; wall pictures seed when the floor opens.
 */
export function addCityFloor(building: Building, city: string, by: string): FloorDef | string {
  if (!isCityId(city)) return 'Pick a city from the academy list';
  const id = city as CityId;
  if (building.list().some((d) => d.cityId === id)) return `${cityOf(id)!.name} is already a floor`;
  if (building.list().length + building.pending().length >= MAX_FLOORS) return `The building is full (${MAX_FLOORS} floors)`;
  const def = cityOf(id)!;
  const dir = path.join(building.projectsDir, 'cities', id);
  mkdirSync(dir, { recursive: true });
  const readme = path.join(dir, 'README.md');
  if (!existsSync(readme)) {
    writeFileSync(
      readme,
      `# ${def.name}\n\nFerfelo Academy city floor. Practice language: **${def.targetLanguage}**.\nFellows on this floor speak ${def.targetLanguage} by default.\n`,
    );
  }
  return building.seedFloor(def.name, dir, by, { cityId: id, palette: def.palette });
}
