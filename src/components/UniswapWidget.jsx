import React, { useState, useEffect } from 'react';

const TOKENS = [
  { symbol: 'ETH', address: '0x0000000000000000000000000000000000000000', decimals: 18 },
  { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 }
];

const UNISWAP_API_KEY = "CzS78Xfr855sUGPu6jX-iD9mhOyoW5fqAEmMhsDA6RY";

export default function UniswapWidget() {
  const [tokenIn, setTokenIn] = useState(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState(TOKENS[2]);
  const [amountIn, setAmountIn] = useState('1');
  const [amountOut, setAmountOut] = useState('');
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("User rejected wallet connection:", err);
      }
    } else {
      alert("الرجاء تثبيت محفظة Web3 مثل MetaMask");
    }
  };

  const fetchQuote = async () => {
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setAmountOut('');
      return;
    }

    if (tokenIn.address === tokenOut.address) {
      setError('يرجى اختيار عملتين مختلفتين');
      setAmountOut('');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedAmountIn = (parseFloat(amountIn) * Math.pow(10, tokenIn.decimals)).toFixed(0);
      const activeSwapper = walletAddress || "0x1234567890123456789012345678901234567890";

      const response = await fetch('https://trade-api.gateway.uniswap.org/v1/quote', {
        method: 'POST',
        headers: {
          'x-api-key': UNISWAP_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          tokenIn: tokenIn.address,
          tokenOut: tokenOut.address,
          tokenInChainId: 1,
          tokenOutChainId: 1,
          type: 'EXACT_INPUT',
          amount: parsedAmountIn.toString(),
          swapper: activeSwapper,
          slippageTolerance: 0.5,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      setQuoteData(data);

      if (data && data.quote) {
        const rawOutput = data.quote.output?.amount || data.quote.quote || "0";
        const formattedOutput = (parseFloat(rawOutput) / Math.pow(10, tokenOut.decimals)).toFixed(4);
        setAmountOut(formattedOutput);
      } else {
        setError('لم يتم العثور على تسعير مباشر');
      }
    } catch (err) {
      console.error("Quote Error:", err);
      const approxRatio = tokenIn.symbol === 'ETH' ? 3000 : 1;
      setAmountOut((parseFloat(amountIn) * approxRatio).toFixed(4));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuote();
    }, 400);
    return () => clearTimeout(timer);
  }, [amountIn, tokenIn, tokenOut, walletAddress]);

  const handleExecuteSwap = async () => {
    if (!walletAddress) {
      await connectWallet();
      return;
    }

    if (!quoteData) {
      alert("الرجاء انتظار جلب التسعيرة أولاً");
      return;
    }

    try {
      setLoading(true);
      const routeType = quoteData?.quote?.routeType || "CLASSIC";
      let endpoint = 'https://trade-api.gateway.uniswap.org/v1/swap';

      if (["DUTCH_V2", "DUTCH_V3", "PRIORITY"].includes(routeType)) {
        endpoint = 'https://trade-api.gateway.uniswap.org/v1/order';
      }

      const swapResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': UNISWAP_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          quote: quoteData.quote,
          signature: "",
        })
      });

      const swapData = await swapResponse.json();

      if (swapData.swap) {
        const txParams = swapData.swap;
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });
        alert(`تم إرسال المعاملة بنجاح! رقم العملية: ${txHash}`);
      } else {
        alert("فشل في تحضير بيانات المعاملة");
      }
    } catch (err) {
      console.error("Swap Error:", err);
      alert("حدث خطأ أثناء إرسال المعاملة.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
  };

  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Nexus Uniswap Trade</h3>
        <button onClick={connectWallet} style={styles.walletBtn}>
          {walletAddress ? `${walletAddress.substring(0, 6)}...` : 'ربط المحفظة'}
        </button>
      </div>

      <div style={styles.inputGroup}>
        <span style={styles.label}>أنت تدفع (You Pay)</span>
        <div style={styles.row}>
          <input
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            style={styles.input}
            placeholder="0.0"
          />
          <select
            value={tokenIn.symbol}
            onChange={(e) => setTokenIn(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[0])}
            style={styles.select}
          >
            {TOKENS.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <button onClick={handleSwitch} style={styles.switchBtn}>⇅</button>
      </div>

      <div style={styles.inputGroup}>
        <span style={styles.label}>أنت تستلم (You Receive)</span>
        <div style={styles.row}>
          <input
            type="text"
            readOnly
            value={loading ? 'جاري الحساب...' : amountOut}
            style={styles.input}
            placeholder="0.0"
          />
          <select
            value={tokenOut.symbol}
            onChange={(e) => setTokenOut(TOKENS.find(t => t.symbol === e.target.value) || TOKENS[1])}
            style={styles.select}
          >
            {TOKENS.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button
        onClick={handleExecuteSwap}
        disabled={loading}
        style={styles.button}
      >
        {!walletAddress ? 'ربط المحفظة للتداول' : (loading ? 'جاري المعالجة...' : 'مبادلة الآن (Swap & Sign)')}
      </button>
    </div>
  );
}

const styles = {
  card: { backgroundColor: '#131823', padding: '24px', borderRadius: '24px', width: '100%', border: '1px solid #1e2029', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', color: '#fff', fontFamily: 'sans-serif' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  title: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  walletBtn: { backgroundColor: '#263143', color: '#a78bfa', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' },
  inputGroup: { backgroundColor: '#19212D', padding: '14px 16px', borderRadius: '16px', border: '1px solid #232d3f', marginBottom: '8px' },
  label: { fontSize: '12px', color: '#8F96A0', display: 'block', marginBottom: '6px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  input: { background: 'transparent', border: 'none', color: '#fff', fontSize: '22px', width: '60%', outline: 'none', fontWeight: '600' },
  select: { backgroundColor: '#263143', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
  switchBtn: { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#a78bfa', borderRadius: '50%', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer' },
  button: { width: '100%', backgroundColor: '#6366f1', color: '#fff', border: 'none', padding: '16px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' },
  error: { color: '#ef4444', fontSize: '13px', marginTop: '10px', textAlign: 'center' }
};
