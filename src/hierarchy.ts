import type { LoggerInterface } from "@leadertechie/telemetry";
import getDefaultLogger from "./telemetry-init";

/**
 * @leadertechie/geo-hierarchy-un-m49
 *
 * Core hierarchy queries.
 * Operates on the composed UN M49 lookup map.
 */

import { REGIONS, compose } from './regions';
import type { HierarchyNode } from './types';

// ─── Internal map ────────────────────────────────────────────────────────────

/** The composed global hierarchy map. */
const M49_MAP = compose(REGIONS);

/** Regex to match ISO country codes (Alpha-2 or Alpha-3). */
const ISO_CODE_RE = /^[A-Z]{2,3}$/;

/**
 * Check if a key is an ISO country code (Alpha-2 or Alpha-3).
 */
export function isISOCode(key: string): boolean {
  return ISO_CODE_RE.test(key) && key !== 'World';
}

// ─── Reverse map: region name → ISO codes ───────────────────────────────────

function buildReverseMap(): Record<string, string[]> {
  const rev: Record<string, string[]> = {};
  for (const [key, parent] of Object.entries(M49_MAP)) {
    if (isISOCode(key)) {
      if (!rev[parent]) rev[parent] = [];
      rev[parent].push(key);
    }
  }
  return rev;
}

const REGION_TO_COUNTRIES = buildReverseMap();

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get the parent key for a given geographic code.
 * Supports ISO Alpha-2, Alpha-3, and UN M49 region names.
 */
export function getParent(key: string, logger?: LoggerInterface): string | undefined {
  const log = logger ?? getDefaultLogger("geo-hierarchy-un-m49");
  if (!M49_MAP[key]) log.warn("Unknown region code", { key });
  return M49_MAP[key];
}

/**
 * Get the full ancestry chain from a code up to root.
 * Returns array from immediate parent up to "World".
 */
export function getAncestors(key: string): string[] {
  const chain: string[] = [];
  let current = M49_MAP[key];
  while (current && current !== '*') {
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
      .filter((c) => c !== 'World')
      .map(buildNode);
    return {
      code,
      name,
      parent: M49_MAP[code] === '*' ? null : (M49_MAP[code] ?? null),
      children,
    };
  }
  return buildNode('World');
}
