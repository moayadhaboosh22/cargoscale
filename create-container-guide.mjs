import fs from 'fs';

const content = `import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Container Guide — Choosing Between 20GP, 40GP & 40HC | CargoScale',
  description: 'A practical guide to choosing the right container type based on cargo density, volume, and height, with a link to full technical specifications.',
};

export default function ContainerGuidePage() {
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
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Container Guide — Choosing Between 20GP, 40GP &amp; 40HC</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0' }}>Logistics Guide</p>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Choosing a container is not just about how much cargo you have. The right choice depends on how dense your cargo is, how much space it takes up, and whether it needs extra height. Here is how the three most common container types compare.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>20GP (Standard 20-Foot)</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Best suited for heavy, dense cargo &mdash; think machinery, metal parts, or canned goods. Because a 20GP has a lower volume but a similar weight limit to larger containers, it is often the more economical choice when weight, not space, is your limiting factor.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>40GP (Standard 40-Foot)</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Best suited for lighter, bulkier cargo &mdash; such as textiles, packaged goods, or electronics. A 40GP offers roughly double the volume of a 20GP without a proportional increase in weight allowance, making it ideal when space runs out before weight does.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>40HC (40-Foot High Cube)</h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          Similar to a 40GP, but with extra internal height. Best suited for tall or bulky items &mdash; furniture, machinery with vertical clearance needs, or cargo that benefits from stacking higher within the same footprint.
        </p>

        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '28px 0 10px 0' }}>Quick Decision Guide</h2>
        <ul style={{ fontSize: '15px', lineHeight: '1.8', margin: '0 0 16px 0', paddingLeft: '20px' }}>
          <li><strong>High density, hits weight limit first:</strong> 20GP is usually more cost-effective.</li>
          <li><strong>Low density, hits volume limit first:</strong> 40GP gives you the space you need.</li>
          <li><strong>Bulky or tall cargo needing extra clearance:</strong> 40HC is worth the small premium over a 40GP.</li>
        </ul>

        <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '0 0 16px 0' }}>
          For exact internal and external dimensions, door openings, and weight limits for each container type, see the full specifications page.
        </p>

        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <Link
            href="/containers"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}
          >
            View Full Container Specifications
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

const dir = 'app/guides/container-guide';
const filePath = dir + '/page.tsx';

if (fs.existsSync(filePath)) {
  console.log('FAIL:file_already_exists:' + filePath);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, content, 'utf8');
console.log('OK:created:' + filePath);
