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
  interface PaletteColor {
    surface?: string;
    warmBg?: string;
    gold?: string;
  }
  interface SimplePaletteColorOptions {
    surface?: string;
    warmBg?: string;
    gold?: string;
  }
}

/* ─── Design Tokens ─── */
export const tokens = {
  /* Brand palette */
  navy: '#0A1F2E',
  navyLight: '#1A3A52',
  navyDark: '#060F18',

  gold: '#C9A84C',
  goldLight: '#F5E8C8',
  goldDark: '#A6882E',

  coral: '#D95C4A',
  coralLight: '#FDE8E4',

  emerald: '#3B9B7A',
  emeraldLight: '#E6F4EE',

  /* Neutrals */
  warmBg: '#F8F6F2',
  white: '#FFFFFF',
  charcoal: '#1A1A1A',
  graphite: '#4A4A4A',
  stone: '#8A8A8A',
  iron: '#C4C4C4',
  bone: '#E8E5DF',
  cloud: '#F0EEE8',

  /* Feedback */
  error: '#C73A3A',
  warning: '#B8860B',
  info: '#2B6B9A',
  success: '#3B9B7A',
  errorLight: '#FDE8E8',
  warningLight: '#FDF4D6',
  infoLight: '#E3F0F9',
  successLight: '#E6F4EE',

  /* Special */
  streak: '#F59E0B',
  hearts: '#EF4444',
  xp: '#C9A84C',
  xpLight: '#F5E8C8',
} as const;

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
      fontWeight: 700,
      fontSize: '4rem',
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
      color: tokens.charcoal,
    },
    h2: {
      fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
      fontWeight: 600,
      fontSize: '3rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: tokens.charcoal,
    },
    h3: {
      fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif",
      fontWeight: 600,
      fontSize: '2.4rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      color: tokens.charcoal,
    },
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: tokens.charcoal,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.6rem',
      lineHeight: 1.4,
      color: tokens.charcoal,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.4rem',
      lineHeight: 1.4,
      color: tokens.charcoal,
    },
    subtitle1: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: tokens.charcoal,
    },
    subtitle2: {
      fontSize: '1.3rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: tokens.graphite,
    },
    body1: {
      fontSize: '1.5rem',
      lineHeight: 1.65,
      color: tokens.graphite,
    },
    body2: {
      fontSize: '1.3rem',
      lineHeight: 1.65,
      color: tokens.stone,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1.4rem',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: tokens.stone,
    },
  },

  shape: {
    borderRadius: 10,
  },

  palette: {
    primary: {
      main: tokens.navy,
      light: tokens.navyLight,
      dark: tokens.navyDark,
      contrastText: tokens.white,
      surface: tokens.white,
      warmBg: tokens.warmBg,
      gold: tokens.gold,
    },
    secondary: {
      main: tokens.coral,
      light: tokens.coralLight,
      dark: '#B84332',
      contrastText: tokens.white,
    },
    error: {
      main: tokens.error,
      light: tokens.errorLight,
    },
    warning: {
      main: tokens.warning,
      light: tokens.warningLight,
    },
    info: {
      main: tokens.info,
      light: tokens.infoLight,
    },
    success: {
      main: tokens.success,
      light: tokens.successLight,
    },
    background: {
      default: tokens.warmBg,
      paper: tokens.white,
    },
    text: {
      primary: tokens.charcoal,
      secondary: tokens.stone,
    },
    divider: tokens.bone,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.warmBg,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '1rem 2.4rem',
          fontSize: '1.4rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:active': {
            transform: 'scale(0.97)',
          },
        },
        containedPrimary: {
          backgroundColor: tokens.navy,
          color: tokens.white,
          '&:hover': {
            backgroundColor: tokens.navyLight,
          },
        },
        containedSecondary: {
          backgroundColor: tokens.coral,
          color: tokens.white,
          '&:hover': {
            backgroundColor: '#B84332',
          },
        },
        outlined: {
          border: `1.5px solid ${tokens.bone}`,
          color: tokens.charcoal,
          '&:hover': {
            border: `1.5px solid ${tokens.navy}`,
            backgroundColor: tokens.cloud,
          },
        },
        text: {
          color: tokens.graphite,
          '&:hover': {
            backgroundColor: tokens.cloud,
          },
        },
        sizeLarge: {
          padding: '1.2rem 3.2rem',
          fontSize: '1.5rem',
          borderRadius: 10,
        },
        sizeSmall: {
          padding: '0.6rem 1.6rem',
          fontSize: '1.2rem',
          borderRadius: 6,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          border: `1px solid ${tokens.bone}`,
          backgroundImage: 'none',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: `1px solid ${tokens.bone}`,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '1.15rem',
          height: 'auto',
          padding: '0.4rem 0.2rem',
        },
        filled: {
          backgroundColor: tokens.cloud,
          color: tokens.graphite,
        },
        outlined: {
          borderColor: tokens.bone,
          color: tokens.stone,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
          backgroundColor: tokens.bone,
        },
        bar: {
          borderRadius: 4,
          backgroundColor: tokens.navy,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: tokens.white,
            transition: 'box-shadow 0.2s ease',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.iron,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: tokens.navy,
              borderWidth: 1.5,
            },
            '&.Mui-focused': {
              boxShadow: `0 0 0 3px ${tokens.navy}15`,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: tokens.bone,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: tokens.navy,
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            color: tokens.iron,
            opacity: 1,
          },
        },
      },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 'var(--bottom-nav-height)',
          backgroundColor: tokens.white,
          borderTop: `1px solid ${tokens.bone}`,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: tokens.cloud,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: '1.05rem',
          '&.Mui-selected': {
            fontSize: '1.05rem',
            color: tokens.navy,
          },
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '1.2rem',
          backgroundColor: tokens.charcoal,
          color: tokens.white,
          padding: '0.6rem 1.2rem',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: tokens.bone,
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 44,
          height: 24,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(20px)',
              color: tokens.white,
              '& + .MuiSwitch-track': {
                backgroundColor: tokens.navy,
                opacity: 1,
                border: 0,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: tokens.navy,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 20,
            height: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 12,
            backgroundColor: tokens.bone,
            opacity: 1,
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1.3rem',
          minHeight: 44,
          '&.Mui-selected': {
            color: tokens.navy,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: tokens.navy,
          height: 2.5,
          borderRadius: 1.5,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: '1px solid transparent',
        },
        standardSuccess: {
          backgroundColor: tokens.emeraldLight,
          color: tokens.emerald,
          borderColor: tokens.emerald,
        },
        standardError: {
          backgroundColor: tokens.errorLight,
          color: tokens.error,
          borderColor: tokens.error,
        },
        standardWarning: {
          backgroundColor: tokens.warningLight,
          color: tokens.warning,
          borderColor: tokens.warning,
        },
        standardInfo: {
          backgroundColor: tokens.infoLight,
          color: tokens.info,
          borderColor: tokens.info,
        },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.cloud,
          borderRadius: 6,
        },
      },
    },

    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: tokens.cloud,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: tokens.bone,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: tokens.graphite,
            backgroundColor: tokens.warmBg,
          },
        },
      },
    },
  },
});

export default theme;
