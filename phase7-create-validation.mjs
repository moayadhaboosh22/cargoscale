import fs from 'fs';

const content = `import { PackageInput, PackageValidationIssue } from '../types/shipment';

export function validatePackages(packages: PackageInput[]): PackageValidationIssue[] {
  const issues: PackageValidationIssue[] = [];

  for (const p of packages) {
    const isFinite =
      Number.isFinite(p.quantity) &&
      Number.isFinite(p.length) &&
      Number.isFinite(p.width) &&
      Number.isFinite(p.height) &&
      Number.isFinite(p.weightPerUnit);

    if (!isFinite) {
      issues.push({ packageId: p.id, field: 'value', message: 'One or more fields contain an invalid number.' });
      continue;
    }

    if (p.quantity < 0) {
      issues.push({ packageId: p.id, field: 'quantity', message: 'Quantity cannot be negative.' });
    }
    if (p.length < 0 || p.width < 0 || p.height < 0) {
      issues.push({ packageId: p.id, field: 'dimensions', message: 'Dimensions cannot be negative.' });
    }
    if (p.weightPerUnit < 0) {
      issues.push({ packageId: p.id, field: 'weightPerUnit', message: 'Weight cannot be negative.' });
    }
    if (p.quantity > 0 && (p.length === 0 || p.width === 0 || p.height === 0)) {
      issues.push({ packageId: p.id, field: 'dimensions', message: 'One or more dimensions are zero; this package will not contribute volume to the shipment.' });
    }
  }

  return issues;
}

export function isNegativeRate(value: number | null): boolean {
  return value !== null && value < 0;
}
`;

const filePath = 'lib/engine/validation.ts';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
