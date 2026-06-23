import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  root: {
    position: 'fixed',
    left: (props: any) => props.x,
    top: (props: any) => props.y,
    zIndex: 9999,
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    opacity: (props: any) => (props.phase === 'enter' ? 0 : 1),
    ...((props: any) =>
      props.phase === 'float'
        ? { transform: 'translate(-50%, -100%)' }
        : {}),
    ...((props: any) =>
      props.phase === 'exit'
        ? { transform: 'translate(-50%, -180%)', opacity: 0 }
        : {}),
  },
  badge: {
    display: 'inline-block',
    padding: '0.4rem 1.2rem',
    borderRadius: '2rem',
    backgroundColor: 'var(--xp-color)',
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 800,
    boxShadow: '0 4px 12px rgba(255, 150, 0, 0.4)',
  },
}));
