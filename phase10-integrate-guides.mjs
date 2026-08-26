import fs from 'fs';

const filePath = 'app/guides/page.tsx';
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

const oldImport = `import Link from 'next/link';`;
const newImport = `import Link from 'next/link';
import FeedbackWidget from '../../components/FeedbackWidget';`;

replaceOnce(oldImport, newImport, 'add_import');

const oldFooter = `      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
      </div>`;

const newFooter = `      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </div>`;

replaceOnce(oldFooter, newFooter, 'add_widget_to_footer');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
