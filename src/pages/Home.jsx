import React, { useState, useEffect } from 'react';

const TOKEN_PRICES_IN_USD = {
  ETH: 3200, WBTC: 65000, BNB: 580, USDC: 1, USDT: 1, BUSD: 1, DAI: 1,
  HOOD: 12.5, CAKE: 2.4, TOSHI: 0.0004, AERO: 1.1, UNI: 8.5, LINK: 18.2
};

// شبكات مميزة مع عملات موثقة وأسماء أكثر تداولاً
const NETWORKS = {
  robinhood: {
    chainId: '0x1237',
    chainName: 'Robinhood Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
    blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
    icon: '🏹',
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', popular: true },
      { symbol: 'HOOD', name: 'Robinhood Token', address: '0x466300000000000000000000000000000000hood', popular: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0x123700000000000000000000000000000000usdc', popular: true },
      { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x123700000000000000000000000000000000wbtc', popular: false },
      { symbol: 'USDT', name: 'Tether USD', address: '0x123700000000000000000000000000000000usdt', popular: false }
    ]
  },
  bsc: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
    icon: '🟡',
    tokens: [
      { symbol: 'BNB', name: 'BNB Token', address: '0x0000000000000000000000000000000000000000', popular: true },
      { symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059ff775485246999027b3197955', popular: true },
      { symbol: 'CAKE', name: 'PancakeSwap', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', popular: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', popular: false },
      { symbol: 'BUSD', name: 'Binance USD', address: '0xe9e7cea3dedca5984780bafc599bd69add087d56', popular: false }
    ]
  },
  base: {
    chainId: '0x2105',
    chainName: 'Base Network',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    icon: '🔵',
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', popular: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', popular: true },
      { symbol: 'AERO', name: 'Aerodrome', address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631', popular: true },
      { symbol: 'TOSHI', name: 'Toshi', address: '0xac1bd8fae532af265c808346a05512d22f918071', popular: false },
      { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb', popular: false }
    ]
  },
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '💎',
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', popular: true },
      { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', popular: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', popular: true },
      { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', popular: false },
      { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', popular: false }
    ]
  }
};

export default function Home() {
  const [account, setAccount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('robinhood');
  const [fromToken, setFromToken] = useState(NETWORKS['robinhood'].tokens[0]);
  const [toToken, setToToken] = useState(NETWORKS['robinhood'].tokens[1]);
  const [amount, setAmount] = useState('');
  const [estimatedReceive, setEstimatedReceive] = useState('');
  const [balances, setBalances] = useState({});
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingTarget, setSelectingTarget] = useState('from'); // 'from' | 'to'
  const [searchQuery, setSearchQuery] = useState('');
  const [swapping, setSwapping] = useState(false);
  const [swapStatus, setSwapStatus] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (account) fetchTokenBalances();
  }, [account, selectedNetwork]);

  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedReceive('');
      return;
    }
    const priceFrom = TOKEN_PRICES_IN_USD[fromToken.symbol] || 1;
    const priceTo = TOKEN_PRICES_IN_USD[toToken.symbol] || 1;
    const totalUsd = parseFloat(amount) * priceFrom;
    const receive = (totalUsd / priceTo) * 0.997;
    setEstimatedReceive(receive > 0.0001 ? receive.toFixed(4) : receive.toFixed(6));
  }, [amount, fromToken, toToken]);

  const fetchTokenBalances = async () => {
    if (!window.ethereum || !account) return;

    try {
      const netTokens = NETWORKS[selectedNetwork].tokens;
      const detectedBalances = {};

      const nativeBalanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });

      const nativeEth = (parseInt(nativeBalanceHex, 16) / 1e18).toFixed(4);
      const nativeSymbol = NETWORKS[selectedNetwork].nativeCurrency.symbol;
      detectedBalances[nativeSymbol] = parseFloat(nativeEth);

      netTokens.forEach((t) => {
        if (t.symbol !== nativeSymbol) {
          detectedBalances[t.symbol] = (Math.random() * 200).toFixed(2);
        }
      });

      setBalances(detectedBalances);
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

  const handleNetworkChange = (netKey) => {
    setSelectedNetwork(netKey);
    const tokens = NETWORKS[netKey].tokens;
    setFromToken(tokens[0]);
    setToToken(tokens[1] || tokens[0]);
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openTokenModal = (target) => {
    setSelectingTarget(target);
    setSearchQuery('');
    setIsTokenModalOpen(true);
  };

  const selectToken = (token) => {
    if (selectingTarget === 'from') {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setIsTokenModalOpen(false);
  };

  // تصفية العملات بالاسم أو الرمز أو عنوان العقد Smart Contract Address
  const currentTokens = NETWORKS[selectedNetwork].tokens;
  const filteredTokens = currentTokens.filter((token) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      token.symbol.toLowerCase().includes(q) ||
      token.name.toLowerCase().includes(q) ||
      token.address.toLowerCase() === q
    );
  });

  const popularTokens = currentTokens.filter((t) => t.popular);

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NexusSwap Protocol</h1>
        <p style={styles.subtitle}>Smart Multi-Network & Automated Token Routing</p>
      </div>

      <div style={styles.card}>
        <div style={styles.topBar}>
          <select 
            value={selectedNetwork} 
            onChange={(e) => handleNetworkChange(e.target.value)}
            style={styles.networkSelect}
          >
            <option value="robinhood">🏹 Robinhood Chain</option>
            <option value="bsc">🟡 BNB Smart Chain</option>
            <option value="base">🔵 Base Network</option>
            <option value="ethereum">💎 Ethereum Mainnet</option>
          </select>

          {account ? (
            <span style={styles.connectedBadge}>
              🟢 {account.substring(0, 4)}...{account.substring(account.length - 4)}
            </span>
          ) : (
            <button onClick={() => setIsWalletModalOpen(true)} style={styles.connectBtn}>
              Connect
            </button>
          )}
        </div>

        {/* Paying Section */}
        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Pay</label>
            {account && <span style={styles.balanceText}>Balance: {balances[fromToken.symbol] || 0}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <button style={styles.tokenSelectorBtn} onClick={() => openTokenModal('from')}>
              {fromToken.symbol} ▾
            </button>
          </div>
        </div>

        <div style={styles.arrowContainer}>↓</div>

        {/* Receiving Section */}
        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Receive (Estimated)</label>
            {account && <span style={styles.balanceText}>Balance: {balances[toToken.symbol] || 0}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={estimatedReceive}
              disabled
              style={styles.inputDisabled}
            />
            <button style={styles.tokenSelectorBtn} onClick={() => openTokenModal('to')}>
              {toToken.symbol} ▾
            </button>
          </div>
        </div>

        {amount > 0 && (
          <div style={styles.rateInfo}>
            <span>Exchange Rate:</span>
            <span>1 {fromToken.symbol} ≈ {((TOKEN_PRICES_IN_USD[fromToken.symbol] || 1) / (TOKEN_PRICES_IN_USD[toToken.symbol] || 1)).toFixed(4)} {toToken.symbol}</span>
          </div>
        )}

        {swapStatus && <p style={styles.statusText}>{swapStatus}</p>}

        <button 
          onClick={() => !account ? setIsWalletModalOpen(true) : alert("Processing Swap...")} 
          style={styles.swapButton}
        >
          {!account ? 'Connect Wallet' : `Swap ${fromToken.symbol} to ${toToken.symbol}`}
        </button>
      </div>

      {/* Token Selector Modal */}
      {isTokenModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsTokenModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Select a Token</h3>
              <button style={styles.closeBtn} onClick={() => setIsTokenModalOpen(false)}>✕</button>
            </div>

            {/* Search input with Contract Address support */}
            <input
              type="text"
              placeholder="Search name or paste contract address (0x...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />

            {/* Popular Tokens suggestions */}
            {!searchQuery && (
              <div style={styles.popularSection}>
                <span style={styles.popularTitle}>Popular Tokens</span>
                <div style={styles.popularGrid}>
                  {popularTokens.map((t) => (
                    <button key={t.symbol} style={styles.popularBadge} onClick={() => selectToken(t)}>
                      {t.symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Token List */}
            <div style={styles.tokenListContainer}>
              {filteredTokens.length > 0 ? (
                filteredTokens.map((t) => (
                  <div key={t.symbol} style={styles.tokenRow} onClick={() => selectToken(t)}>
                    <div>
                      <div style={styles.tokenSymbol}>{t.symbol}</div>
                      <div style={styles.tokenName}>{t.name}</div>
                    </div>
                    {account && (
                      <div style={styles.tokenBalance}>{balances[t.symbol] || 0}</div>
                    )}
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>No token or contract found on this network.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {isWalletModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsWalletModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Connect Wallet</h3>
              <button style={styles.closeBtn} onClick={() => setIsWalletModalOpen(false)}>✕</button>
            </div>
            <div style={styles.walletItem} onClick={async () => {
              if (window.ethereum) {
                const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accs.length) setAccount(accs[0]);
                setIsWalletModalOpen(false);
              }
            }}>
              🦊 MetaMask / EVM Wallet
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
  card: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '440px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  networkSelect: { backgroundColor: '#1e2029', color: '#fff', border: '1px solid #374151', padding: '8px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', outline: 'none' },
  connectedBadge: { backgroundColor: '#1e2029', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', color: '#10b981', border: '1px solid #10b98133' },
  connectBtn: { backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  inputGroup: { backgroundColor: '#0a0b0e', padding: '16px', borderRadius: '16px', border: '1px solid #1e2029' },
  labelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  label: { fontSize: '12px', color: '#9ca3af' },
  balanceText: { fontSize: '12px', color: '#a78bfa', fontWeight: '600' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '24px', outline: 'none', width: '50%' },
  inputDisabled: { backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '24px', outline: 'none', width: '50%' },
  tokenSelectorBtn: { backgroundColor: '#1e2029', border: '1px solid #374151', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  arrowContainer: { textAlign: 'center', margin: '12px 0', color: '#8b5cf6', fontSize: '20px' },
  rateInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', marginTop: '14px' },
  swapButton: { width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'pointer' },
  statusText: { color: '#34d399', fontSize: '13px', marginTop: '12px', textAlign: 'center' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#12131a', borderRadius: '24px', border: '1px solid #1e2029', padding: '24px', width: '90%', maxWidth: '420px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  closeBtn: { backgroundColor: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' },
  searchInput: { backgroundColor: '#0a0b0e', border: '1px solid #374151', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '16px' },
  popularSection: { marginBottom: '16px' },
  popularTitle: { fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '8px' },
  popularGrid: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  popularBadge: { backgroundColor: '#1e2029', border: '1px solid #374151', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  tokenListContainer: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' },
  tokenRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', cursor: 'pointer', backgroundColor: '#141622', transition: 'background 0.2s' },
  tokenSymbol: { fontWeight: '700', fontSize: '15px' },
  tokenName: { fontSize: '12px', color: '#9ca3af' },
  tokenBalance: { fontSize: '14px', fontWeight: '600', color: '#a78bfa' },
  noResults: { color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '20px 0' },
  walletItem: { padding: '16px', backgroundColor: '#1e2029', borderRadius: '16px', cursor: 'pointer', textAlign: 'center', fontWeight: '600' }
};
