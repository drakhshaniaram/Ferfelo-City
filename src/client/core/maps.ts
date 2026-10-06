/**
 * The building's map changing (the office, or a map of its own like the castle): the old world goes,
 * the new one's put up with everyone in their seats, and you come in where it has you arrive. Also
 * the floor's paint, down off a roof the map doesn't have, and who's waiting on another floor.
 *
 * Academy halls (Ferfelo City, castle, ship) have no tower roof. Riding to the rooftop bar temporarily
 * borrows the office tower without changing the saved map pick; leaving the roof restores it.
 */
import { floorPalette } from '../../shared/floors';
import { OFFICE_PLAN, type MapPlan } from '../../shared/maps';
import { ROOF } from '../../shared/rooftop';
import { store } from '../state';
import { $, toast } from '../ui/dom';
import type { Ctx } from './context';
import type { CoreState } from './ctx';
import { builtFloors } from './floors';
import type { Parts } from './parts';
import { streetOf } from './worlds';

export type MapsParts = Pick<Parts, 'stage' | 'worlds' | 'place' | 'travel' | 'arrival' | 'views' | 'walking' | 'peers' | 'telescope' | 'smoking' | 'hoops' | 'arcade' | 'cabinet' | 'dog' | 'jukebox' | 'boards'>;

/** Registers the floor's paint (store 'floors'), the map (store 'map') and the floors' waiting count (the 'floors' message). */
export function installMaps(ctx: Ctx, core: CoreState, parts: MapsParts) {
  const { player, sound, sky, me, hands } = ctx;
  const { holiday } = parts.stage;
  const { inOffice, plan } = parts.worlds;

  /** Office tower is up only so the rooftop bar works; store.map stays on the hall the building picked. */
  let borrowedForRoof = false;

  /** Which floor paint is on the walls now (id + palette — city floors share indices). */
  let painted = '';
  function paintFloor() {
    const f = store.currentFloor();
    const key = f ? `${f.id}:${f.palette}` : `:${0}`;
    if (key === painted) return;
    painted = key;
    ctx.world().setLook(floorPalette(f?.palette ?? 0));
  }
  // A brand-new floor can arrive before the elevator's list says what color it is.
  store.on('floors', paintFloor);

  /**
   * Puts up `nextPlan`'s world. `settle` places you in the car when you're on a floor (skip while
   * borrowing the tower mid-ride up to the roof).
   */
  function swapWorld(nextPlan: MapPlan, settle: boolean): boolean {
    const { worlds, views, boards } = parts;
    const next = worlds.worldFor(nextPlan);
    if (next.world === worlds.world()) return false;
    for (const [id, v] of views.workerViews) {
      worlds.court()?.release(id);
      v.model.root.removeFromParent();
      v.laptop.root.removeFromParent();
      v.model.dispose();
      v.laptop.dispose();
      sound.removeTypist(id);
    }
    views.workerViews.clear();
    views.departures.clear();
    views.sendoffs.clear();
    views.arrivals.clear();
    parts.telescope.exit();
    ctx.activities.stopAll('map');
    parts.walking.stopWalkingTo();
    parts.smoking.stop();
    if (parts.hoops.holding()) parts.hoops.dropBall();
    me.holdBall(false);
    hands.holdBall(false);
    for (const r of parts.peers.remotes.values()) r.person.holdBall(false);
    parts.arcade.stop();
    parts.cabinet.stop();
    worlds.world().group.visible = false;
    worlds.enter(next);
    const world = worlds.world();
    world.group.visible = !core.upTop;
    if (!core.upTop) player.colliders = world.colliders;
    player.room = { ...nextPlan.bounds, ...world.room };
    if (!core.upTop && !inOffice()) player.street = streetOf(world);
    sky.setIndoors(world.room.enclosed);
    sound.setHall(world.acoustics ? { bounds: nextPlan.bounds, ...world.acoustics } : null);
    holiday.group.visible = inOffice() && !core.upTop;
    parts.dog.root.visible = inOffice() && !!store.dog;
    parts.jukebox.playJukebox();
    boards.dressBoards(world);
    painted = '';
    paintFloor();
    parts.arrival.renderProject();
    views.dressUp();
    views.syncPlan();
    views.syncWorkersSeated();
    views.syncJail();
    boards.renderPullsBoard();
    boards.renderServicesBoard();
    boards.renderQueueBoard();
    if (settle && store.floor && !core.upTop && !core.trip) {
      parts.place.placeInCar();
      parts.travel.lift()?.setOpen(true);
    } else if (settle && core.trip) parts.travel.pending.placeOnArrival = true;
    views.heraldHires.clear();
    ctx.hint.invalidate();
    ctx.hud.refresh();
    return true;
  }

  /**
   * The building changed maps (or you arrived and it's not the office): the old world goes, the new
   * one's put up, every worker sits down in its seat there, and you come in where it has you arrive.
   */
  function applyMap() {
    borrowedForRoof = false;
    if (!swapWorld(store.plan(), true)) return;
    offTheRoof();
  }
  store.on('map', applyMap);

  /** Hall maps have no tower: put the office world up so the rooftop bar can load. Does not change store.map. */
  function borrowOfficeForRoof() {
    if (inOffice()) return;
    borrowedForRoof = true;
    swapWorld(OFFICE_PLAN, false);
  }

  /** After the rooftop: put the building's saved map back. */
  function restoreAfterRoof() {
    if (!borrowedForRoof) return;
    borrowedForRoof = false;
    swapWorld(store.plan(), true);
  }

  /** Down off the roof, on a map with no roof to be up on (it changed while you were up there). */
  function offTheRoof() {
    if (!core.upTop || inOffice() || core.trip) return;
    // Still marked on the roof after a map swap: borrow the tower instead of kicking (academy halls).
    if (store.floor === ROOF && builtFloors().length > 0) {
      borrowOfficeForRoof();
      return;
    }
    const f = builtFloors()[0];
    if (!f) return;
    parts.travel.leaveRoofFor(f.id);
    toast(`The building's ${plan().icon} ${plan().name} now, with no rooftop bar: down you go`);
  }

  ctx.messages.on('floors', () => noticeWaiting());
  /** Workers waiting on someone, per floor, the last time the elevator said so. */
  const waitingOn = new Map<string, number>();
  /** Someone's waiting on another floor: say so, since you can't see or hear it from here. */
  function noticeWaiting() {
    let elsewhere = 0;
    for (const f of store.floors) {
      const before = waitingOn.get(f.id);
      waitingOn.set(f.id, f.waiting);
      if (f.id === store.floor) continue;
      elsewhere += f.waiting;
      if (before !== undefined && f.waiting > before) {
        toast(`🙋 A worker on the ${f.name} floor is waiting on someone — take the elevator up`, 'warn');
        sound.ding('needs_input');
      }
    }
    const badge = $('floors-waiting');
    badge.textContent = elsewhere ? String(elsewhere) : '';
    badge.classList.toggle('hidden', !elsewhere);
    $('project').title = elsewhere ? `${elsewhere} worker${elsewhere === 1 ? '' : 's'} on other floors waiting on someone — click to go there` : 'Floors: go to another project';
  }

  return { paintFloor, applyMap, offTheRoof, noticeWaiting, borrowOfficeForRoof, restoreAfterRoof };
}
