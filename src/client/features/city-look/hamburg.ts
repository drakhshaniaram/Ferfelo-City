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
  toon,
} from './kit';

/** Hamburg: brick skyline above boards; ships/crane on the floor — west wall stays clear of glass. */
export function hamburgLook(): THREE.Group {
  const root = new THREE.Group();

  const brick = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const x = (i - 2.5) * 0.95;
    brick.add(box(0.88, 1.15, 0.2, '#c45c3a', x, 0, 0));
    for (let r = 0; r < 3; r++) {
      brick.add(box(0.62, 0.16, 0.05, '#8fd3ff', x, -0.35 + r * 0.32, 0.12));
    }
    brick.add(box(0.92, 0.12, 0.24, '#3d405b', x, 0.65, 0));
    for (let r = 0; r < 4; r++) brick.add(box(0.88, 0.025, 0.02, '#8b3a22', x, -0.5 + r * 0.3, 0.11));
  }
  brick.add(box(6.0, 0.14, 0.32, '#4a6fa5', 0, -0.75, 0.08));
  root.add(onWall('north', -4, NORTH_ABOVE_BOARDS_Y, brick));

  const elphi = new THREE.Group();
  elphi.add(box(2.4, 0.9, 0.3, '#dce3ea', 0, 0, 0));
  for (let i = 0; i < 5; i++) {
    elphi.add(box(0.35, 0.15 + i * 0.08, 0.12, '#fffaf3', (i - 2) * 0.4, 0.55 + i * 0.02, 0.1));
  }
  root.add(onWall('north', NORTH_WEST_CLEAR, 4.6, elphi));

  for (const [x, z, rot] of [
    [-15.2, -10.5, 0.5],
    [-15.0, 10.0, -0.4],
  ] as const) {
    const ship = new THREE.Group();
    ship.add(box(1.8, 0.4, 0.4, '#2b2d42', 0, 0.35, 0));
    ship.add(box(1.0, 0.4, 0.32, '#ef476f', 0.15, 0.7, 0));
    ship.add(box(0.08, 0.75, 0.08, '#fffaf3', -0.25, 0.95, 0));
    ship.add(box(0.5, 0.08, 0.08, '#fffaf3', -0.05, 1.3, 0));
    ship.position.set(x, 0, z);
    ship.rotation.y = rot;
    root.add(ship);
  }

  const anchor = new THREE.Group();
  anchor.add(box(0.14, 0.85, 0.14, '#4a5568', 0, 0.15, 0));
  anchor.add(mesh(new THREE.TorusGeometry(0.25, 0.055, 8, 14), toon('#4a5568'), 0, 0.55, 0, false));
  anchor.add(box(0.65, 0.12, 0.12, '#4a5568', 0, -0.3, 0));
  anchor.add(box(0.12, 0.35, 0.12, '#4a5568', -0.28, -0.4, 0));
  anchor.add(box(0.12, 0.35, 0.12, '#4a5568', 0.28, -0.4, 0));
  root.add(onWall('east', -11.5, 2.0, anchor));

  const fish = new THREE.Group();
  fish.add(box(1.4, 0.7, 0.5, '#fffaf3', 0, 0.4, 0));
  fish.add(box(1.5, 0.08, 0.55, '#ef476f', 0, 0.78, 0));
  fish.add(box(0.5, 0.15, 0.2, '#8fd3ff', -0.3, 0.9, 0.1));
  fish.add(box(0.5, 0.15, 0.2, '#ffd166', 0.3, 0.9, 0.1));
  fish.position.set(14, 0, -11);
  root.add(fish);

  root.add(banner('south', SOUTH_SOLID[0], '#ef476f'));
  root.add(banner('south', SOUTH_SOLID[1], '#2b2d42'));
  root.add(lanterns('east', [-11, 10], ['#ffd166', '#ef476f']));
  root.add(lanterns('north', [NORTH_WEST_CLEAR, NORTH_EAST_CLEAR, NORTH_EAST_CLEAR + 2.2], ['#ffd166', '#ef476f', '#8fd3ff']));
  root.add(lanterns('south', [SOUTH_SOLID[2], SOUTH_SOLID[3]], ['#8fd3ff', '#ffd166']));

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
  crane.add(box(0.15, 2.0, 0.15, '#ffd166', 0, 1.0, 0));
  crane.add(box(1.6, 0.12, 0.12, '#ffd166', 0.6, 1.9, 0));
  crane.add(box(0.08, 0.6, 0.08, '#2b2d42', 1.3, 1.55, 0));
  crane.position.set(12.8, 0, 10.2);
  root.add(crane);

  return root;
}
