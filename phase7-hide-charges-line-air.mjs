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

const oldLine = `            <p style={{ fontSize: '13px', margin: '5px 0' }}>Origin and Dest. Charges: <b>{(originCharges + destCharges).toFixed(2)} {currency}</b></p>`;

const newLine = `            {freightMode !== 'Air Freight' && (
              <p style={{ fontSize: '13px', margin: '5px 0' }}>Origin and Dest. Charges: <b>{(originCharges + destCharges).toFixed(2)} {currency}</b></p>
            )}`;

replaceOnce(oldLine, newLine, 'hide_charges_line_under_air');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
