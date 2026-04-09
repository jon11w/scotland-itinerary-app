import { useState } from 'react';
import { itinerary, TRIP_CONFIG } from '../data/itinerary';
import SummaryView from './SummaryView';
import DayView from './DayView';

function loadCompleted() {
  try {
    const stored = localStorage.getItem('itinerary-completed');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch { return new Set(); }
}

export default function ItineraryView({ onLogout }) {
  const [completed, setCompleted]           = useState(loadCompleted);
  const [view, setView]                     = useState('summary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(null);

  const toggleComplete = (eventId) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId); else next.add(eventId);
      try { localStorage.setItem('itinerary-completed', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const handleSelectDay = (index) => {
    setSelectedDayIndex(index);
    setView('day');
  };

  const handleBack = () => {
    setView('summary');
    setSelectedDayIndex(null);
  };

  const handlePrevDay = () => setSelectedDayIndex(i => Math.max(0, i - 1));
  const handleNextDay = () => setSelectedDayIndex(i => Math.min(itinerary.length - 1, i + 1));

  const totalStops = itinerary.reduce((sum, day) => sum + day.events.length, 0);
  const selectedDay = selectedDayIndex !== null ? itinerary[selectedDayIndex] : null;

  return (
    <div style={s.page}>

      {/* Sticky header */}
      <header style={s.header}>
        <div style={s.headerBg} />
        <div style={s.headerInner}>
          <div style={{ minWidth: 0 }}>
            <p style={s.eyebrow}>✦ Your itinerary</p>
            <h1 style={s.title}>{TRIP_CONFIG.title}</h1>
          </div>
          <button style={s.logoutBtn} onClick={onLogout}>Sign out</button>
        </div>
        <div style={s.summaryRow}>
          <span style={s.summaryItem}><strong style={s.summaryNum}>{itinerary.length}</strong> days</span>
          <span style={s.summaryDot}>·</span>
          <span style={s.summaryItem}><strong style={s.summaryNum}>{totalStops}</strong> stops</span>
          <span style={s.summaryDot}>·</span>
          <span style={s.summaryDest}>{TRIP_CONFIG.destination}</span>
        </div>
        <div style={s.tartanStripe} />
      </header>

      <main style={s.main}>
        {view === 'summary' && (
          <SummaryView
            days={itinerary}
            completedEvents={completed}
            onSelectDay={handleSelectDay}
          />
        )}
        {view === 'day' && selectedDay && (
          <DayView
            day={selectedDay}
            dayIndex={selectedDayIndex}
            totalDays={itinerary.length}
            completedEvents={completed}
            onToggleComplete={toggleComplete}
            onBack={handleBack}
            onPrev={handlePrevDay}
            onNext={handleNextDay}
          />
        )}
      </main>

      {view === 'summary' && (
        <footer style={s.footer}>
          <p style={s.footerText}>Tap a day to view your itinerary</p>
        </footer>
      )}
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface)',
    overflowX: 'hidden',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    overflow: 'hidden',
    width: '100%',
  },
  headerBg: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(22,53,38,0.92)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  headerInner: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '18px 22px 10px',
    gap: 12,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(20px, 5vw, 28px)',
    fontWeight: 600,
    fontStyle: 'italic',
    color: '#ffffff',
    lineHeight: 1.2,
  },
  logoutBtn: {
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    padding: '6px 14px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(8px)',
    cursor: 'pointer',
    flexShrink: 0,
    marginTop: 2,
    letterSpacing: '0.03em',
  },
  summaryRow: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 22px 14px',
  },
  summaryItem: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: 300,
  },
  summaryNum: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontStyle: 'italic',
  },
  summaryDot: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
  },
  summaryDest: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.04em',
  },
  tartanStripe: {
    position: 'relative',
    height: 5,
    background: 'var(--tartan-overlay), rgba(255,255,255,0.06)',
  },
  main: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  footer: {
    padding: '16px 16px 36px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 11,
    color: 'var(--on-surface-faint)',
    letterSpacing: '0.04em',
  },
};
