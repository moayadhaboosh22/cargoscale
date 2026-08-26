import fs from 'fs';

const content = `import {
  CargoSummary,
  NormalizedPackage,
  ContainerMixResult,
} from '../types/shipment';
import { recommendContainer, checkDimensions } from './container-fit';
import { getAllContainerTypes, getContainerSpec } from '../reference/containers';

export function recommendContainerMix(
  cargoSummary: CargoSummary,
  normalizedPackages: NormalizedPackage[]
): ContainerMixResult {
  if (cargoSummary.totalPackages === 0 || normalizedPackages.length === 0) {
    return {
      lines: [],
      totalContainers: 0,
      totalVolumeCapacityM3: 0,
      totalPayloadCapacityKg: 0,
      volumeUtilizationPercent: 0,
      payloadUtilizationPercent: 0,
      limitingFactor: 'NONE',
      feasible: false,
      dimensionalIssue: false,
      reasons: ['No packages provided; cannot generate a container recommendation.'],
    };
  }

  // Step 1: try a single container using the existing, tested engine
  // (this already runs per-package dimension + rotation checks).
  const single = recommendContainer(cargoSummary, normalizedPackages);
  if (single.recommendedContainer && single.assessment) {
    const spec = getContainerSpec(single.recommendedContainer);
    const limitingFactor =
      single.assessment.volumeUtilizationPercent >= single.assessment.payloadUtilizationPercent
        ? 'VOLUME'
        : 'WEIGHT';

    return {
      lines: [{ type: single.recommendedContainer, count: 1 }],
      totalContainers: 1,
      totalVolumeCapacityM3: spec.usableVolumeM3,
      totalPayloadCapacityKg: spec.payloadKg,
      volumeUtilizationPercent: single.assessment.volumeUtilizationPercent,
      payloadUtilizationPercent: single.assessment.payloadUtilizationPercent,
      limitingFactor,
      feasible: true,
      dimensionalIssue: false,
      reasons: single.reasons,
    };
  }

  // Step 2: single container doesn't work. Determine why using the LARGEST
  // available type as the reference point: is this a dimensional problem
  // (a package too big for even the largest container), or a capacity
  // problem (needs multiple containers)?
  const allTypes = getAllContainerTypes();
  const largestType = allTypes[allTypes.length - 1];
  const largestSpec = getContainerSpec(largestType);

  const dimensionResults = normalizedPackages.map((pkg) => checkDimensions(pkg, largestSpec));
  const anyPackageOversized = dimensionResults.some((r) => r.status === 'FAIL');

  if (anyPackageOversized) {
    return {
      lines: [],
      totalContainers: 0,
      totalVolumeCapacityM3: 0,
      totalPayloadCapacityKg: 0,
      volumeUtilizationPercent: 0,
      payloadUtilizationPercent: 0,
      limitingFactor: 'NONE',
      feasible: false,
      dimensionalIssue: true,
      reasons: [
        'One or more packages exceed the internal dimensions of the largest available container (' + largestType + '), even with rotation considered.',
        'Adding more containers will not resolve this; this shipment may require breakbulk, out-of-gauge, or specialized equipment arrangements.',
      ],
    };
  }

  // Step 3: purely capacity-driven -- compute the required count from BOTH
  // volume and weight independently and take the larger requirement. This
  // is the fix for the critical under-counting bug: container count can
  // never come out lower than what volume or weight actually demands.
  const containersByVolume =
    cargoSummary.totalCBM > 0 ? Math.ceil(cargoSummary.totalCBM / largestSpec.usableVolumeM3) : 0;
  const containersByWeight =
    cargoSummary.totalGrossWeightKg > 0 ? Math.ceil(cargoSummary.totalGrossWeightKg / largestSpec.payloadKg) : 0;
  const count = Math.max(1, containersByVolume, containersByWeight);

  const totalVolumeCapacityM3 = largestSpec.usableVolumeM3 * count;
  const totalPayloadCapacityKg = largestSpec.payloadKg * count;
  const volumeUtilizationPercent =
    totalVolumeCapacityM3 > 0 ? (cargoSummary.totalCBM / totalVolumeCapacityM3) * 100 : 0;
  const payloadUtilizationPercent =
    totalPayloadCapacityKg > 0 ? (cargoSummary.totalGrossWeightKg / totalPayloadCapacityKg) * 100 : 0;
  const limitingFactor: 'VOLUME' | 'WEIGHT' = containersByVolume >= containersByWeight ? 'VOLUME' : 'WEIGHT';

  return {
    lines: [{ type: largestType, count }],
    totalContainers: count,
    totalVolumeCapacityM3,
    totalPayloadCapacityKg,
    volumeUtilizationPercent,
    payloadUtilizationPercent,
    limitingFactor,
    feasible: true,
    dimensionalIssue: false,
    reasons: [
      count + 'x ' + largestType + ' required based on ' + (limitingFactor === 'VOLUME' ? 'volume' : 'payload weight') + ' capacity.',
      'Physical loading arrangement was not simulated beyond per-package dimension and rotation checks.',
    ],
  };
}
`;

const filePath = 'lib/engine/container-mix.ts';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
