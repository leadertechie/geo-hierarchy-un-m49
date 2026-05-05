# @leadertechie/geo-hierarchy-un-m49

**UN M49 geographic hierarchy provider.** Maps ISO Alpha-2/3 country codes to regional hierarchy (continent → sub-region → country).

Zero dependencies. Fast O(1) parent lookup. Works in browser, Node, edge workers.

---

## Installation

```bash
npm install @leadertechie/geo-hierarchy-un-m49
```

---

## Quick Start

```typescript
import { getParent, getAncestors, has, getChildren, buildTree } from '@leadertechie/geo-hierarchy-un-m49';

// Get parent region
getParent('AU');   // → "Australia and New Zealand"
getParent('AUS');  // → "Australia and New Zealand"
getParent('IN');   // → "Southern Asia"
getParent('Asia'); // → "World"

// Get full ancestry chain
getAncestors('AU');
// → ["Australia and New Zealand", "Oceania", "World"]

// Check if code exists
has('US');  // → true
has('XX');  // → false

// Get countries in a region
getCountriesInRegion('Oceania');
// → ["AU", "AUS", "NZ", "NZL", "FJ", "FJI", ...]

// Get direct children
getChildren('World');
// → ["Africa", "Americas", "Asia", "Europe", "Oceania"]

// Build full tree
const tree = buildTree();
// → { code: "World", children: [{ code: "Oceania", children: [...] }, ...] }
```

---

## API

### `getParent(key: string): string | undefined`

Get parent region for any ISO Alpha-2, Alpha-3, or region name.

| Input | Output |
|-------|--------|
| `"AU"` | `"Australia and New Zealand"` |
| `"AUS"` | `"Australia and New Zealand"` |
| `"Oceania"` | `"World"` |
| `"World"` | `"*"` |
| `"XX"` | `undefined` |

### `getAncestors(key: string): string[]`

Full chain from immediate parent up to `"World"`.

```typescript
getAncestors('AU'); // → ["Australia and New Zealand", "Oceania", "World"]
```

### `has(key: string): boolean`

Check if code exists in hierarchy.

### `getCountriesInRegion(region: string): string[]`

All ISO codes (Alpha-2 + Alpha-3) belonging to a region.

### `getChildren(parent: string): string[]`

Direct children of any node (regions or countries).

### `buildTree(): HierarchyNode`

Build full tree structure:

```typescript
interface HierarchyNode {
  code: string;
  name: string;
  parent: string | null;
  children: HierarchyNode[];
}
```

---

## Hierarchy Structure

```
World
├── Africa
│   ├── Northern Africa        (DZ, EG, LY, MA, ...)
│   ├── Sub-Saharan Africa
│   │   ├── Eastern Africa     (BI, DJ, ET, KE, ...)
│   │   ├── Middle Africa      (AO, CM, CF, TD, ...)
│   │   ├── Southern Africa    (BW, LS, NA, ZA, ...)
│   │   └── Western Africa     (BJ, GH, GN, NG, ...)
├── Americas
│   ├── Northern America       (CA, US, BM, GL, ...)
│   └── Latin America and the Caribbean
│       ├── Caribbean          (CU, DO, HT, JM, ...)
│       ├── Central America    (CR, GT, MX, PA, ...)
│       └── South America      (AR, BR, CL, CO, ...)
├── Asia
│   ├── Central Asia           (KZ, KG, TJ, TM, UZ)
│   ├── Eastern Asia           (CN, JP, KR, MN, ...)
│   ├── South-eastern Asia     (ID, MY, PH, TH, VN, ...)
│   ├── Southern Asia          (IN, PK, BD, LK, ...)
│   └── Western Asia           (AE, IL, SA, TR, ...)
├── Europe
│   ├── Eastern Europe         (BY, CZ, PL, RU, UA, ...)
│   ├── Northern Europe        (DK, FI, NO, SE, GB, ...)
│   ├── Southern Europe        (ES, GR, IT, PT, ...)
│   └── Western Europe         (AT, BE, FR, DE, NL, ...)
└── Oceania
    ├── Australia and New Zealand (AU, NZ, NF)
    ├── Melanesia              (FJ, PG, SB, VU, ...)
    ├── Micronesia             (FM, GU, MH, PW, ...)
    └── Polynesia              (CK, PF, TO, WS, ...)
```

---

## Usage with RegionalConfigResolver

```typescript
import { getParent } from '@leadertechie/geo-hierarchy-un-m49';

const resolver = new RegionalConfigResolver(kvData, getParent);
```

---

## Data Source

Hierarchy based on [UN M49](https://unstats.un.org/unsd/methodology/m49/) standard. Covers all UN member states plus major territories.

---

## License

MIT
