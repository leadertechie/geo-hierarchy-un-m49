import { describe, it, expect } from 'vitest';
import AFRICA from '../regions/africa';
import AMERICAS from '../regions/americas';
import ASIA from '../regions/asia';
import EUROPE from '../regions/europe';
import OCEANIA from '../regions/oceania';

describe('Africa strategy', () => {
  it('has continent root', () => {
    expect(AFRICA['Africa']).toBe('World');
  });

  it('has sub-regions', () => {
    expect(AFRICA['Northern Africa']).toBe('Africa');
    expect(AFRICA['Sub-Saharan Africa']).toBe('Africa');
    expect(AFRICA['Eastern Africa']).toBe('Sub-Saharan Africa');
    expect(AFRICA['Middle Africa']).toBe('Sub-Saharan Africa');
    expect(AFRICA['Southern Africa']).toBe('Sub-Saharan Africa');
    expect(AFRICA['Western Africa']).toBe('Sub-Saharan Africa');
  });

  it('has countries', () => {
    expect(AFRICA['ZA']).toBe('Southern Africa');
    expect(AFRICA['NG']).toBe('Western Africa');
    expect(AFRICA['KE']).toBe('Eastern Africa');
    expect(AFRICA['EG']).toBe('Northern Africa');
    expect(AFRICA['AO']).toBe('Middle Africa');
  });

  it('has Alpha-3 codes', () => {
    expect(AFRICA['ZAF']).toBe('Southern Africa');
    expect(AFRICA['NGA']).toBe('Western Africa');
    expect(AFRICA['KEN']).toBe('Eastern Africa');
  });

  it('has no duplicate parent references', () => {
    const parents = Object.values(AFRICA);
    const unique = new Set(parents);
    // All parents should be known keys within Africa or "World"
    for (const p of unique) {
      if (p === 'World') continue;
      expect(AFRICA).toHaveProperty(p);
    }
  });
});

describe('Americas strategy', () => {
  it('has continent root', () => {
    expect(AMERICAS['Americas']).toBe('World');
  });

  it('has sub-regions', () => {
    expect(AMERICAS['Northern America']).toBe('Americas');
    expect(AMERICAS['Latin America and the Caribbean']).toBe('Americas');
    expect(AMERICAS['Caribbean']).toBe('Latin America and the Caribbean');
    expect(AMERICAS['Central America']).toBe('Latin America and the Caribbean');
    expect(AMERICAS['South America']).toBe('Latin America and the Caribbean');
  });

  it('has countries', () => {
    expect(AMERICAS['US']).toBe('Northern America');
    expect(AMERICAS['CA']).toBe('Northern America');
    expect(AMERICAS['BR']).toBe('South America');
    expect(AMERICAS['MX']).toBe('Central America');
    expect(AMERICAS['CU']).toBe('Caribbean');
  });

  it('has Alpha-3 codes', () => {
    expect(AMERICAS['USA']).toBe('Northern America');
    expect(AMERICAS['BRA']).toBe('South America');
  });

  it('has no duplicate parent references', () => {
    const parents = Object.values(AMERICAS);
    const unique = new Set(parents);
    for (const p of unique) {
      if (p === 'World') continue;
      expect(AMERICAS).toHaveProperty(p);
    }
  });
});

describe('Asia strategy', () => {
  it('has continent root', () => {
    expect(ASIA['Asia']).toBe('World');
  });

  it('has sub-regions', () => {
    expect(ASIA['Central Asia']).toBe('Asia');
    expect(ASIA['Eastern Asia']).toBe('Asia');
    expect(ASIA['South-eastern Asia']).toBe('Asia');
    expect(ASIA['Southern Asia']).toBe('Asia');
    expect(ASIA['Western Asia']).toBe('Asia');
  });

  it('has countries', () => {
    expect(ASIA['CN']).toBe('Eastern Asia');
    expect(ASIA['IN']).toBe('Southern Asia');
    expect(ASIA['JP']).toBe('Eastern Asia');
    expect(ASIA['SA']).toBe('Western Asia');
    expect(ASIA['ID']).toBe('South-eastern Asia');
    expect(ASIA['KZ']).toBe('Central Asia');
  });

  it('has Alpha-3 codes', () => {
    expect(ASIA['CHN']).toBe('Eastern Asia');
    expect(ASIA['IND']).toBe('Southern Asia');
  });

  it('has no duplicate parent references', () => {
    const parents = Object.values(ASIA);
    const unique = new Set(parents);
    for (const p of unique) {
      if (p === 'World') continue;
      expect(ASIA).toHaveProperty(p);
    }
  });
});

describe('Europe strategy', () => {
  it('has continent root', () => {
    expect(EUROPE['Europe']).toBe('World');
  });

  it('has sub-regions', () => {
    expect(EUROPE['Eastern Europe']).toBe('Europe');
    expect(EUROPE['Northern Europe']).toBe('Europe');
    expect(EUROPE['Southern Europe']).toBe('Europe');
    expect(EUROPE['Western Europe']).toBe('Europe');
  });

  it('has countries', () => {
    expect(EUROPE['GB']).toBe('Northern Europe');
    expect(EUROPE['DE']).toBe('Western Europe');
    expect(EUROPE['FR']).toBe('Western Europe');
    expect(EUROPE['IT']).toBe('Southern Europe');
    expect(EUROPE['PL']).toBe('Eastern Europe');
    expect(EUROPE['RU']).toBe('Eastern Europe');
  });

  it('has Alpha-3 codes', () => {
    expect(EUROPE['GBR']).toBe('Northern Europe');
    expect(EUROPE['DEU']).toBe('Western Europe');
  });

  it('has no duplicate parent references', () => {
    const parents = Object.values(EUROPE);
    const unique = new Set(parents);
    for (const p of unique) {
      if (p === 'World') continue;
      expect(EUROPE).toHaveProperty(p);
    }
  });
});

describe('Oceania strategy', () => {
  it('has continent root', () => {
    expect(OCEANIA['Oceania']).toBe('World');
  });

  it('has sub-regions', () => {
    expect(OCEANIA['Australia and New Zealand']).toBe('Oceania');
    expect(OCEANIA['Melanesia']).toBe('Oceania');
    expect(OCEANIA['Micronesia']).toBe('Oceania');
    expect(OCEANIA['Polynesia']).toBe('Oceania');
  });

  it('has countries', () => {
    expect(OCEANIA['AU']).toBe('Australia and New Zealand');
    expect(OCEANIA['NZ']).toBe('Australia and New Zealand');
    expect(OCEANIA['FJ']).toBe('Melanesia');
    expect(OCEANIA['FM']).toBe('Micronesia');
    expect(OCEANIA['TO']).toBe('Polynesia');
  });

  it('has Alpha-3 codes', () => {
    expect(OCEANIA['AUS']).toBe('Australia and New Zealand');
    expect(OCEANIA['NZL']).toBe('Australia and New Zealand');
  });

  it('has no duplicate parent references', () => {
    const parents = Object.values(OCEANIA);
    const unique = new Set(parents);
    for (const p of unique) {
      if (p === 'World') continue;
      expect(OCEANIA).toHaveProperty(p);
    }
  });
});
