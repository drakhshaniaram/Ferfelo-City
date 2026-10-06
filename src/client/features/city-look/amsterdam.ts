import * as THREE from 'three';
import { NORTH_BOARD_EAST, NORTH_BOARD_WEST, banner, box, cyl, lanterns, mesh, onWall, rug, sphere, toon } from './kit';

/** Amsterdam: canal row, bikes, tulips, orange banners, cobble rugs. */
export function amsterdamLook(): THREE.Group {
  const root = new THREE.Group();

  // Canal-house skyline on the south wall (north is reserved for the learning boards).
  const houses = new THREE.Group();
  const colors = ['#ff6b4a', '#5ec4e0', '#ffe066', '#7bd389', '#c77dff', '#ff8fab', '#4cc9f0'];
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * 1.05;
    const h = 1.5 + (i % 4) * 0.22;
    houses.add(box(0.95, h, 0.22, colors[i], x, h / 2 - 0.85, 0));
    houses.add(box(0.6, 0.22, 0.24, colors[i], x, h / 2 - 0.85 + 0.22, 0));
    houses.add(box(0.35, 0.18, 0.24, colors[i], x, h / 2 - 0.85 + 0.4, 0));
    houses.add(box(0.2, 0.14, 0.12, '#fff8e7', x - 0.2, 0.1, 0.08));
    houses.add(box(0.2, 0.14, 0.12, '#fff8e7', x + 0.2, 0.1, 0.08));
    houses.add(box(0.18, 0.28, 0.1, '#5c4033', x, -0.55, 0.08));
  }
  houses.add(box(7.5, 0.15, 0.35, '#3a8fb7', 0, -1.05, 0.05));
  houses.add(box(7.5, 0.08, 0.4, '#2d6a7e', 0, -1.15, 0.05));
  root.add(onWall('south', 0, 3.35, houses));

  // Bridge west of the Issues/Scenes board
  const bridge = new THREE.Group();
  bridge.add(box(2.2, 0.12, 0.2, '#8b7355', 0, 0, 0));
  bridge.add(box(0.12, 0.7, 0.12, '#8b7355', -0.9, 0.35, 0));
  bridge.add(box(0.12, 0.7, 0.12, '#8b7355', 0.9, 0.35, 0));
  bridge.add(mesh(new THREE.TorusGeometry(0.9, 0.06, 8, 20, Math.PI), toon('#8b7355'), 0, 0.35, 0, false));
  root.add(onWall('north', NORTH_BOARD_WEST - 0.6, 2.4, bridge));

  for (const u of [-4, 0, 4]) {
    const bike = new THREE.Group();
    bike.add(mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 16), toon('#2b2d42'), -0.32, 0, 0, false));
    bike.add(mesh(new THREE.TorusGeometry(0.26, 0.035, 8, 16), toon('#2b2d42'), 0.32, 0, 0, false));
    bike.add(box(0.65, 0.05, 0.05, '#ff5a1f', 0, 0.1, 0));
    bike.add(box(0.06, 0.32, 0.05, '#ff5a1f', -0.18, 0.26, 0));
    bike.add(box(0.2, 0.04, 0.04, '#2b2d42', 0.28, 0.28, 0));
    root.add(onWall('west', u, 1.55, bike));
  }

  const tulips = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const x = (i - 3.5) * 0.32;
    tulips.add(box(0.04, 0.5, 0.04, '#3a9b4a', x, 0, 0));
    tulips.add(sphere(0.11, ['#ff4d6d', '#ff9f1c', '#ffe066', '#ff4d6d', '#c77dff', '#ff8fab', '#ff4d6d', '#ffe066'][i], x, 0.32, 0));
  }
  tulips.add(box(2.8, 0.2, 0.35, '#8b5e3c', 0, -0.35, 0));
  root.add(onWall('east', 0, 1.9, tulips));

  const mill = new THREE.Group();
  mill.add(cyl(0.25, 0.35, 1.1, '#fffaf3', 0, 0, 0));
  mill.add(box(1.4, 0.12, 0.08, '#2b2d42', 0, 0.45, 0.1));
  mill.add(box(0.12, 1.4, 0.08, '#2b2d42', 0, 0.45, 0.1));
  root.add(onWall('west', -8, 2.5, mill));

  root.add(banner('south', 6, '#ff5a1f'));
  root.add(banner('south', 8, '#fffaf3'));
  root.add(lanterns('north', [NORTH_BOARD_WEST - 1.2, NORTH_BOARD_EAST + 1.5, NORTH_BOARD_EAST + 3.5], ['#ff9f1c', '#ff4d6d', '#ffe066']));
  root.add(lanterns('east', [-8, -4, 4, 8], ['#5ec4e0', '#ff9f1c', '#ff4d6d', '#ffe066']));

  root.add(rug(1.4, 1.0, '#3a8fb7', -12, -10));
  root.add(rug(1.2, 0.9, '#ff5a1f', 12, -10));
  root.add(rug(1.3, 1.1, '#7bd389', -12, 10));
  root.add(rug(1.1, 0.85, '#ffe066', 12, 10));

  const cart = new THREE.Group();
  cart.add(box(1.2, 0.55, 0.7, '#8b5e3c', 0, 0.35, 0));
  cart.add(mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 14), toon('#2b2d42'), -0.45, 0.22, 0.4, false));
  cart.add(mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 14), toon('#2b2d42'), 0.45, 0.22, 0.4, false));
  for (let i = 0; i < 5; i++) cart.add(sphere(0.12, ['#ff4d6d', '#ff9f1c', '#ffe066', '#c77dff', '#ff8fab'][i], (i - 2) * 0.2, 0.75, 0));
  cart.position.set(-14, 0, -11);
  root.add(cart);

  return root;
}
