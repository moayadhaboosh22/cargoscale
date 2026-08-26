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

const oldBtn = `            <button onClick={() => setShowComparison(!showComparison)} style={{ background: showComparison ? '#7c3aed' : '#f3e8ff', color: showComparison ? '#fff' : '#7c3aed', border: '1px solid #c4b5fd', padding: '7px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>{showComparison ? 'Hide' : 'Compare'} LCL vs FCL</button>`;

const newBtn = `            {freightMode !== 'Air Freight' && (
            <button onClick={() => setShowComparison(!showComparison)} style={{ background: showComparison ? '#7c3aed' : '#f3e8ff', color: showComparison ? '#fff' : '#7c3aed', border: '1px solid #c4b5fd', padding: '7px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>{showComparison ? 'Hide' : 'Compare'} LCL vs FCL</button>
            )}`;

replaceOnce(oldBtn, newBtn, 'hide_compare_button_under_air');

const oldPanel = `        {showComparison && (`;
const newPanel = `        {showComparison && freightMode !== 'Air Freight' && (`;

replaceOnce(oldPanel, newPanel, 'guard_comparison_panel_under_air');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
