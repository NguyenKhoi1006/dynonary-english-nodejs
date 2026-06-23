import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  root: {
    position: 'relative',
    width: '100%',
    minHeight: '40rem',
    padding: '2rem 1rem',
  },

  /* ── SVG connecting lines ── */
  linesSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  line: {
    stroke: '#e0e0e0',
    strokeWidth: 3,
    strokeLinecap: 'round',
  },
  lineActive: {
    stroke: 'var(--primary-color)',
  },

  /* ── Skill node ── */
  node: {
    position: 'absolute',
    width: '10rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },

  nodeIcon: {
    width: '5.6rem',
    height: '5.6rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '0.4rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },

  checkMark: {
    color: '#fff',
    fontSize: '2.4rem',
  },

  lockIcon: {
    fontSize: '2rem',
    opacity: 0.6,
  },

  lessonIcon: {
    color: '#fff',
    fontSize: '2.2rem',
    fontWeight: 800,
    textTransform: 'uppercase',
  },

  /* ── Status variants ── */
  nodeLocked: {
    '& $nodeIcon': {
      backgroundColor: '#e0e0e0',
    },
    '& $nodeTitle': {
      color: '#afafaf',
    },
    cursor: 'default',
  },
  nodeAvailable: {
    '& $nodeIcon': {
      backgroundColor: 'var(--primary-color)',
      transition: 'transform 0.2s ease',
    },
    '&:hover $nodeIcon': {
      boxShadow: '0 4px 16px rgba(88, 204, 2, 0.4)',
    },
  },
  nodeInProgress: {
    '& $nodeIcon': {
      backgroundColor: 'var(--primary-dark)',
      border: '3px solid var(--xp-color)',
    },
  },
  nodeCompleted: {
    '& $nodeIcon': {
      backgroundColor: 'var(--primary-color)',
    },
    '& $nodeTitle': {
      color: 'var(--primary-dark)',
    },
  },

  nodeTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    textAlign: 'center',
    color: 'var(--text-color)',
    lineHeight: 1.2,
    maxWidth: '10rem',
  },

  /* ── Progress bar for in_progress ── */
  progressRing: {
    width: '5.6rem',
    height: '0.4rem',
    backgroundColor: '#e0e0e0',
    borderRadius: '0.2rem',
    marginTop: '0.3rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--xp-color)',
    borderRadius: '0.2rem',
    transition: 'width 0.4s ease',
  },

  /* ── Tooltip on hover ── */
  tooltip: {
    position: 'absolute',
    bottom: 'calc(100% + 0.8rem)',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    borderRadius: '1.2rem',
    padding: '1rem 1.4rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    zIndex: 10,
    minWidth: '16rem',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  tooltipTitle: {
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--text-color)',
    marginBottom: '0.3rem',
  },
  tooltipDesc: {
    fontSize: '1.1rem',
    color: 'var(--label-color)',
    marginBottom: '0.3rem',
  },
  tooltipProgress: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--xp-color)',
  },
}));
