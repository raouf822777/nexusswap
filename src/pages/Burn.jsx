import React from 'react';

export default function Burn() {
  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Tokenomics & Deflation</div>
        
        <h1 style={styles.title}>
          50% Revenue <span style={styles.gradientText}>Buyback & Burn</span>
        </h1>
        
        <p style={styles.description}>
          We are committed to building long-term value for our community. 
          To reduce the total circulating supply of <strong>NEXUSSWAP ($NEXUS)</strong>, 
          50% of all platform revenues are dedicated to automated token buybacks and permanent burns.
        </p>

        <div style={styles.statsGrid}>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>50%</span>
            <span style={styles.statLabel}>Revenue Allocated</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>DEX</span>
            <span style={styles.statLabel}>Market Buybacks</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNumber}>$NEXUS</span>
            <span style={styles.statLabel}>Deflationary Token</span>
          </div>
        </div>

        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>🔥 How the Burn Mechanism Works</h3>
          <ul style={styles.infoList}>
            <li><strong>1. Revenue Collection:</strong> Swap fees collected by NexusSwap are aggregated into a dedicated buyback pool.</li>
            <li><strong>2. Open Market Buyback:</strong> 50% of these funds are used directly on DEXs to purchase $NEXUS tokens.</li>
            <li><strong>3. Permanent Deflation:</strong> Purchased tokens are immediately sent to a dead burn address (0x0...000), removing them from supply forever.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '60px 20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#12131a',
    border: '1px solid #1e2029',
    borderRadius: '24px',
    padding: '40px 30px',
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    padding: '6px 16px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '16px',
  },
  gradientText: {
    background: 'linear-gradient(90deg, #ef4444, #f97316)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  description: {
    color: '#9ca3af',
    fontSize: '16px',
    lineHeight: '1.7',
    marginBottom: '32px',
    maxWidth: '650px',
    margin: '0 auto 32px auto',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statBox: {
    backgroundColor: '#1a1b26',
    border: '1px solid #2e303e',
    borderRadius: '16px',
    padding: '20px',
  },
  statNumber: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '800',
    color: '#f87171',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  infoBox: {
    backgroundColor: '#161722',
    border: '1px solid #282a3a',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'left',
  },
  infoTitle: {
    fontSize: '18px',
    color: '#f3f4f6',
    marginBottom: '16px',
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: '1.8',
  },
};
