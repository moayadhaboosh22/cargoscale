'use client';
import React, { useState } from 'react';
import { convertToMeters, convertToKg } from '../../../lib/engine/units';
import { calculateCFT } from '../../../lib/engine/cbm';

type ConversionType = 'length' | 'weight' | 'volume';

export default function UnitConverterPage() {
  const [conversionType, setConversionType] = useState<ConversionType>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [lengthFrom, setLengthFrom] = useState<'cm' | 'm' | 'in' | 'ft'>('cm');
  const [lengthTo, setLengthTo] = useState<'cm' | 'm' | 'in' | 'ft'>('in');
  const [weightFrom, setWeightFrom] = useState<'kg' | 'lb'>('kg');
  const [weightTo, setWeightTo] = useState<'kg' | 'lb'>('lb');
  const [volumeFrom, setVolumeFrom] = useState<'cbm' | 'cft'>('cbm');
  const [volumeTo, setVolumeTo] = useState<'cbm' | 'cft'>('cft');

  function metersToUnit(meters: number, unit: 'cm' | 'm' | 'in' | 'ft'): number {
    if (unit === 'm') return meters;
    if (unit === 'cm') return meters * 100;
    if (unit === 'in') return meters / 0.0254;
    return meters / 0.3048;
  }

  function calculateLengthResult(): number {
    const meters = convertToMeters(inputValue, lengthFrom);
    return metersToUnit(meters, lengthTo);
  }

  function calculateWeightResult(): number {
    const kg = convertToKg(inputValue, weightFrom);
    if (weightTo === 'kg') return kg;
    return kg / 0.45359237;
  }

  function calculateVolumeResult(): number {
    if (volumeFrom === volumeTo) return inputValue;
    if (volumeFrom === 'cbm' && volumeTo === 'cft') return calculateCFT(inputValue);
    return inputValue / 35.3146667;
  }

  let result = 0;
  if (conversionType === 'length') result = calculateLengthResult();
  else if (conversionType === 'weight') result = calculateWeightResult();
  else result = calculateVolumeResult();

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>CS</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CargoScale</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Unit Converter</div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '20px', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>Unit Converter</h2>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Conversion Type</label>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {(['length', 'weight', 'volume'] as ConversionType[]).map(type => (
              <button
                key={type}
                onClick={() => setConversionType(type)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  background: conversionType === type ? '#2563eb' : '#f8fafc',
                  color: conversionType === type ? '#fff' : '#1e293b',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: conversionType === type ? 'bold' : 'normal',
                  textTransform: 'capitalize'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>Value</label>
          <input type="number" value={inputValue} onChange={e => setInputValue(Number(e.target.value))} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>From</label>
            {conversionType === 'length' && (
              <select value={lengthFrom} onChange={e => setLengthFrom(e.target.value as 'cm' | 'm' | 'in' | 'ft')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">inch</option>
                <option value="ft">ft</option>
              </select>
            )}
            {conversionType === 'weight' && (
              <select value={weightFrom} onChange={e => setWeightFrom(e.target.value as 'kg' | 'lb')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            )}
            {conversionType === 'volume' && (
              <select value={volumeFrom} onChange={e => setVolumeFrom(e.target.value as 'cbm' | 'cft')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
                <option value="cbm">CBM</option>
                <option value="cft">CFT</option>
              </select>
            )}
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '4px' }}>To</label>
            {conversionType === 'length' && (
              <select value={lengthTo} onChange={e => setLengthTo(e.target.value as 'cm' | 'm' | 'in' | 'ft')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
                <option value="cm">cm</option>
                <option value="m">m</option>
                <option value="in">inch</option>
                <option value="ft">ft</option>
              </select>
            )}
            {conversionType === 'weight' && (
              <select value={weightTo} onChange={e => setWeightTo(e.target.value as 'kg' | 'lb')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            )}
            {conversionType === 'volume' && (
              <select value={volumeTo} onChange={e => setVolumeTo(e.target.value as 'cbm' | 'cft')} style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', background: '#fff' }}>
                <option value="cbm">CBM</option>
                <option value="cft">CFT</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '6px' }}>Result</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{result.toFixed(4)}</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
      </div>

    </main>
  );
}
