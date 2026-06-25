import { createTheme, ThemeOptions } from '@mui/material/styles';
import { palette } from './palette';

const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2, letterSpacing: '-0.03em' },
  h2: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.25, letterSpacing: '-0.02em' },
  h3: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.3 },
  h4: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.35 },
  h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
  h6: { fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.4 },
  subtitle1: { fontWeight: 500, fontSize: '1rem', lineHeight: 1.5 },
  subtitle2: { fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.5 },
  body1: { fontSize: '0.95rem', lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', lineHeight: 1.6 },
  button: { fontWeight: 500, fontSize: '0.875rem', textTransform: 'none' as const },
  caption: { fontSize: '0.8rem', lineHeight: 1.4 },
};

const shape = { borderRadius: 8 };

const components: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        padding: '0.5rem 1.25rem',
        fontWeight: 500,
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': { boxShadow: 'none' },
      },
      sizeLarge: { padding: '0.75rem 2rem', fontSize: '0.95rem' },
      sizeSmall: { padding: '0.3rem 0.75rem', fontSize: '0.8rem' },
      outlined: { borderWidth: 1, '&:hover': { borderWidth: 1 } },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { backgroundImage: 'none' },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 12 },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 6, fontWeight: 500, fontSize: '0.8rem' },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 6,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1.5,
          },
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: { borderRadius: '50%' },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: { height: 2 },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
        minHeight: 40,
        padding: '0.5rem 1rem',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 4,
        fontSize: '0.8rem',
        padding: '0.4rem 0.75rem',
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: 6 },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: { borderRadius: 4, height: 6 },
      bar: { borderRadius: 4 },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: { transform: 'scale(1)' },
    },
  },
};

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: { mode, ...palette[mode] },
    typography,
    shape,
    components,
  });
