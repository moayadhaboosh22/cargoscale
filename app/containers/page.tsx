'use client';
import React from 'react';
import FeedbackWidget from '../../components/FeedbackWidget';
import { CONTAINER_SPECS, getAllContainerTypes } from '../../lib/reference/containers';

export default function ContainerSpecsPage() {
  const types = getAllContainerTypes();

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1100px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#ffffff', padding: '15px 20px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1e293b' }}>Container Specifications</h2>
          <p style={{ margin: '0', fontSize: '12px', color: '#64748b' }}>
            Reference dimensions and capacities for standard shipping containers.
          </p>
        </div>
        <a href="/" style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}>
          Back to CargoScale
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        {types.map(type => {
          const spec = CONTAINER_SPECS[type];
          return (
            <div key={type} style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ background: '#2563eb', color: '#fff', padding: '12px 18px' }}>
                <h3 style={{ margin: 0, fontSize: '15px' }}>{spec.name}</h3>
                <span style={{ fontSize: '11px', opacity: 0.85 }}>Type: {spec.type}</span>
              </div>

              <div style={{ padding: '15px 18px' }}>
                <h4 style={{ fontSize: '12px', color: '#16a34a', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Internal Dimensions
                </h4>
                <table style={{ width: '100%', fontSize: '13px', marginBottom: '14px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Length</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.internalLengthM.toFixed(2)} m</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Width</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.internalWidthM.toFixed(2)} m</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Height</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.internalHeightM.toFixed(2)} m</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Usable Volume</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right', color: '#16a34a' }}>{spec.usableVolumeM3.toFixed(1)} CBM</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{ fontSize: '12px', color: '#2563eb', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  External Dimensions
                </h4>
                <table style={{ width: '100%', fontSize: '13px', marginBottom: '14px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Length</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.externalLengthM.toFixed(2)} m</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Width</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.externalWidthM.toFixed(2)} m</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Height</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.externalHeightM.toFixed(2)} m</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{ fontSize: '12px', color: '#d97706', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Door Opening
                </h4>
                <table style={{ width: '100%', fontSize: '13px', marginBottom: '14px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Width</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.doorWidthM.toFixed(2)} m</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Height</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.doorHeightM.toFixed(2)} m</td>
                    </tr>
                  </tbody>
                </table>

                <h4 style={{ fontSize: '12px', color: '#dc2626', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Weight
                </h4>
                <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Tare (Empty) Weight</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.tareWeightKg.toLocaleString()} kg</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Max Payload</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right', color: '#16a34a' }}>{spec.payloadKg.toLocaleString()} kg</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '3px 0', color: '#64748b' }}>Max Gross Weight</td>
                      <td style={{ padding: '3px 0', fontWeight: 'bold', textAlign: 'right' }}>{spec.maxGrossWeightKg.toLocaleString()} kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '14px 18px', fontSize: '12px', color: '#92400e' }}>
        These are standard reference dimensions and may vary slightly by manufacturer, container age, and shipping line. Always confirm exact specifications with your carrier for critical loading decisions.
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <FeedbackWidget />
      </div>
    </main>
  );
}