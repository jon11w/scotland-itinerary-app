import { useState, useEffect } from 'react';

const TYPE_CONFIG = {
  sightseeing: { label: 'Sightseeing', color: 'var(--secondary)',          bg: 'var(--secondary-container)' },
  dining:      { label: 'Dining',      color: 'var(--primary)',             bg: 'rgba(22,53,38,0.08)' },
  arrival:     { label: 'Stay',        color: 'var(--tertiary)',            bg: 'var(--tertiary-container)' },
  departure:   { label: 'Travel',      color: 'var(--on-surface-muted)',    bg: 'rgba(28,28,25,0.06)' },
  experience:  { label: 'Experience',  color: 'var(--tertiary)',            bg: 'var(--tertiary-container)' },
  shopping:    { label: 'Shopping',    color: 'var(--secondary)',           bg: 'var(--secondary-container)' },
};

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

async function fetchUnsplashImage(query) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (data.results?.length > 0) {
      return { url: data.results[0].urls.regular, credit: data.results[0].user.name, creditLink: data.results[0].user.links.html };
    }
  } catch {}
  return { url: `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`, credit: null, creditLink: null };
}

async function fetchAIDescription(event) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `You are a friendly travel guide. Write a brief, enthusiastic 2-sentence description of "${event.name}" located at "${event.location}" for a city break itinerary. Focus on what makes it special and worth visiting. Be warm and conversational. Return ONLY the description text, no preamble.` }],
      }),
    });
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch { return null; }
}

function openInMaps(location) {
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, '_blank', 'noopener,noreferrer');
}

export default function EventCard({ event, isCompleted, onToggleComplete }) {
  const [expanded, setExpanded] = useState(false);
  const [image, setImage]       = useState(null);
  const [description, setDesc]  = useState(null);
  const [loading, setLoading]   = useState(false);
  const [loaded, setLoaded]     = useState(false);

  const tc = TYPE_CONFIG[event.type] || TYPE_CONFIG.sightseeing;

  useEffect(() => {
    if (expanded && !loaded) {
      setLoading(true); setLoaded(true);
      Promise.all([fetchUnsplashImage(event.locationQuery || event.name), fetchAIDescription(event)])
        .then(([img, desc]) => { setImage(img); setDesc(desc); setLoading(false); });
    }
  }, [expanded, loaded, event]);

  return (
    <div style={{ ...s.card, ...(isCompleted ? s.cardDone : {}) }}>
      <div style={s.tartanStrip} />

      {/* Type chip + time + checkbox row */}
      <div style={s.topRow}>
        <span style={{ ...s.chip, color: tc.color, background: tc.bg }}>
          {tc.label}
        </span>
        <div style={s.timeCheck}>
          <span style={s.time}>{event.time}</span>
          <button
            style={{ ...s.checkBtn, ...(isCompleted ? s.checkBtnDone : {}) }}
            onClick={() => onToggleComplete(event.id)}
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted && (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Name */}
      <h3 style={{ ...s.name, ...(isCompleted ? s.nameDone : {}) }}>
        {event.name}
      </h3>

      {/* Location */}
      <button style={s.locBtn} onClick={() => openInMaps(event.location)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span style={s.locText}>{event.location}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.5 }}>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </button>

      {/* Notes */}
      {event.notes && (
        <p style={s.notes}>{event.notes}</p>
      )}

      {/* Expand */}
      <button style={s.expandBtn} onClick={() => setExpanded(e => !e)}>
        {expanded ? 'Less info ↑' : 'Photos & info ↓'}
      </button>

      {expanded && (
        <div style={s.expanded}>
          {loading ? (
            <div style={s.skelWrap}>
              <div style={s.skelImg} />
              <div style={s.skelLine} />
              <div style={{ ...s.skelLine, width: '70%' }} />
            </div>
          ) : (
            <>
              {image && (
                <div style={s.imgWrap}>
                  <img src={image.url} alt={event.name} style={s.img} loading="lazy" />
                  {image.credit && (
                    <a href={image.creditLink} target="_blank" rel="noopener noreferrer" style={s.credit}>
                      {image.credit} / Unsplash
                    </a>
                  )}
                </div>
              )}
              {description && <p style={s.desc}>{description}</p>}
            </>
          )}

          {event.info && (
            <div style={s.infoSection}>
              {event.info.openingHours && (
                <div style={s.infoRow}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--on-surface-faint)' }}>
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={s.infoText}>{event.info.openingHours}</span>
                </div>
              )}
              {event.info.admissionNote && (
                <div style={s.infoRow}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--on-surface-faint)' }}>
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
                  </svg>
                  <span style={s.infoText}>{event.info.admissionNote}</span>
                </div>
              )}
              {(event.info.website || event.info.bookingUrl) && (
                <div style={s.infoLinks}>
                  {event.info.website && (
                    <a href={event.info.website} target="_blank" rel="noopener noreferrer" style={s.infoLink}>
                      {event.info.websiteLabel || 'Website'} ↗
                    </a>
                  )}
                  {event.info.bookingUrl && (
                    <a href={event.info.bookingUrl} target="_blank" rel="noopener noreferrer" style={s.infoLinkAccent}>
                      {event.info.bookingLabel || 'Book'} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    background: 'var(--surface-lowest)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    boxShadow: 'var(--shadow-ambient)',
    overflow: 'hidden',
    position: 'relative',
    minWidth: 0,
    width: '100%',
  },
  tartanStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
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
  },
  cardDone: {
    background: 'rgba(22,53,38,0.03)',
    boxShadow: 'none',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 20,
  },
  chip: {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    borderRadius: 999,
    flexShrink: 1,
    minWidth: 0,
  },
  timeCheck: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 600,
    fontStyle: 'italic',
    color: 'var(--on-surface)',
    lineHeight: 1,
  },
  checkBtn: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: '1.5px solid var(--outline-variant)',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'white',
    padding: 0,
  },
  checkBtnDone: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--on-surface)',
    lineHeight: 1.35,
    overflowWrap: 'break-word',
    minWidth: 0,
  },
  nameDone: {
    color: 'var(--on-surface-muted)',
  },
  locBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    color: 'var(--primary)',
    fontSize: 11,
    textAlign: 'left',
    cursor: 'pointer',
    padding: '8px 12px',
    background: 'rgba(22,53,38,0.06)',
    borderRadius: 'var(--radius-sm)',
    width: '100%',
    lineHeight: 1.4,
  },
  locText: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  notes: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 300,
    color: 'var(--on-surface-muted)',
    lineHeight: 1.65,
    paddingLeft: 12,
    borderLeft: '2px solid var(--outline-variant)',
    overflowWrap: 'break-word',
    minWidth: 0,
  },
  expandBtn: {
    alignSelf: 'flex-start',
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--secondary)',
    padding: '3px 0',
    letterSpacing: '0.01em',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(68,97,128,0.3)',
    textUnderlineOffset: '3px',
  },
  expanded: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingTop: 2,
  },
  skelWrap: { display: 'flex', flexDirection: 'column', gap: 10 },
  skelImg:  { width: '100%', height: 180, borderRadius: 'var(--radius-md)', background: 'var(--surface-low)' },
  skelLine: { height: 13, width: '88%', borderRadius: 4, background: 'var(--surface-low)' },
  imgWrap: {
    position: 'relative',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  img: { width: '100%', height: 200, objectFit: 'cover', display: 'block' },
  credit: {
    position: 'absolute', bottom: 0, right: 0,
    background: 'rgba(22,53,38,0.65)', color: 'rgba(255,255,255,0.75)',
    fontSize: 9, padding: '3px 8px', textDecoration: 'none',
  },
  desc: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 300,
    color: 'var(--on-surface-muted)',
    lineHeight: 1.7,
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingTop: 10,
    borderTop: '1px solid var(--outline-variant)',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 7,
  },
  infoText: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--on-surface-muted)',
    lineHeight: 1.55,
    overflowWrap: 'break-word',
    minWidth: 0,
  },
  infoLinks: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    paddingTop: 2,
  },
  infoLink: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--secondary)',
    padding: '5px 12px',
    background: 'var(--secondary-container)',
    borderRadius: 999,
    textDecoration: 'none',
  },
  infoLinkAccent: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--primary)',
    padding: '5px 12px',
    background: 'rgba(22,53,38,0.08)',
    borderRadius: 999,
    textDecoration: 'none',
  },
};
