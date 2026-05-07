/**
 * @leadertechie/geo-hierarchy-un-m49
 *
 * Dropdown binding helpers.
 * Convenience functions for populating cascading region → sub-region selects.
 */

import { getChildren, isISOCode } from './hierarchy';
import type { RegionSubRegionPair } from './types';

/**
 * Get all top-level continents/regions (direct children of "World").
 *
 * @example
 * getContinents()
 * // => ["Africa", "Americas", "Asia", "Europe", "Oceania"]
 */
export function getContinents(): string[] {
  return getChildren('World');
}

/**
 * Get only the human-readable sub-region names under a region,
 * filtering out ISO country codes.
 *
 * @example
 * getSubRegions("Asia")
 * // => ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"]
 *
 * getSubRegions("Southern Asia")
 * // => []  (only countries below)
 */
export function getSubRegions(region: string): string[] {
  return getChildren(region).filter((child) => !isISOCode(child));
}

/**
 * Get all ISO country codes (Alpha-2 and Alpha-3) that are direct
 * children of a sub-region. Only returns direct descendants, unlike
 * getCountriesInRegion().
 *
 * @example
 * getCountriesInSubRegion("Southern Asia")
 * // => ["AF", "AFG", "BD", "BGD", ...]
 */
export function getCountriesInSubRegion(subRegion: string): string[] {
  return getChildren(subRegion).filter((child) => isISOCode(child));
}

/**
 * Returns flat { region, subRegion } pairs for binding two cascading
 * dropdowns. Handles deep hierarchies (e.g. Africa's Sub-Saharan Africa
 * containing Eastern/Middle/Southern/Western Africa) by flattening
 * grandchildren under the continent.
 *
 * @example
 * getRegionSubRegionPairs()
 * // => [
 * //   { region: "Africa", subRegion: "Northern Africa" },
 * //   { region: "Africa", subRegion: "Eastern Africa" },
 * //   { region: "Africa", subRegion: "Middle Africa" },
 * //   // ... etc
 * // ]
 */
export function getRegionSubRegionPairs(): RegionSubRegionPair[] {
  const continents = getContinents();
  const pairs: RegionSubRegionPair[] = [];

  for (const continent of continents) {
    const subRegions = getChildren(continent).filter((child) => !isISOCode(child));

    // Direct sub-regions
    for (const subRegion of subRegions) {
      pairs.push({ region: continent, subRegion });
    }

    // Flatten one more level for deep hierarchies (e.g. Sub-Saharan Africa)
    for (const subRegion of subRegions) {
      const deeper = getChildren(subRegion).filter((child) => !isISOCode(child));
      for (const d of deeper) {
        pairs.push({ region: continent, subRegion: d });
      }
    }
  }

  return pairs;
}

/**
 * Get all the hierarchy levels between a continent and its deepest
 * sub-regions. Useful for introspecting hierarchy depth dynamically.
 *
 * @example
 * getHierarchyLevels("Africa")
 * // => [
 * //   ["Northern Africa", "Sub-Saharan Africa"],
 * //   ["Eastern Africa", "Middle Africa", "Southern Africa", "Western Africa"],
 * // ]
 *
 * getHierarchyLevels("Asia")
 * // => [
 * //   ["Central Asia", "Eastern Asia", ...],
 * // ]
 */
export function getHierarchyLevels(continent: string): string[][] {
  const levels: string[][] = [];
  let currentLevel = getChildren(continent).filter((child) => !isISOCode(child));

  while (currentLevel.length > 0) {
    levels.push(currentLevel);
    const nextLevel: string[] = [];
    for (const region of currentLevel) {
      const children = getChildren(region).filter((child) => !isISOCode(child));
      nextLevel.push(...children);
    }
    currentLevel = nextLevel;
  }

  return levels;
}
