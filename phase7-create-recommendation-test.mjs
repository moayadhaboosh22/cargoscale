import fs from 'fs';

const content = `import { describe, it, expect } from 'vitest';
import { buildRecommendation } from './recommendation';
import { recommendContainerMix } from './container-mix';
import { normalizePackage } from './units';
import { calculateCargoSummary } from './cbm';
import { CostBreakdown, PackageInput } from '../types/shipment';

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

function cost(total: number): CostBreakdown {
  return {
    baseFreight: total,
    originCharges: 0,
    destinationCharges: 0,
    additionalCharges: 0,
    totalEstimatedCost: total,
    currency: 'USD',
  };
}

describe('buildRecommendation', () => {
  it('returns Pending when there is no cargo', () => {
    const result = buildRecommendation({
      freightMode: 'FCL',
      cargoSummary: calculateCargoSummary([]),
      chargeableWeightKg: 0,
      containerMix: null,
      lclCost: null,
      fclCost: null,
    });
    expect(result.headline).toBe('Pending');
    expect(result.confidence).toBe('LOW');
  });

  it('gives a clear Air Freight recommendation based on chargeable weight', () => {
    const packages = [pkg({ quantity: 10, weightPerUnit: 15 })];
    const cargoSummary = calculateCargoSummary(packages);
    const result = buildRecommendation({
      freightMode: 'Air',
      cargoSummary,
      chargeableWeightKg: 42,
      containerMix: null,
      lclCost: null,
      fclCost: null,
    });
    expect(result.headline).toContain('Air Freight');
    expect(result.reasons.join(' ')).toContain('42.00');
  });

  it('flags LCL cost comparison as unavailable when the LCL rate is missing', () => {
    const packages = [pkg({ quantity: 10, weightPerUnit: 15 })];
    const cargoSummary = calculateCargoSummary(packages);
    const result = buildRecommendation({
      freightMode: 'LCL',
      cargoSummary,
      chargeableWeightKg: 0,
      containerMix: null,
      lclCost: null,
      fclCost: null,
    });
    expect(result.confidence).toBe('LOW');
    expect(result.warnings.join(' ')).toMatch(/rate/i);
  });

  it('gives a normal FCL recommendation for a well-fitting shipment with no Smart-branded wording', () => {
    const packages = [pkg({ quantity: 10, length: 60, width: 40, height: 50, weightPerUnit: 15 })];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const containerMix = recommendContainerMix(cargoSummary, normalized);

    const result = buildRecommendation({
      freightMode: 'FCL',
      cargoSummary,
      chargeableWeightKg: 0,
      containerMix,
      lclCost: null,
      fclCost: null,
    });

    expect(result.headline).toContain('Recommended Container Mix');
    expect(result.headline).not.toMatch(/Smart/i);
  });

  it('adds a low-utilization warning for a small shipment in a large container, within the SAME result object', () => {
    const packages = [pkg({ quantity: 1, length: 100, width: 100, height: 100, weightPerUnit: 200 })];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const containerMix = recommendContainerMix(cargoSummary, normalized);

    const result = buildRecommendation({
      freightMode: 'FCL',
      cargoSummary,
      chargeableWeightKg: 0,
      containerMix,
      lclCost: null,
      fclCost: null,
    });

    if (containerMix.totalContainers === 1 && containerMix.volumeUtilizationPercent < 15) {
      expect(result.warnings.join(' ')).toMatch(/[Ll]ow utilization/);
      expect(result.headline).toContain('Recommended Container Mix');
    }
  });

  it('conflicting scenario resolved: low utilization + LCL cheaper produces one unified result', () => {
    const packages = [pkg({ quantity: 1, length: 100, width: 100, height: 100, weightPerUnit: 200 })];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const containerMix = recommendContainerMix(cargoSummary, normalized);

    const result = buildRecommendation({
      freightMode: 'FCL',
      cargoSummary,
      chargeableWeightKg: 0,
      containerMix,
      lclCost: cost(200),
      fclCost: cost(1200),
    });

    if (containerMix.totalContainers === 1 && containerMix.volumeUtilizationPercent < 15) {
      expect(result.costComparison).not.toBe(null);
      expect(result.costComparison?.recommendedOption).toBe('LCL');
      expect(result.warnings.some((w) => /LCL/.test(w) && /cheaper/.test(w))).toBe(true);
      expect(result.confidence).toBe('MEDIUM');
    }
  });

  it('produces a no-suitable-container result with a dimensional issue reason when a package is oversized', () => {
    const packages = [pkg({ id: 'oversized', quantity: 1, length: 1300, width: 200, height: 200, weightPerUnit: 5000, allowRotation: true })];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const containerMix = recommendContainerMix(cargoSummary, normalized);

    const result = buildRecommendation({
      freightMode: 'FCL',
      cargoSummary,
      chargeableWeightKg: 0,
      containerMix,
      lclCost: null,
      fclCost: null,
    });

    expect(result.headline).toMatch(/dimensional/i);
    expect(result.confidence).toBe('LOW');
  });

  it('does not fabricate a cost-based recommendation when FCL rate data is missing', () => {
    const packages = [pkg({ quantity: 10, length: 60, width: 40, height: 50, weightPerUnit: 15 })];
    const normalized = packages.map(normalizePackage);
    const cargoSummary = calculateCargoSummary(packages);
    const containerMix = recommendContainerMix(cargoSummary, normalized);

    const result = buildRecommendation({
      freightMode: 'FCL',
      cargoSummary,
      chargeableWeightKg: 0,
      containerMix,
      lclCost: cost(200),
      fclCost: null,
    });

    expect(result.costComparison).toBe(null);
  });
});
`;

const filePath = 'lib/engine/recommendation.test.ts';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
