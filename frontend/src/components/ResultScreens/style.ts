import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 6000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    transition: 'opacity 0.2s ease',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '2rem',
    padding: '3rem 2.4rem',
    maxWidth: '36rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  emoji: {
    fontSize: '5rem',
    lineHeight: 1,
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: 800,
    color: 'var(--text-color)',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.4rem',
    color: 'var(--label-color)',
    textAlign: 'center',
    lineHeight: 1.4,
  },

  /* ── Score ring ── */
  scoreRing: {
    margin: '0.8rem 0',
  },

  /* ── XP row ── */
  xpRow: {
    margin: '0.4rem 0',
  },
  xpBadge: {
    display: 'inline-block',
    padding: '0.6rem 2rem',
    borderRadius: '2rem',
    backgroundColor: 'var(--xp-color)',
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 800,
    boxShadow: '0 3px 10px rgba(255,150,0,0.3)',
  },

  /* ── Actions ── */
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '100%',
    marginTop: '0.8rem',
  },
  btnPrimary: {
    width: '100%',
    padding: '1.2rem',
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
  btnOutline: {
    width: '100%',
    padding: '1.2rem',
    backgroundColor: 'transparent',
    color: 'var(--text-color)',
    border: '2px solid var(--border-color)',
    borderRadius: '1.2rem',
    fontSize: '1.6rem',
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },

  /* ── Level-up specific ── */
  levelUpCard: {
    background: 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)',
    border: '2px solid #ffc800',
  },
  levelUpSparkles: {
    fontSize: '3rem',
  },
  levelNumber: {
    fontSize: '7.2rem',
    fontWeight: 900,
    color: 'var(--xp-color)',
    lineHeight: 1,
    textShadow: '0 4px 12px rgba(255,150,0,0.3)',
  },

  /* ── Achievement specific ── */
  achievementIcon: {
    fontSize: '6rem',
    lineHeight: 1,
  },
  achievementLabel: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--primary-color)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
}));
