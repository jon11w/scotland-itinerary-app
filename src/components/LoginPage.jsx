import { useState } from 'react';
import { AUTH, TRIP_CONFIG } from '../data/itinerary';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (username === AUTH.username && password === AUTH.password) {
        onLogin();
      } else {
        setError('Incorrect username or password.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={s.page}>
      {/* Full-bleed hero */}
      <div style={s.hero}>
        <img src={TRIP_CONFIG.coverImage} alt="" style={s.heroImg} />
        <div style={s.heroGradient} />
        {/* Tartan accent edge at bottom */}
        <div style={s.tartanEdge} />
        <div style={s.heroContent}>
          <p style={s.eyebrow}>Private itinerary</p>
          <h1 style={s.heroTitle}>{TRIP_CONFIG.title}</h1>
          <p style={s.heroSub}>{TRIP_CONFIG.subtitle}</p>
        </div>
      </div>

      {/* Overlapping login card */}
      <div style={s.cardWrap}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>Sign in to continue</h2>

          <form onSubmit={handleSubmit} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                style={{ ...s.input, ...(focusedField === 'username' ? s.inputFocused : {}) }}
                placeholder="your username"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Password</label>
              <div style={s.passwordWrap}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{ ...s.input, ...s.passwordInput, ...(focusedField === 'password' ? s.inputFocused : {}) }}
                  placeholder="your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={s.eyeBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={s.errorBox}>
                <span style={s.errorText}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={s.dest}>{TRIP_CONFIG.destination}</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--surface)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hero: {
    position: 'relative',
    width: '100%',
    height: 'clamp(260px, 55vw, 380px)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 30%',
  },
  heroGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(22,53,38,0.2) 0%, rgba(22,53,38,0.72) 100%)',
  },
  tartanEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    background: 'var(--tartan-overlay), var(--primary)',
    opacity: 0.6,
  },
  heroContent: {
    position: 'absolute',
    bottom: 36,
    left: 28,
    right: 28,
  },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 7vw, 44px)',
    fontWeight: 600,
    fontStyle: 'italic',
    color: '#ffffff',
    lineHeight: 1.1,
    marginBottom: 8,
  },
  heroSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: '0.02em',
  },
  cardWrap: {
    width: '100%',
    maxWidth: 440,
    padding: '0 20px 48px',
    marginTop: -32,
    position: 'relative',
    zIndex: 10,
  },
  card: {
    background: 'var(--surface-lowest)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px 28px 28px',
    boxShadow: 'var(--shadow-float)',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 400,
    color: 'var(--on-surface)',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--on-surface-muted)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '11px 0 10px',
    border: 'none',
    borderBottom: '1.5px solid var(--outline-variant)',
    borderRadius: 0,
    fontSize: 15,
    color: 'var(--on-surface)',
    background: 'transparent',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputFocused: {
    borderBottomColor: 'var(--primary)',
  },
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    paddingRight: 32,
  },
  eyeBtn: {
    position: 'absolute',
    right: 0,
    bottom: 10,
    color: 'var(--on-surface-faint)',
    padding: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  errorBox: {
    background: 'var(--error-container)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
  },
  errorText: {
    fontSize: 13,
    color: 'var(--error)',
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)',
    color: 'var(--on-primary)',
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.04em',
    transition: 'opacity 0.15s, transform 0.1s',
    cursor: 'pointer',
    marginTop: 4,
    boxShadow: '0 4px 16px rgba(22,53,38,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  dest: {
    marginTop: 20,
    fontSize: 11,
    color: 'var(--on-surface-faint)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
};
