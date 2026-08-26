'use client';
import React, { useState } from 'react';
import FeedbackWidget from '../../../components/FeedbackWidget';
import { PackageInput as EnginePackageInput } from '../../../lib/types/shipment';
import { calculateCargoSummary } from '../../../lib/engine/cbm';

export default function CbmCalculatorPage() {
  const [length, setLength] = useState<number>(60);
  const [width, setWidth] = useState<number>(40);
  const [height, setHeight] = useState<number>(50);
  const [dimUnit, setDimUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm');
  const [quantity, setQuantity] = useState<number>(1);

  const enginePackage: EnginePackageInput = {
    id: '1',
    unitType: 'carton',
    quantity,
    length,
    width,
    height,
    dimUnit,
    weightPerUnit: 0,
    weightUnit: 'kg',
    stackable: true,
    allowRotation: false,
  };

  const cargoSummary = calculateCargoSummary([enginePackage]);

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>CS</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CargoScale</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>CBM Calculator</div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>CBM Calculator</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Length</label>
            <input type="number" value={length} onChange={e => setLength(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Width</label>
            <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Height</label>
            <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Unit</label>
            <select value={dimUnit} onChange={e => setDimUnit(e.target.value as 'cm' | 'm' | 'in' | 'ft')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Quantity</label>
          <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }} />
        </div>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '6px' }}>Total CBM</div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563eb' }}>{cargoSummary.totalCBM.toFixed(3)}</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Cubic Meters</div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </div>

    </main>
  );
}
