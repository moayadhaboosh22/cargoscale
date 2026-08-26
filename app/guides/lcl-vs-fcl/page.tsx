import type { Metadata } from 'next';
import Link from 'next/link';
import FeedbackWidget from '../../../components/FeedbackWidget';

export const metadata: Metadata = {
  title: 'LCL vs FCL — Which One Do You Need? | CargoScale',
  description: 'A clear comparison between LCL (Less than Container Load) and FCL (Full Container Load) shipping, and how to decide which one fits your shipment.',
};

export default function LclVsFclPage() {
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
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>LCL vs FCL — Which One Do You Need?</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0' }}>Logistics Guide</p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          When shipping by sea, one of the first decisions you will face is whether to ship <strong>LCL (Less than Container Load)</strong> or <strong>FCL (Full Container Load)</strong>. The right choice depends on your shipment volume, budget, and how much flexibility you need.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>How LCL Works</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          With LCL, your cargo shares container space with shipments from other customers. You only pay for the volume you actually use, which is calculated in CBM. This makes LCL a practical option when your shipment does not fill a full container.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>How FCL Works</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          With FCL, you book an entire container exclusively for your own cargo, regardless of whether you fill it completely. You pay a flat rate for the container itself, not per CBM, and your shipment does not share space with anyone else.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Key Differences</h2>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', margin: '0 0 16px 0', paddingLeft: '20px' }}>
          <li><strong>Cost:</strong> LCL is priced per CBM; FCL is a flat container rate regardless of fill level.</li>
          <li><strong>Speed:</strong> FCL typically moves faster, since it skips consolidation and deconsolidation at warehouses.</li>
          <li><strong>Handling risk:</strong> LCL cargo is handled more times, alongside other shipments, which can slightly increase risk of damage or delay.</li>
          <li><strong>Flexibility:</strong> LCL suits smaller, irregular shipments; FCL suits larger or recurring volumes.</li>
        </ul>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Which One Should You Choose?</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          As a general rule of thumb, shipments under roughly 15 CBM are often more cost-effective as LCL, while shipments approaching or exceeding that range start to make FCL competitive or cheaper. This is only a starting guideline &mdash; actual rates vary by route, carrier, and season, so the real comparison should always be based on current freight rates for your specific shipment.
        </p>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Link
            href="/tools/shipment-analyzer"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}
          >
            Compare LCL vs FCL for Your Shipment
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
