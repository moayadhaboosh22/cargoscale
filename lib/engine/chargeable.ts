import { ChargeableWeightResult, RevenueTonResult } from '../types/shipment';

export function calculateVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  dimFactor: number
): number {
  return (lengthCm * widthCm * heightCm) / dimFactor;
}

export function calculateChargeableWeight(
  grossWeightKg: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  dimFactor: number
): ChargeableWeightResult {
  const volumetricWeightKg = calculateVolumetricWeight(lengthCm, widthCm, heightCm, dimFactor);
  const chargeableWeightKg = Math.max(grossWeightKg, volumetricWeightKg);

  return {
    grossWeightKg,
    volumetricWeightKg,
    chargeableWeightKg,
    dimFactor,
  };
}

const KG_PER_REVENUE_TON = 1000;

export function calculateRevenueTon(
  volumeCBM: number,
  weightKg: number
): RevenueTonResult {
  const weightRT = weightKg / KG_PER_REVENUE_TON;
  const chargeableRT = Math.max(volumeCBM, weightRT);

  return {
    volumeCBM,
    weightRT,
    chargeableRT,
  };
}