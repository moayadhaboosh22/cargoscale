import fs from 'fs';

const content = `import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Shipment Analyzer — Freight Estimation & Container Recommendation | CargoScale',
  description: 'Analyze your shipment: volume, chargeable weight, recommended container mix, and LCL vs FCL cost comparison — all in one free tool.',
};

export default function ShipmentAnalyzerLayout({ children }: { children: ReactNode }) {
  return children;
}
`;

const filePath = 'app/tools/shipment-analyzer/layout.tsx';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
