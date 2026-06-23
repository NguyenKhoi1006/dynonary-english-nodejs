import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    color: 'var(--streak-color)',
  },
  flame: {
    transition: 'transform 0.3s ease',
    display: 'block',
  },
  badge: {
    position: 'absolute',
    top: '-0.4rem',
    right: '-0.8rem',
    fontSize: (props: any) =>
      props.size === 'small' ? '0.9rem' : props.size === 'large' ? '1.4rem' : '1.1rem',
    fontWeight: 800,
    color: 'var(--streak-color)',
    backgroundColor: '#fff',
    borderRadius: '50%',
    minWidth: (props: any) =>
      props.size === 'small' ? '1.4rem' : props.size === 'large' ? '2.2rem' : '1.8rem',
    height: (props: any) =>
      props.size === 'small' ? '1.4rem' : props.size === 'large' ? '2.2rem' : '1.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    lineHeight: 1,
  },
}));
