// Augment DefaultTheme from @mui/styles to support breakpoints, transitions, and palette
import '@mui/material/styles';

declare module '@mui/styles' {
  interface DefaultTheme {
    breakpoints: {
      up: (key: number | string) => string;
      down: (key: number | string) => string;
      between: (start: number | string, end: number | string) => string;
      only: (key: number | string) => string;
      not: (key: number | string) => string;
      values: Record<string, number>;
      keys: string[];
    };
    transitions: {
      create: (props: string | string[], options?: Record<string, unknown>) => string;
      duration: Record<string, number>;
      easing: Record<string, string>;
      getAutoHeightDuration: (height: number) => number;
    };
    palette: Record<string, unknown>;
    spacing: (factor: number) => number;
    shape: { borderRadius: number };
    mixins: Record<string, unknown>;
    zIndex: Record<string, number>;
    typography: Record<string, unknown>;
    direction: 'ltr' | 'rtl';
    shadows: string[];
    unstable_sxConfig: Record<string, unknown>;
  }
}
