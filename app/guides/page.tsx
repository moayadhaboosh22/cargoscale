import type { Metadata } from 'next';
import Link from 'next/link';
import FeedbackWidget from '../../components/FeedbackWidget';

export const metadata: Metadata = {
  title: 'Logistics Guides | CargoScale',
  description: 'Practical guides on shipping, freight terms, container types, and logistics calculations to help you make informed shipping decisions.',
};

const publishedGuides = [
  { title: 'What is CBM & How to Calculate It', description: 'Understand cubic meters and how shipment volume is calculated.', href: '/guides/cbm-explained' },
  { title: 'LCL vs FCL — Which One Do You Need?', description: 'Compare less-than-container-load and full-container-load shipping.', href: '/guides/lcl-vs-fcl' },
  { title: 'Air Freight Chargeable Weight Explained', description: 'Why air freight cost depends on both weight and volume.', href: '/guides/air-freight-chargeable-weight' },
  { title: 'Incoterms Explained Simply', description: 'A clear breakdown of who is responsible for what, and when.', href: '/guides/incoterms-explained' },
  { title: 'Container Guide (20GP / 40GP / 40HC)', description: 'Dimensions, capacities, and when to use each container type.', href: '/guides/container-guide' },
];

const upcomingGuides: { title: string; description: string }[] = [];

export default function GuidesPage() {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', background: '#f1f5f9', color: '#1e293b', direction: 'ltr', minHeight: '100vh' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>CS</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CargoScale</div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Logistics Guides</div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Logistics Guides</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
          Practical, no-nonsense guides on shipping terms, container types, and freight calculations. We are building this section out one guide at a time.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {publishedGuides.map((guide) => (
          <Link key={guide.title} href={guide.href} style={{ display: 'block', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '18px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>{guide.title}</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{guide.description}</div>
          </Link>
        ))}
        {upcomingGuides.map((guide) => (
          <div key={guide.title} style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>{guide.title}</div>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '3px 8px', whiteSpace: 'nowrap' }}>Coming Soon</span>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{guide.description}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <a href="/" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>&larr; Back to CargoScale</a>
        <div style={{ marginTop: '8px' }}>
          <FeedbackWidget />
        </div>
      </div>

    </main>
  );
}
