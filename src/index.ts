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

// ─── Region strategies ───────────────────────────────────────────────────────

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

// ─── Compose ─────────────────────────────────────────────────────────────────

/**
 * Compose multiple region strategies into a single hierarchy map.
 * Later strategies override earlier ones on key collision.
 */
export function compose(strategies: RegionStrategy[]): Record<string, string> {
  const map: Record<string, string> = {
    "World": "*",
  };
  for (const s of strategies) {
    Object.assign(map, s.data);
  }
  return map;
}

/** The composed global hierarchy map. */
const M49_MAP = compose(REGIONS);

// ── Reverse map: region name → ISO codes ──

function buildReverseMap(): Record<string, string[]> {
  const rev: Record<string, string[]> = {};
  for (const [key, parent] of Object.entries(M49_MAP)) {
    if (/^[A-Z]{2,3}$/.test(key) && key !== "World") {
      if (!rev[parent]) rev[parent] = [];
      rev[parent].push(key);
    }
  }
  return rev;
}

const REGION_TO_COUNTRIES = buildReverseMap();

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Get the parent key for a given geographic code.
 * Supports ISO Alpha-2, Alpha-3, and UN M49 region names.
 */
export function getParent(key: string): string | undefined {
  return M49_MAP[key];
}

/**
 * Get the full ancestry chain from a code up to root.
 * Returns array from immediate parent up to "World".
 */
export function getAncestors(key: string): string[] {
  const chain: string[] = [];
  let current = M49_MAP[key];
  while (current && current !== "*") {
    chain.push(current);
    current = M49_MAP[current];
  }
  return chain;
}

/**
 * Check if a code exists in the hierarchy.
 */
export function has(key: string): boolean {
  return key in M49_MAP;
}

/**
 * Get all ISO codes (Alpha-2 and Alpha-3) belonging to a region.
 */
export function getCountriesInRegion(region: string): string[] {
  return REGION_TO_COUNTRIES[region] ?? [];
}

/**
 * Get all direct children of a given node.
 */
export function getChildren(parent: string): string[] {
  const children: string[] = [];
  for (const [key, value] of Object.entries(M49_MAP)) {
    if (value === parent) {
      children.push(key);
    }
  }
  return children;
}

/**
 * Build a full tree from the hierarchy.
 */
export function buildTree(): HierarchyNode {
  function buildNode(code: string): HierarchyNode {
    const name = code;
    const children = getChildren(code)
      .filter((c) => c !== "World")
      .map(buildNode);
    return {
      code,
      name,
      parent: M49_MAP[code] === "*" ? null : (M49_MAP[code] ?? null),
      children,
    };
  }
  return buildNode("World");
}

/**
 * Usage with RegionalConfigResolver:
 *
 * const resolver = new RegionalConfigResolver(kvData, getParent);
 */
