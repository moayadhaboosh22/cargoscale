import fs from 'fs';
const filePath = 'app/guides/lcl-vs-fcl/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(`import Link from 'next/link';`, `import Link from 'next/link';
import FeedbackWidget from '../../../components/FeedbackWidget';`, 'add_import');
replaceOnce(`      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/guides" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Guides</Link>
      </div>`, `      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/guides" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Guides</Link>
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </div>`, 'add_widget_to_footer');
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
