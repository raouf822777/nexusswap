import React from 'react';
import { LiFiWidget } from '@lifi/widget';

const widgetConfig = {
  integrator: 'raouf',
  apiKey: '3b7131cd-d41d-4c0c-ad06-d47f9ffecb40.1a3ecb84-82d0-4076-bab6-4440f9850dd8',
  variant: 'expandable',
  subvariant: 'default',
  appearance: 'dark',
  fee: 0, // إلغاء أي قيود عمولة إضافية قد تمنع استعراض المسارات
  buildUrl: false,
  theme: {
    palette: {
      primary: { main: '#8b5cf6' },
      background: {
        paper: '#12131a',
        default: '#0a0b0e',
      },
    },
    shape: {
      borderRadius: 16,
      borderRadiusSecondary: 12,
    },
  },
  sdkConfig: {
    apiKey: '3b7131cd-d41d-4c0c-ad06-d47f9ffecb40.1a3ecb84-82d0-4076-bab6-4440f9850dd8',
    defaultRouteOptions: {
      maxPriceImpact: 0.8, // رفع السقف لـ 80% لضمان إرجاع كافة المسارات المتاحة
      allowSwitchChain: true,
      slippage: 0.005, // 0.5% Slippage
    },
  },
};

export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Cross-Chain Swaps</h1>
        <p style={styles.subtitle}>At Best Rates & Security</p>
        <p style={styles.desc}>
          Connect your wallet and swap any token across multiple blockchain networks seamlessly in seconds with minimal fees.
        </p>
      </div>

      <div style={styles.widgetWrapper}>
        <LiFiWidget config={widgetConfig} integrator="raouf" />
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <span style={styles.icon}>🔒</span>
          <h3>Top-tier Security</h3>
          <p>All transactions are executed directly from your wallet via decentralized smart contracts.</p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.icon}>🌐</span>
          <h3>Multi-Chain Support</h3>
          <p>Support for over 20+ blockchain ecosystems and hundreds of verified tokens.</p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.icon}>🚀</span>
          <h3>Optimal Routes</h3>
          <p>LI.FI routing algorithms automatically find the fastest and cheapest swap paths for you.</p>
        </div>
      </div>
    </main>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#a78bfa',
    margin: '0 0 16px 0',
  },
  desc: {
    color: '#9ca3af',
    maxWidth: '600px',
    margin: '0 auto',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  widgetWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '50px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
  },
  featureCard: {
    backgroundColor: '#12131a',
    border: '1px solid #1e2029',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
  },
  icon: {
    fontSize: '28px',
    display: 'block',
    marginBottom: '12px',
  },
};
