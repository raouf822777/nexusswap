import React from 'react';
import { SquidWidget } from '@0xsquid/widget';

export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NexusSwap Protocol</h1>
        <p style={styles.subtitle}>Powered by Axelar & Squid</p>
        <p style={styles.desc}>
          Swap any token across 60+ blockchains with deep liquidity and seamless security.
        </p>
      </div>

      <div style={styles.widgetWrapper}>
        <SquidWidget
          config={{
            companyName: 'NexusSwap',
            integratorId: 'nexusswap-app-build',
            style: {
              neutralContent: '#9CA3AF',
              baseContent: '#FFFFFF',
              base100: '#12131A',
              base200: '#0A0B0E',
              base300: '#1E2029',
              error: '#EF4444',
              warning: '#F59E0B',
              success: '#10B981',
              primary: '#8B5CF6',
              primaryContent: '#FFFFFF',
              roundedBtn: '9999px',
              roundedCornerModal: '1rem',
              roundedCornerSmall: '0.5rem',
            },
          }}
        />
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
    minHeight: '600px',
  },
};
