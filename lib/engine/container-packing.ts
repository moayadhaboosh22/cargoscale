import type { NormalizedPackage } from '../types/shipment';

export interface PackingBox {
  id: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  stackable: boolean;
}

export interface PackedBox {
  id: string;
  x: number;
  y: number;
  z: number;
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface PackingResult {
  packedBoxes: PackedBox[];
  unpackedBoxes: { id: string; reason: string }[];
  layersUsed: number;
  floorAreaUsedPercent: number;
  feasible: boolean;
}

interface ContainerDims {
  length: number;
  width: number;
  height: number;
}

export function packContainer(boxes: PackingBox[], container: ContainerDims): PackingResult {
  const packedBoxes: PackedBox[] = [];
  const unpackedBoxes: { id: string; reason: string }[] = [];

  const nonStackable = boxes.filter((b) => !b.stackable).sort((a, b) => b.height - a.height);
  const stackable = boxes.filter((b) => b.stackable).sort((a, b) => b.weight - a.weight);

  let cursorX = 0;
  let cursorZ = 0;
  let rowMaxWidth = 0;
  let usedFloorArea = 0;
  const floorArea = container.length * container.width;

  function placeOnFloor(box: PackingBox): PackedBox | null {
    if (box.length > container.length || box.width > container.width || box.height > container.height) {
      return null;
    }
    if (cursorX + box.length > container.length) {
      cursorX = 0;
      cursorZ += rowMaxWidth;
      rowMaxWidth = 0;
    }
    if (cursorZ + box.width > container.width) {
      return null;
    }
    const placed: PackedBox = {
      id: box.id,
      x: cursorX,
      y: 0,
      z: cursorZ,
      length: box.length,
      width: box.width,
      height: box.height,
      weight: box.weight,
    };
    cursorX += box.length;
    rowMaxWidth = Math.max(rowMaxWidth, box.width);
    usedFloorArea += box.length * box.width;
    return placed;
  }

  for (const box of nonStackable) {
    const placed = placeOnFloor(box);
    if (placed) {
      packedBoxes.push(placed);
    } else {
      unpackedBoxes.push({ id: box.id, reason: 'Does not fit on container floor (non-stackable item).' });
    }
  }

  const stacks: Record<string, PackingBox[]> = {};
  for (const box of stackable) {
    const key = box.length + 'x' + box.width;
    if (!stacks[key]) stacks[key] = [];
    stacks[key].push(box);
  }

  let layersUsed = 1;

  for (const key of Object.keys(stacks)) {
    const group = stacks[key];
    const base = placeOnFloor(group[0]);
    if (!base) {
      for (const box of group) {
        unpackedBoxes.push({ id: box.id, reason: 'Does not fit on container floor.' });
      }
      continue;
    }
    packedBoxes.push(base);
    let currentHeight = base.height;
    for (let i = 1; i < group.length; i++) {
      const box = group[i];
      if (currentHeight + box.height > container.height) {
        unpackedBoxes.push({ id: box.id, reason: 'Exceeds container height when stacked.' });
        continue;
      }
      const heavierBelow = packedBoxes.some(
        (p) => p.x === base.x && p.z === base.z && p.weight < box.weight
      );
      if (heavierBelow) {
        unpackedBoxes.push({ id: box.id, reason: 'Cannot stack a heavier item on top of a lighter one.' });
        continue;
      }
      packedBoxes.push({
        id: box.id,
        x: base.x,
        y: currentHeight,
        z: base.z,
        length: box.length,
        width: box.width,
        height: box.height,
        weight: box.weight,
      });
      currentHeight += box.height;
      layersUsed = Math.max(layersUsed, 2);
    }
  }

  const floorAreaUsedPercent = floorArea === 0 ? 0 : Math.min((usedFloorArea / floorArea) * 100, 100);

  return {
    packedBoxes,
    unpackedBoxes,
    layersUsed,
    floorAreaUsedPercent,
    feasible: unpackedBoxes.length === 0,
  };
}

export interface ShipmentContainerDims {
  internalLengthM: number;
  internalWidthM: number;
  internalHeightM: number;
}

export function expandPackagesToBoxes(packages: NormalizedPackage[]): PackingBox[] {
  const boxes: PackingBox[] = [];
  for (const pkg of packages) {
    const qty = Math.max(0, Math.floor(pkg.quantity));
    for (let i = 0; i < qty; i++) {
      boxes.push({
        id: `${pkg.id}-${i + 1}`,
        length: pkg.lengthM,
        width: pkg.widthM,
        height: pkg.heightM,
        weight: pkg.grossWeightPerUnitKg,
        stackable: pkg.stackable,
      });
    }
  }
  return boxes;
}

export function packShipment(
  packages: NormalizedPackage[],
  containerSpec: ShipmentContainerDims
): PackingResult {
  const boxes = expandPackagesToBoxes(packages);
  return packContainer(boxes, {
    length: containerSpec.internalLengthM,
    width: containerSpec.internalWidthM,
    height: containerSpec.internalHeightM,
  });
}
