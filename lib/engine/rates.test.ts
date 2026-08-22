import { describe, it, expect } from 'vitest';
import { calculateAirFreightCost, calculateLclFreightCost, calculateFclFreightCost } from './rates';

describe('calculateAirFreightCost', () => {
  it('calculates cost without a minimum', () => {
    const result = calculateAirFreightCost(50, {
      ratePerKg: 4,
      originCharges: 100,
      destinationCharges: 150,
      additionalCharges: 20,
      currency: 'USD',
    });
    expect(result.baseFreight).toBe(200);
    expect(result.totalEstimatedCost).toBe(200 + 100 + 150 + 20);
    expect(result.currency).toBe('USD');
  });

  it('applies the minimum when calculated cost is lower', () => {
    const result = calculateAirFreightCost(10, {
      ratePerKg: 4,
      minimumCharge: 100,
      originCharges: 0,
      destinationCharges: 0,
      additionalCharges: 0,
      currency: 'USD',
    });
    expect(result.baseFreight).toBe(100);
  });
});

describe('calculateLclFreightCost', () => {
  it('calculates cost without a minimum', () => {
    const result = calculateLclFreightCost(18, {
      ratePerRT: 50,
      originCharges: 100,
      destinationCharges: 150,
      additionalCharges: 0,
      currency: 'USD',
    });
    expect(result.baseFreight).toBe(900);
    expect(result.totalEstimatedCost).toBe(900 + 100 + 150 + 0);
  });

  it('applies the minimum RT when shipment is smaller than it', () => {
    const result = calculateLclFreightCost(2, {
      ratePerRT: 50,
      minimumRT: 5,
      originCharges: 0,
      destinationCharges: 0,
      additionalCharges: 0,
      currency: 'USD',
    });
    expect(result.baseFreight).toBe(5 * 50);
  });
});

describe('calculateFclFreightCost', () => {
  it('calculates cost by multiplying flat rate by container count', () => {
    const result = calculateFclFreightCost({
      containerFlatRate: 950,
      numberOfContainers: 2,
      originCharges: 250,
      destinationCharges: 300,
      additionalCharges: 50,
      currency: 'USD',
    });
    expect(result.baseFreight).toBe(1900);
    expect(result.totalEstimatedCost).toBe(1900 + 250 + 300 + 50);
  });
});