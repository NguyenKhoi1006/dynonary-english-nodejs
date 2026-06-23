import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

const ThemeContext = createContext<{ mode: ThemeMode; toggle: () => void }>({
  mode: 'light',
  toggle: () => {},
});

export const useAdminTheme = () => useContext(ThemeContext);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('adminTheme');
    return (saved === 'dark' ? 'dark' : 'light') as ThemeMode;
  });

  useEffect(() => {
    localStorage.setItem('adminTheme', mode);
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1976d2' },
          ...(mode === 'dark'
            ? { background: { default: '#121212', paper: '#1e1e1e' } }
            : { background: { default: '#f5f5f5', paper: '#ffffff' } }),
        },
        typography: {
          fontFamily: '"Montserrat", Arial, Helvetica, sans-serif',
          fontSize: 16,
          htmlFontSize: 10,
        },
        breakpoints: {
          values: { xxs: 375, xs: 480, sm: 576, md: 768, lg: 992, xl: 1200 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
