import * as THREE from 'three';
import { NORTH_BOARD_EAST, NORTH_BOARD_WEST, banner, box, cyl, lanterns, mesh, onWall, rug, toon } from './kit';

/** Hamburg: Speicherstadt brick, ships, anchors, fish-stand vibe. */
export function hamburgLook(): THREE.Group {
  const root = new THREE.Group();

  // Brick warehouse row on the south wall — north stays clear for the boards.
  const brick = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const x = (i - 2.5) * 1.15;
    brick.add(box(1.05, 1.7, 0.24, '#c45c3a', x, 0, 0));
    for (let r = 0; r < 4; r++) {
      brick.add(box(0.75, 0.2, 0.06, '#8fd3ff', x, -0.55 + r * 0.38, 0.14));
    }
    brick.add(box(1.1, 0.14, 0.3, '#3d405b', x, 0.92, 0));
    for (let r = 0; r < 5; r++) brick.add(box(1.05, 0.03, 0.02, '#8b3a22', x, -0.7 + r * 0.35, 0.13));
  }
  brick.add(box(7.2, 0.2, 0.4, '#4a6fa5', 0, -1.05, 0.1));
  root.add(onWall('south', 0, 3.15, brick));

  const elphi = new THREE.Group();
  elphi.add(box(2.4, 0.9, 0.3, '#dce3ea', 0, 0, 0));
  for (let i = 0; i < 5; i++) {
    elphi.add(box(0.35, 0.15 + i * 0.08, 0.12, '#fffaf3', (i - 2) * 0.4, 0.55 + i * 0.02, 0.1));
  }
  root.add(onWall('north', NORTH_BOARD_WEST - 0.8, 2.6, elphi));

  for (const u of [-5, 2]) {
    const ship = new THREE.Group();
    ship.add(box(1.8, 0.4, 0.4, '#2b2d42', 0, 0, 0));
    ship.add(box(1.0, 0.4, 0.32, '#ef476f', 0.15, 0.35, 0));
    ship.add(box(0.08, 0.75, 0.08, '#fffaf3', -0.25, 0.6, 0));
    ship.add(box(0.5, 0.08, 0.08, '#fffaf3', -0.05, 0.95, 0));
    root.add(onWall('west', u, 1.75, ship));
  }

  const anchor = new THREE.Group();
  anchor.add(box(0.14, 0.85, 0.14, '#4a5568', 0, 0.15, 0));
  anchor.add(mesh(new THREE.TorusGeometry(0.25, 0.055, 8, 14), toon('#4a5568'), 0, 0.55, 0, false));
  anchor.add(box(0.65, 0.12, 0.12, '#4a5568', 0, -0.3, 0));
  anchor.add(box(0.12, 0.35, 0.12, '#4a5568', -0.28, -0.4, 0));
  anchor.add(box(0.12, 0.35, 0.12, '#4a5568', 0.28, -0.4, 0));
  root.add(onWall('east', 2, 2.0, anchor));

  const fish = new THREE.Group();
  fish.add(box(1.4, 0.7, 0.5, '#fffaf3', 0, 0.4, 0));
  fish.add(box(1.5, 0.08, 0.55, '#ef476f', 0, 0.78, 0));
  fish.add(box(0.5, 0.15, 0.2, '#8fd3ff', -0.3, 0.9, 0.1));
  fish.add(box(0.5, 0.15, 0.2, '#ffd166', 0.3, 0.9, 0.1));
  fish.position.set(14, 0, -11);
  root.add(fish);

  root.add(banner('south', -7, '#ef476f'));
  root.add(banner('south', -5, '#2b2d42'));
  root.add(lanterns('east', [-6, -2, 2, 6], ['#ffd166', '#ef476f', '#8fd3ff', '#ffd166']));
  root.add(lanterns('north', [NORTH_BOARD_WEST - 1.4, NORTH_BOARD_EAST + 2, NORTH_BOARD_EAST + 4], ['#ffd166', '#ef476f', '#8fd3ff']));

  root.add(rug(1.5, 1.0, '#c45c3a', -12, -10));
  root.add(rug(1.2, 0.9, '#4a6fa5', 12, 10));
  root.add(rug(1.3, 1.0, '#3d405b', 12, -10));

  for (const [x, z] of [
    [-13, 11],
    [-11, 11],
    [13, 11],
  ] as const) {
    root.add(cyl(0.12, 0.14, 0.7, '#ef476f', x, 0.35, z));
  }

  const crane = new THREE.Group();
  crane.add(box(0.15, 2.0, 0.15, '#ffd166', 0, 0, 0));
  crane.add(box(1.6, 0.12, 0.12, '#ffd166', 0.6, 0.9, 0));
  crane.add(box(0.08, 0.6, 0.08, '#2b2d42', 1.3, 0.55, 0));
  root.add(onWall('west', 8, 2.8, crane));

  return root;
}
