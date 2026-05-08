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
import {
  // Core lookups
  getParent, getAncestors, has, getChildren, buildTree,
  // Dropdown binding helpers
  getContinents, getSubRegions, getCountriesInSubRegion,
  getRegionSubRegionPairs, getHierarchyLevels,
} from '@leadertechie/geo-hierarchy-un-m49';

// ─── Core lookups ────────────────────────────────────────────────────────

getParent('AU');   // → "Australia and New Zealand"
getParent('AUS');  // → "Australia and New Zealand"
getParent('IN');   // → "Southern Asia"
getParent('Asia'); // → "World"

getAncestors('AU');
// → ["Australia and New Zealand", "Oceania", "World"]

has('US');  // → true
has('XX');  // → false

getCountriesInRegion('Oceania');
// → ["AU", "AUS", "NZ", "NZL", "FJ", "FJI", ...]

getChildren('World');
// → ["Africa", "Americas", "Asia", "Europe", "Oceania"]

buildTree();
// → { code: "World", children: [{ code: "Oceania", children: [...] }, ...] }

// ─── Cascading dropdowns ─────────────────────────────────────────────────

// Level 1: populate region selector
getContinents();
// → ["Africa", "Americas", "Asia", "Europe", "Oceania"]

// Level 2: populate sub-region selector based on selected region
getSubRegions('Asia');
// → ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"]

// Level 3: populate country selector based on selected sub-region
getCountriesInSubRegion('Southern Asia');
// → ["AF", "AFG", "BD", "BGD", "BT", "BTN", "IN", "IND", ...]

// Flat pairs for simple two-dropdown binding
getRegionSubRegionPairs();
// → [
//     { region: "Africa", subRegion: "Northern Africa" },
//     { region: "Africa", subRegion: "Eastern Africa" },
//     { region: "Africa", subRegion: "Sub-Saharan Africa" },
//     { region: "Asia", subRegion: "Southern Asia" },
//     // ... handles deep hierarchies (Africa's grandchildren flattened)
//   ]

// Introspect hierarchy depth for dynamic UI
getHierarchyLevels('Africa');
// → [
//     ["Northern Africa", "Sub-Saharan Africa"],
//     ["Eastern Africa", "Middle Africa", "Southern Africa", "Western Africa"],
//   ]
```

---

## API

### Core lookups

#### `getParent(key: string): string | undefined`

Get parent region for any ISO Alpha-2, Alpha-3, or region name.

| Input | Output |
|-------|--------|
| `"AU"` | `"Australia and New Zealand"` |
| `"AUS"` | `"Australia and New Zealand"` |
| `"Oceania"` | `"World"` |
| `"World"` | `"*"` |
| `"XX"` | `undefined` |

#### `getAncestors(key: string): string[]`

Full chain from immediate parent up to `"World"`.

```typescript
getAncestors('AU'); // → ["Australia and New Zealand", "Oceania", "World"]
```

#### `has(key: string): boolean`

Check if code exists in hierarchy.

#### `getCountriesInRegion(region: string): string[]`

All ISO codes (Alpha-2 + Alpha-3) belonging to a region.

#### `getChildren(parent: string): string[]`

Direct children of any node (regions or countries).

#### `buildTree(): HierarchyNode`

Build full tree structure:

```typescript
interface HierarchyNode {
  code: string;
  name: string;
  parent: string | null;
  children: HierarchyNode[];
}
```

### Dropdown binding helpers

#### `getContinents(): string[]`

Get all top-level regions (direct children of `"World"`). Ideal for populating the first dropdown in a cascading selector.

#### `getSubRegions(region: string): string[]`

Get only human-readable sub-region names under a region, **filtering out ISO country codes**. Use this for the second dropdown after a continent is selected.

```typescript
getSubRegions('Asia');
// → ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"]

getSubRegions('Southern Asia');
// → []  // only countries below, no named sub-regions
```

#### `getCountriesInSubRegion(subRegion: string): string[]`

Get only ISO country codes (Alpha-2 and Alpha-3) that are **direct** children of a sub-region. Use this for the third dropdown after a sub-region is selected.

```typescript
getCountriesInSubRegion('Southern Asia');
// → ["AF", "AFG", "BD", "BGD", "BT", "BTN", "IN", "IND", "IR", "IRN", ...]
```

#### `getRegionSubRegionPairs(): RegionSubRegionPair[]`

Returns flat `{ region, subRegion }` pairs for binding **two cascading dropdowns**. Handles deep hierarchies (e.g. Africa's `Sub-Saharan Africa` → `Eastern Africa`) by flattening grandchildren under the continent.

```typescript
getRegionSubRegionPairs();
// → [
//     { region: "Africa", subRegion: "Northern Africa" },
//     { region: "Africa", subRegion: "Sub-Saharan Africa" },
//     { region: "Africa", subRegion: "Eastern Africa" },  // flattened
//     { region: "Africa", subRegion: "Middle Africa" },   // flattened
//     { region: "Asia", subRegion: "Southern Asia" },
//     { region: "Oceania", subRegion: "Australia and New Zealand" },
//     // ...
//   ]
```

#### `getHierarchyLevels(continent: string): string[][]`

Returns arrays grouped by depth level, so you can dynamically determine a continent's hierarchy depth for adaptive UI.

```typescript
getHierarchyLevels('Africa');
// → [
//     ["Northern Africa", "Sub-Saharan Africa"],                          // level 0
//     ["Eastern Africa", "Middle Africa", "Southern Africa", "Western Africa"], // level 1
//   ]

getHierarchyLevels('Asia');
// → [
//     ["Central Asia", "Eastern Asia", "South-eastern Asia", "Southern Asia", "Western Asia"],
//   ]
```

---

## Real-world example: Cascading dropdowns (React)

```tsx
import { useState, useMemo } from 'react';
import {
  getContinents,
  getSubRegions,
  getCountriesInSubRegion,
} from '@leadertechie/geo-hierarchy-un-m49';

export function RegionSelector() {
  const [region, setRegion] = useState('');
  const [subRegion, setSubRegion] = useState('');

  const continents = useMemo(() => getContinents(), []);
  const subRegions = useMemo(
    () => (region ? getSubRegions(region) : []),
    [region]
  );
  const countries = useMemo(
    () => (subRegion ? getCountriesInSubRegion(subRegion) : []),
    [subRegion]
  );

  return (
    <div>
      <select value={region} onChange={e => { setRegion(e.target.value); setSubRegion(''); }}>
        <option value="">Select region</option>
        {continents.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={subRegion}
        onChange={e => setSubRegion(e.target.value)}
        disabled={!region}
      >
        <option value="">Select sub-region</option>
        {subRegions.map(sr => <option key={sr} value={sr}>{sr}</option>)}
      </select>

      <select disabled={!subRegion}>
        {countries.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
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
