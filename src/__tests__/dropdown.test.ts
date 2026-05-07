import { describe, it, expect } from 'vitest';
import {
  getContinents,
  getSubRegions,
  getCountriesInSubRegion,
  getCountriesInRegion,
  getRegionSubRegionPairs,
  getHierarchyLevels,
  getChildren,
} from '../index';

describe('getContinents', () => {
  it('returns all 5 continent names as children of World', () => {
    const continents = getContinents();
    expect(continents).toContain('Africa');
    expect(continents).toContain('Americas');
    expect(continents).toContain('Asia');
    expect(continents).toContain('Europe');
    expect(continents).toContain('Oceania');
  });

  it('returns same result as getChildren("World")', () => {
    expect(getContinents()).toEqual(getChildren('World'));
  });
});

describe('getSubRegions', () => {
  it('returns sub-region names for a continent, excluding ISO codes', () => {
    const subRegions = getSubRegions('Asia');
    expect(subRegions).toContain('Central Asia');
    expect(subRegions).toContain('Eastern Asia');
    expect(subRegions).toContain('South-eastern Asia');
    expect(subRegions).toContain('Southern Asia');
    expect(subRegions).toContain('Western Asia');
    expect(subRegions).not.toContain('IN');
    expect(subRegions).not.toContain('IND');
    expect(subRegions).not.toContain('CN');
  });

  it('returns sub-regions including deep ones for Africa', () => {
    const subRegions = getSubRegions('Africa');
    expect(subRegions).toContain('Northern Africa');
    expect(subRegions).toContain('Sub-Saharan Africa');
  });

  it('returns empty array when only countries exist under region', () => {
    expect(getSubRegions('Southern Asia')).toEqual([]);
  });

  it('returns empty array for unknown region', () => {
    expect(getSubRegions('Atlantis')).toEqual([]);
  });
});

describe('getCountriesInSubRegion', () => {
  it('returns ISO codes directly under a sub-region', () => {
    const countries = getCountriesInSubRegion('Southern Asia');
    expect(countries).toContain('IN');
    expect(countries).toContain('IND');
    expect(countries).toContain('PK');
    expect(countries).toContain('PAK');
    expect(countries).toContain('BD');
    expect(countries).toContain('BGD');
    expect(countries).not.toContain('Asia');
    expect(countries).not.toContain('Central Asia');
  });

  it('returns empty array for a continent (no countries directly)', () => {
    expect(getCountriesInSubRegion('Asia')).toEqual([]);
  });

  it('returns empty array for unknown region', () => {
    expect(getCountriesInSubRegion('Atlantis')).toEqual([]);
  });
});

describe('getCountriesInSubRegion vs getCountriesInRegion', () => {
  it('getCountriesInRegion returns countries in a flat list (not recursive)', () => {
    const all = getCountriesInRegion('Sub-Saharan Africa');
    expect(all).toEqual([]);
  });

  it('getCountriesInSubRegion only returns direct children that are ISO codes', () => {
    const direct = getCountriesInSubRegion('Sub-Saharan Africa');
    expect(direct).toEqual([]);

    const ea = getCountriesInSubRegion('Eastern Africa');
    expect(ea).toContain('KE');
    expect(ea).toContain('TZ');
  });

  it('both return same result for leaf sub-regions', () => {
    const byRegion = getCountriesInRegion('Southern Asia');
    const bySubRegion = getCountriesInSubRegion('Southern Asia');
    expect(byRegion.sort()).toEqual(bySubRegion.sort());
  });
});

describe('getRegionSubRegionPairs', () => {
  it('returns an array of RegionSubRegionPair objects', () => {
    const pairs = getRegionSubRegionPairs();
    expect(Array.isArray(pairs)).toBe(true);
    expect(pairs.length).toBeGreaterThan(0);

    for (const pair of pairs) {
      expect(pair).toHaveProperty('region');
      expect(pair).toHaveProperty('subRegion');
      expect(typeof pair.region).toBe('string');
      expect(typeof pair.subRegion).toBe('string');
    }
  });

  it('includes simple pairs (continent → direct sub-region)', () => {
    const pairs = getRegionSubRegionPairs();
    expect(pairs).toContainEqual({ region: 'Asia', subRegion: 'Southern Asia' });
    expect(pairs).toContainEqual({ region: 'Oceania', subRegion: 'Australia and New Zealand' });
    expect(pairs).toContainEqual({ region: 'Europe', subRegion: 'Northern Europe' });
  });

  it('flattens deep Africa hierarchy (continent → grandchild sub-region)', () => {
    const pairs = getRegionSubRegionPairs();
    expect(pairs).toContainEqual({ region: 'Africa', subRegion: 'Eastern Africa' });
    expect(pairs).toContainEqual({ region: 'Africa', subRegion: 'Middle Africa' });
    expect(pairs).toContainEqual({ region: 'Africa', subRegion: 'Southern Africa' });
    expect(pairs).toContainEqual({ region: 'Africa', subRegion: 'Western Africa' });
  });

  it('includes Sub-Saharan Africa as its own pair too', () => {
    const pairs = getRegionSubRegionPairs();
    expect(pairs).toContainEqual({ region: 'Africa', subRegion: 'Sub-Saharan Africa' });
  });

  it('covers all 5 continents', () => {
    const pairs = getRegionSubRegionPairs();
    const regions = [...new Set(pairs.map((p) => p.region))];
    expect(regions).toContain('Africa');
    expect(regions).toContain('Americas');
    expect(regions).toContain('Asia');
    expect(regions).toContain('Europe');
    expect(regions).toContain('Oceania');
  });

  it('never includes ISO codes as subRegion', () => {
    const pairs = getRegionSubRegionPairs();
    for (const pair of pairs) {
      expect(pair.subRegion).not.toMatch(/^[A-Z]{2,3}$/);
    }
  });
});

describe('getHierarchyLevels', () => {
  it('returns one level for shallow continents like Asia', () => {
    const levels = getHierarchyLevels('Asia');
    expect(levels.length).toBe(1);
    expect(levels[0]).toContain('Southern Asia');
    expect(levels[0]).toContain('Eastern Asia');
  });

  it('returns two levels for deep continents like Africa', () => {
    const levels = getHierarchyLevels('Africa');
    expect(levels.length).toBe(2);
    expect(levels[0]).toContain('Northern Africa');
    expect(levels[0]).toContain('Sub-Saharan Africa');
    expect(levels[1]).toContain('Eastern Africa');
    expect(levels[1]).toContain('Middle Africa');
    expect(levels[1]).toContain('Southern Africa');
    expect(levels[1]).toContain('Western Africa');
  });

  it('returns empty array for a region with no sub-regions', () => {
    expect(getHierarchyLevels('Southern Asia')).toEqual([]);
  });

  it('returns empty array for unknown continent', () => {
    expect(getHierarchyLevels('Atlantis')).toEqual([]);
  });
});
