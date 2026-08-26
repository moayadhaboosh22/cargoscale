import fs from 'fs';

const filePath = 'lib/types/shipment.ts';
const addition = `
// Phase 7 -- container mix & recommendation types

export type LimitingFactor = 'VOLUME' | 'WEIGHT' | 'NONE';

export interface ContainerMixLine {
  type: ContainerType;
  count: number;
}

export interface ContainerMixResult {
  lines: ContainerMixLine[];
  totalContainers: number;
  totalVolumeCapacityM3: number;
  totalPayloadCapacityKg: number;
  volumeUtilizationPercent: number;
  payloadUtilizationPercent: number;
  limitingFactor: LimitingFactor;
  feasible: boolean;
  dimensionalIssue: boolean;
  reasons: string[];
}

export type FreightModeSimple = 'Air' | 'LCL' | 'FCL';

export interface RecommendationInput {
  freightMode: FreightModeSimple;
  cargoSummary: CargoSummary;
  chargeableWeightKg: number;
  containerMix: ContainerMixResult | null;
  lclCost: CostBreakdown | null;
  fclCost: CostBreakdown | null;
}

export interface RecommendationResult {
  headline: string;
  reasons: string[];
  warnings: string[];
  confidence: RecommendationStrength;
  costComparison: FreightComparisonResult | null;
}

export interface PackageValidationIssue {
  packageId: string;
  field: string;
  message: string;
}
`;

const current = fs.readFileSync(filePath, 'utf8');

if (current.includes('ContainerMixResult')) {
  console.log('FAIL:already_contains_ContainerMixResult');
  process.exit(1);
}

fs.writeFileSync(filePath, current + addition, 'utf8');
console.log('OK:appended:' + filePath);
