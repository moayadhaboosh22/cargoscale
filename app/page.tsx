import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', color: '#1e293b', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
            CS
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>CargoScale</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Logistics Decision Assistant</div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1e293b' }}>
          CargoScale
        </h1>
        <p style={{ fontSize: '18px', color: '#475569', margin: '0 0 32px 0' }}>
          Smart Logistics Tools &amp; Decision Assistant
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/tools/shipment-analyzer"
            style={{ background: '#2563eb', color: '#fff', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px' }}
          >
            Analyze Shipment
          </Link>
          <a href="#tools" style={{ background: '#fff', color: '#2563eb', padding: '12px 28px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', border: '1px solid #cbd5e1' }}>
            Explore Tools
          </a>
        </div>
      </section>

      {/* Quick Tools */}
      <section id="tools" style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 20px 60px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>Quick Tools</h2>
        <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '28px' }}>
          Start with the tool that fits your task.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <Link
            href="/tools/shipment-analyzer"
            style={{ display: 'block', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>Shipment Analyzer</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Full shipment analysis — volume, weight, chargeable weight, container fit, and LCL vs FCL comparison.
            </div>
          </Link>

          <Link
            href="/tools/cbm-calculator"
            style={{ display: 'block', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>CBM Calculator</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Quickly calculate the total volume (CBM) of your shipment.
            </div>
          </Link>

          <Link
            href="/tools/chargeable-weight"
            style={{ display: 'block', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '20px', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginBottom: '6px' }}>Chargeable Weight Calculator</div>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
              Compare actual vs. volumetric weight for air freight shipments.
            </div>
          </Link>

          <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '6px' }}>More Tools</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              Unit Converter is coming soon.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
        CargoScale — Logistics Decision Assistant
      </footer>

    </main>
  );
}