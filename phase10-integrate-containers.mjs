import fs from 'fs';
const filePath = 'app/containers/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');
function replaceOnce(oldStr, newStr, label) {
  const count = content.split(oldStr).length - 1;
  if (count !== 1) { console.log(`FAIL:${label}:found=${count}`); process.exit(1); }
  content = content.replace(oldStr, newStr);
  console.log(`OK:${label}`);
}
replaceOnce(`import React from 'react';`, `import React from 'react';
import FeedbackWidget from '../../components/FeedbackWidget';`, 'add_import');
replaceOnce(`      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '14px 18px', fontSize: '12px', color: '#92400e' }}>
        These are standard reference dimensions and may vary slightly by manufacturer, container age, and shipping line. Always confirm exact specifications with your carrier for critical loading decisions.
      </div>
    </main>`, `      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '14px 18px', fontSize: '12px', color: '#92400e' }}>
        These are standard reference dimensions and may vary slightly by manufacturer, container age, and shipping line. Always confirm exact specifications with your carrier for critical loading decisions.
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <FeedbackWidget />
      </div>
    </main>`, 'add_widget_footer');
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
