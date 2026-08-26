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

// 1. Remove the Air Freight weight block from the LEFT card (Cargo Facts)
const oldLeft = `            {freightMode === 'Sea LCL' && (<p style={{ fontSize: '13px', margin: '5px 0' }}>Chargeable RT: <b>{revenueTonResult.chargeableRT.toFixed(2)} RT</b></p>)}
            {freightMode === 'Air Freight' && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                <p style={{ fontSize: '13px', margin: '5px 0' }}>Volumetric Weight: <b>{hasCargo ? volumetricWeightKg.toFixed(2) + ' KG' : '\\u2014'}</b></p>
                <p style={{ fontSize: '15px', margin: '6px 0 2px 0', fontWeight: 'bold', color: '#2563eb' }}>
                  Chargeable Weight: {hasCargo ? chargeableWeightKg.toFixed(2) + ' KG' : '\\u2014'}
                </p>
                <p style={{ fontSize: '11px', margin: '0', color: '#64748b' }}>= the greater of Gross Weight and Volumetric Weight (used for Air Freight pricing)</p>
              </div>
            )}`;

const newLeft = `            {freightMode === 'Sea LCL' && (<p style={{ fontSize: '13px', margin: '5px 0' }}>Chargeable RT: <b>{revenueTonResult.chargeableRT.toFixed(2)} RT</b></p>)}`;

replaceOnce(oldLeft, newLeft, 'remove_weight_block_from_left_card');

// 2. Change the RIGHT card's header to be conditional
const oldHeader = `            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#d97706' }}>Cost Breakdown</h4>`;
const newHeader = `            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#d97706' }}>{freightMode === 'Air Freight' ? 'Chargeable Weight Breakdown' : 'Cost Breakdown'}</h4>`;

replaceOnce(oldHeader, newHeader, 'make_right_card_header_conditional');

// 3. Replace the RIGHT card's body: Air Freight shows weight breakdown, others show the existing cost breakdown unchanged
const oldBody = `            <p style={{ fontSize: '13px', margin: '5px 0' }}>Base Freight ({freightMode === 'Air Freight' ? 'Air' : freightMode === 'Sea LCL' ? 'LCL' : mixText}): <b>{effectiveCost ? effectiveCost.baseFreight.toFixed(2) + ' ' + currency : '\\u2014'}</b></p>
            {freightMode !== 'Air Freight' && (
              <p style={{ fontSize: '13px', margin: '5px 0' }}>Origin and Dest. Charges: <b>{(originCharges + destCharges).toFixed(2)} {currency}</b></p>
            )}
            <p style={{ fontSize: '14px', margin: '8px 0 0 0', fontWeight: 'bold' }}>Total Estimated: <span style={{ color: '#2563eb' }}>{effectiveCost ? totalEstimatedCost.toFixed(2) + ' ' + currency : '\\u2014'}</span></p>
            {!effectiveCost && hasCargo && freightMode !== 'Air Freight' && (
              <p style={{ fontSize: '11px', margin: '6px 0 0 0', color: '#b45309' }}>Cost comparison unavailable \\u2014 enter the required rate.</p>
            )}`;

const newBody = `            {freightMode === 'Air Freight' ? (
              <>
                <p style={{ fontSize: '13px', margin: '5px 0' }}>Volumetric Weight: <b>{hasCargo ? volumetricWeightKg.toFixed(2) + ' KG' : '\\u2014'}</b></p>
                <p style={{ fontSize: '15px', margin: '6px 0 2px 0', fontWeight: 'bold', color: '#2563eb' }}>
                  Chargeable Weight: {hasCargo ? chargeableWeightKg.toFixed(2) + ' KG' : '\\u2014'}
                </p>
                <p style={{ fontSize: '11px', margin: '0', color: '#64748b' }}>= the greater of Gross Weight and Volumetric Weight (used for Air Freight pricing)</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: '13px', margin: '5px 0' }}>Base Freight ({freightMode === 'Sea LCL' ? 'LCL' : mixText}): <b>{effectiveCost ? effectiveCost.baseFreight.toFixed(2) + ' ' + currency : '\\u2014'}</b></p>
                <p style={{ fontSize: '13px', margin: '5px 0' }}>Origin and Dest. Charges: <b>{(originCharges + destCharges).toFixed(2)} {currency}</b></p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', fontWeight: 'bold' }}>Total Estimated: <span style={{ color: '#2563eb' }}>{effectiveCost ? totalEstimatedCost.toFixed(2) + ' ' + currency : '\\u2014'}</span></p>
                {!effectiveCost && hasCargo && (
                  <p style={{ fontSize: '11px', margin: '6px 0 0 0', color: '#b45309' }}>Cost comparison unavailable \\u2014 enter the required rate.</p>
                )}
              </>
            )}`;

replaceOnce(oldBody, newBody, 'replace_right_card_body');

fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:file_written');
