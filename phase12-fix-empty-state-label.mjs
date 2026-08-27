import fs from 'fs';
const filePath = 'app/tools/shipment-analyzer/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(
  `? (containerMix.feasible ? containerMix.lines.map(l => l.count + 'x ' + l.type).join(' + ') : 'No suitable container')`,
  `? (containerMix.feasible ? containerMix.lines.map(l => l.count + 'x ' + l.type).join(' + ') : (hasCargo ? 'No suitable container' : 'Enter shipment details'))`,
  'fix_mixtext_empty_state'
);
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
