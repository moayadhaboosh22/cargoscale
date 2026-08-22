import { PackageInput, CargoSummary } from '../types/shipment';
import { normalizePackage } from './units';

const CBM_TO_CFT = 35.3146667;
const KG_TO_LB = 1 / 0.45359237;

export function calculateCFT(cbm: number): number {
  return cbm * CBM_TO_CFT;
}

export function calculateCargoDensity(totalGrossWeightKg: number, totalCBM: number): number {
  if (totalCBM === 0) return 0;
  return totalGrossWeightKg / totalCBM;
}

export function calculateCargoSummary(packages: PackageInput[]): CargoSummary {
  if (packages.length === 0) {
    return {
      totalPackages: 0,
      totalCBM: 0,
      totalCFT: 0,
      totalGrossWeightKg: 0,
      totalGrossWeightLb: 0,
      cargoDensityKgM3: 0,
      maxUnitDimensionsM: { lengthM: 0, widthM: 0, heightM: 0 },
    };
  }

  const normalized = packages.map(normalizePackage);

  let totalPackages = 0;
  let totalCBM = 0;
  let totalGrossWeightKg = 0;
  let maxUnitDimensionsM = { lengthM: 0, widthM: 0, heightM: 0 };

  for (const pkg of normalized) {
    totalPackages += pkg.quantity;
    totalCBM += pkg.totalVolumeM3;
    totalGrossWeightKg += pkg.totalGrossWeightKg;

    if (pkg.volumePerUnitM3 > maxUnitDimensionsM.lengthM * maxUnitDimensionsM.widthM * maxUnitDimensionsM.heightM) {
      maxUnitDimensionsM = {
        lengthM: pkg.lengthM,
        widthM: pkg.widthM,
        heightM: pkg.heightM,
      };
    }
  }

  return {
    totalPackages,
    totalCBM,
    totalCFT: calculateCFT(totalCBM),
    totalGrossWeightKg,
    totalGrossWeightLb: totalGrossWeightKg * KG_TO_LB,
    cargoDensityKgM3: calculateCargoDensity(totalGrossWeightKg, totalCBM),
    maxUnitDimensionsM,
  };
}