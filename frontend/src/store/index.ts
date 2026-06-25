import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
