import { describe, it, expect } from 'vitest';
import { convertToMeters, convertToKg, normalizePackage } from './units';
import { PackageInput } from '../types/shipment';

describe('convertToMeters', () => {
  it('converts cm to meters correctly', () => {
    expect(convertToMeters(100, 'cm')).toBeCloseTo(1);
  });

  it('converts mm to meters correctly', () => {
    expect(convertToMeters(1000, 'mm')).toBeCloseTo(1);
  });

  it('converts inches to meters correctly', () => {
    expect(convertToMeters(1, 'in')).toBeCloseTo(0.0254);
  });

  it('converts feet to meters correctly', () => {
    expect(convertToMeters(1, 'ft')).toBeCloseTo(0.3048);
  });

  it('returns same value when unit is already meters', () => {
    expect(convertToMeters(2.5, 'm')).toBe(2.5);
  });
});

describe('convertToKg', () => {
  it('converts lb to kg correctly', () => {
    expect(convertToKg(1, 'lb')).toBeCloseTo(0.45359237);
  });

  it('returns same value when unit is already kg', () => {
    expect(convertToKg(10, 'kg')).toBe(10);
  });
});

describe('normalizePackage', () => {
  const samplePackage: PackageInput = {
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
  };

  const result = normalizePackage(samplePackage);

  it('calculates dimensions in meters correctly', () => {
    expect(result.lengthM).toBeCloseTo(0.5);
    expect(result.widthM).toBeCloseTo(0.4);
    expect(result.heightM).toBeCloseTo(0.3);
  });

  it('calculates single unit volume correctly', () => {
    expect(result.volumePerUnitM3).toBeCloseTo(0.06);
  });

  it('calculates total volume correctly', () => {
    expect(result.totalVolumeM3).toBeCloseTo(0.6);
  });

  it('calculates total weight correctly', () => {
    expect(result.totalGrossWeightKg).toBeCloseTo(150);
  });
});