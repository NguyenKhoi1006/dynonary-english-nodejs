import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  navWrapper: {
    paddingBottom: 'var(--nav-height)',
  },

  nav: {
    backgroundColor: 'var(--bg-color-sec)',
    height: 'var(--nav-height)',
    boxShadow: 'var(--box-shadow)',

    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999,
  },

  /* ── Logo block ── */
  logoLink: {
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoImg: {
    height: '4rem',
    width: 'auto',
    marginRight: '0.6rem',
  },
  logoText: {
    fontSize: '2rem',
    fontWeight: 700,
    color: 'var(--text-color)',
  },

  /* ── Search bar — flex grow ── */
  searchWrap: {
    flex: '1 1 auto',
    maxWidth: '64rem',
    margin: '0 2rem',
  },

  /* ── Right controls ── */
  controls: {
    marginLeft: 'auto',
    flexShrink: 0,
  },

  avt: {
    height: '3.6rem',
    width: '3.6rem',
    transition: 'opacity 0.2s ease',
    '&:hover, &:active': {
      opacity: 0.85,
    },
  },

  userInfo: {
    gap: '0.8rem',
  },

  userName: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--text-color)',
    maxWidth: '12rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    '@media (max-width: 600px)': {
      display: 'none',
    },
  },

  loginBtn: {
    height: '3.7rem',
    minWidth: '12rem',
  },

  loginLabel: {
    fontSize: '1.4rem',
  },

  /* ── LMS nav links ── */
  lmsLinks: {
    gap: '0.4rem',
    marginRight: '1.6rem',
    flexShrink: 0,
  },
  lmsLink: {
    textDecoration: 'none',
    color: 'var(--text-color)',
    fontSize: '1.4rem',
    fontWeight: 600,
    padding: '0.6rem 1.2rem',
    borderRadius: '0.6rem',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'var(--hover-color)',
    },
  },

  /* ════════════════════════════════════════════
     Compact header (learner mode)
     ════════════════════════════════════════════ */
  compactInner: {
    gap: '1.2rem',
    padding: '0 1.2rem',
  },
  logoCompactImg: {
    height: '3.2rem',
    width: 'auto',
  },

  /* ── XP block ── */
  xpBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    minWidth: '10rem',
    flex: '0 1 auto',
  },
  xpIcon: {
    fontSize: '2rem',
    color: 'var(--xp-color)',
    flexShrink: 0,
  },
  xpValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--xp-color)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  xpBar: {
    flex: 1,
    minWidth: '4rem',
    height: '0.8rem !important',
    borderRadius: '0.4rem',
    '& .MuiLinearProgress-bar': {
      backgroundColor: 'var(--xp-color)',
      borderRadius: '0.4rem',
    },
  },

  /* ── Generic stat block (streak / hearts) ── */
  statBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--text-color)',
  },
  streakIcon: {
    fontSize: '2rem',
    color: 'var(--streak-color)',
  },
  heartIcon: {
    fontSize: '1.8rem',
    color: 'var(--heart-color)',
  },

  userCompact: {
    marginLeft: 'auto',
  },
}));
