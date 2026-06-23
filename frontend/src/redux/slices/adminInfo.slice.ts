import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminInfoState {
  isAuth: boolean;
  uid: string;
  email: string;
  name: string;
  avt: string;
  accessToken: string;
  refreshToken: string;
}

const initialState: AdminInfoState = {
  isAuth: false,
  uid: '',
  email: '',
  name: '',
  avt: '',
  accessToken: localStorage.getItem('admin_access_token') || '',
  refreshToken: localStorage.getItem('admin_refresh_token') || '',
};

const adminInfoSlice = createSlice({
  name: 'adminInfo',
  initialState,
  reducers: {
    setAdmin(
      state,
      action: PayloadAction<{
        uid: string;
        email: string;
        name: string;
        avt?: string;
        accessToken: string;
        refreshToken: string;
      }>,
    ) {
      const { uid, email, name, avt, accessToken, refreshToken } = action.payload;
      state.isAuth = true;
      state.uid = uid;
      state.email = email;
      state.name = name;
      state.avt = avt || '';
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      localStorage.setItem('admin_access_token', accessToken);
      localStorage.setItem('admin_refresh_token', refreshToken);
    },

    clearAdmin(state) {
      state.isAuth = false;
      state.uid = '';
      state.email = '';
      state.name = '';
      state.avt = '';
      state.accessToken = '';
      state.refreshToken = '';
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
    },
  },
});

const { reducer, actions } = adminInfoSlice;
export const { setAdmin, clearAdmin } = actions;
export default reducer;
