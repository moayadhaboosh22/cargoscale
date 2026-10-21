import { describe, it, expect } from 'vitest';
import { packContainer, type PackingBox } from './container-packing';

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
