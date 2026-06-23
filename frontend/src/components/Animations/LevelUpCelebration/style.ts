import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.4s ease',
    cursor: 'pointer',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    transition: 'all 1.2s ease-out',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  levelLabel: {
    fontSize: '2.4rem',
    fontWeight: 800,
    color: '#ffc800',
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
    transition: 'all 0.6s ease-out',
  },
  levelValue: {
    fontSize: '8rem',
    fontWeight: 900,
    color: '#fff',
    textShadow: '0 4px 16px rgba(0,0,0,0.3)',
    transition: 'all 0.6s ease-out 0.2s',
    opacity: 0,
  },
}));
