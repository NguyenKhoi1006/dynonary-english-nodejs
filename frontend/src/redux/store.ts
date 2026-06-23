import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './slices/message.slice';
import userInfoReducer from './slices/userInfo.slice';
import adminInfoReducer from './slices/adminInfo.slice';
import voiceReducer from './slices/voice.slice';

const store = configureStore({
  reducer: {
    message: messageReducer,
    userInfo: userInfoReducer,
    adminInfo: adminInfoReducer,
    voice: voiceReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
