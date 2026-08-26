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

const oldSection = `        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' }}>
          <div onClick={() => setShowRatesSection(!showRatesSection)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showRatesSection ? '12px' : 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{freightMode === 'Sea LCL' ? 'LCL Rate and Charges Configuration' : 'Container Rates and Charges Configuration'}</span>`;

const newSection = `        {freightMode !== 'Air Freight' && (
        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '15px 20px', marginBottom: '15px' }}>
          <div onClick={() => setShowRatesSection(!showRatesSection)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: showRatesSection ? '12px' : 0 }}>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b' }}>{freightMode === 'Sea LCL' ? 'LCL Rate and Charges Configuration' : 'Container Rates and Charges Configuration'}</span>`;

replaceOnce(oldSection, newSection, 'add_air_freight_wrapper_open');

const oldClose = `            </div>
          ))}
        </div>

        {freightMode === 'Sea FCL' && containerSelection === 'AUTO' && containerMix.feasible && (`;

const newClose = `            </div>
          ))}
        </div>
        )}

        {freightMode === 'Sea FCL' && containerSelection === 'AUTO' && containerMix.feasible && (`;

replaceOnce(oldClose, newClose, 'add_air_freight_wrapper_close');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
