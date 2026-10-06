/**
 * Shared helpers for city-floor cartoon set dressing.
 */
import * as THREE from 'three';
import { wallPose, type WallId } from '../../../shared/decor';
import { mesh, toon } from '../../world/toon';

export function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) m.geometry?.dispose();
  });
}

export function onWall(wall: WallId, u: number, y: number, local: THREE.Group, out = 0.08) {
  const pose = wallPose(wall, u, y, out);
  local.position.set(pose.x, pose.y, pose.z);
  local.rotation.y = pose.rotY;
  return local;
}

export function box(w: number, h: number, d: number, color: string, x = 0, y = 0, z = 0) {
  return mesh(new THREE.BoxGeometry(w, h, d), toon(color), x, y, z, false);
}

export function cyl(rTop: number, rBot: number, h: number, color: string, x = 0, y = 0, z = 0, seg = 12) {
  return mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), toon(color), x, y, z, false);
}

export function sphere(r: number, color: string, x = 0, y = 0, z = 0) {
  return mesh(new THREE.SphereGeometry(r, 10, 10), toon(color), x, y, z, false);
}

/** Flat floor rug/disk — no collider, sits on the floor near walls. */
export function rug(rx: number, rz: number, color: string, x: number, z: number) {
  const m = mesh(new THREE.CylinderGeometry(rx, rz, 0.02, 24), toon(color), x, 0.012, z, false);
  return m;
}

/** Banner strip hanging on a wall. */
export function banner(wall: WallId, u: number, color: string, w = 0.9, h = 1.4) {
  const g = new THREE.Group();
  g.add(box(w, h, 0.04, color, 0, 0, 0));
  g.add(box(w + 0.1, 0.08, 0.06, '#2b2d42', 0, h / 2 + 0.04, 0));
  return onWall(wall, u, 3.4, g);
}

/** String of round lanterns along a wall. */
export function lanterns(wall: WallId, us: number[], colors: string[]) {
  const root = new THREE.Group();
  us.forEach((u, i) => {
    const g = new THREE.Group();
    g.add(box(0.04, 0.35, 0.04, '#5c4033', 0, 0.2, 0));
    g.add(sphere(0.16, colors[i % colors.length], 0, 0, 0));
    root.add(onWall(wall, u, 4.2, g));
  });
  return root;
}

export { mesh, toon };
