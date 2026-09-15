import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import About from './pages/About';
import Faq from './pages/Faq';
import Burn from './pages/Burn';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={styles.pageWrapper}>
          
          {/* Header Navigation */}
          <header style={styles.header}>
            <Link to="/" style={styles.logoContainer}>
              <span style={styles.logoIcon}>⚡</span>
              <span style={styles.logoText}>NexusSwap</span>
            </Link>
            <nav style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>Swap</Link>
              <Link to="/burn" style={styles.burnNavLink}>🔥 Burn</Link>
              <Link to="/about" style={styles.navLink}>About</Link>
              <Link to="/faq" style={styles.navLink}>FAQ</Link>
            </nav>
          </header>

          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/burn" element={<Burn />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>

          {/* Footer */}
          <footer style={styles.footer}>
            <p>© {new Date().getFullYear()} NexusSwap. All rights reserved.</p>
          </footer>

        </div>
      </Router>
    </QueryClientProvider>
  );
}

const styles = {
  pageWrapper: {
    backgroundColor: '#0a0b0e',
    color: '#ffffff',
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    direction: 'ltr',
    overflowX: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 5%',
    borderBottom: '1px solid #1a1c23',
    backdropFilter: 'blur(10px)',
    width: '100%',
    boxSizing: 'border-box',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'color 0.2s',
  },
  burnNavLink: {
    color: '#f87171',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '15px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    borderTop: '1px solid #1a1c23',
    color: '#6b7280',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
};