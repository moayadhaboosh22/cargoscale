import fs from 'fs';
const content = `import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Unit Converter — Length, Weight & Volume | CargoScale',
  description: 'Convert length, weight, and volume units commonly used in shipping and freight — cm/m/in/ft, kg/lb, CBM/CFT. Free, no signup required.',
};

export default function UnitConverterLayout({ children }: { children: ReactNode }) {
  return children;
}
`;
const filePath = 'app/tools/unit-converter/layout.tsx';
if (fs.existsSync(filePath)) { console.log('FAIL:file_already_exists:' + filePath); process.exit(1); }
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
