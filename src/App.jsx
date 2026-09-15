import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, arbitrum, optimism, polygon, bsc, avalanche } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

import Home from './pages/Home';

const projectId = '981d7ff2b198243ccba4376e145e52ae';

const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum, optimism, polygon, bsc, avalanche],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
  },
});

const queryClient = new QueryClient();

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <span style={styles.logoIcon}>⚡</span>
        <span style={styles.logoText}>NexusSwap</span>
      </div>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Swap</Link>
        <Link to="/burn" style={styles.link}>Burn</Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>© 2026 NexusSwap. All rights reserved.</p>
    </footer>
  );
}

function BurnPage() {
  return (
    <div style={styles.burnContainer}>
      <h2>Token Burn Portal</h2>
      <p style={styles.burnSubText}>Burn your tokens safely across supported chains.</p>
      <div style={styles.burnCard}>
        <p>Token Burn interface is under scheduled maintenance or ready for action.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div style={styles.appContainer}>
            <Navbar />
            <div style={styles.content}>
              <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/burn" element={<BurnPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#0a0b0e',
    color: '#ffffff',
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#12131a',
    borderBottom: '1px solid #1e2029',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px',
  },
  burnContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
  },
  burnSubText: {
    color: '#9ca3af',
    marginBottom: '30px',
  },
  burnCard: {
    backgroundColor: '#12131a',
    border: '1px solid #1e2029',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#0a0b0e',
    borderTop: '1px solid #1e2029',
  },
  footerText: {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0,
  },
};
