import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfoState {
  isAuth: boolean;
  uid: string;
  email: string;
  name: string;
  username: string;
  avt: string;
  favoriteList: string[];
  coin: number;
  authLoading: boolean;
  role: 'learner' | 'admin' | null;
  membership: 'free' | 'premium';
  level: string | null;
  status: 'active' | 'banned';
  xp: number;
  streak: number;
  hearts: number;
  maxHearts: number;
}

const initialState: UserInfoState = {
  isAuth: false,
  uid: '',
  email: '',
  name: '',
  username: '',
  avt: '',
  favoriteList: [],
  coin: 0,
  authLoading: true, // starts true while Firebase checks auth state
  role: null,
  membership: 'free',
  level: null,
  status: 'active',
  xp: 0,
  streak: 0,
  hearts: 5,
  maxHearts: 5,
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        uid: string;
        email: string;
        name: string;
        username?: string;
        avt?: string;
        coin?: number;
        favoriteList?: string[];
        role?: 'learner' | 'admin';
        membership?: 'free' | 'premium';
        level?: string | null;
        status?: 'active' | 'banned';
        xp?: number;
        streak?: number;
        hearts?: number;
        maxHearts?: number;
      }>,
    ) {
      const { uid, email, name, username, avt, coin, favoriteList, role, membership, level, status, xp, streak, hearts, maxHearts } =
        action.payload;
      state.isAuth = true;
      state.uid = uid;
      state.email = email;
      state.name = name;
      state.username = username || name;
      state.avt = avt || '';
      state.coin = coin ?? 0;
      state.favoriteList = favoriteList || [];
      state.role = role || null;
      state.membership = membership || 'free';
      state.level = level ?? null;
      state.status = status || 'active';
      state.xp = xp ?? 0;
      state.streak = streak ?? 0;
      state.hearts = hearts ?? 5;
      state.maxHearts = maxHearts ?? 5;
      state.authLoading = false;
    },

    clearUser(state) {
      Object.assign(state, initialState);
      state.authLoading = false;
    },

    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.authLoading = action.payload;
    },

    setAddFavorites(
      state,
      action: PayloadAction<{ word: string; isAdd?: boolean }>,
    ) {
      const { word, isAdd = true } = action.payload;
      if (isAdd) {
        state.favoriteList.push(word);
      } else {
        state.favoriteList = state.favoriteList.filter((i) => i !== word);
      }
    },

    setUserCoin(state, action: PayloadAction<number>) {
      state.coin = action.payload;
    },

    setUserAvt(state, action: PayloadAction<string>) {
      state.avt = action.payload;
    },

    updateUserProfile(
      state,
      action: PayloadAction<{ name?: string; username?: string }>,
    ) {
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.username !== undefined)
        state.username = action.payload.username;
    },

    setUserXp(state, action: PayloadAction<number>) {
      state.xp = action.payload;
    },

    setUserStreak(state, action: PayloadAction<number>) {
      state.streak = action.payload;
    },

    setUserHearts(state, action: PayloadAction<{ hearts: number; maxHearts?: number }>) {
      state.hearts = action.payload.hearts;
      if (action.payload.maxHearts !== undefined) {
        state.maxHearts = action.payload.maxHearts;
      }
    },
  },
});

const { reducer, actions } = userInfoSlice;
export const {
  setUser,
  clearUser,
  setAuthLoading,
  setAddFavorites,
  setUserCoin,
  setUserAvt,
  updateUserProfile,
  setUserXp,
  setUserStreak,
  setUserHearts,
} = actions;
export default reducer;
