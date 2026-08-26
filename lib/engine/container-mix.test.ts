import { describe, it, expect } from 'vitest';
import { recommendContainerMix } from './container-mix';
import { normalizePackage } from './units';
import { calculateCargoSummary } from './cbm';
import { PackageInput } from '../types/shipment';

function build(packages: PackageInput[]) {
  const normalized = packages.map(normalizePackage);
  const cargoSummary = calculateCargoSummary(packages);
  return { normalized, cargoSummary };
}

function pkg(overrides: Partial<PackageInput>): PackageInput {
  return {
    id: overrides.id ?? '1',
    unitType: 'carton',
    quantity: 1,
    length: 50,
    width: 50,
    height: 50,
    dimUnit: 'cm',
    weightPerUnit: 10,
    weightUnit: 'kg',
    stackable: true,
    allowRotation: false,
    ...overrides,
  };
}

describe('recommendContainerMix', () => {
  it('returns a no-cargo result for an empty shipment', () => {
    const result = recommendContainerMix(calculateCargoSummary([]), []);
    expect(result.feasible).toBe(false);
    expect(result.totalContainers).toBe(0);
  });

  it('recommends a single 20GP for a small shipment', () => {
    const { normalized, cargoSummary } = build([
      pkg({ quantity: 10, length: 60, width: 40, height: 50, weightPerUnit: 15 }),
    ]);
    const result = recommendContainerMix(cargoSummary, normalized);
    expect(result.totalContainers).toBe(1);
    expect(result.lines).toEqual([{ type: '20GP', count: 1 }]);
    expect(result.feasible).toBe(true);
    expect(result.dimensionalIssue).toBe(false);
  });

  it('recommends a larger single container for a bigger (but still single-container) shipment', () => {
    const { normalized, cargoSummary } = build([
      pkg({ quantity: 25, length: 120, width: 100, height: 150, weightPerUnit: 300 }),
    ]);
    const result = recommendContainerMix(cargoSummary, normalized);
    expect(result.totalContainers).toBe(1);
    expect(['40GP', '40HC']).toContain(result.lines[0].type);
  });

  it('Mandatory regression -- Case A: 15 CBM / 90,000 KG must NOT be 1x 40HC and must respect payload limits', () => {
    const { normalized, cargoSummary } = build([
      pkg({ quantity: 10, length: 100, width: 100, height: 150, weightPerUnit: 9000 }),
    ]);
    expect(cargoSummary.totalCBM).toBeCloseTo(15);
    expect(cargoSummary.totalGrossWeightKg).toBeCloseTo(90000);

    const result = recommendContainerMix(cargoSummary, normalized);

    expect(result.lines).not.toEqual([{ type: '40HC', count: 1 }]);
    expect(result.totalContainers).toBeGreaterThan(1);
    expect(result.totalPayloadCapacityKg).toBeGreaterThanOrEqual(cargoSummary.totalGrossWeightKg);
    expect(result.limitingFactor).toBe('WEIGHT');
  });

  it('Mandatory regression -- Case B: 20 CBM / 50,000 KG must NOT be 1x 40HC', () => {
    const { normalized, cargoSummary } = build([
      pkg({ quantity: 10, length: 100, width: 100, height: 200, weightPerUnit: 5000 }),
    ]);
    expect(cargoSummary.totalCBM).toBeCloseTo(20);
    expect(cargoSummary.totalGrossWeightKg).toBeCloseTo(50000);

    const result = recommendContainerMix(cargoSummary, normalized);

    expect(result.lines).not.toEqual([{ type: '40HC', count: 1 }]);
    expect(result.totalContainers).toBeGreaterThanOrEqual(2);
    expect(result.totalPayloadCapacityKg).toBeGreaterThanOrEqual(cargoSummary.totalGrossWeightKg);
  });

  it('Mandatory regression -- Case C: an oversized package produces a dimensional warning, not more containers', () => {
    const { normalized, cargoSummary } = build([
      pkg({ id: 'oversized', quantity: 1, length: 1300, width: 200, height: 200, weightPerUnit: 5000, allowRotation: true }),
    ]);
    const result = recommendContainerMix(cargoSummary, normalized);

    expect(result.dimensionalIssue).toBe(true);
    expect(result.feasible).toBe(false);
    expect(result.reasons.join(' ')).toMatch(/exceed/i);
  });

  it('is volume-limited when volume drives the container count', () => {
    const { normalized, cargoSummary } = build([
      pkg({ quantity: 1, length: 1000, width: 235, height: 239, weightPerUnit: 500 }),
    ]);
    const result = recommendContainerMix(cargoSummary, normalized);
    expect(result.feasible).toBe(true);
    if (result.totalContainers > 0) {
      expect(result.payloadUtilizationPercent).toBeLessThan(result.volumeUtilizationPercent + 1);
    }
  });

  it('is weight-limited when weight drives the container count (multi-container)', () => {
    const { normalized, cargoSummary } = build([
      pkg({ quantity: 1, length: 100, width: 100, height: 100, weightPerUnit: 60000 }),
    ]);
    const result = recommendContainerMix(cargoSummary, normalized);
    expect(result.limitingFactor).toBe('WEIGHT');
    expect(result.totalContainers).toBeGreaterThanOrEqual(3);
  });

  it('handles a mixed package shipment (multiple rows) without under-counting', () => {
    const { normalized, cargoSummary } = build([
      pkg({ id: 'a', quantity: 10, length: 100, width: 100, height: 100, weightPerUnit: 100 }),
      pkg({ id: 'b', quantity: 5, length: 150, width: 120, height: 120, weightPerUnit: 800 }),
    ]);
    const result = recommendContainerMix(cargoSummary, normalized);
    expect(result.feasible).toBe(true);
    expect(result.totalPayloadCapacityKg).toBeGreaterThanOrEqual(cargoSummary.totalGrossWeightKg);
    expect(result.totalVolumeCapacityM3).toBeGreaterThanOrEqual(cargoSummary.totalCBM);
  });
});
