export default function SummaryView({ days, completedEvents, onSelectDay }) {
  return (
    <div style={s.list}>
      {days.map((day, index) => {
        const completedCount = day.events.filter(e => completedEvents.has(e.id)).length;
        const total    = day.events.length;
        const allDone  = completedCount === total;
        const inProgress = completedCount > 0 && !allDone;

        const highlights = day.events
          .filter(e => e.type !== 'departure' && e.type !== 'arrival')
          .slice(0, 3)
          .map(e => e.name);
        const summary = highlights.length
          ? highlights.join(' · ')
          : day.events.slice(0, 2).map(e => e.name).join(' · ');

        return (
          <button key={day.id} style={s.card} onClick={() => onSelectDay(index)}>
            {/* Tartan strip */}
            <div style={s.tartanStrip} />

            <div style={s.cardInner}>
              <div style={s.cardLeft}>
                <span style={s.dayLabel}>{day.dayLabel}</span>
                <h2 style={{ ...s.dayDate, ...(allDone ? s.dayDateDone : {}) }}>{day.date}</h2>
                <p style={s.highlights}>{summary}</p>
              </div>
              <div style={s.cardRight}>
                <span style={{ ...s.pill, ...(allDone ? s.pillDone : inProgress ? s.pillProgress : {}) }}>
                  {allDone ? '✓' : completedCount > 0 ? `${completedCount}/${total}` : `${total} stops`}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--on-surface-faint)', flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

const s = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '20px 16px 36px',
    maxWidth: 640,
    width: '100%',
    margin: '0 auto',
  },
  card: {
    background: 'var(--surface-lowest)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-ambient)',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  tartanStrip: {
    height: 6,
    backgroundColor: '#3d7a58',
    backgroundImage: [
      'repeating-linear-gradient(0deg,' +
        'rgba(61,122,88,0.55) 0px,rgba(61,122,88,0.55) 18px,' +
        'rgba(30,30,30,0.55) 18px,rgba(30,30,30,0.55) 24px,' +
        'rgba(160,40,40,0.55) 24px,rgba(160,40,40,0.55) 28px,' +
        'rgba(30,30,30,0.55) 28px,rgba(30,30,30,0.55) 34px,' +
        'rgba(61,122,88,0.55) 34px,rgba(61,122,88,0.55) 52px)',
      'repeating-linear-gradient(90deg,' +
        '#3d7a58 0px,#3d7a58 18px,' +
        '#1e1e1e 18px,#1e1e1e 24px,' +
        '#a02828 24px,#a02828 28px,' +
        '#1e1e1e 28px,#1e1e1e 34px,' +
        '#3d7a58 34px,#3d7a58 52px)',
    ].join(','),
    flexShrink: 0,
  },
  cardInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px 18px',
    gap: 12,
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
    flex: 1,
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
  dayDateDone: {
    color: 'var(--on-surface-muted)',
  },
  highlights: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 400,
    color: 'var(--on-surface-muted)',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  cardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  pill: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    color: 'var(--on-surface-muted)',
    background: 'var(--surface)',
    padding: '3px 10px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
  },
  pillDone: {
    color: 'var(--primary)',
    background: 'rgba(22,53,38,0.08)',
    fontWeight: 600,
  },
  pillProgress: {
    color: 'var(--secondary)',
    background: 'var(--secondary-container)',
  },
};
