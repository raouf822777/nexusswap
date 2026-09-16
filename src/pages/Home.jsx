import React from 'react';
import { SwapWidget } from '@uniswap/widgets';

// يمكن استخدام أي RPC عام أو خاص بـ Infura / Alchemy / Ankr
const JSON_RPC_URL = 'https://rpc.ankr.com/eth';

export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Uniswap Swap</h1>
        <p style={styles.subtitle}>Decentralized Token Exchange</p>
        <p style={styles.desc}>
          Swap ERC-20 tokens directly using Uniswap liquidity protocol.
        </p>
      </div>

      <div style={styles.widgetWrapper}>
        <div className="Uniswap">
          <SwapWidget
            jsonRpcUrlMap={{
              1: [JSON_RPC_URL],
            }}
            theme={{
              primary: '#FFFFFF',
              secondary: '#9CA3AF',
              interactive: '#1E2029',
              container: '#12131A',
              module: '#0A0B0E',
              accent: '#8B5CF6',
              outline: '#262626',
              dialog: '#12131A',
            }}
            width={420}
          />
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
    color: '#ff007a',
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
    minHeight: '500px',
  },
};
