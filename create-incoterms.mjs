import fs from 'fs';

const content = `import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Incoterms Explained Simply | CargoScale',
  description: 'A practical, simplified guide to the most common Incoterms, organized by how much responsibility falls on the seller versus the buyer.',
};

export default function IncotermsExplainedPage() {
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
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Incoterms Explained Simply</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0' }}>Logistics Guide</p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Incoterms are standardized trade terms that define exactly who is responsible for shipping costs, insurance, and risk at each stage of a shipment &mdash; from the seller's warehouse to the buyer's door. Choosing the right one affects your cost, risk, and control over the shipment.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Least Seller Responsibility</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 8px 0' }}>
          <strong>EXW (Ex Works):</strong> The buyer takes on almost everything &mdash; pickup from the seller's premises, export clearance, main transport, and import clearance. The seller's only job is to make the goods available.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          <strong>FCA (Free Carrier):</strong> The seller delivers the goods to a carrier or location named by the buyer, handling export clearance. The buyer takes over from there, including main transport.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Shared Responsibility</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 8px 0' }}>
          <strong>FOB (Free on Board):</strong> The seller delivers the goods onto the vessel at the port of origin. Risk transfers to the buyer once the goods are on board, though the buyer arranges and pays for the main sea freight.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 8px 0' }}>
          <strong>CIF (Cost, Insurance & Freight):</strong> The seller pays for freight and insurance to the destination port, but risk still transfers to the buyer once goods are loaded at origin. The seller arranges shipping; the buyer bears the risk in transit.
        </p>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          <strong>CPT (Carriage Paid To):</strong> Similar to CIF but usable for any mode of transport, not just sea freight. The seller pays for carriage to a named destination, while risk transfers earlier, once goods are handed to the first carrier.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Most Seller Responsibility</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          <strong>DDP (Delivered Duty Paid):</strong> The seller handles everything &mdash; transport, export and import clearance, duties, and taxes &mdash; delivering the goods ready for use at the buyer's door. This is the most convenient option for the buyer, and typically the most expensive for the seller.
        </p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          These six cover the majority of everyday shipments. A handful of other Incoterms exist for more specific situations (such as FAS, CFR, DAP, and DPU), each sitting at a different point along the same spectrum of responsibility.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Why It Matters</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          The Incoterm you agree on directly affects your total landed cost, who arranges insurance, and who bears the risk if something goes wrong in transit. Always confirm the Incoterm in writing before shipping, and make sure it matches what was actually agreed with your supplier or buyer.
        </p>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Link
            href="/guides/lcl-vs-fcl"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}
          >
            Read: LCL vs FCL Guide
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

const dir = 'app/guides/incoterms-explained';
const filePath = dir + '/page.tsx';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
