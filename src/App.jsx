import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, arbitrum, optimism, polygon, bsc, avalanche } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

import Home from './pages/Home';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Burn from './pages/Burn';

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
      <Link to="/" style={styles.logoContainer}>
        <span style={styles.logoIcon}>⚡</span>
        <span style={styles.logoText}>NexusSwap</span>
      </Link>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.link}>Swap</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/faq" style={styles.link}>FAQ</Link>
        <Link to="/burn" style={styles.link}>Burn 🔥</Link>
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
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/burn" element={<Burn />} />
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
  content: { flex: 1, display: 'flex', flexDirection: 'column' },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#12131a',
    borderBottom: '1px solid #1e2029',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoIcon: { fontSize: '24px' },
  logoText: {
    fontSize: '20px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#9ca3af', textDecoration: 'none', fontWeight: '500', fontSize: '15px' },
  footer: { textAlign: 'center', padding: '20px', backgroundColor: '#0a0b0e', borderTop: '1px solid #1e2029' },
  footerText: { color: '#6b7280', fontSize: '14px', margin: 0 },
};
