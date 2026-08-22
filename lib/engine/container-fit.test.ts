import { describe, it, expect } from 'vitest';
import {
  calculateVolumeUtilization,
  calculatePayloadUtilization,
  checkDimensions,
  assessContainerFit,
  recommendContainer,
} from './container-fit';
import { normalizePackage } from './units';
import { calculateCargoSummary } from './cbm';
import { CONTAINER_SPECS } from '../reference/containers';
import { PackageInput } from '../types/shipment';

describe('calculateVolumeUtilization', () => {
  it('calculates volume usage percentage correctly', () => {
    expect(calculateVolumeUtilization(18, 28)).toBeCloseTo((18 / 28) * 100);
  });

  it('returns zero when capacity is zero', () => {
    expect(calculateVolumeUtilization(10, 0)).toBe(0);
  });
});

describe('calculatePayloadUtilization', () => {
  it('calculates weight usage percentage correctly', () => {
    expect(calculatePayloadUtilization(4000, 21800)).toBeCloseTo((4000 / 21800) * 100);
  });
});

describe('checkDimensions', () => {
  const container = CONTAINER_SPECS['20GP'];

  it('passes when package fits without rotation', () => {
    const pkg = normalizePackage({
      id: 'p1', unitType: 'crate', quantity: 1,
      length: 500, width: 200, height: 200, dimUnit: 'cm',
      weightPerUnit: 100, weightUnit: 'kg',
      stackable: true, allowRotation: false,
    });
    const result = checkDimensions(pkg, container);
    expect(result.fitsAsIs).toBe(true);
    expect(result.status).toBe('PASS');
  });

  it('fails when package is too large and rotation not allowed', () => {
    const pkg = normalizePackage({
      id: 'p2', unitType: 'crate', quantity: 1,
      length: 700, width: 200, height: 200, dimUnit: 'cm',
      weightPerUnit: 100, weightUnit: 'kg',
      stackable: true, allowRotation: false,
    });
    const result = checkDimensions(pkg, container);
    expect(result.fitsAsIs).toBe(false);
    expect(result.status).toBe('FAIL');
  });

  it('passes via rotation when allowRotation is set', () => {
    const pkg = normalizePackage({
      id: 'p3', unitType: 'crate', quantity: 1,
      length: 230, width: 230, height: 200, dimUnit: 'cm',
      weightPerUnit: 100, weightUnit: 'kg',
      stackable: true, allowRotation: true,
    });
    const result = checkDimensions(pkg, container);
    expect(result.fitsWithRotation).toBe(true);
    expect(result.status).toBe('PASS');
  });
});

describe('assessContainerFit', () => {
  const packages: PackageInput[] = [
    {
      id: '1', unitType: 'carton', quantity: 10,
      length: 60, width: 40, height: 50, dimUnit: 'cm',
      weightPerUnit: 15, weightUnit: 'kg',
      stackable: true, allowRotation: false,
    },
  ];
  const normalized = packages.map(normalizePackage);
  const cargoSummary = calculateCargoSummary(packages);

  const assessment = assessContainerFit(cargoSummary, normalized, '20GP');

  it('calculates volume and weight utilization correctly', () => {
    expect(assessment.volumeUtilizationPercent).toBeCloseTo((cargoSummary.totalCBM / 28) * 100);
    expect(assessment.payloadUtilizationPercent).toBeCloseTo((cargoSummary.totalGrossWeightKg / 21800) * 100);
  });

  it('gives PASS for volume and weight within capacity', () => {
    expect(assessment.volumeCheck).toBe('PASS');
    expect(assessment.payloadCheck).toBe('PASS');
  });

  it('keeps loadingSimulated as false always', () => {
    expect(assessment.loadingSimulated).toBe(false);
  });
});

describe('recommendContainer', () => {
  it('recommends the smallest fitting container (20GP) for a small shipment', () => {
    const packages: PackageInput[] = [
      {
        id: '1', unitType: 'carton', quantity: 10,
        length: 60, width: 40, height: 50, dimUnit: 'cm',
        weightPerUnit: 15, weightUnit: 'kg',
        stackable: true, allowRotation: false,
      },
    ];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const result = recommendContainer(cargoSummary, normalized);

    expect(result.recommendedContainer).toBe('20GP');
    expect(result.strength).toBe('HIGH');
  });

  it('recommends a larger container (at least 40GP) for a bigger shipment', () => {
    const packages: PackageInput[] = [
      {
        id: '1', unitType: 'pallet', quantity: 25,
        length: 120, width: 100, height: 150, dimUnit: 'cm',
        weightPerUnit: 300, weightUnit: 'kg',
        stackable: false, allowRotation: false,
      },
    ];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const result = recommendContainer(cargoSummary, normalized);

    expect(['40GP', '40HC']).toContain(result.recommendedContainer);
  });

  it('returns null for an empty list', () => {
    const result = recommendContainer(calculateCargoSummary([]), []);
    expect(result.recommendedContainer).toBe(null);
    expect(result.strength).toBe('LOW');
  });
});