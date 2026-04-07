import EventCard from './EventCard';

export default function DaySection({ day, isActive, onClick, completedEvents, onToggleComplete }) {
  const completedCount = day.events.filter(e => completedEvents.has(e.id)).length;
  const allDone = completedCount === day.events.length;

  return (
    <section style={s.section}>
      <button style={s.header} onClick={onClick}>
        <div style={s.headerLeft}>
          <span style={s.dayLabel}>{day.dayLabel}</span>
          <h2 style={s.dayDate}>{day.date}</h2>
        </div>
        <div style={s.headerRight}>
          <span style={{ ...s.stopCount, ...(allDone ? s.stopCountDone : {}) }}>
            {completedCount > 0 ? `${completedCount}/${day.events.length}` : `${day.events.length} stops`}
          </span>
          <span style={{ ...s.chevron, transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </div>
      </button>

      {isActive && (
        <div style={s.body}>
          {day.events.map((event) => (
            <div key={event.id} style={s.row}>
              <div style={s.cardWrapper}>
                <EventCard
                  event={event}
                  isCompleted={completedEvents.has(event.id)}
                  onToggleComplete={onToggleComplete}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const s = {
  section: {
    background: '#ebe1cc',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-ambient)',
    minWidth: 0,
    width: '100%',
  },
  header: {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 22px',
    cursor: 'pointer',
    background: 'transparent',
    textAlign: 'left',
    gap: 12,
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
    overflow: 'hidden',
  },
  dayLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--tertiary)',
  },
  dayDate: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    fontWeight: 600,
    fontStyle: 'italic',
    color: 'var(--on-surface)',
    lineHeight: 1.15,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  stopCount: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    color: 'var(--on-surface-muted)',
    background: 'var(--surface)',
    padding: '3px 10px',
    borderRadius: 999,
  },
  chevron: {
    color: 'var(--on-surface-faint)',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.25s ease',
  },
  body: {
    padding: '20px 16px 20px 18px',
    background: 'var(--surface-lowest)',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    width: '100%',
  },
  row: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    minWidth: 0,
    width: '100%',
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 14,
    minWidth: 0,
  },
  stopCountDone: {
    color: 'var(--primary)',
    background: 'rgba(22,53,38,0.08)',
  },
};
