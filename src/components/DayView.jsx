import { useEffect, useRef } from 'react';
import EventCard from './EventCard';

// Approximate sticky header height — update if header layout changes
const HEADER_HEIGHT = 100;

export default function DayView({ day, dayIndex, totalDays, completedEvents, onToggleComplete, onBack, onPrev, onNext }) {
  const isFirst = dayIndex === 0;
  const isLast  = dayIndex === totalDays - 1;

  const firstRender = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: firstRender.current ? 'instant' : 'smooth' });
    firstRender.current = false;
  }, [day.id]);

  return (
    <div style={s.page}>
      {/* Sticky day nav bar */}
      <div style={{ ...s.navBar, top: HEADER_HEIGHT }}>
        <button style={s.navBtn} onClick={onBack} aria-label="Back to summary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          <span style={s.navBtnLabel}>All days</span>
        </button>

        <div style={s.navCentre}>
          <span style={s.navDayLabel}>{day.dayLabel}</span>
          <span style={s.navDayDate}>{day.date}</span>
        </div>

        <div style={s.navArrows}>
          <button
            style={{ ...s.arrowBtn, ...(isFirst ? s.arrowBtnDisabled : {}) }}
            onClick={onPrev}
            disabled={isFirst}
            aria-label="Previous day"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            style={{ ...s.arrowBtn, ...(isLast ? s.arrowBtnDisabled : {}) }}
            onClick={onNext}
            disabled={isLast}
            aria-label="Next day"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Event list */}
      <div style={s.eventList}>
        {day.events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isCompleted={completedEvents.has(event.id)}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
}

const s = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  navBar: {
    position: 'sticky',
    zIndex: 50,
    background: 'var(--surface-low)',
    borderBottom: '1px solid var(--outline-variant)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    gap: 8,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: 'var(--primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '6px 4px',
    flexShrink: 0,
  },
  navBtnLabel: {
    display: 'inline',
  },
  navCentre: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1,
    flex: 1,
    minWidth: 0,
  },
  navDayLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--tertiary)',
  },
  navDayDate: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 600,
    fontStyle: 'italic',
    color: 'var(--on-surface)',
    lineHeight: 1.1,
  },
  navArrows: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '1px solid var(--outline-variant)',
    background: 'var(--surface-lowest)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--on-surface)',
  },
  arrowBtnDisabled: {
    opacity: 0.3,
    cursor: 'default',
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '16px 12px 36px',
    maxWidth: 640,
    width: '100%',
    margin: '0 auto',
  },
};
