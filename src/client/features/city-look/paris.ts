import * as THREE from 'three';
import {
  NORTH_ABOVE_BOARDS_Y,
  NORTH_EAST_CLEAR,
  NORTH_WEST_CLEAR,
  SOUTH_SOLID,
  banner,
  box,
  cyl,
  lanterns,
  mesh,
  onWall,
  rug,
  sphere,
  toon,
} from './kit';

/** Paris: façades above boards; awnings as floor café props — no west-wall glass hangings. */
export function parisLook(): THREE.Group {
  const root = new THREE.Group();

  const face = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 1.15;
    face.add(box(1.05, 1.25, 0.16, '#ffe8d2', x, 0, 0));
    face.add(box(0.32, 0.4, 0.05, '#8fd3ff', x - 0.24, 0.15, 0.1));
    face.add(box(0.32, 0.4, 0.05, '#8fd3ff', x + 0.24, 0.15, 0.1));
    face.add(box(0.14, 0.1, 0.03, '#e63946', x - 0.24, 0.15, 0.12));
    face.add(box(0.14, 0.1, 0.03, '#e63946', x + 0.24, 0.15, 0.12));
    face.add(box(0.28, 0.38, 0.06, '#5c4033', x, -0.4, 0.08));
    face.add(box(1.1, 0.1, 0.18, '#e6b422', x, 0.7, 0.02));
  }
  root.add(onWall('north', -4, NORTH_ABOVE_BOARDS_Y, face));

  const tower = new THREE.Group();
  tower.add(box(0.18, 2.6, 0.18, '#5c4033', 0, 0, 0));
  for (const y of [0.4, 0.95, 1.45, 1.9]) tower.add(box(0.85 - y * 0.2, 0.08, 0.08, '#5c4033', 0, y, 0));
  tower.add(mesh(new THREE.ConeGeometry(0.14, 0.4, 4), toon('#5c4033'), 0, 1.5, 0, false));
  root.add(onWall('north', NORTH_WEST_CLEAR, 4.8, tower));

  // Striped awning as a floor café stand (not hung on west glass).
  for (const [x, z] of [
    [-15.0, -10.2],
    [14.2, 10.0],
  ] as const) {
    const awning = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      awning.add(box(0.26, 0.55, 0.08, i % 2 ? '#e63946' : '#fffaf3', (i - 3) * 0.26, 1.1, 0));
    }
    awning.add(box(1.9, 0.08, 0.1, '#2b2d42', 0, 1.42, 0));
    awning.add(box(0.08, 1.0, 0.08, '#5c4033', -0.85, 0.5, 0.2));
    awning.add(box(0.08, 1.0, 0.08, '#5c4033', 0.85, 0.5, 0.2));
    awning.position.set(x, 0, z);
    root.add(awning);
  }

  const metro = new THREE.Group();
  metro.add(box(0.9, 0.9, 0.1, '#e63946', 0, 0, 0));
  metro.add(box(0.7, 0.7, 0.12, '#fffaf3', 0, 0, 0.02));
  metro.add(box(0.35, 0.12, 0.14, '#e63946', 0, 0, 0.04));
  root.add(onWall('east', -11.5, 2.2, metro));

  const bake = new THREE.Group();
  bake.add(box(1.6, 0.5, 0.1, '#ffe8d2', 0, 0, 0));
  bake.add(box(1.65, 0.08, 0.12, '#e6b422', 0, 0.28, 0));
  bake.add(sphere(0.14, '#e6b422', -0.45, 0, 0.08));
  bake.add(sphere(0.1, '#c45c3a', -0.2, 0.05, 0.08));
  root.add(onWall('east', 10, 2.0, bake));

  const cafe = new THREE.Group();
  cafe.add(cyl(0.35, 0.35, 0.05, '#5c4033', 0, 0.72, 0));
  cafe.add(cyl(0.05, 0.05, 0.7, '#2b2d42', 0, 0.35, 0));
  cafe.add(box(0.35, 0.45, 0.35, '#e63946', 0.7, 0.4, 0));
  cafe.add(box(0.35, 0.45, 0.35, '#e63946', -0.7, 0.4, 0));
  cafe.add(cyl(0.06, 0.05, 0.12, '#fffaf3', 0.1, 0.82, 0.1));
  cafe.position.set(13.5, 0, -10.5);
  root.add(cafe);

  root.add(banner('south', SOUTH_SOLID[2], '#002395'));
  root.add(banner('south', SOUTH_SOLID[2] + 1.8, '#fffaf3'));
  root.add(banner('south', SOUTH_SOLID[3], '#ed2939'));
  root.add(lanterns('north', [NORTH_WEST_CLEAR, NORTH_EAST_CLEAR, NORTH_EAST_CLEAR + 2.2], ['#e6b422', '#e63946', '#ffe066']));
  root.add(lanterns('south', [SOUTH_SOLID[0], SOUTH_SOLID[1], SOUTH_SOLID[3]], ['#e6b422', '#e63946', '#ffe066']));

  root.add(rug(1.4, 1.0, '#e63946', -12, -10));
  root.add(rug(1.2, 0.9, '#002395', 12, 10));
  root.add(rug(1.3, 1.0, '#e6b422', -12, 10));

  const seine = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    seine.add(box(0.5, 0.15 + (i % 3) * 0.05, 0.12, '#5ec4e0', (i - 3.5) * 0.55, Math.sin(i) * 0.08, 0));
  }
  root.add(onWall('south', SOUTH_SOLID[1], 1.6, seine));

  return root;
}
