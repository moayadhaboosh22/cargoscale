import {
  CargoSummary,
  NormalizedPackage,
  ContainerType,
  ContainerSpec,
  ContainerFitAssessment,
  ContainerRecommendation,
  DimensionCheckResult,
  CheckStatus,
} from '../types/shipment';
import { getAllContainerTypes, getContainerSpec } from '../reference/containers';

const HIGH_CONFIDENCE_THRESHOLD_PERCENT = 90;

export function calculateVolumeUtilization(totalCBM: number, usableVolumeM3: number): number {
  if (usableVolumeM3 === 0) return 0;
  return (totalCBM / usableVolumeM3) * 100;
}

export function calculatePayloadUtilization(totalGrossWeightKg: number, payloadKg: number): number {
  if (payloadKg === 0) return 0;
  return (totalGrossWeightKg / payloadKg) * 100;
}

export function checkDimensions(pkg: NormalizedPackage, container: ContainerSpec): DimensionCheckResult {
  const fitsAsIs =
    pkg.lengthM <= container.internalLengthM &&
    pkg.widthM <= container.internalWidthM &&
    pkg.heightM <= container.internalHeightM;

  const pkgDimsSorted = [pkg.lengthM, pkg.widthM, pkg.heightM].sort((a, b) => b - a);
  const containerDimsSorted = [
    container.internalLengthM,
    container.internalWidthM,
    container.internalHeightM,
  ].sort((a, b) => b - a);

  const fitsWithRotation =
    pkgDimsSorted[0] <= containerDimsSorted[0] &&
    pkgDimsSorted[1] <= containerDimsSorted[1] &&
    pkgDimsSorted[2] <= containerDimsSorted[2];

  const status: CheckStatus = pkg.allowRotation
    ? (fitsWithRotation ? 'PASS' : 'FAIL')
    : (fitsAsIs ? 'PASS' : 'FAIL');

  return {
    packageId: pkg.id,
    status,
    fitsAsIs,
    fitsWithRotation,
  };
}

export function assessContainerFit(
  cargoSummary: CargoSummary,
  normalizedPackages: NormalizedPackage[],
  containerType: ContainerType
): ContainerFitAssessment {
  const container = getContainerSpec(containerType);

  const volumeUtilizationPercent = calculateVolumeUtilization(cargoSummary.totalCBM, container.usableVolumeM3);
  const payloadUtilizationPercent = calculatePayloadUtilization(cargoSummary.totalGrossWeightKg, container.payloadKg);

  const volumeCheck: CheckStatus = cargoSummary.totalCBM <= container.usableVolumeM3 ? 'PASS' : 'FAIL';
  const payloadCheck: CheckStatus = cargoSummary.totalGrossWeightKg <= container.payloadKg ? 'PASS' : 'FAIL';

  const dimensionResults = normalizedPackages.map((pkg) => checkDimensions(pkg, container));
  const dimensionCheck: CheckStatus = dimensionResults.every((r) => r.status === 'PASS') ? 'PASS' : 'FAIL';

  return {
    containerType,
    volumeUtilizationPercent,
    payloadUtilizationPercent,
    volumeCheck,
    payloadCheck,
    dimensionCheck,
    dimensionResults,
    loadingSimulated: false,
  };
}

export function recommendContainer(
  cargoSummary: CargoSummary,
  normalizedPackages: NormalizedPackage[]
): ContainerRecommendation {
  if (cargoSummary.totalPackages === 0 || normalizedPackages.length === 0) {
    return {
      recommendedContainer: null,
      strength: 'LOW',
      assessment: null,
      reasons: ['No packages provided; cannot generate a container recommendation.'],
    };
  }

  const orderedTypes = getAllContainerTypes();

  for (const type of orderedTypes) {
    const assessment = assessContainerFit(cargoSummary, normalizedPackages, type);

    const allPass =
      assessment.volumeCheck === 'PASS' &&
      assessment.payloadCheck === 'PASS' &&
      assessment.dimensionCheck === 'PASS';

    if (allPass) {
      const maxUtilization = Math.max(assessment.volumeUtilizationPercent, assessment.payloadUtilizationPercent);
      const strength = maxUtilization < HIGH_CONFIDENCE_THRESHOLD_PERCENT ? 'HIGH' : 'MEDIUM';

      const reasons = [
        type + ' passed volume, payload and reference dimension checks.',
        maxUtilization >= HIGH_CONFIDENCE_THRESHOLD_PERCENT
          ? 'Utilization is close to container limits; consider reviewing before booking.'
          : 'Utilization is comfortably within container limits.',
        'Physical loading arrangement was not simulated (reference dimension check only).',
      ];

      return {
        recommendedContainer: type,
        strength,
        assessment,
        reasons,
      };
    }
  }

  return {
    recommendedContainer: null,
    strength: 'LOW',
    assessment: null,
    reasons: [
      'No single container type accommodates this shipment based on volume, payload or dimension checks.',
      'Multiple containers or an alternative freight mode may be required.',
    ],
  };
}