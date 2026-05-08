/**
 * @leadertechie/geo-hierarchy-un-m49
 *
 * Standard hierarchy provider based on UN M49.
 * Maps ISO codes (Alpha-2/3) to regional hierarchy.
 *
 * Architecture: Strategy pattern.
 * Each continent is a separate module (strategy) exporting its own Record<string, string>.
 * The compose() function merges them into a single lookup map.
 * Consumers can also use individual region strategies directly.
 *
 * Data sourced from the 'un-m49' npm package.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type {
  M49Entry,
  HierarchyNode,
  RegionStrategy,
  RegionSubRegionPair,
  RegionSubRegion,
} from './types';
// ─── Region strategies ───────────────────────────────────────────────────────

export { REGIONS, compose } from './regions';

// ─── Core hierarchy queries ─────────────────────────────────────────────────

export {
  getParent,
  getAncestors,
  has,
  getCountriesInRegion,
  getChildren,
  buildTree,
} from './hierarchy';

// ─── Dropdown binding helpers ────────────────────────────────────────────────

export {
  getContinents,
  getSubRegions,
  getCountriesInSubRegion,
  getRegionSubRegionPairs,
  getHierarchyLevels,
} from './dropdown';

