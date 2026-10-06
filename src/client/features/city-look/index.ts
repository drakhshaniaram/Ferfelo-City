/**
 * Academy city floors: swap in cartoon wall props when you're on a city floor in the office tower.
 */
import type { Group } from 'three';
import { cityOf, isCityId } from '../../../shared/cities';
import { ROOF } from '../../../shared/rooftop';
import type { Ctx } from '../../core/context';
import { store } from '../../state';
import { buildCityLook, disposeCityLook } from './world';

export function installCityLook(ctx: Ctx) {
  let group: Group | null = null;
  let shown = '';

  function clear() {
    if (!group) return;
    group.removeFromParent();
    disposeCityLook(group);
    group = null;
    shown = '';
  }

  function sync() {
    if (!ctx.inOffice() || store.floor === ROOF) {
      clear();
      return;
    }
    const cityId = store.currentFloor()?.cityId;
    if (!cityId || !isCityId(cityId) || !cityOf(cityId)) {
      clear();
      return;
    }
    if (shown === cityId) return;
    clear();
    group = buildCityLook(cityId);
    ctx.office.group.add(group);
    shown = cityId;
  }

  store.on('floor', sync);
  store.on('floors', sync);
  store.on('map', sync);
  sync();

  return { sync, clear };
}
