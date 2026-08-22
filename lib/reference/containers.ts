import { ContainerSpec, ContainerType } from '../types/shipment';

export const CONTAINER_SPECS: Record<ContainerType, ContainerSpec> = {
  '20GP': {
    type: '20GP',
    name: "20' General Purpose",
    usableVolumeM3: 28,
    payloadKg: 21800,
    internalLengthM: 5.9,
    internalWidthM: 2.35,
    internalHeightM: 2.39,
    externalLengthM: 6.06,
    externalWidthM: 2.44,
    externalHeightM: 2.59,
    doorWidthM: 2.34,
    doorHeightM: 2.28,
    tareWeightKg: 2300,
    maxGrossWeightKg: 24000,
  },
  '40GP': {
    type: '40GP',
    name: "40' General Purpose",
    usableVolumeM3: 58,
    payloadKg: 26500,
    internalLengthM: 12.03,
    internalWidthM: 2.35,
    internalHeightM: 2.39,
    externalLengthM: 12.19,
    externalWidthM: 2.44,
    externalHeightM: 2.59,
    doorWidthM: 2.34,
    doorHeightM: 2.28,
    tareWeightKg: 3750,
    maxGrossWeightKg: 30480,
  },
  '40HC': {
    type: '40HC',
    name: "40' High Cube",
    usableVolumeM3: 68,
    payloadKg: 28500,
    internalLengthM: 12.03,
    internalWidthM: 2.35,
    internalHeightM: 2.69,
    externalLengthM: 12.19,
    externalWidthM: 2.44,
    externalHeightM: 2.90,
    doorWidthM: 2.34,
    doorHeightM: 2.58,
    tareWeightKg: 3900,
    maxGrossWeightKg: 32500,
  },
};

export function getContainerSpec(type: ContainerType): ContainerSpec {
  return CONTAINER_SPECS[type];
}

export function getAllContainerTypes(): ContainerType[] {
  return Object.keys(CONTAINER_SPECS) as ContainerType[];
}