import React, { useState, useEffect } from 'react';

export default function Home() {
  const [account, setAccount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletName, setWalletName] = useState('');

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

  const getProvider = (type) => {
    if (!window.ethereum) return null;

    // في حال وجود أكثر من محفظة مثبته
    if (window.ethereum.providers) {
      if (type === 'metamask') {
        return window.ethereum.providers.find((p) => p.isMetaMask && !p.isPhantom);
      }
      if (type === 'coinbase') {
        return window.ethereum.providers.find((p) => p.isCoinbaseWallet);
      }
    }

    if (type === 'metamask' && window.ethereum.isMetaMask && !window.phantom) return window.ethereum;
    if (type === 'phantom' && (window.phantom?.ethereum || window.solana)) return window.phantom?.ethereum || window.ethereum;
    if (type === 'coinbase' && window.coinbaseWalletExtension) return window.coinbaseWalletExtension;
    if (type === 'keplr' && window.keplr) return 'keplr';

    return window.ethereum;
  };

  const connectWallet = async (type, name) => {
    try {
      if (type === 'keplr') {
        if (!window.keplr) {
          alert('محفظة Keplr غير مثبتة على متصفحك.');
          return;
        }
        await window.keplr.enable("cosmoshub-4");
        const offlineSigner = window.keplr.getOfflineSigner("cosmoshub-4");
        const accounts = await offlineSigner.getAccounts();
        setAccount(accounts[0].address);
        setWalletName(name);
        setIsModalOpen(false);
        return;
      }

      const provider = getProvider(type);
      if (!provider) {
        alert(`محفظة ${name} غير مثبتة في المتصفح.`);
        return;
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setWalletName(name);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('خطأ في الاتصال بالمحفظة:', err);
    }
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
              🟢 {walletName ? `${walletName}: ` : ''}{account.substring(0, 6)}...{account.substring(account.length - 4)}
            </span>
          ) : (
            <button onClick={() => setIsModalOpen(true)} style={styles.connectBtn}>
              Connect Wallet
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

        <button onClick={() => !account ? setIsModalOpen(true) : alert('سيتم بدء عملية التبادل')} style={styles.swapButton}>
          {!account ? 'Connect Wallet' : 'Swap Tokens'}
        </button>
      </div>

      {/* نافذة اختيار المحفظة المنبثقة (Modal) */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Connect a wallet</h3>
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div style={styles.walletList}>
              <div style={styles.walletItem} onClick={() => connectWallet('metamask', 'MetaMask')}>
                <div style={styles.walletInfo}>
                  <span style={styles.walletIcon}>🦊</span>
                  <span style={styles.walletName}>MetaMask</span>
                </div>
                <span style={styles.tagRecent}>Recent</span>
              </div>

              <div style={styles.walletItem} onClick={() => connectWallet('phantom', 'Phantom')}>
                <div style={styles.walletInfo}>
                  <span style={styles.walletIcon}>👻</span>
                  <span style={styles.walletName}>Phantom</span>
                </div>
                <span style={styles.tagDetected}>Detected</span>
              </div>

              <div style={styles.walletItem} onClick={() => connectWallet('keplr', 'Keplr')}>
                <div style={styles.walletInfo}>
                  <span style={styles.walletIcon}>✨</span>
                  <span style={styles.walletName}>Keplr</span>
                </div>
                <span style={styles.tagDetected}>Detected</span>
              </div>

              <div style={styles.walletItem} onClick={() => connectWallet('coinbase', 'Coinbase Wallet')}>
                <div style={styles.walletInfo}>
                  <span style={styles.walletIcon}>🔵</span>
                  <span style={styles.walletName}>Coinbase Wallet</span>
                </div>
                <span style={styles.tagDetected}>Detected</span>
              </div>

              <div style={styles.walletItem} onClick={() => connectWallet('other', 'Browser Wallet')}>
                <div style={styles.walletInfo}>
                  <span style={styles.walletIcon}>👛</span>
                  <span style={styles.walletName}>Other wallets</span>
                </div>
                <span style={{ color: '#9ca3af' }}>›</span>
              </div>
            </div>
          </div>
        </div>
      )}
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
  connectBtn: { backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  inputGroup: { backgroundColor: '#0a0b0e', padding: '16px', borderRadius: '16px', border: '1px solid #1e2029' },
  label: { fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '8px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '24px', outline: 'none', width: '60%' },
  inputDisabled: { backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '24px', outline: 'none', width: '60%' },
  select: { backgroundColor: '#1e2029', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  arrowContainer: { textAlign: 'center', margin: '12px 0', color: '#8b5cf6', fontSize: '20px' },
  swapButton: { width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'pointer' },
  
  // Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#12131a', borderRadius: '24px', border: '1px solid #1e2029', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  closeBtn: { backgroundColor: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' },
  walletList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  walletItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#1a1b23', borderRadius: '16px', cursor: 'pointer', transition: '0.2s', border: '1px solid transparent' },
  walletInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  walletIcon: { fontSize: '20px' },
  walletName: { fontSize: '15px', fontWeight: '600', color: '#fff' },
  tagRecent: { fontSize: '12px', color: '#ec4899', fontWeight: '600' },
  tagDetected: { fontSize: '12px', color: '#9ca3af' }
};
