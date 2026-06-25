import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  themeMode: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  notification: { open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' } | null;
}

const initialState: UiState = {
  themeMode: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  sidebarOpen: true,
  loading: false,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.themeMode);
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.themeMode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    showNotification(state, action: PayloadAction<UiState['notification']>) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar, setSidebarOpen, setLoading, showNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
