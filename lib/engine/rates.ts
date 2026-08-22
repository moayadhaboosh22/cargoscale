import { CostBreakdown, AirRateInput, LclRateInput, FclRateInput } from '../types/shipment';

function sumCharges(baseFreight: number, originCharges: number, destinationCharges: number, additionalCharges: number): number {
  return baseFreight + originCharges + destinationCharges + additionalCharges;
}

export function calculateAirFreightCost(chargeableWeightKg: number, input: AirRateInput): CostBreakdown {
  const calculatedFreight = chargeableWeightKg * input.ratePerKg;
  const baseFreight = input.minimumCharge !== undefined
    ? Math.max(calculatedFreight, input.minimumCharge)
    : calculatedFreight;

  return {
    baseFreight,
    originCharges: input.originCharges,
    destinationCharges: input.destinationCharges,
    additionalCharges: input.additionalCharges,
    totalEstimatedCost: sumCharges(baseFreight, input.originCharges, input.destinationCharges, input.additionalCharges),
    currency: input.currency,
  };
}

export function calculateLclFreightCost(chargeableRT: number, input: LclRateInput): CostBreakdown {
  const effectiveRT = input.minimumRT !== undefined
    ? Math.max(chargeableRT, input.minimumRT)
    : chargeableRT;
  const baseFreight = effectiveRT * input.ratePerRT;

  return {
    baseFreight,
    originCharges: input.originCharges,
    destinationCharges: input.destinationCharges,
    additionalCharges: input.additionalCharges,
    totalEstimatedCost: sumCharges(baseFreight, input.originCharges, input.destinationCharges, input.additionalCharges),
    currency: input.currency,
  };
}

export function calculateFclFreightCost(input: FclRateInput): CostBreakdown {
  const baseFreight = input.containerFlatRate * input.numberOfContainers;

  return {
    baseFreight,
    originCharges: input.originCharges,
    destinationCharges: input.destinationCharges,
    additionalCharges: input.additionalCharges,
    totalEstimatedCost: sumCharges(baseFreight, input.originCharges, input.destinationCharges, input.additionalCharges),
    currency: input.currency,
  };
}