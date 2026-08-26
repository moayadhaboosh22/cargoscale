import fs from 'fs';

const filePath = 'app/page.tsx';
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
import FeedbackWidget from '../components/FeedbackWidget';`;

replaceOnce(oldImport, newImport, 'add_import');

const oldFooter = `      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        <Link href="/guides" style={{ color: '#2563eb', textDecoration: 'none', marginRight: '12px' }}>Guides</Link>
        CargoScale — Logistics Decision Assistant
      </footer>`;

const newFooter = `      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        <Link href="/guides" style={{ color: '#2563eb', textDecoration: 'none', marginRight: '12px' }}>Guides</Link>
        CargoScale — Logistics Decision Assistant
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </footer>`;

replaceOnce(oldFooter, newFooter, 'add_widget_to_footer');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
