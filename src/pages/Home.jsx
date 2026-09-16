import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [account, setAccount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // التحقق من وجود المحفظة المتصلة عند التحميل
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('الرجاء تثبيت محفظة MetaMask لتشغيل التطبيق.');
      return;
    }
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (!account) {
      connectWallet();
      return;
    }
    if (!amount || amount <= 0) {
      alert('الرجاء إدخال مبلغ صحيح للتبادل.');
      return;
    }
    alert(`سيتم طلب الموافقة من المحفظة لتبادل ${amount} ${fromToken} إلى ${toToken}`);
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NexusSwap Protocol</h1>
        <p style={styles.subtitle}>Direct Smart Contract Interface</p>
      </div>

      <div style={styles.card}>
        <div style={styles.walletStatus}>
          {account ? (
            <span style={styles.connectedBadge}>
              🟢 {account.substring(0, 6)}...{account.substring(account.length - 4)}
            </span>
          ) : (
            <button onClick={connectWallet} style={styles.connectBtn} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>You Pay</label>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} style={styles.select}>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
              <option value="DAI">DAI</option>
            </select>
          </div>
        </div>

        <div style={styles.arrowContainer}>↓</div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>You Receive (Estimated)</label>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount ? (parseFloat(amount) * 3200).toFixed(2) : ''}
              disabled
              style={styles.inputDisabled}
            />
            <select value={toToken} onChange={(e) => setToToken(e.target.value)} style={styles.select}>
              <option value="USDC">USDC</option>
              <option value="WBTC">WBTC</option>
              <option value="LINK">LINK</option>
            </select>
          </div>
        </div>

        <button onClick={handleSwap} style={styles.swapButton}>
          {!account ? 'Connect Wallet' : 'Swap Tokens'}
        </button>
      </div>
    </main>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', backgroundColor: '#0a0b0e', minHeight: '100vh', color: '#fff' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '32px', fontWeight: '800', margin: '0' },
  subtitle: { color: '#a78bfa', fontSize: '18px', marginTop: '8px' },
  card: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  walletStatus: { display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' },
  connectedBadge: { backgroundColor: '#1e2029', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', color: '#10b981', border: '1px solid #10b98133' },
  connectBtn: { backgroundColor: '#1e2029', color: '#fff', border: '1px solid #374151', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' },
  inputGroup: { backgroundColor: '#0a0b0e', padding: '16px', borderRadius: '16px', border: '1px solid #1e2029' },
  label: { fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '8px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '24px', outline: 'none', width: '60%' },
  inputDisabled: { backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '24px', outline: 'none', width: '60%' },
  select: { backgroundColor: '#1e2029', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  arrowContainer: { textAlign: 'center', margin: '12px 0', color: '#8b5cf6', fontSize: '20px' },
  swapButton: { width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'pointer', transition: '0.2s' }
};
