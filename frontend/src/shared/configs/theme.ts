import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xxs: true;
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

const theme: Theme = createTheme({
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
    fontFamily: [
      'SF Pro Display', 'Geist Sans', 'Helvetica Neue',
      '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
      'Arial', 'sans-serif',
    ].join(','),
    fontSize: 18,
    htmlFontSize: 14,
    h1: {
      fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
      fontWeight: 600,
      fontSize: '3.6rem',
      lineHeight: 1.1,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
      fontWeight: 600,
      fontSize: '2.8rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
      fontWeight: 500,
      fontSize: '2.2rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.8rem',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.6rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.4rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.5rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '1.3rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
      fontSize: '1.4rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  palette: {
    primary: {
      main: '#111111',
      dark: '#333333',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2F3437',
      contrastText: '#ffffff',
    },
    error: {
      main: '#9F2F2D',
      light: '#FDEBEC',
    },
    warning: {
      main: '#956400',
      light: '#FBF3DB',
    },
    info: {
      main: '#1F6C9F',
      light: '#E1F3FE',
    },
    success: {
      main: '#346538',
      light: '#EDF3EC',
    },
    background: {
      default: '#F7F6F3',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2F3437',
      secondary: '#787774',
    },
    divider: '#EAEAEA',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '1rem 2.4rem',
          fontSize: '1.4rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
        containedPrimary: {
          backgroundColor: '#111111',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          border: '1px solid #EAEAEA',
          color: '#2F3437',
          '&:hover': {
            border: '1px solid #111111',
            backgroundColor: '#F7F6F3',
          },
        },
        text: {
          color: '#2F3437',
          '&:hover': {
            backgroundColor: '#F0EFED',
          },
        },
        sizeLarge: {
          padding: '1.2rem 3.2rem',
          fontSize: '1.5rem',
        },
        sizeSmall: {
          padding: '0.6rem 1.6rem',
          fontSize: '1.2rem',
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          border: '1px solid #EAEAEA',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: 'none',
          border: '1px solid #EAEAEA',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '1.2rem',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          height: 6,
          backgroundColor: '#EAEAEA',
        },
        bar: {
          borderRadius: 3,
          backgroundColor: '#111111',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 'var(--bottom-nav-height)',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #EAEAEA',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#F7F6F3',
          },
        },
        label: {
          fontWeight: 500,
          fontSize: '1.1rem',
          '&.Mui-selected': {
            fontSize: '1.1rem',
            color: '#111111',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
          fontWeight: 500,
          fontSize: '1.2rem',
          backgroundColor: '#2F3437',
          color: '#FFFFFF',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#EAEAEA',
        },
      },
    },
  },
});

export default theme;
