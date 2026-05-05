import { describe, it, expect } from 'vitest';
import { getParent, getAncestors, has, getCountriesInRegion, getChildren, buildTree, compose, REGIONS } from '../index';
import AFRICA from '../regions/africa';
import AMERICAS from '../regions/americas';

describe('compose', () => {
  it('merges region strategies into single map', () => {
    const map = compose(REGIONS);
    expect(map['World']).toBe('*');
    expect(map['Africa']).toBe('World');
    expect(map['AU']).toBe('Australia and New Zealand');
    expect(map['US']).toBe('Northern America');
  });

  it('later strategies override earlier on key collision', () => {
    const custom = { name: 'Custom', data: { 'AU': 'Custom Region' } };
    const map = compose([...REGIONS, custom]);
    expect(map['AU']).toBe('Custom Region');
  });

  it('works with subset of strategies', () => {
    const map = compose([
      { name: 'Africa', data: AFRICA },
      { name: 'Americas', data: AMERICAS },
    ]);
    expect(map['Africa']).toBe('World');
    expect(map['Americas']).toBe('World');
    expect(map['AU']).toBeUndefined();
    expect(map['US']).toBe('Northern America');
  });
});

describe('REGIONS', () => {
  it('exports all 5 continents', () => {
    const names = REGIONS.map((r) => r.name);
    expect(names).toContain('Africa');
    expect(names).toContain('Americas');
    expect(names).toContain('Asia');
    expect(names).toContain('Europe');
    expect(names).toContain('Oceania');
  });

  it('each region has data', () => {
    for (const r of REGIONS) {
      expect(Object.keys(r.data).length).toBeGreaterThan(0);
    }
  });
});

describe('getParent', () => {
  it('returns parent for ISO Alpha-2 code', () => {
    expect(getParent('AU')).toBe('Australia and New Zealand');
    expect(getParent('US')).toBe('Northern America');
    expect(getParent('IN')).toBe('Southern Asia');
    expect(getParent('GB')).toBe('Northern Europe');
  });

  it('returns parent for ISO Alpha-3 code', () => {
    expect(getParent('AUS')).toBe('Australia and New Zealand');
    expect(getParent('USA')).toBe('Northern America');
    expect(getParent('IND')).toBe('Southern Asia');
    expect(getParent('GBR')).toBe('Northern Europe');
  });

  it('returns parent for region name', () => {
    expect(getParent('Oceania')).toBe('World');
    expect(getParent('Africa')).toBe('World');
    expect(getParent('Southern Asia')).toBe('Asia');
    expect(getParent('Northern Europe')).toBe('Europe');
  });

  it('returns "*" for World root', () => {
    expect(getParent('World')).toBe('*');
  });

  it('returns undefined for unknown code', () => {
    expect(getParent('XX')).toBeUndefined();
    expect(getParent('ZZZ')).toBeUndefined();
    expect(getParent('')).toBeUndefined();
  });
});

describe('getAncestors', () => {
  it('returns full chain for a country', () => {
    expect(getAncestors('AU')).toEqual(['Australia and New Zealand', 'Oceania', 'World']);
    expect(getAncestors('IN')).toEqual(['Southern Asia', 'Asia', 'World']);
  });

  it('returns chain for a sub-region', () => {
    expect(getAncestors('Oceania')).toEqual(['World']);
  });

  it('returns empty chain for World', () => {
    expect(getAncestors('World')).toEqual([]);
  });

  it('returns empty chain for unknown code', () => {
    expect(getAncestors('XX')).toEqual([]);
  });
});

describe('has', () => {
  it('returns true for known codes', () => {
    expect(has('AU')).toBe(true);
    expect(has('AUS')).toBe(true);
    expect(has('World')).toBe(true);
    expect(has('Oceania')).toBe(true);
  });

  it('returns false for unknown codes', () => {
    expect(has('XX')).toBe(false);
    expect(has('ZZZ')).toBe(false);
  });
});

describe('getCountriesInRegion', () => {
  it('returns countries in a sub-region', () => {
    const anz = getCountriesInRegion('Australia and New Zealand');
    expect(anz).toContain('AU');
    expect(anz).toContain('NZ');
    expect(anz).toContain('NF');
  });

  it('returns empty array for unknown region', () => {
    expect(getCountriesInRegion('Atlantis')).toEqual([]);
  });

  it('returns empty array for country-level code', () => {
    expect(getCountriesInRegion('AU')).toEqual([]);
  });
});

describe('getChildren', () => {
  it('returns top-level regions for World', () => {
    const children = getChildren('World');
    expect(children).toContain('Africa');
    expect(children).toContain('Americas');
    expect(children).toContain('Asia');
    expect(children).toContain('Europe');
    expect(children).toContain('Oceania');
  });

  it('returns sub-regions for a continent', () => {
    const children = getChildren('Asia');
    expect(children).toContain('Central Asia');
    expect(children).toContain('Eastern Asia');
    expect(children).toContain('South-eastern Asia');
    expect(children).toContain('Southern Asia');
    expect(children).toContain('Western Asia');
  });

  it('returns countries for a sub-region', () => {
    const children = getChildren('Australia and New Zealand');
    expect(children).toContain('AU');
    expect(children).toContain('NZ');
    expect(children).toContain('NF');
  });

  it('returns empty array for leaf node', () => {
    expect(getChildren('AU')).toEqual([]);
  });
});

describe('buildTree', () => {
  it('builds tree with World as root', () => {
    const tree = buildTree();
    expect(tree.code).toBe('World');
    expect(tree.name).toBe('World');
    expect(tree.parent).toBeNull();
  });

  it('includes top-level regions as children', () => {
    const tree = buildTree();
    const regionNames = tree.children.map((c) => c.code);
    expect(regionNames).toContain('Africa');
    expect(regionNames).toContain('Americas');
    expect(regionNames).toContain('Asia');
    expect(regionNames).toContain('Europe');
    expect(regionNames).toContain('Oceania');
  });

  it('nests sub-regions under continents', () => {
    const tree = buildTree();
    const oceania = tree.children.find((c) => c.code === 'Oceania')!;
    expect(oceania).toBeDefined();
    const subRegions = oceania.children.map((c) => c.code);
    expect(subRegions).toContain('Australia and New Zealand');
    expect(subRegions).toContain('Melanesia');
    expect(subRegions).toContain('Micronesia');
    expect(subRegions).toContain('Polynesia');
  });

  it('nests countries under sub-regions', () => {
    const tree = buildTree();
    const oceania = tree.children.find((c) => c.code === 'Oceania')!;
    const anz = oceania.children.find((c) => c.code === 'Australia and New Zealand')!;
    const countries = anz.children.map((c) => c.code);
    expect(countries).toContain('AU');
    expect(countries).toContain('NZ');
  });
});
