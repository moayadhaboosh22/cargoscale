import fs from 'fs';
const filePath = 'app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(`import Link from 'next/link';
import FeedbackWidget from '../components/FeedbackWidget';`, `import type { Metadata } from 'next';
import Link from 'next/link';
import FeedbackWidget from '../components/FeedbackWidget';

export const metadata: Metadata = {
  title: 'CargoScale — Smart Logistics Tools & Decision Assistant',
  description: 'Free logistics tools for shipment volume (CBM), chargeable weight, container recommendations, and LCL vs FCL analysis — plus a full Shipment Analyzer for complete freight decisions.',
};`, 'add_metadata');
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
