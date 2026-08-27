import fs from 'fs';
const content = `import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'CBM Calculator — Calculate Shipment Volume | CargoScale',
  description: 'Quickly calculate the total volume (CBM) of your shipment from package dimensions and quantity. Free, no signup required.',
};

export default function CbmCalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
`;
const filePath = 'app/tools/cbm-calculator/layout.tsx';
if (fs.existsSync(filePath)) { console.log('FAIL:file_already_exists:' + filePath); process.exit(1); }
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
