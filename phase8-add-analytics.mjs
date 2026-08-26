import fs from 'fs';

const filePath = 'app/layout.tsx';
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

const oldImport = `import "./globals.css";`;
const newImport = `import "./globals.css";
import { Analytics } from "@vercel/analytics/next";`;

replaceOnce(oldImport, newImport, 'add_analytics_import');

const oldBody = `      <body className="min-h-full flex flex-col">{children}</body>`;
const newBody = `      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>`;

replaceOnce(oldBody, newBody, 'add_analytics_component');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
