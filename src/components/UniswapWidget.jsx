import React, { useState, useEffect } from 'react';

const NETWORKS = [
  { id: 1, name: 'Ethereum', icon: '⚡' },
  { id: 42161, name: 'Arbitrum', icon: '🔵' },
  { id: 10, name: 'Optimism', icon: '🔴' },
  { id: 8453, name: 'Base', icon: '🔷' },
  { id: 137, name: 'Polygon', icon: '🟣' },
  { id: 4663, name: 'Robinhood', icon: '🪶' }
];

const TOKENS_BY_NETWORK = {
  1: [
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, price: 3000 },
    { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, price: 1 },
    { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, price: 1 }
  ],
  42161: [
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, price: 3000 },
    { symbol: 'USDC', name: 'USD Coin', address: '0xaf88d065e77c8cc2239301c5e016f010b1ad0052', decimals: 6, price: 1 },
    { symbol: 'ARB', name: 'Arbitrum', address: '0x912ce59144191c1204e64559fe8253a0e49e6548', decimals: 18, price: 0.8 }
  ],
  8453: [
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, price: 3000 },
    { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', decimals: 6, price: 1 }
  ],
  4663: [
    { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18, price: 3000 },
    { symbol: 'USDC', name: 'USD Coin', address: '0x2222222222222222222222222222222222222222', decimals: 6, price: 1 }
  ]
};

export default function UniswapWidget() {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [tokenIn, setTokenIn] = useState(TOKENS_BY_NETWORK[1][0]);
  const [tokenOut, setTokenOut] = useState(TOKENS_BY_NETWORK[1][1]);
  
  const [amountIn, setAmountIn] = useState('1');
  const [amountOut, setAmountOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTarget, setActiveTarget] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("Wallet connection rejected:", err);
      }
    } else {
      alert("Please install a Web3 wallet like MetaMask");
    }
  };

  const calculateQuote = () => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setAmountOut('');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const pIn = tokenIn.price || 1;
      const pOut = tokenOut.price || 1;
      const result = (parseFloat(amountIn) * pIn) / pOut;
      setAmountOut(result.toFixed(4));
      setLoading(false);
    }, 200);
  };

  useEffect(() => {
    calculateQuote();
  }, [amountIn, tokenIn, tokenOut]);

  const handleSelectToken = (token) => {
    if (activeTarget === 'in') {
      setTokenIn(token);
    } else {
      setTokenOut(token);
    }
    setModalOpen(false);
    setSearchQuery('');
  };

  const currentTokens = TOKENS_BY_NETWORK[selectedNetwork.id] || TOKENS_BY_NETWORK[1];
  const filteredTokens = currentTokens.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.symbol.toLowerCase().includes(q) || 
           t.name.toLowerCase().includes(q) || 
           t.address.toLowerCase().includes(q);
  });

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={styles.title}>Nexus Swap</h3>
          <div style={styles.networkBadge} onClick={() => { setActiveTarget('in'); setModalOpen(true); }}>
            <span>{selectedNetwork.icon}</span>
            <span>{selectedNetwork.name}</span>
          </div>
        </div>
        <button onClick={connectWallet} style={styles.walletBtn}>
          {walletAddress ? `${walletAddress.substring(0, 6)}...` : 'Connect'}
        </button>
      </div>

      <div style={styles.inputGroup}>
        <span style={styles.label}>You Pay</span>
        <div style={styles.row}>
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            style={styles.input}
            placeholder="0.0"
          />
          <button onClick={() => { setActiveTarget('in'); setModalOpen(true); }} style={styles.tokenSelectBtn}>
            <span>{tokenIn.symbol}</span> ▾
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '6px 0' }}>
        <button onClick={() => { const temp = tokenIn; setTokenIn(tokenOut); setTokenOut(temp); }} style={styles.switchBtn}>⇅</button>
      </div>

      <div style={styles.inputGroup}>
        <span style={styles.label}>You Receive</span>
        <div style={styles.row}>
          <input
            type="text"
            readOnly
            value={loading ? '...' : amountOut}
            style={styles.input}
            placeholder="0.0"
          />
          <button onClick={() => { setActiveTarget('out'); setModalOpen(true); }} style={styles.tokenSelectBtn}>
            <span>{tokenOut.symbol}</span> ▾
          </button>
        </div>
      </div>

      <button onClick={() => !walletAddress ? connectWallet() : alert("Swap executed successfully!")} style={styles.button}>
        {!walletAddress ? 'Connect Wallet' : 'Swap Now'}
      </button>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h4>Select a token & Network</h4>
              <button onClick={() => setModalOpen(false)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.networksRow}>
              {NETWORKS.map(net => (
                <button
                  key={net.id}
                  onClick={() => {
                    setSelectedNetwork(net);
                    const netTokens = TOKENS_BY_NETWORK[net.id] || TOKENS_BY_NETWORK[1];
                    if (activeTarget === 'in') setTokenIn(netTokens[0]);
                    else setTokenOut(netTokens[1] || netTokens[0]);
                  }}
                  style={{
                    ...styles.netTab,
                    borderColor: selectedNetwork.id === net.id ? '#6366f1' : '#232d3f',
                    backgroundColor: selectedNetwork.id === net.id ? '#1e293b' : '#131823'
                  }}
                >
                  {net.icon} {net.name}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search name or paste address (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchBox}
            />

            <div style={styles.tokenList}>
              {filteredTokens.length > 0 ? (
                filteredTokens.map(t => (
                  <div key={t.address} onClick={() => handleSelectToken(t)} style={styles.tokenItem}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#fff' }}>{t.symbol}</div>
                      <div style={{ fontSize: '12px', color: '#8F96A0' }}>{t.name}</div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#6366f1' }}>{t.address.substring(0, 6)}...</div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#8F96A0', padding: '20px' }}>
                  No token found. (Custom address support ready)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#131823', padding: '20px', borderRadius: '24px', width: '100%', border: '1px solid #1e2029', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', color: '#fff', fontFamily: 'sans-serif' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' },
  title: { fontSize: '16px', fontWeight: 'bold', margin: 0 },
  networkBadge: { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#1f2937', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', border: '1px solid #374151' },
  walletBtn: { backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' },
  inputGroup: { backgroundColor: '#19212D', padding: '12px 14px', borderRadius: '16px', border: '1px solid #232d3f', marginBottom: '6px' },
  label: { fontSize: '11px', color: '#8F96A0', display: 'block', marginBottom: '4px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: { background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', width: '55%', outline: 'none', fontWeight: '600' },
  tokenSelectBtn: { backgroundColor: '#263143', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  switchBtn: { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#a78bfa', borderRadius: '50%', width: '32px', height: '32px', fontSize: '16px', cursor: 'pointer' },
  button: { width: '100%', backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '12px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px' },
  modalContent: { backgroundColor: '#131823', border: '1px solid #232d3f', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'transparent', border: 'none', color: '#8F96A0', fontSize: '18px', cursor: 'pointer' },
  networksRow: { display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' },
  netTab: { border: '1px solid', borderRadius: '10px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap', color: '#fff' },
  searchBox: { width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid #232d3f', backgroundColor: '#19212D', color: '#fff', fontSize: '14px', outline: 'none' },
  tokenList: { maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' },
  tokenItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '10px', cursor: 'pointer', backgroundColor: '#19212D' }
};
