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

const oldComment = `// KNOWN ISSUE (Phase 4, not resolved): the main white card on this page renders
// narrower than on cbm-calculator/chargeable-weight pages despite identical
// maxWidth (600px) and width:100% on the card itself. Root cause not identified
// after diff comparison + browser inspection (computed width showed 390px in
// one test, unclear if device-toolbar related). Not a functional issue, no
// horizontal scroll, all calculations correct. Revisit later.
'use client';`;

const newComment = `'use client';`;

replaceOnce(oldComment, newComment, 'remove_known_issue_comment');

const oldCardStyle = `<div style={{ width: '100%', boxSizing: 'border-box', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '15px' }}>`;

const newCardStyle = `<div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '15px' }}>`;

replaceOnce(oldCardStyle, newCardStyle, 'simplify_card_style');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
