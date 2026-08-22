import { describe, it, expect } from 'vitest';
import { compareLclVsFcl } from './comparison';
import { CostBreakdown } from '../types/shipment';

const makeCost = (total: number): CostBreakdown => ({
  baseFreight: total - 50,
  originCharges: 50,
  destinationCharges: 0,
  additionalCharges: 0,
  totalEstimatedCost: total,
  currency: 'USD',
});

describe('compareLclVsFcl', () => {
  it('recommends LCL when its cost is lower', () => {
    const result = compareLclVsFcl(makeCost(800), makeCost(1200));
    expect(result.recommendedOption).toBe('LCL');
    expect(result.differenceAmount).toBeCloseTo(400);
    expect(result.strength).toBe('HIGH');
  });

  it('recommends FCL when its cost is lower', () => {
    const result = compareLclVsFcl(makeCost(1500), makeCost(1000));
    expect(result.recommendedOption).toBe('FCL');
    expect(result.differenceAmount).toBeCloseTo(500);
    expect(result.strength).toBe('HIGH');
  });

  it('returns LOW strength with no recommendation when one price is missing', () => {
    const result = compareLclVsFcl(makeCost(800), null);
    expect(result.recommendedOption).toBe(null);
    expect(result.strength).toBe('LOW');
    expect(result.fclCost).toBe(null);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it('returns LOW strength when both prices are nearly equal', () => {
    const result = compareLclVsFcl(makeCost(1000), makeCost(1005));
    expect(result.strength).toBe('LOW');
  });
});