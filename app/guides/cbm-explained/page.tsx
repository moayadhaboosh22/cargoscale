import type { Metadata } from 'next';
import Link from 'next/link';
import FeedbackWidget from '../../../components/FeedbackWidget';

export const metadata: Metadata = {
  title: 'What is CBM and How to Calculate It | CargoScale',
  description: 'A simple explanation of CBM (Cubic Meters) in shipping, why it matters for freight pricing, and how to calculate it with a worked example.',
};

export default function CbmExplainedPage() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>CS</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CargoScale</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Guides</div>
        </div>
      </div>

      <article style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>What is CBM and How to Calculate It</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0' }}>Logistics Guide</p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          CBM stands for <strong>Cubic Meters</strong>. It is the standard unit used across sea and air freight to measure the volume a shipment occupies. Carriers use it, alongside weight, to calculate shipping costs and to decide how much space a shipment takes up in a container.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Why CBM Matters</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Freight pricing is rarely based on weight alone. A shipment that is light but bulky can take up as much space in a container as one that is heavy but compact. Carriers price shipments based on whichever is greater: the actual weight or the volume the cargo occupies. CBM is how that volume is measured and compared.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>The Formula</h2>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px', margin: '0 0 16px 0', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
          CBM = Length (m) &times; Width (m) &times; Height (m)
        </div>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          All three dimensions must be in meters. If your measurements are in centimeters, divide each by 100 before multiplying. For multiple identical packages, multiply the result by the quantity.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Worked Example</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px 0' }}>
          Suppose you have 10 cartons, each measuring 60 cm &times; 40 cm &times; 50 cm.
        </p>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', margin: '0 0 16px 0', paddingLeft: '20px' }}>
          <li>Convert to meters: 0.6 m &times; 0.4 m &times; 0.5 m</li>
          <li>Volume per carton: 0.12 CBM</li>
          <li>Total for 10 cartons: 0.12 &times; 10 = <strong>1.2 CBM</strong></li>
        </ul>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>A Quick Note on Density</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Once you know your total CBM and total weight, you can calculate cargo density (weight divided by volume). This helps determine whether your shipment is better suited to sea freight, and whether LCL or FCL makes more financial sense &mdash; a comparison CargoScale calculates automatically in the Shipment Analyzer.
        </p>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Link
            href="/tools/cbm-calculator"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}
          >
            Try the CBM Calculator
          </Link>
        </div>
      </article>

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/guides" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to Guides</Link>
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </div>

    </main>
  );
}
