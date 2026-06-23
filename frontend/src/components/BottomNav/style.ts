import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 'var(--bottom-nav-height)',
    backgroundColor: '#ffffff',
    borderTop: '1px solid rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
  },
  action: {
    flex: 1,
    maxWidth: 'none',
    minWidth: 0,
    padding: '0.4rem 0',
    '& .MuiBottomNavigationAction-label': {
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#afafaf',
      marginTop: '0.2rem',
    },
    '&.Mui-selected': {
      '& .MuiBottomNavigationAction-label': {
        color: 'var(--primary-color)',
      },
      '& .MuiSvgIcon-root': {
        color: 'var(--primary-color)',
      },
    },
  },
}));
