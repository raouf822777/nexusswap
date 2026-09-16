import React, { useState, useEffect } from 'react';

const NETWORKS = {
  robinhood: {
    chainId: '0x1237',
    chainName: 'Robinhood Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
    blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
    icon: '🏹',
    tokens: ['ETH', 'USDC', 'HOOD', 'WBTC', 'USDT']
  },
  bsc: {
    chainId: '0x38',
    chainName: 'BNB Smart Chain',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
    icon: '🟡',
    tokens: ['BNB', 'USDT', 'USDC', 'CAKE', 'BUSD']
  },
  base: {
    chainId: '0x2105',
    chainName: 'Base Network',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://mainnet.base.org'],
    blockExplorerUrls: ['https://basescan.org'],
    icon: '🔵',
    tokens: ['ETH', 'USDC', 'TOSHI', 'AERO', 'DAI']
  },
  ethereum: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://eth.llamarpc.com'],
    blockExplorerUrls: ['https://etherscan.io'],
    icon: '💎',
    tokens: ['ETH', 'USDT', 'USDC', 'WBTC', 'UNI']
  }
};

export default function Home() {
  const [account, setAccount] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('robinhood');
  const [tokenList, setTokenList] = useState(NETWORKS['robinhood'].tokens);
  const [balances, setBalances] = useState({});
  const [fromToken, setFromToken] = useState(NETWORKS['robinhood'].tokens[0]);
  const [toToken, setToToken] = useState(NETWORKS['robinhood'].tokens[1]);
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [swapStatus, setSwapStatus] = useState('');

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    if (account) {
      fetchTokenBalances();
    } else {
      setTokenList(NETWORKS[selectedNetwork].tokens);
    }
  }, [account, selectedNetwork]);

  // جلب الأرصدة وترتيب العملات حسب الرصيد
  const fetchTokenBalances = async () => {
    if (!window.ethereum || !account) return;

    try {
      const netTokens = NETWORKS[selectedNetwork].tokens;
      const detectedBalances = {};

      // قراءة رصيد العملة الأساسية (ETH/BNB)
      const nativeBalanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest'],
      });

      const nativeEth = (parseInt(nativeBalanceHex, 16) / 1e18).toFixed(4);
      const nativeSymbol = NETWORKS[selectedNetwork].nativeCurrency.symbol;
      detectedBalances[nativeSymbol] = parseFloat(nativeEth);

      // إنشاء أرصدة عشوائية/تجريبية لباقي الـ Tokens للمعاينة
      netTokens.forEach((t) => {
        if (t !== nativeSymbol) {
          detectedBalances[t] = detectedBalances[t] !== undefined ? detectedBalances[t] : (Math.random() > 0.5 ? (Math.random() * 50).toFixed(2) : 0);
        }
      });

      setBalances(detectedBalances);

      // فرز القائمة: العملات ذات الرصيد الأكبر في المقدمة
      const sortedTokens = [...netTokens].sort((a, b) => {
        const balA = parseFloat(detectedBalances[a] || 0);
        const balB = parseFloat(detectedBalances[b] || 0);
        return balB - balA;
      });

      setTokenList(sortedTokens);
      setFromToken(sortedTokens[0]);
      setToToken(sortedTokens[1] || sortedTokens[0]);
    } catch (err) {
      console.error('Error fetching balances:', err);
    }
  };

  const handleNetworkChange = async (netKey) => {
    setSelectedNetwork(netKey);
    const net = NETWORKS[netKey];

    if (window.ethereum && account) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: net.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: net.chainId,
                chainName: net.chainName,
                nativeCurrency: net.nativeCurrency,
                rpcUrls: net.rpcUrls,
                blockExplorerUrls: net.blockExplorerUrls
              }],
            });
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        }
      }
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
        console.error(err);
      }
    }
  };

  const executeSwap = async () => {
    if (!account) {
      setIsModalOpen(true);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount to swap.');
      return;
    }

    setSwapping(true);
    setSwapStatus('Checking network and confirming transaction in wallet...');

    try {
      const net = NETWORKS[selectedNetwork];

      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: net.chainId }],
          });
        } catch (err) {
          // Switch network error
        }

        const txParams = {
          from: account,
          to: account,
          value: '0x0',
        };

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });

        setSwapStatus(`Transaction submitted successfully! Hash: ${txHash.substring(0, 10)}...`);
      }
    } catch (err) {
      console.error(err);
      setSwapStatus('Transaction cancelled or an error occurred during swap.');
    } finally {
      setTimeout(() => setSwapping(false), 4000);
    }
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NexusSwap Protocol</h1>
        <p style={styles.subtitle}>Cross-Chain Multi-Network Swap</p>
      </div>

      <div style={styles.card}>
        <div style={styles.topBar}>
          <select 
            value={selectedNetwork} 
            onChange={(e) => handleNetworkChange(e.target.value)}
            style={styles.networkSelect}
          >
            <option value="robinhood">🏹 Robinhood Chain (ID: 4663)</option>
            <option value="bsc">🟡 BNB Smart Chain (ID: 56)</option>
            <option value="base">🔵 Base Network (ID: 8453)</option>
            <option value="ethereum">💎 Ethereum Mainnet (ID: 1)</option>
          </select>

          {account ? (
            <span style={styles.connectedBadge}>
              🟢 {account.substring(0, 4)}...{account.substring(account.length - 4)}
            </span>
          ) : (
            <button onClick={() => setIsModalOpen(true)} style={styles.connectBtn}>
              Connect
            </button>
          )}
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Pay ({NETWORKS[selectedNetwork].chainName})</label>
            {account && <span style={styles.balanceText}>Balance: {balances[fromToken] || 0}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={styles.input}
            />
            <select value={fromToken} onChange={(e) => setFromToken(e.target.value)} style={styles.select}>
              {tokenList.map((token) => (
                <option key={token} value={token}>
                  {token} {balances[token] ? `(${balances[token]})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.arrowContainer}>↓</div>

        <div style={styles.inputGroup}>
          <div style={styles.labelRow}>
            <label style={styles.label}>You Receive (Estimated)</label>
            {account && <span style={styles.balanceText}>Balance: {balances[toToken] || 0}</span>}
          </div>
          <div style={styles.row}>
            <input
              type="number"
              placeholder="0.0"
              value={amount ? (parseFloat(amount) * 0.998).toFixed(4) : ''}
              disabled
              style={styles.inputDisabled}
            />
            <select value={toToken} onChange={(e) => setToToken(e.target.value)} style={styles.select}>
              {tokenList.map((token) => (
                <option key={token} value={token}>
                  {token} {balances[token] ? `(${balances[token]})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {swapStatus && (
          <p style={styles.statusText}>{swapStatus}</p>
        )}

        <button 
          onClick={executeSwap} 
          disabled={swapping}
          style={swapping ? styles.swapButtonDisabled : styles.swapButton}
        >
          {swapping ? 'Processing...' : !account ? 'Connect Wallet' : `Swap ${fromToken} to ${toToken}`}
        </button>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Connect Wallet</h3>
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div style={styles.walletList}>
              <div style={styles.walletItem} onClick={connectWallet}>
                <span style={styles.walletName}>🦊 MetaMask / EVM Wallet</span>
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
  select: { backgroundColor: '#1e2029', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  arrowContainer: { textAlign: 'center', margin: '12px 0', color: '#8b5cf6', fontSize: '20px' },
  swapButton: { width: '100%', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'pointer' },
  swapButtonDisabled: { width: '100%', backgroundColor: '#4b5563', color: '#9ca3af', border: 'none', padding: '16px', borderRadius: '16px', fontSize: '16px', fontWeight: '700', marginTop: '20px', cursor: 'not-allowed' },
  statusText: { color: '#34d399', fontSize: '13px', marginTop: '12px', textAlign: 'center' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#12131a', borderRadius: '24px', border: '1px solid #1e2029', padding: '24px', width: '90%', maxWidth: '400px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '18px', fontWeight: '700', margin: 0 },
  closeBtn: { backgroundColor: 'transparent', border: 'none', color: '#9ca3af', fontSize: '18px', cursor: 'pointer' },
  walletList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  walletItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: '#1a1b23', borderRadius: '16px', cursor: 'pointer' },
  walletName: { fontSize: '15px', fontWeight: '600', color: '#fff' }
};
