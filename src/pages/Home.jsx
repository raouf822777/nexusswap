import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const NETWORKS = {
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', popular: true, coingeckoId: 'ethereum', decimals: 18 },
      { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', popular: true, coingeckoId: 'tether', decimals: 6 },
      { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', popular: true, coingeckoId: 'usd-coin', decimals: 6 },
      { symbol: 'WBTC', name: 'Wrapped BTC', address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', popular: false, coingeckoId: 'wrapped-bitcoin', decimals: 8 },
      { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', popular: false, coingeckoId: 'uniswap', decimals: 18 }
    ]
  },
  bsc: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    tokens: [
      { symbol: 'BNB', name: 'BNB Token', address: '0x0000000000000000000000000000000000000000', popular: true, coingeckoId: 'binancecoin', decimals: 18 },
      { symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059ff775485246999027b3197955', popular: true, coingeckoId: 'tether', decimals: 18 },
      { symbol: 'CAKE', name: 'PancakeSwap', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', popular: true, coingeckoId: 'pancakeswap-token', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', popular: false, coingeckoId: 'usd-coin', decimals: 18 }
    ]
  },
  base: {
    chainId: '0x2105',
    chainName: 'Base Network',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', popular: true, coingeckoId: 'ethereum', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', popular: true, coingeckoId: 'usd-coin', decimals: 6 },
      { symbol: 'AERO', name: 'Aerodrome', address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631', popular: true, coingeckoId: 'aerodrome-finance', decimals: 18 },
      { symbol: 'TOSHI', name: 'Toshi', address: '0xac1bd8fae532af265c808346a05512d22f918071', popular: false, coingeckoId: 'toshi', decimals: 18 }
    ]
  },
  robinhood: {
    chainId: '0x1237',
    chainName: 'Robinhood Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', popular: true, coingeckoId: 'ethereum', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x000000000000000000000000000000000000usdc', popular: true, coingeckoId: 'usd-coin', decimals: 6 }
    ]
  }
};

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export default function Home() {
  const [account, setAccount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [fromToken, setFromToken] = useState(NETWORKS['ethereum'].tokens[0]);
  const [toToken, setToToken] = useState(NETWORKS['ethereum'].tokens[1]);
  const [amount, setAmount] = useState('');
  const [estimatedReceive, setEstimatedReceive] = useState('');
  const [balances, setBalances] = useState({});
  const [prices, setPrices] = useState({});
  
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [selectingTarget, setSelectingTarget] = useState('from');
  const [searchQuery, setSearchQuery] = useState('');
  const [customToken, setCustomToken] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (account) fetchRealBalances();
  }, [account, selectedNetwork]);

  useEffect(() => {
    fetchPrices();
  }, [fromToken, toToken]);

  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedReceive('');
      return;
    }
    const pFrom = prices[fromToken.symbol] || 0;
    const pTo = prices[toToken.symbol] || 0;

    if (pFrom > 0 && pTo > 0) {
      const totalUsd = parseFloat(amount) * pFrom;
      const receive = (totalUsd / pTo) * 0.997;
      setEstimatedReceive(receive > 0.0001 ? receive.toFixed(4) : receive.toFixed(6));
    }
  }, [amount, fromToken, toToken, prices]);

  const fetchPrices = async () => {
    try {
      const ids = [fromToken.coingeckoId, toToken.coingeckoId].filter(Boolean).join(',');
      if (!ids) return;

      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
      const data = await res.json();

      const newPrices = {};
      if (fromToken.coingeckoId && data[fromToken.coingeckoId]) {
        newPrices[fromToken.symbol] = data[fromToken.coingeckoId].usd;
      }
      if (toToken.coingeckoId && data[toToken.coingeckoId]) {
        newPrices[toToken.symbol] = data[toToken.coingeckoId].usd;
      }

      setPrices((prev) => ({ ...prev, ...newPrices }));
    } catch (e) {
      console.error('Error fetching market prices:', e);
    }
  };

  const fetchRealBalances = async () => {
    if (!window.ethereum || !account) return;

    try {
      const rpcUrl = NETWORKS[selectedNetwork].rpcUrls[0];
      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const tokens = NETWORKS[selectedNetwork].tokens;
      const realBalances = {};

      for (const token of tokens) {
        if (token.address === '0x0000000000000000000000000000000000000000') {
          try {
            const rawBalance = await provider.getBalance(account);
            realBalances[token.symbol] = parseFloat(ethers.formatEther(rawBalance)).toFixed(4);
          } catch {
            realBalances[token.symbol] = '0.0000';
          }
        } else {
          try {
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const rawBalance = await contract.balanceOf(account);
            const formatted = ethers.formatUnits(rawBalance, token.decimals);
            realBalances[token.symbol] = parseFloat(formatted).toFixed(4);
          } catch {
            realBalances[token.symbol] = '0.0000';
          }
        }
      }
      setBalances(realBalances);
    } catch (err) {
      console.error('Balance error:', err);
    }
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

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCustomToken(null);

    if (val.startsWith('0x') && val.length === 42) {
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${val}`);
        const data = await res.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          const newTok = {
            symbol: pair.baseToken.symbol,
            name: pair.baseToken.name,
            address: val,
            decimals: 18,
            priceUsd: parseFloat(pair.priceUsd)
          };
          setCustomToken(newTok);
        }
      } catch (err) {
        console.error('Token search error:', err);
      }
    }
  };

  const openModal = (target) => {
    setSelectingTarget(target);
    setSearchQuery('');
    setCustomToken(null);
    setIsTokenModalOpen(true);
  };

  const selectToken = (token) => {
    if (selectingTarget === 'from') setFromToken(token);
    else setToToken(token);
    if (token.priceUsd) {
      setPrices((prev) => ({ ...prev, [token.symbol]: token.priceUsd }));
    }
    setIsTokenModalOpen(false);
  };

  const currentTokens = NETWORKS[selectedNetwork].tokens;
  const filteredTokens = currentTokens.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    return t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.address.toLowerCase() === q;
  });

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NexusSwap Protocol</h1>
        <p style={styles.subtitle}>Real-time Prices & Verified On-Chain Balances</p>
      </div>

      <div style={styles.card}>
        <div style={styles.topBar}>
          <select 
            value={selectedNetwork} 
            onChange={(e) => {
              const netKey = e.target.value;
              setSelectedNetwork(netKey);
              setFromToken(NETWORKS[netKey].tokens[0]);
              setToToken(NETWORKS[netKey].tokens[1] || NETWORKS[netKey].tokens[0]);
            }}
            style={styles.networkSelect}
          >
            <option value="ethereum">💎 Ethereum Mainnet</option>
            <option value="bsc">🟡 BNB Smart Chain</option>
            <option value="base">🔵 Base Network</option>
            <option value="robinhood">🏹 Robinhood Chain</option>
          </select>

          {account ? (
            <span style={styles.connectedBadge}>
              🟢 {account.substring(0, 4)}...{account.substring(account.length - 4)}
            </span>
          ) : (
            <button onClick={async () => {
              if (window.ethereum) {
                const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accs.length) setAccount(accs[0]);
              }
            }} style={styles.connectBtn}>
              Connect
            </button>
          )}
        </div>

        {/* Paying Section */}
        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Pay</label>
            {account && <span style={styles.balanceText}>Balance: {balances[fromToken.symbol] || '0.0000'}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <button style={styles.tokenBtn} onClick={() => openModal('from')}>
              {fromToken.symbol} ▾
            </button>
          </div>
          <div style={styles.priceSubtext}>
            ${prices[fromToken.symbol] ? prices[fromToken.symbol].toLocaleString() : '0.00'} USD
          </div>
        </div>

        <div style={styles.arrowContainer}>↓</div>

        {/* Receiving Section */}
        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Receive</label>
            {account && <span style={styles.balanceText}>Balance: {balances[toToken.symbol] || '0.0000'}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={estimatedReceive}
              disabled
              style={styles.inputDisabled}
            />
            <button style={styles.tokenBtn} onClick={() => openModal('to')}>
              {toToken.symbol} ▾
            </button>
          </div>
          <div style={styles.priceSubtext}>
            ${prices[toToken.symbol] ? prices[toToken.symbol].toLocaleString() : '0.00'} USD
          </div>
        </div>

        <button 
          onClick={() => !account ? checkConnection() : alert("Swap Request Submitted!")} 
          style={styles.swapButton}
        >
          {!account ? 'Connect Wallet' : `Swap ${fromToken.symbol}`}
        </button>
      </div>

      {/* Modal Selection */}
      {isTokenModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsTokenModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Select Token</h3>
              <button style={styles.closeBtn} onClick={() => setIsTokenModalOpen(false)}>✕</button>
            </div>

            <input
              type="text"
              placeholder="Search name or paste contract address (0x...)"
              value={searchQuery}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />

            <div style={styles.tokenListContainer}>
              {customToken ? (
                <div style={styles.tokenRow} onClick={() => selectToken(customToken)}>
                  <div>
                    <div style={styles.tokenSymbol}>{customToken.symbol} (Contract Found)</div>
                    <div style={styles.tokenName}>{customToken.name}</div>
                  </div>
                  <div style={styles.tokenPrice}>${customToken.priceUsd}</div>
                </div>
              ) : filteredTokens.length > 0 ? (
                filteredTokens.map((t) => (
                  <div key={t.symbol} style={styles.tokenRow} onClick={() => selectToken(t)}>
                    <div>
                      <div style={styles.tokenSymbol}>{t.symbol}</div>
                      <div style={styles.tokenName}>{t.name}</div>
                    </div>
                    {account && <div style={styles.tokenBalance}>{balances[t.symbol] || '0.0000'}</div>}
                  </div>
                ))
              ) : (
                <div style={styles.noResults}>No token found or invalid contract address.</div>
              )}
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
  card: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '440px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  networkSelect: { backgroundColor: '#1e2029', color: '#fff', border: '1px solid #374151', padding: '8px 12px', borderRadius: '12px', fontSize: '14px', outline: 'none' },
  connectedBadge: { backgroundColor: '#1e2029', padding: '8px 12px', borderRadius: '12px', fontSize: '12px', color: '#10b981' },
  connectBtn: { backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' },
  inputGroup: { backgroundColor: '#0a0b0e', padding: '16px', borderRadius: '16px', border: '1px solid #1e2029' },
  labelRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  label: { fontSize: '12px', color: '#9ca3af' },
  balanceText: { fontSize: '12px', color: '#10b981', fontWeight: '600' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '24px', outline: 'none', width: '50%' },
  inputDisabled: { backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '24px', outline: 'none', width: '50%' },
  tokenBtn: { backgroundColor: '#1e2029', border: '1px solid #374151', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' },
  priceSubtext: { fontSize: '11px', color: '#6b7280', marginTop: '6px' },
  arrowContainer: { textAlign: 'center', margin: '12px 0', color: '#8b5cf6', fontSize: '20px' },
  swapButton: { width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'pointer' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#12131a', borderRadius: '24px', border: '1px solid #1e2029', padding: '24px', width: '90%', maxWidth: '420px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  closeBtn: { backgroundColor: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' },
  searchInput: { backgroundColor: '#0a0b0e', border: '1px solid #374151', borderRadius: '12px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', marginBottom: '16px' },
  tokenListContainer: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' },
  tokenRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', cursor: 'pointer', backgroundColor: '#141622' },
  tokenSymbol: { fontWeight: '700', fontSize: '15px' },
  tokenName: { fontSize: '12px', color: '#9ca3af' },
  tokenPrice: { fontSize: '14px', fontWeight: '600', color: '#10b981' },
  tokenBalance: { fontSize: '14px', fontWeight: '600', color: '#a78bfa' },
  noResults: { color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '20px 0' }
};
