/** Apply a city floor's default practice language and greet its vibe. */
import { cityOf } from '../../../shared/cities';
import { loadLearner, saveLearner } from '../../state/learner';
import { toast } from '../../ui/dom';

/** When you arrive on a city floor, set target language and toast the city's welcome. */
export function greetCityFloor(cityId: string | undefined, opts?: { quiet?: boolean }) {
  const city = cityOf(cityId);
  if (!city) return;
  const cur = loadLearner();
  if (cur.targetLanguage !== city.targetLanguage) {
    saveLearner({ ...cur, targetLanguage: city.targetLanguage });
  }
  if (!opts?.quiet) toast(`${city.icon} ${city.welcome}`, 'info');
}

/** @deprecated Prefer greetCityFloor — kept for any leftover call sites. */
export function applyCityFloorLanguage(cityId: string | undefined, opts?: { quiet?: boolean }) {
  greetCityFloor(cityId, opts);
}
