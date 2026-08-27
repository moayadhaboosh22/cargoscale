import fs from 'fs';
const filePath = 'app/containers/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(`          Back to Calculator`, `          Back to CargoScale`, 'fix_back_link_text');
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
