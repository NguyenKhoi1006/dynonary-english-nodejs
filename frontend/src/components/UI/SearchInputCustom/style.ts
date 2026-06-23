import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
  },

  /* ── Input box ── */
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    height: '4rem',
    borderRadius: '2rem',
    backgroundColor: 'var(--bg-color)',
    border: '1px solid transparent',
    transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color'], {
      duration: 220,
    }),
    padding: '0 1.2rem 0 1rem',
  },
  inputWrapFocused: {
    borderColor: 'var(--primary-color)',
    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.15)',
    backgroundColor: 'var(--bg-color)',
  },

  searchIcon: {
    fontSize: '2rem',
    color: 'var(--label-color)',
    marginRight: '0.6rem',
    flexShrink: 0,
  },

  inputRoot: {
    flex: 1,
    color: 'var(--text-color)',
  },

  inputInput: {
    fontSize: '1.5rem',
    padding: 0,
    '&::placeholder': {
      color: 'var(--label-color)',
      opacity: 0.7,
    },
  },

  /* ── Popper dropdown ── */
  popper: {
    zIndex: 1300,
    width: '100%',
    minWidth: '28rem',
    maxWidth: '50rem',
  },

  resPaper: {
    marginTop: '0.6rem',
    borderRadius: '1.2rem',
    backgroundColor: 'var(--bg-color-sec)',
    maxHeight: '36rem',
    overflow: 'auto',
  },

  resItem: {
    padding: '1rem 1.6rem',
    fontSize: '1.5rem',
    color: 'var(--text-color)',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.06)',
    },
  },
}));
