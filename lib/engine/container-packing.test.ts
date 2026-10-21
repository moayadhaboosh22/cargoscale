import { describe, it, expect } from 'vitest';
import { packContainer, expandPackagesToBoxes, packShipment, type PackingBox } from './container-packing';
import type { NormalizedPackage } from '../types/shipment';

const CONTAINER_20GP = { length: 590, width: 235, height: 238 };

describe('packContainer', () => {
  it('packs two boxes that fit side by side on the floor', () => {
    const boxes: PackingBox[] = [
      { id: 'a', length: 100, width: 100, height: 100, weight: 50, stackable: true },
      { id: 'b', length: 100, width: 100, height: 100, weight: 50, stackable: true },
    ];
    const result = packContainer(boxes, CONTAINER_20GP);
    expect(result.feasible).toBe(true);
    expect(result.packedBoxes.length).toBe(2);
    expect(result.unpackedBoxes.length).toBe(0);
  });

  it('rejects a box longer than the container itself', () => {
    const boxes: PackingBox[] = [
      { id: 'huge', length: 700, width: 100, height: 100, weight: 50, stackable: true },
    ];
    const result = packContainer(boxes, CONTAINER_20GP);
    expect(result.feasible).toBe(false);
    expect(result.unpackedBoxes.length).toBe(1);
    expect(result.unpackedBoxes[0].id).toBe('huge');
    expect(result.unpackedBoxes[0].reason).toMatch(/does not fit/i);
  });

  it('allows a lighter box to stack on top of a heavier one with a matching footprint', () => {
    const boxes: PackingBox[] = [
      { id: 'heavy', length: 100, width: 100, height: 50, weight: 100, stackable: true },
      { id: 'light', length: 100, width: 100, height: 50, weight: 20, stackable: true },
    ];
    const result = packContainer(boxes, CONTAINER_20GP);
    expect(result.feasible).toBe(true);
    expect(result.layersUsed).toBe(2);
    const heavy = result.packedBoxes.find((b) => b.id === 'heavy');
    const light = result.packedBoxes.find((b) => b.id === 'light');
    expect(heavy?.y).toBe(0);
    expect(light?.y).toBe(50);
  });

  it('always places the heavier box as the base regardless of input order', () => {
    const boxes: PackingBox[] = [
      { id: 'light2', length: 100, width: 100, height: 50, weight: 20, stackable: true },
      { id: 'heavy2', length: 100, width: 100, height: 50, weight: 100, stackable: true },
    ];
    const result = packContainer(boxes, CONTAINER_20GP);
    expect(result.feasible).toBe(true);
    const heavy2 = result.packedBoxes.find((b) => b.id === 'heavy2');
    const light2 = result.packedBoxes.find((b) => b.id === 'light2');
    expect(heavy2?.y).toBe(0);
    expect(light2?.y).toBe(50);
  });

  it('places non-stackable items side by side on the floor only', () => {
    const boxes: PackingBox[] = [
      { id: 'ns1', length: 120, width: 80, height: 200, weight: 300, stackable: false },
      { id: 'ns2', length: 120, width: 80, height: 200, weight: 300, stackable: false },
    ];
    const result = packContainer(boxes, CONTAINER_20GP);
    expect(result.feasible).toBe(true);
    expect(result.packedBoxes.length).toBe(2);
    expect(result.packedBoxes.every((b) => b.y === 0)).toBe(true);
  });

  it('rejects stacking that would exceed the container height', () => {
    const boxes: PackingBox[] = [
      { id: 'tall1', length: 100, width: 100, height: 150, weight: 50, stackable: true },
      { id: 'tall2', length: 100, width: 100, height: 150, weight: 40, stackable: true },
    ];
    const result = packContainer(boxes, CONTAINER_20GP);
    expect(result.feasible).toBe(false);
    const rejected = result.unpackedBoxes.find((b) => b.id === 'tall2');
    expect(rejected).toBeDefined();
    expect(rejected?.reason).toMatch(/exceeds container height/i);
  });

  it('handles empty input without error', () => {
    const result = packContainer([], CONTAINER_20GP);
    expect(result.feasible).toBe(true);
    expect(result.packedBoxes.length).toBe(0);
    expect(result.unpackedBoxes.length).toBe(0);
    expect(result.floorAreaUsedPercent).toBe(0);
  });
});

function makePackage(overrides: Partial<NormalizedPackage>): NormalizedPackage {
  return {
    id: 'pkg',
    unitType: 'box',
    quantity: 1,
    length: 100,
    width: 100,
    height: 100,
    dimUnit: 'cm',
    weightPerUnit: 50,
    weightUnit: 'kg',
    stackable: true,
    allowRotation: false,
    lengthM: 1,
    widthM: 1,
    heightM: 1,
    volumePerUnitM3: 1,
    totalVolumeM3: 1,
    grossWeightPerUnitKg: 50,
    totalGrossWeightKg: 50,
    ...overrides,
  };
}

describe('expandPackagesToBoxes', () => {
  it('expands a package quantity into individual boxes with unique ids', () => {
    const packages = [makePackage({ id: 'p1', quantity: 3, lengthM: 0.5, widthM: 0.5, heightM: 0.5, grossWeightPerUnitKg: 10 })];
    const boxes = expandPackagesToBoxes(packages);
    expect(boxes.length).toBe(3);
    expect(boxes.map((b) => b.id)).toEqual(['p1-1', 'p1-2', 'p1-3']);
    expect(boxes.every((b) => b.weight === 10)).toBe(true);
  });

  it('produces no boxes for a zero-quantity package', () => {
    const packages = [makePackage({ id: 'z', quantity: 0 })];
    expect(expandPackagesToBoxes(packages).length).toBe(0);
  });
});

describe('packShipment', () => {
  it('packs a realistic shipment into a 20GP-sized container', () => {
    const container20GP = { internalLengthM: 5.9, internalWidthM: 2.35, internalHeightM: 2.38 };
    const packages = [
      makePackage({ id: 'p1', quantity: 2, lengthM: 1.0, widthM: 1.0, heightM: 1.0, grossWeightPerUnitKg: 50, stackable: true }),
      makePackage({ id: 'p2', quantity: 1, lengthM: 1.2, widthM: 0.8, heightM: 2.0, grossWeightPerUnitKg: 300, stackable: false }),
    ];
    const result = packShipment(packages, container20GP);
    expect(result.feasible).toBe(true);
    expect(result.packedBoxes.length).toBe(3);
  });
});
