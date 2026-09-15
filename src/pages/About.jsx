import React from 'react';

export default function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>About NexusSwap</h1>
      <p style={styles.subtitle}>
        NexusSwap is a next-generation decentralized cross-chain liquidity aggregator designed to make crypto swaps seamless, secure, and lightning fast.
      </p>
      
      <div style={styles.contentGrid}>
        <div style={styles.card}>
          <h3>Our Mission</h3>
          <p>To eliminate blockchain boundaries by providing unified liquidity across all major EVM and non-EVM ecosystems.</p>
        </div>
        <div style={styles.card}>
          <h3>Powered by LI.FI</h3>
          <p>By integrating advanced routing protocols, NexusSwap finds the most cost-effective and secure swap paths available.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '60px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
  title: { fontSize: '36px', fontWeight: '800', marginBottom: '16px' },
  subtitle: { color: '#9ca3af', fontSize: '18px', lineHeight: '1.6', marginBottom: '40px' },
  contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '16px', padding: '24px', textAlign: 'left' }
};
