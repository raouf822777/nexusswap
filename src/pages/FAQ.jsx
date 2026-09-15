import React from 'react';

export default function FAQ() {
  const faqs = [
    { q: "What is NexusSwap?", a: "NexusSwap is a multi-chain aggregator allowing you to swap tokens across different blockchains directly from your wallet." },
    { q: "Are there extra platform fees?", a: "NexusSwap routes your transactions with zero hidden markup fees beyond network gas and standard bridge fees." },
    { q: "Which wallets are supported?", a: "We support MetaMask, WalletConnect, Coinbase Wallet, Rabby, Trust Wallet, and all major Web3 mobile wallets." },
    { q: "What should I do if a transaction is delayed?", a: "Cross-chain bridge transactions depend on network congestion. You can track your transaction status via the route detail link provided in the widget." }
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Frequently Asked Questions</h1>
      <div style={styles.faqList}>
        {faqs.map((item, index) => (
          <div key={index} style={styles.faqCard}>
            <h3 style={styles.question}>{item.q}</h3>
            <p style={styles.answer}>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '60px 20px', maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '36px', fontWeight: '800', marginBottom: '40px', textAlign: 'center' },
  faqList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  faqCard: { backgroundColor: '#12131a', border: '1px solid #1e2029', borderRadius: '16px', padding: '24px' },
  question: { fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#8b5cf6' },
  answer: { color: '#9ca3af', lineHeight: '1.6', margin: 0 }
};
