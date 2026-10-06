import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { Building, FloorDef } from './building.js';

/**
 * Academy with an empty building: a plain campus folder so learners land on a floor instead of the
 * GitHub “first project” elevator. No-op once any floor (or clone) is already there.
 */
export function ensureCampus(building: Building, by: string): FloorDef | undefined {
  if (building.list().length || building.pending().length) return building.list()[0];
  const dir = path.join(building.projectsDir, 'ferfelo-campus');
  mkdirSync(dir, { recursive: true });
  if (!existsSync(path.join(dir, 'README.md'))) writeFileSync(path.join(dir, 'README.md'), '# Ferfelo Campus\n\nLanguage fellows for Ferfelo Academy.\n');
  return building.seedFloor('Ferfelo Campus', dir, by);
}
