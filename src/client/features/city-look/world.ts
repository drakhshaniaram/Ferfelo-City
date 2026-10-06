/**
 * Cartoon set dressing for Academy city floors — distinctive props so each floor feels like that city.
 */
import type { Group } from 'three';
import type { CityId } from '../../../shared/cities';
import { amsterdamLook } from './amsterdam';
import { hamburgLook } from './hamburg';
import { parisLook } from './paris';
import { tehranLook } from './tehran';
import { disposeGroup } from './kit';

const BUILDERS: Record<CityId, () => Group> = {
  amsterdam: amsterdamLook,
  hamburg: hamburgLook,
  paris: parisLook,
  tehran: tehranLook,
};

export function buildCityLook(cityId: CityId): Group {
  const g = BUILDERS[cityId]();
  g.name = `city-look-${cityId}`;
  return g;
}

export function disposeCityLook(g: Group) {
  disposeGroup(g);
}
