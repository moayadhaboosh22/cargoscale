import { describe, it, expect } from 'vitest';
import { calculateCargoSummary } from './cbm';
import { PackageInput } from '../types/shipment';

describe('calculateCargoSummary', () => {
  const packages: PackageInput[] = [
    {
      id: '1',
      unitType: 'carton',
      quantity: 10,
      length: 50,
      width: 40,
      height: 30,
      dimUnit: 'cm',
      weightPerUnit: 15,
      weightUnit: 'kg',
      stackable: true,
      allowRotation: false,
    },
    {
      id: '2',
      unitType: 'pallet',
      quantity: 2,
      length: 120,
      width: 100,
      height: 150,
      dimUnit: 'cm',
      weightPerUnit: 200,
      weightUnit: 'kg',
      stackable: false,
      allowRotation: false,
    },
  ];

  const result = calculateCargoSummary(packages);

  it('calculates total package count correctly', () => {
    expect(result.totalPackages).toBe(12);
  });

  it('calculates total CBM correctly', () => {
    expect(result.totalCBM).toBeCloseTo(4.2);
  });

  it('calculates total CFT correctly', () => {
    expect(result.totalCFT).toBeCloseTo(4.2 * 35.3147, 1);
  });

  it('calculates total weight in kg correctly', () => {
    expect(result.totalGrossWeightKg).toBeCloseTo(550);
  });

  it('calculates total weight in lb correctly', () => {
    expect(result.totalGrossWeightLb).toBeCloseTo(550 / 0.45359237, 1);
  });

  it('calculates cargo density correctly', () => {
    expect(result.cargoDensityKgM3).toBeCloseTo(550 / 4.2, 2);
  });

  it('identifies largest package dimensions', () => {
    expect(result.maxUnitDimensionsM.lengthM).toBeCloseTo(1.2);
    expect(result.maxUnitDimensionsM.widthM).toBeCloseTo(1.0);
    expect(result.maxUnitDimensionsM.heightM).toBeCloseTo(1.5);
  });

  it('returns zeros for an empty list', () => {
    const empty = calculateCargoSummary([]);
    expect(empty.totalPackages).toBe(0);
    expect(empty.totalCBM).toBe(0);
    expect(empty.cargoDensityKgM3).toBe(0);
  });
});