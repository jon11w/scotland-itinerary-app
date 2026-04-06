import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import ItineraryView from './components/ItineraryView';

const SESSION_KEY = 'itinerary_auth';

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

  return isLoggedIn
    ? <ItineraryView onLogout={handleLogout} />
    : <LoginPage onLogin={handleLogin} />;
}
