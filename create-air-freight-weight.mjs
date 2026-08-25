import fs from 'fs';

const content = `import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Air Freight Chargeable Weight Explained | CargoScale',
  description: 'How chargeable weight is calculated for air freight, why it matters, and a worked example comparing actual weight to volumetric weight.',
};

export default function AirFreightChargeableWeightPage() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center',justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>CS</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CargoScale</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Guides</div>
        </div>
      </div>

      <article style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Air Freight Chargeable Weight Explained</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0' }}>Logistics Guide</p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Air freight is not always priced by actual weight alone. Carriers also consider how much space a shipment takes up relative to its weight, using a figure called <strong>chargeable weight</strong>. Understanding it helps you predict costs accurately before booking.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>The Formula</h2>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', margin: '0 0 16px 0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
          Volumetric Weight = (L &times; W &times; H in cm) &divide; DIM Factor
        </div>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          The DIM Factor is set by the carrier and commonly defaults to 6000 for air freight, though it varies by airline and route. Once you have the volumetric weight, <strong>chargeable weight is whichever is greater: the actual gross weight or the volumetric weight.</strong>
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Worked Example</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px 0' }}>
          Suppose you have a shipment measuring 60 cm &times; 40 cm &times; 50 cm, with a gross weight of 15 kg, and a DIM Factor of 6000.
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', margin: '0 0 16px 0', paddingLeft: '20px' }}>
          <li>Volume: 60 &times; 40 &times; 50 = 120,000 cm&sup3;</li>
          <li>Volumetric weight: 120,000 &divide; 6000 = <strong>20 kg</strong></li>
          <li>Gross weight: 15 kg</li>
          <li>Chargeable weight: the greater of the two = <strong>20 kg</strong></li>
        </ul>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Even though the shipment only weighs 15 kg, it is billed as 20 kg because its volume takes up more space than its weight alone would suggest.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Why This Matters</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Light but bulky shipments &mdash; foam, textiles, packaging, electronics with lots of empty space &mdash; are especially affected by chargeable weight. Knowing this in advance helps you pack more efficiently and avoid surprises when the invoice arrives.
        </p>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Link
            href="/tools/chargeable-weight"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}
          >
            Try the Chargeable Weight Calculator
          </Link>
        </div>
      </article>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/guides" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Guides</Link>
      </div>

    </main>
  );
}
`;

const dir = 'app/guides/air-freight-chargeable-weight';
const filePath = dir + '/page.tsx';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
