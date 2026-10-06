/** Apply a city floor's default practice language to the learner profile in this browser. */
import { cityOf } from '../../../shared/cities';
import { loadLearner, saveLearner } from '../../state/learner';
import { toast } from '../../ui/dom';

/** When you arrive on a city floor, set target language to that city's default (Dutch, German, …). */
export function applyCityFloorLanguage(cityId: string | undefined, opts?: { quiet?: boolean }) {
  const city = cityOf(cityId);
  if (!city) return;
  const cur = loadLearner();
  if (cur.targetLanguage === city.targetLanguage) return;
  saveLearner({ ...cur, targetLanguage: city.targetLanguage });
  if (!opts?.quiet) toast(`🌆 ${city.name}: fellows here speak ${city.targetLanguage} by default`, 'info');
}
