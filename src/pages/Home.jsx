import React from 'react';
import { LiFiWidget } from '@lifi/widget';

const widgetConfig = {
  integrator: 'raouf',
  appearance: 'dark',
  theme: {
    palette: {
      primary: { main: '#8b5cf6' },
      background: { default: '#12131a', paper: '#1a1b26' },
    },
    container: {
      border: '1px solid #2e303e',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    },
  },
};

export default function Home() {
  return (
    <main style={styles.main}>
      <div style={styles.heroSection}>
        <h1 style={styles.title}>
          Cross-Chain Swaps <br />
          <span style={styles.titleGradient}>At Best Rates & Security</span>
        </h1>
        <p style={styles.subtitle}>
          Connect your wallet and swap any token across multiple blockchain networks seamlessly in seconds with minimal fees.
        </p>
      </div>

      <div id="swap" style={styles.widgetWrapper}>
        <LiFiWidget config={widgetConfig} />
      </div>

      <section id="features" style={styles.featuresSection}>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🔒</div>
          <h3 style={styles.featureTitle}>Top-tier Security</h3>
          <p style={styles.featureDesc}>All transactions are executed directly from your wallet via decentralized smart contracts.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🌐</div>
          <h3 style={styles.featureTitle}>Multi-Chain Support</h3>
          <p style={styles.featureDesc}>Support for over 20+ blockchain ecosystems and hundreds of verified tokens.</p>
        </div>
        <div style={styles.featureCard}>
          <div style={styles.featureIcon}>🚀</div>
          <h3 style={styles.featureTitle}>Optimal Routes</h3>
          <p style={styles.featureDesc}>LI.FI routing algorithms automatically find the fastest and cheapest swap paths for you.</p>
        </div>
      </section>
    </main>
  );
}

const styles = {
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '700px',
  },
  title: {
    fontSize: '38px',
    fontWeight: '800',
    lineHeight: '1.3',
    marginBottom: '16px',
  },
  titleGradient: {
    background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#9ca3af',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  widgetWrapper: {
    position: 'relative',
    margin: '10px 0 60px 0',
    zIndex: 1,
  },
  featuresSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    width: '100%',
    maxWidth: '1100px',
    marginTop: '20px',
  },
  featureCard: {
    backgroundColor: '#12131a',
    border: '1px solid #1e2029',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#f3f4f6',
  },
  featureDesc: {
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: '1.5',
  },
};
