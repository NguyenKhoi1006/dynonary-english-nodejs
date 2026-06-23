import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xxs: 375,
      xs: 480,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  typography: {
    fontFamily: '"Nunito", "Montserrat", Arial, Helvetica, sans-serif',
    fontSize: 16,
    htmlFontSize: 10,
    h1: { fontWeight: 800, fontSize: '3.2rem', lineHeight: 1.2 },
    h2: { fontWeight: 800, fontSize: '2.4rem', lineHeight: 1.25 },
    h3: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.3 },
    h4: { fontWeight: 700, fontSize: '1.8rem', lineHeight: 1.35 },
    h5: { fontWeight: 700, fontSize: '1.6rem', lineHeight: 1.4 },
    h6: { fontWeight: 700, fontSize: '1.4rem', lineHeight: 1.4 },
    button: { fontWeight: 700, textTransform: 'none', fontSize: '1.5rem' },
  },
  shape: { borderRadius: 12 },
  palette: {
    primary: { main: '#58cc02', dark: '#46a302', contrastText: '#ffffff' },
    secondary: { main: '#1cb0f6', dark: '#1899d6', contrastText: '#ffffff' },
    error: { main: '#ea2b2b' },
    warning: { main: '#ff9600' },
    info: { main: '#ce82ff' },
    success: { main: '#58a700' },
    background: { default: '#f7f7f7', paper: '#ffffff' },
    text: { primary: '#3c3c3c', secondary: '#777777' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '1rem 2.4rem',
          fontSize: '1.5rem',
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none', filter: 'brightness(0.92)' },
          '&:active': { transform: 'scale(0.97)' },
        },
        containedPrimary: {
          backgroundColor: '#58cc02',
          '&:hover': { backgroundColor: '#46a302' },
        },
        containedSecondary: {
          backgroundColor: '#1cb0f6',
          '&:hover': { backgroundColor: '#1899d6' },
        },
        outlined: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
        sizeLarge: { padding: '1.4rem 3.2rem', fontSize: '1.7rem', borderRadius: 14 },
        sizeSmall: { padding: '0.6rem 1.6rem', fontSize: '1.3rem', borderRadius: 8 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)' },
      },
    },
    MuiPaper: {
      styleOverrides: { rounded: { borderRadius: 12 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 12, backgroundColor: '#e5e5e5' },
        bar: { borderRadius: 8 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 'var(--bottom-nav-height)',
          backgroundColor: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.08)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '0.4rem',
          '&.Mui-selected': { backgroundColor: '#e8f5e1' },
        },
        label: {
          fontWeight: 600,
          fontSize: '1.1rem',
          '&.Mui-selected': { fontSize: '1.1rem' },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiTooltip: {
      styleOverrides: { tooltip: { borderRadius: 8, fontWeight: 600, fontSize: '1.2rem' } },
    },
  },
});

export default theme;
