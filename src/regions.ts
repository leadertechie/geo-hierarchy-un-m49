/**
 * @leadertechie/geo-hierarchy-un-m49
 *
 * Region strategy registration and composition.
 * Each region file is a separate strategy module exporting its own Record<string, string>.
 */

import type { RegionStrategy } from './types';

import AFRICA from './regions/africa';
import AMERICAS from './regions/americas';
import ASIA from './regions/asia';
import EUROPE from './regions/europe';
import OCEANIA from './regions/oceania';

/** All region strategies. Add new continents here. */
export const REGIONS: RegionStrategy[] = [
  { name: 'Africa', data: AFRICA },
  { name: 'Americas', data: AMERICAS },
  { name: 'Asia', data: ASIA },
  { name: 'Europe', data: EUROPE },
  { name: 'Oceania', data: OCEANIA },
];

/**
 * Compose multiple region strategies into a single hierarchy map.
 * Later strategies override earlier ones on key collision.
 */
export function compose(strategies: RegionStrategy[]): Record<string, string> {
  const map: Record<string, string> = {
    World: '*',
  };
  for (const s of strategies) {
    Object.assign(map, s.data);
  }
  return map;
}
