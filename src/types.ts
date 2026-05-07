/**
 * @leadertechie/geo-hierarchy-un-m49
 *
 * Shared type definitions.
 */

export interface M49Entry {
  code: string;
  parent?: string;
  iso?: string; // Alpha-2 or Alpha-3
}

export interface HierarchyNode {
  code: string;
  name: string;
  parent: string | null;
  children: HierarchyNode[];
}

/** A region strategy: a module that exports its own hierarchy map. */
export interface RegionStrategy {
  name: string;
  data: Record<string, string>;
}

/** A flat { region, subRegion } pair for binding cascading dropdowns. */
export interface RegionSubRegionPair {
  region: string;
  subRegion: string;
}

/** Backward-compatible alias. */
export type RegionSubRegion = RegionSubRegionPair;
