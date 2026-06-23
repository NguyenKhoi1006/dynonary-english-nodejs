import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 5000,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },

  /* ── Header ── */
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    padding: '0.8rem 1.6rem',
    borderBottom: '1px solid var(--border-color)',
    flexShrink: 0,
  },
  exitBtn: {
    width: '3.6rem',
    height: '3.6rem',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f0f0f0',
    fontSize: '1.6rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  progressTrack: {
    flex: 1,
    height: '1rem',
    backgroundColor: '#e5e5e5',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '0.5rem',
    transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  xpDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    flexShrink: 0,
  },
  xpIcon: {
    fontSize: '1.8rem',
  },
  xpCount: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--xp-color)',
  },

  /* ── Body ── */
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'auto',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },

  /* ── Streak badge ── */
  streakBadge: {
    position: 'fixed',
    top: '6rem',
    right: '1.6rem',
    backgroundColor: 'var(--streak-color)',
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.3rem',
    padding: '0.4rem 1rem',
    borderRadius: '2rem',
    boxShadow: '0 2px 8px rgba(255, 150, 0, 0.3)',
    zIndex: 10,
  },

  /* ── Result screen ── */
  resultCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.2rem',
    padding: '3rem 2rem',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
  },
  resultEmoji: {
    fontSize: '6rem',
  },
  resultTitle: {
    fontSize: '2.4rem',
    fontWeight: 800,
    color: 'var(--text-color)',
  },
  resultScore: {
    fontSize: '4.8rem',
    fontWeight: 900,
    color: 'var(--primary-color)',
  },
  resultXp: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--xp-color)',
  },
  continueBtn: {
    marginTop: '1rem',
    padding: '1.2rem 4rem',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '1.2rem',
    fontSize: '1.6rem',
    fontWeight: 800,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--primary-dark)',
    },
  },
}));
