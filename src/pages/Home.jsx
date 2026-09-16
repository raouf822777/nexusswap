import React from 'react';

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
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>NexusSwap Protocol</h1>
      <p style={{ color: '#a78bfa', marginBottom: '24px', fontSize: '15px' }}>Instant Multi-Chain Swap</p>
      
      {/* تم إزالة الويدجت القديم - جاهز لإضافة Uniswap Widget */}
      <div id="swap-container" style={{ width: '100%', maxWidth: '440px' }}>
        {/* سيتم إدراج مكون Uniswap الجديد هنا */}
      </div>
    </main>
  );
}
