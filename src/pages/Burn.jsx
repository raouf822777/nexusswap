import React from 'react';

export default function Burn() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Token Burn Portal 🔥</h1>
      <p style={styles.subtitle}>
        Deflationary Mechanism & Protocol Token Burning Hub.
      </p>

      <div style={styles.burnGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>1,000,000 +</span>
          <span style={styles.statLabel}>Total Tokens Burned</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>0.25%</span>
          <span style={styles.statLabel}>Auto-Burn Rate per Tx</span>
        </div>
      </div>

      <div style={styles.burnBox}>
        <h3>Burn Nexus Tokens</h3>
        <p style={styles.desc}>
          Permanently remove tokens from circulation to increase overall ecosystem scarcity and value alignment.
        </p>
        <button style={styles.burnButton}>Connect Wallet to Burn</button>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '60px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '36px', fontWeight: '800', marginBottom: '16px', color: '#ef4444' },
  subtitle: { color: '#9ca3af', fontSize: '18px', marginBottom: '40px' },
  burnGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column' },
  statNumber: { fontSize: '24px', fontWeight: '800', color: '#f3f4f6' },
  statLabel: { color: '#6b7280', fontSize: '14px', marginTop: '6px' },
  burnBox: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '20px', padding: '32px' },
  desc: { color: '#9ca3af', marginBottom: '24px', lineHeight: '1.6' },
  burnButton: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '16px' }
};
