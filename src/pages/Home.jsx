import React from 'react';
import UniswapWidget from '../components/UniswapWidget';

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0a0b0e',
      padding: '20px',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '6px' }}>NexusSwap</h1>
        <p style={{ color: '#a78bfa', fontSize: '15px', margin: 0 }}>Decentralized Trading powered by Uniswap API</p>
      </div>

      {/* صندوق الويدجت */}
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <UniswapWidget />
      </div>
    </main>
  );
}
