import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const NETWORKS = {
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDT', name: 'Tether USD', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6 },
      { symbol: 'USDC', name: 'USD Coin', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 }
    ]
  },
  bsc: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    tokens: [
      { symbol: 'BNB', name: 'BNB Token', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDT', name: 'Tether USD', address: '0x55d398326f99059ff775485246999027b3197955', decimals: 18 },
      { symbol: 'CAKE', name: 'PancakeSwap', address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', decimals: 18 }
    ]
  },
  robinhood: {
    chainId: '0x1237',
    chainName: 'Robinhood Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
      { symbol: 'USDC', name: 'USD Coin', address: '0x123700000000000000000000000000000000usdc', decimals: 6 }
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
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      fetchRealBalances();
    }
  }, [account, selectedNetwork]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount('');
      setBalances({});
    }
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (err) {
        console.error('Connection check failed:', err);
      }
    }
  };

  const fetchRealBalances = async () => {
    if (!window.ethereum || !account) return;
    setIsFetching(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const tokens = NETWORKS[selectedNetwork].tokens;
      const realBalances = {};

      for (const token of tokens) {
        if (token.address === '0x0000000000000000000000000000000000000000') {
          try {
            const rawBalance = await provider.getBalance(account);
            realBalances[token.symbol] = parseFloat(ethers.formatEther(rawBalance)).toFixed(4);
          } catch (e) {
            realBalances[token.symbol] = '0.0000';
          }
        } else {
          try {
            const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
            const rawBalance = await contract.balanceOf(account);
            const formatted = ethers.formatUnits(rawBalance, token.decimals);
            realBalances[token.symbol] = parseFloat(formatted).toFixed(4);
          } catch (e) {
            realBalances[token.symbol] = '0.0000';
          }
        }
      }

      setBalances(realBalances);
    } catch (err) {
      console.error('Error fetching balances:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accs.length) setAccount(accs[0]);
      } catch (err) {
        console.error('Wallet connection rejected:', err);
      }
    } else {
      alert('الرجاء تثبيت محفظة MetaMask لتكمن من الاتصال.');
    }
  };

  const renderBalance = (symbol) => {
    if (!account) return null;
    if (isFetching && !balances[symbol]) return 'جاري التحميل...';
    return balances[symbol] !== undefined ? balances[symbol] : '0.0000';
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NexusSwap Protocol</h1>
        <p style={styles.subtitle}>On-Chain Token Swap & Live Balances</p>
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
            <option value="robinhood">🏹 Robinhood Chain</option>
          </select>

          {account ? (
            <span style={styles.connectedBadge}>
              🟢 {account.substring(0, 4)}...{account.substring(account.length - 4)}
            </span>
          ) : (
            <button onClick={connectWallet} style={styles.connectBtn}>
              Connect
            </button>
          )}
        </div>

        {/* Paying Section */}
        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Pay</label>
            {account && <span style={styles.balanceText}>Balance: {renderBalance(fromToken.symbol)}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <select 
              value={fromToken.symbol} 
              onChange={(e) => setFromToken(NETWORKS[selectedNetwork].tokens.find(t => t.symbol === e.target.value))}
              style={styles.select}
            >
              {NETWORKS[selectedNetwork].tokens.map(t => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.arrowContainer}>↓</div>

        {/* Receiving Section */}
        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Receive</label>
            {account && <span style={styles.balanceText}>Balance: {renderBalance(toToken.symbol)}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={estimatedReceive}
              disabled
              style={styles.inputDisabled}
            />
            <select 
              value={toToken.symbol} 
              onChange={(e) => setToToken(NETWORKS[selectedNetwork].tokens.find(t => t.symbol === e.target.value))}
              style={styles.select}
            >
              {NETWORKS[selectedNetwork].tokens.map(t => (
                <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={() => !account ? connectWallet() : alert("Processing Swap...")} 
          style={styles.swapButton}
        >
          {!account ? 'Connect Wallet' : 'Swap'}
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
  select: { backgroundColor: '#1e2029', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600' },
  arrowContainer: { textAlign: 'center', margin: '12px 0', color: '#8b5cf6', fontSize: '20px' },
  swapButton: { width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'pointer' }
};
