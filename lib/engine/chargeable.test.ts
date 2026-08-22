import { describe, it, expect } from 'vitest';
import { calculateVolumetricWeight, calculateChargeableWeight, calculateRevenueTon } from './chargeable';

describe('calculateVolumetricWeight', () => {
  it('calculates volumetric weight with DIM factor 6000 correctly', () => {
    const result = calculateVolumetricWeight(50, 40, 30, 6000);
    expect(result).toBeCloseTo(10);
  });

  it('calculates volumetric weight with DIM factor 5000 correctly', () => {
    const result = calculateVolumetricWeight(50, 40, 30, 5000);
    expect(result).toBeCloseTo(12);
  });
});

describe('calculateChargeableWeight', () => {
  it('picks gross weight when it is larger than volumetric', () => {
    const result = calculateChargeableWeight(20, 40, 40, 30, 6000);
    expect(result.grossWeightKg).toBe(20);
    expect(result.volumetricWeightKg).toBeCloseTo(8);
    expect(result.chargeableWeightKg).toBe(20);
    expect(result.dimFactor).toBe(6000);
  });

  it('picks volumetric weight when it is larger than gross', () => {
    const result = calculateChargeableWeight(5, 60, 50, 40, 5000);
    expect(result.grossWeightKg).toBe(5);
    expect(result.volumetricWeightKg).toBeCloseTo(24);
    expect(result.chargeableWeightKg).toBeCloseTo(24);
  });
});

describe('calculateRevenueTon', () => {
  it('picks volume (CBM) when larger than weight in RT', () => {
    const result = calculateRevenueTon(18, 4000);
    expect(result.volumeCBM).toBe(18);
    expect(result.weightRT).toBeCloseTo(4);
    expect(result.chargeableRT).toBeCloseTo(18);
  });

  it('picks weight (RT) when larger than volume', () => {
    const result = calculateRevenueTon(3, 5000);
    expect(result.weightRT).toBeCloseTo(5);
    expect(result.chargeableRT).toBeCloseTo(5);
  });
});