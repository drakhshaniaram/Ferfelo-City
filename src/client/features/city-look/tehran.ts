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

/** Tehran: tile mural above boards; peaks/Milad on the floor — west glass left alone. */
export function tehranLook(): THREE.Group {
  const root = new THREE.Group();

  const wall = new THREE.Group();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 10; col++) {
      const c = (row + col) % 2 ? '#0f9b8e' : '#14b8a6';
      wall.add(box(0.48, 0.32, 0.07, c, (col - 4.5) * 0.5, (row - 1) * 0.36, 0));
    }
  }
  wall.add(box(0.32, 1.2, 0.18, '#0d7377', -0.95, 0.05, 0.04));
  wall.add(box(0.32, 1.2, 0.18, '#0d7377', 0.95, 0.05, 0.04));
  const arch = mesh(new THREE.TorusGeometry(0.7, 0.16, 8, 24, Math.PI), toon('#14b8a6'), 0, 0.55, 0.06, false);
  arch.rotation.z = Math.PI;
  wall.add(arch);
  for (let i = 0; i < 7; i++) wall.add(sphere(0.06, '#ffe066', (i - 3) * 0.26, -0.65, 0.1));
  root.add(onWall('north', -4, NORTH_ABOVE_BOARDS_Y, wall));

  const azadi = new THREE.Group();
  azadi.add(box(0.5, 0.3, 0.4, '#f3e0c8', -0.7, -0.4, 0));
  azadi.add(box(0.5, 0.3, 0.4, '#f3e0c8', 0.7, -0.4, 0));
  azadi.add(box(0.35, 1.2, 0.35, '#f3e0c8', -0.55, 0.3, 0));
  azadi.add(box(0.35, 1.2, 0.35, '#f3e0c8', 0.55, 0.3, 0));
  const top = mesh(new THREE.TorusGeometry(0.55, 0.12, 8, 20, Math.PI), toon('#f3e0c8'), 0, 0.85, 0, false);
  top.rotation.z = Math.PI;
  azadi.add(top);
  root.add(onWall('north', NORTH_WEST_CLEAR, 4.6, azadi));

  const peaks = new THREE.Group();
  peaks.add(mesh(new THREE.ConeGeometry(0.8, 1.3, 4), toon('#8b9bb4'), -0.9, 0.65, 0, false));
  peaks.add(mesh(new THREE.ConeGeometry(1.1, 1.8, 4), toon('#6e7f99'), 0.4, 0.9, 0, false));
  peaks.add(mesh(new THREE.ConeGeometry(0.55, 0.9, 4), toon('#a8b5c4'), 1.4, 0.45, 0, false));
  peaks.add(mesh(new THREE.ConeGeometry(0.4, 0.45, 4), toon('#fffaf3'), 0.4, 1.7, 0, false));
  peaks.position.set(-15.0, 0, -10.0);
  root.add(peaks);

  for (const u of [-11.5, 10]) {
    const stall = new THREE.Group();
    stall.add(box(1.5, 0.08, 0.8, '#c86a3a', 0, 0.9, 0));
    stall.add(box(0.08, 0.9, 0.08, '#5c4033', -0.65, 0.4, 0.3));
    stall.add(box(0.08, 0.9, 0.08, '#5c4033', 0.65, 0.4, 0.3));
    stall.add(box(1.4, 0.5, 0.5, '#f3e0c8', 0, 0.3, 0));
    stall.add(sphere(0.1, '#ffe066', -0.3, 0.65, 0.15));
    stall.add(sphere(0.1, '#c86a3a', 0, 0.65, 0.15));
    stall.add(sphere(0.1, '#0f9b8e', 0.3, 0.65, 0.15));
    root.add(onWall('east', u, 1.7, stall));
  }

  const tea = new THREE.Group();
  tea.add(cyl(0.28, 0.32, 0.55, '#c86a3a', 0, 0.4, 0));
  tea.add(cyl(0.12, 0.16, 0.2, '#0f9b8e', 0, 0.75, 0));
  tea.add(mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 12, Math.PI), toon('#c86a3a'), 0.35, 0.45, 0, false));
  tea.add(cyl(0.05, 0.06, 0.15, '#fffaf3', 0.45, 0.35, 0.2));
  tea.position.set(-14, 0, -11);
  root.add(tea);

  const rugsStack = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    rugsStack.add(box(1.1, 0.12, 0.7, ['#c86a3a', '#0f9b8e', '#ffe066', '#8b3a22'][i], 0, 0.1 + i * 0.14, 0));
  }
  rugsStack.position.set(14, 0, -11);
  root.add(rugsStack);

  root.add(banner('south', SOUTH_SOLID[0], '#0f9b8e'));
  root.add(banner('south', SOUTH_SOLID[1], '#ffe066'));
  root.add(lanterns('north', [NORTH_WEST_CLEAR, NORTH_EAST_CLEAR, NORTH_EAST_CLEAR + 2.2], ['#ffe066', '#c86a3a', '#14b8a6']));
  root.add(lanterns('south', [SOUTH_SOLID[2], SOUTH_SOLID[3]], ['#ffe066', '#c86a3a']));

  root.add(rug(1.5, 1.1, '#0f9b8e', -12, -10));
  root.add(rug(1.3, 1.0, '#c86a3a', 12, 10));
  root.add(rug(1.2, 0.9, '#ffe066', -12, 10));
  root.add(rug(1.4, 1.0, '#8b3a22', 12, -10));

  const milad = new THREE.Group();
  milad.add(cyl(0.08, 0.2, 1.8, '#f3e0c8', 0, 0.9, 0));
  milad.add(box(0.5, 0.25, 0.5, '#14b8a6', 0, 1.6, 0));
  milad.add(sphere(0.12, '#ffe066', 0, 1.9, 0));
  milad.position.set(12.5, 0, 10.5);
  root.add(milad);

  return root;
}
