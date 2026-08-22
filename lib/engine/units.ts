import { PackageInput, NormalizedPackage } from '../types/shipment';

export function convertToMeters(value: number, unit: 'cm' | 'mm' | 'in' | 'm' | 'ft'): number {
  switch (unit) {
    case 'mm':
      return value * 0.001;
    case 'cm':
      return value * 0.01;
    case 'in':
      return value * 0.0254;
    case 'ft':
      return value * 0.3048;
    case 'm':
    default:
      return value;
  }
}

export function convertToKg(value: number, unit: 'kg' | 'lb'): number {
  switch (unit) {
    case 'lb':
      return value * 0.45359237;
    case 'kg':
    default:
      return value;
  }
}

export function normalizePackage(pkg: PackageInput): NormalizedPackage {
  const lengthM = convertToMeters(pkg.length, pkg.dimUnit);
  const widthM = convertToMeters(pkg.width, pkg.dimUnit);
  const heightM = convertToMeters(pkg.height, pkg.dimUnit);

  const volumePerUnitM3 = lengthM * widthM * heightM;
  const totalVolumeM3 = volumePerUnitM3 * pkg.quantity;

  const grossWeightPerUnitKg = convertToKg(pkg.weightPerUnit, pkg.weightUnit);
  const totalGrossWeightKg = grossWeightPerUnitKg * pkg.quantity;

  return {
    ...pkg,
    lengthM,
    widthM,
    heightM,
    volumePerUnitM3,
    totalVolumeM3,
    grossWeightPerUnitKg,
    totalGrossWeightKg,
  };
}
