import fs from 'fs';

const filePath = 'app/tools/unit-converter/page.tsx';
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

const oldImport = `'use client';
import React, { useState } from 'react';`;

const newImport = `'use client';
import React, { useState } from 'react';
import FeedbackWidget from '../../../components/FeedbackWidget';`;

replaceOnce(oldImport, newImport, 'add_import');

const oldFooter = `      <div style={{ textAlign: 'center' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
      </div>`;

const newFooter = `      <div style={{ textAlign: 'center' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </div>`;

replaceOnce(oldFooter, newFooter, 'add_widget_to_footer');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
