import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ItineraryView from './components/ItineraryView';

const SESSION_KEY = 'itinerary_auth';

function InstallBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on iOS Safari where there's no automatic install prompt
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandaloneMode = window.navigator.standalone === true;
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (isIOS && !isInStandaloneMode && !dismissed) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div style={bs.banner}>
      <div style={bs.content}>
        <span style={bs.icon}>⬆</span>
        <p style={bs.text}>
          Add to Home Screen for offline access — tap <strong>Share</strong> then <strong>Add to Home Screen</strong>
        </p>
      </div>
      <button style={bs.close} onClick={() => { localStorage.setItem('pwa-banner-dismissed', '1'); setShow(false); }}>✕</button>
    </div>
  );
}

const bs = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    background: '#163526',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  icon: {
    fontSize: 20,
    flexShrink: 0,
  },
  text: {
    fontFamily: 'Manrope, system-ui, sans-serif',
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  },
  close: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    flexShrink: 0,
    padding: '4px 8px',
  },
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  const handleLogin = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn
        ? <ItineraryView onLogout={handleLogout} />
        : <LoginPage onLogin={handleLogin} />}
      <InstallBanner />
    </>
  );
}
