export default function Faq() {
  // يمكنك استبدال هذا العنوان مستقبلاً بعنوان العقد الحقيقي للعملة
  const TOKEN_CONTRACT_ADDRESS = "YOUR_TOKEN_CONTRACT_ADDRESS_HERE";

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Frequently Asked Questions</h1>
      <p style={styles.subtitle}>Everything you need to know about $NEXUS tokenomics, swapping, and fees.</p>

      <div style={styles.faqList}>

        {/* Question 1: Total Supply */}
        <div style={styles.faqItem}>
          <h3 style={styles.question}>1. What is the total supply of NEXUSSWAP ($NEXUS)?</h3>
          <p style={styles.answer}>
            The total supply of <strong>$NEXUS</strong> is capped at <strong>1,000,000,000 (1 Billion)</strong> tokens. No additional tokens can ever be minted.
          </p>
        </div>

        {/* Question 2: Burn Mechanism */}
        <div style={styles.faqItem}>
          <h3 style={styles.question}>2. How does the Token Burn mechanism work?</h3>
          <p style={styles.answer}>
            NexusSwap dedicates <strong>50% of all platform revenues</strong> to purchase $NEXUS tokens directly from Decentralized Exchanges (DEXs). These bought-back tokens are immediately sent to a dead burn address (0x00...000), permanently removing them from circulation and increasing scarcity over time.
          </p>
        </div>

        {/* Question 3: Where to Trade */}
        <div style={styles.faqItem}>
          <h3 style={styles.question}>3. Where is $NEXUS currently available for trading?</h3>
          <p style={styles.answer}>
            $NEXUS is currently listed and active for trading on major <strong>Decentralized Exchanges (DEXs)</strong>. You can seamlessly swap and trade $NEXUS directly using our integrated Swap interface on the home page.
          </p>
        </div>

        {/* Question 4: Trading Fees */}
        <div style={styles.faqItem}>
          <h3 style={styles.question}>4. What are the platform transaction fees?</h3>
          <p style={styles.answer}>
            NexusSwap charges a fixed flat fee of <strong>0.03%</strong> per swap. This fee structure ensures transparent and predictable costs for all users while funding our deflationary buyback initiative.
          </p>
        </div>

        {/* Question 5: Contract Address */}
        <div style={styles.faqItem}>
          <h3 style={styles.question}>5. What is the official $NEXUS Contract Address on Robinhood Chain?</h3>
          <p style={styles.answer}>
            Below is the official token contract address deployed on Robinhood Chain:
          </p>
          <div style={styles.contractBox}>
            <span style={styles.contractLabel}>Contract Address:</span>
            <code style={styles.contractCode}>{TOKEN_CONTRACT_ADDRESS}</code>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '60px 20px',
    maxWidth: '850px',
    margin: '0 auto',
    color: '#fff',
    minHeight: '80vh',
    width: '100%',
    boxSizing: 'border-box',
  },
  mainTitle: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '12px',
    textAlign: 'center',
    background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '16px',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  faqItem: {
    backgroundColor: '#12131a',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #1e2029',
  },
  question: {
    fontSize: '18px',
    color: '#f3f4f6',
    marginBottom: '10px',
    fontWeight: '700',
  },
  answer: {
    color: '#9ca3af',
    lineHeight: '1.6',
    fontSize: '15px',
    margin: 0,
  },
  contractBox: {
    marginTop: '12px',
    backgroundColor: '#1a1b26',
    border: '1px solid #2e303e',
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    wordBreak: 'break-all',
  },
  contractLabel: {
    fontSize: '12px',
    color: '#a78bfa',
    fontWeight: '600',
  },
  contractCode: {
    fontFamily: 'monospace',
    color: '#34d399',
    fontSize: '14px',
  },
};
