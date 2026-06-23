import { makeStyles } from '@mui/styles';

export default makeStyles(() => ({
  /* ── Shared ── */
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem 1.6rem',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
  },
  prompt: {
    fontSize: '2rem',
    fontWeight: 700,
    textAlign: 'center',
    color: 'var(--text-color)',
    lineHeight: 1.4,
  },
  image: {
    width: '12rem',
    height: '12rem',
    objectFit: 'contain',
    borderRadius: '1.2rem',
  },
  hint: {
    fontSize: '1.4rem',
    color: 'var(--label-color)',
    textAlign: 'center',
  },

  /* ── Multi-choice + TapTranslate grid ── */
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    width: '100%',
    maxWidth: '40rem',
  },
  optionBtn: {
    padding: '1.6rem',
    fontSize: '1.6rem',
    fontWeight: 700,
    backgroundColor: '#fff',
    border: '2px solid var(--border-color)',
    borderRadius: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    color: 'var(--text-color)',
    '&:hover:not(:disabled)': {
      borderColor: 'var(--primary-color)',
      backgroundColor: '#f0fae8',
    },
    '&:disabled': {
      cursor: 'default',
    },
  },
  tapBtn: {
    composes: '$optionBtn',
    padding: '1.2rem',
    fontSize: '1.4rem',
  },

  /* ── Correct / wrong states ── */
  correct: {
    backgroundColor: '#d4edc9 !important',
    borderColor: 'var(--primary-color) !important',
    color: 'var(--primary-dark) !important',
  },
  wrong: {
    backgroundColor: '#fce4e4 !important',
    borderColor: 'var(--error-color) !important',
    color: 'var(--error-color) !important',
  },

  /* ── Word bank ── */
  answerStrip: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.6rem',
    minHeight: '5rem',
    width: '100%',
    maxWidth: '40rem',
    padding: '1rem',
    backgroundColor: '#f7f7f7',
    borderRadius: '1.2rem',
    border: '2px dashed var(--border-color)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#afafaf',
    fontSize: '1.3rem',
  },
  chip: {
    padding: '0.6rem 1.2rem',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '2rem',
    fontSize: '1.4rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      backgroundColor: 'var(--primary-dark)',
    },
  },
  bank: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8rem',
    justifyContent: 'center',
    maxWidth: '40rem',
  },
  chipBank: {
    padding: '0.8rem 1.6rem',
    backgroundColor: '#fff',
    color: 'var(--text-color)',
    border: '2px solid var(--border-color)',
    borderRadius: '2rem',
    fontSize: '1.4rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover:not(:disabled)': {
      borderColor: 'var(--primary-color)',
      backgroundColor: '#f0fae8',
    },
  },
  submitBtn: {
    padding: '1.2rem 4rem',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '1.2rem',
    fontSize: '1.6rem',
    fontWeight: 800,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--primary-dark)',
    },
    '&:disabled': {
      opacity: 0.4,
      cursor: 'default',
    },
  },
}));
