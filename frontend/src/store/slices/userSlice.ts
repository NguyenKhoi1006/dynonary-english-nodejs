import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface UserState {
  isAuth: boolean;
  authLoading: boolean;
  currentUser: User | null;
  isTutor: boolean;
  tutorProfileId: string | null;
}

const initialState: UserState = {
  isAuth: false,
  authLoading: true,
  currentUser: null,
  isTutor: false,
  tutorProfileId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User; isTutor?: boolean; tutorProfileId?: string }>) {
      state.isAuth = true;
      state.authLoading = false;
      state.currentUser = action.payload.user;
      state.isTutor = action.payload.isTutor ?? false;
      state.tutorProfileId = action.payload.tutorProfileId ?? null;
    },
    clearUser(state) {
      Object.assign(state, initialState);
      state.authLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.authLoading = action.payload;
    },
    setTutorStatus(state, action: PayloadAction<{ isTutor: boolean; tutorProfileId?: string }>) {
      state.isTutor = action.payload.isTutor;
      state.tutorProfileId = action.payload.tutorProfileId ?? null;
    },
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, setAuthLoading, setTutorStatus, updateProfile } = userSlice.actions;
export default userSlice.reducer;
