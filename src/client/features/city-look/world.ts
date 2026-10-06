/**
 * Cartoon set dressing for Academy city floors: chunky toon props on the walls that read as each
 * city's vibe without photo posters (canal houses, harbor brick, café awnings, turquoise arches).
 */
import * as THREE from 'three';
import { wallPose } from '../../../shared/decor';
import type { CityId } from '../../../shared/cities';
import { mesh, toon } from '../../world/toon';

function disposeGroup(g: THREE.Object3D) {
  // Toon materials are shared/cached — only free geometries.
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.geometry?.dispose();
  });
}

/** Stick a local-space group flat against a wall at (u, y). */
function onWall(wall: 'north' | 'south' | 'east' | 'west', u: number, y: number, local: THREE.Group) {
  const pose = wallPose(wall, u, y, 0.08);
  local.position.set(pose.x, pose.y, pose.z);
  local.rotation.y = pose.rotY;
  return local;
}

function box(w: number, h: number, d: number, color: string, x = 0, y = 0, z = 0) {
  return mesh(new THREE.BoxGeometry(w, h, d), toon(color), x, y, z, false);
}

/** Amsterdam: stepped canal gables + bike + tulip blobs. */
function amsterdam(): THREE.Group {
  const root = new THREE.Group();
  const houses = new THREE.Group();
  const colors = ['#ff6b4a', '#5ec4e0', '#ffe066', '#7bd389', '#c77dff'];
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 0.95;
    const h = 1.4 + (i % 3) * 0.25;
    houses.add(box(0.85, h, 0.2, colors[i], x, h / 2 - 0.7, 0));
    // Stepped gable
    houses.add(box(0.55, 0.22, 0.22, colors[i], x, h / 2 - 0.7 + 0.2, 0));
    houses.add(box(0.32, 0.18, 0.22, colors[i], x, h / 2 - 0.7 + 0.38, 0));
    houses.add(box(0.18, 0.14, 0.12, '#fff8e7', x, 0.05, 0.06));
  }
  root.add(onWall('north', 0, 3.2, houses));

  const bike = new THREE.Group();
  bike.add(mesh(new THREE.TorusGeometry(0.28, 0.04, 8, 16), toon('#2b2d42'), -0.35, 0, 0, false));
  bike.add(mesh(new THREE.TorusGeometry(0.28, 0.04, 8, 16), toon('#2b2d42'), 0.35, 0, 0, false));
  bike.add(box(0.7, 0.06, 0.06, '#ff5a1f', 0, 0.12, 0));
  bike.add(box(0.08, 0.35, 0.06, '#ff5a1f', -0.2, 0.28, 0));
  root.add(onWall('west', 2, 1.6, bike));

  const tulips = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 0.35;
    tulips.add(box(0.04, 0.45, 0.04, '#3a9b4a', x, 0, 0));
    tulips.add(mesh(new THREE.SphereGeometry(0.12, 8, 8), toon(['#ff4d6d', '#ff9f1c', '#ffe066', '#ff4d6d'][i]), x, 0.28, 0, false));
  }
  root.add(onWall('east', -2, 1.8, tulips));
  return root;
}

/** Hamburg: brick warehouse blocks + ship + anchor. */
function hamburg(): THREE.Group {
  const root = new THREE.Group();
  const brick = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 1.1;
    brick.add(box(1, 1.5, 0.22, '#c45c3a', x, 0, 0));
    for (let r = 0; r < 3; r++) {
      brick.add(box(0.7, 0.18, 0.06, '#8fd3ff', x, -0.4 + r * 0.4, 0.12));
    }
    brick.add(box(1.05, 0.12, 0.28, '#3d405b', x, 0.82, 0));
  }
  root.add(onWall('north', 0, 3.0, brick));

  const ship = new THREE.Group();
  ship.add(box(1.6, 0.35, 0.35, '#2b2d42', 0, 0, 0));
  ship.add(box(0.9, 0.35, 0.3, '#ef476f', 0.1, 0.3, 0));
  ship.add(box(0.08, 0.7, 0.08, '#fffaf3', -0.2, 0.55, 0));
  root.add(onWall('west', -1, 1.7, ship));

  const anchor = new THREE.Group();
  anchor.add(box(0.12, 0.7, 0.12, '#4a5568', 0, 0.1, 0));
  anchor.add(mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 12), toon('#4a5568'), 0, 0.45, 0, false));
  anchor.add(box(0.55, 0.1, 0.1, '#4a5568', 0, -0.25, 0));
  root.add(onWall('east', 1.5, 1.9, anchor));
  return root;
}

/** Paris: cream façades + striped awning + tower silhouette. */
function paris(): THREE.Group {
  const root = new THREE.Group();
  const tower = new THREE.Group();
  tower.add(box(0.15, 2.2, 0.15, '#5c4033', 0, 0, 0));
  tower.add(box(0.7, 0.08, 0.08, '#5c4033', 0, 0.5, 0));
  tower.add(box(0.5, 0.08, 0.08, '#5c4033', 0, 0.95, 0));
  tower.add(box(0.3, 0.08, 0.08, '#5c4033', 0, 1.35, 0));
  tower.add(mesh(new THREE.ConeGeometry(0.12, 0.35, 4), toon('#5c4033'), 0, 1.25, 0, false));
  root.add(onWall('north', 0, 3.1, tower));

  const awning = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    awning.add(box(0.28, 0.55, 0.08, i % 2 ? '#e63946' : '#fffaf3', (i - 2.5) * 0.28, 0, 0));
  }
  awning.add(box(1.8, 0.08, 0.1, '#2b2d42', 0, 0.32, 0));
  root.add(onWall('west', 0, 2.2, awning));

  const cafe = new THREE.Group();
  cafe.add(box(1.2, 0.9, 0.15, '#ffe8d2', 0, 0, 0));
  cafe.add(box(0.35, 0.45, 0.05, '#8fd3ff', -0.3, 0.05, 0.08));
  cafe.add(box(0.35, 0.45, 0.05, '#8fd3ff', 0.3, 0.05, 0.08));
  cafe.add(box(1.25, 0.12, 0.2, '#e6b422', 0, 0.5, 0.02));
  root.add(onWall('east', -1, 1.8, cafe));
  return root;
}

/** Tehran: turquoise tile arch + mountains + tea pot. */
function tehran(): THREE.Group {
  const root = new THREE.Group();
  const arch = new THREE.Group();
  arch.add(box(2.2, 0.25, 0.2, '#0f9b8e', 0, -0.6, 0));
  arch.add(box(0.35, 1.4, 0.2, '#0f9b8e', -0.9, 0.1, 0));
  arch.add(box(0.35, 1.4, 0.2, '#0f9b8e', 0.9, 0.1, 0));
  const crescent = mesh(new THREE.TorusGeometry(0.7, 0.18, 8, 20, Math.PI), toon('#14b8a6'), 0, 0.55, 0, false);
  crescent.rotation.z = Math.PI;
  arch.add(crescent);
  // Tile dots
  for (let i = 0; i < 5; i++) {
    arch.add(mesh(new THREE.SphereGeometry(0.08, 8, 8), toon('#ffe066'), (i - 2) * 0.35, -0.35, 0.12, false));
  }
  root.add(onWall('north', 0, 3.0, arch));

  const peaks = new THREE.Group();
  peaks.add(mesh(new THREE.ConeGeometry(0.7, 1.1, 4), toon('#8b9bb4'), -0.6, 0, 0, false));
  peaks.add(mesh(new THREE.ConeGeometry(0.9, 1.5, 4), toon('#6e7f99'), 0.3, 0.1, 0, false));
  peaks.add(mesh(new THREE.ConeGeometry(0.35, 0.4, 4), toon('#fffaf3'), 0.3, 0.75, 0, false));
  root.add(onWall('west', 1, 2.0, peaks));

  const tea = new THREE.Group();
  tea.add(mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.35, 12), toon('#c86a3a'), 0, 0, 0, false));
  tea.add(mesh(new THREE.TorusGeometry(0.18, 0.04, 8, 12, Math.PI), toon('#c86a3a'), 0.28, 0, 0, false));
  tea.add(mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.12, 10), toon('#0f9b8e'), 0, 0.22, 0, false));
  root.add(onWall('east', 0, 1.7, tea));
  return root;
}

const BUILDERS: Record<CityId, () => THREE.Group> = {
  amsterdam,
  hamburg,
  paris,
  tehran,
};

/** Cartoon props for a city floor; caller parents into the office and disposes later. */
export function buildCityLook(cityId: CityId): THREE.Group {
  const g = BUILDERS[cityId]();
  g.name = `city-look-${cityId}`;
  return g;
}

export function disposeCityLook(g: THREE.Group) {
  disposeGroup(g);
}
