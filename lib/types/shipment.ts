export type DimensionUnit = 'cm' | 'mm' | 'in' | 'm' | 'ft';
export type WeightUnit = 'kg' | 'lb';
export type FreightMode = 'Air' | 'LCL' | 'FCL';
export type ContainerType = '20GP' | '40GP' | '40HC';

export interface PackageInput {
  id: string;
  unitType: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  dimUnit: DimensionUnit;
  weightPerUnit: number;
  weightUnit: WeightUnit;
  stackable: boolean;
  allowRotation: boolean;
}

export interface NormalizedPackage extends PackageInput {
  lengthM: number;
  widthM: number;
  heightM: number;
  volumePerUnitM3: number;
  totalVolumeM3: number;
  grossWeightPerUnitKg: number;
  totalGrossWeightKg: number;
}

export interface CargoSummary {
  totalPackages: number;
  totalCBM: number;
  totalCFT: number;
  totalGrossWeightKg: number;
  totalGrossWeightLb: number;
  cargoDensityKgM3: number;
  maxUnitDimensionsM: {
    lengthM: number;
    widthM: number;
    heightM: number;
  };
}

export interface ChargeableWeightResult {
  grossWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  dimFactor: number;
}

export interface RevenueTonResult {
  volumeCBM: number;
  weightRT: number;
  chargeableRT: number;
}

export interface ContainerSpec {
  type: ContainerType;
  name: string;
  usableVolumeM3: number;
  payloadKg: number;
  internalLengthM: number;
  internalWidthM: number;
  internalHeightM: number;
  externalLengthM: number;
  externalWidthM: number;
  externalHeightM: number;
  doorWidthM: number;
  doorHeightM: number;
  tareWeightKg: number;
  maxGrossWeightKg: number;
}

export type CheckStatus = 'PASS' | 'FAIL';

export interface DimensionCheckResult {
  packageId: string;
  status: CheckStatus;
  fitsAsIs: boolean;
  fitsWithRotation: boolean;
}

export interface ContainerFitAssessment {
  containerType: ContainerType;
  volumeUtilizationPercent: number;
  payloadUtilizationPercent: number;
  volumeCheck: CheckStatus;
  payloadCheck: CheckStatus;
  dimensionCheck: CheckStatus;
  dimensionResults: DimensionCheckResult[];
  loadingSimulated: false;
}

export interface ContainerRecommendation {
  recommendedContainer: ContainerType | null;
  strength: RecommendationStrength;
  assessment: ContainerFitAssessment | null;
  reasons: string[];
}

export type RecommendationStrength = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CostBreakdown {
  baseFreight: number;
  originCharges: number;
  destinationCharges: number;
  additionalCharges: number;
  totalEstimatedCost: number;
  currency: string;
}

export interface AirRateInput {
  ratePerKg: number;
  minimumCharge?: number;
  originCharges: number;
  destinationCharges: number;
  additionalCharges: number;
  currency: string;
}

export interface LclRateInput {
  ratePerRT: number;
  minimumRT?: number;
  originCharges: number;
  destinationCharges: number;
  additionalCharges: number;
  currency: string;
}

export interface FclRateInput {
  containerFlatRate: number;
  numberOfContainers: number;
  originCharges: number;
  destinationCharges: number;
  additionalCharges: number;
  currency: string;
}

export interface FreightComparisonResult {
  lclCost: CostBreakdown | null;
  fclCost: CostBreakdown | null;
  differenceAmount: number | null;
  recommendedOption: 'LCL' | 'FCL' | null;
  strength: RecommendationStrength;
  reasons: string[];
}
