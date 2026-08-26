import fs from 'fs';

const filePath = 'app/tools/shipment-analyzer/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) {
    console.log(`FAIL:${label}:found=${count}`);
    process.exit(1);
  }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}

const oldLabel = `Base Freight ({freightMode === 'Sea LCL' ? 'LCL' : mixText}):`;
const newLabel = `Base Freight ({freightMode === 'Air Freight' ? 'Air' : freightMode === 'Sea LCL' ? 'LCL' : mixText}):`;

replaceOnce(oldLabel, newLabel, 'fix_base_freight_label');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
