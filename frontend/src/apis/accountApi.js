import api from 'services/api';

const accountApi = {
  // ─── User Info ──────────────────────────────────────────────
  getUserInfo: async () => {
    try {
      const res = await api.get('/apis/account/user-info');
      return { status: res.status, data: { user: res.data } };
    } catch {
      return { status: 200, data: { user: {} } };
    }
  },

  getUserProfile: async () => {
    try {
      const res = await api.get('/apis/account/user-profile');
      return { status: res.status, data: res.data };
    } catch {
      return { status: 200, data: {} };
    }
  },

  // ─── Profile ────────────────────────────────────────────────
  putUpdateProfile: async (name = '', username = '') => {
    const res = await api.put('/apis/account/update-profile', { name, username });
    return { status: res.status };
  },

  putUpdateAvt: async (avtSrc = '') => {
    const res = await api.put('/apis/account/update-avt', { avtSrc });
    return { status: res.status, data: res.data };
  },

  // ─── Favorites ──────────────────────────────────────────────
  putToggleWordFavorite: async (_username, word, isAdd) => {
    const res = await api.put('/apis/account/toggle-favorite', { word, isAdd });
    return { status: res.status };
  },

  // ─── Coin ───────────────────────────────────────────────────
  putUpdateUserCoin: async (newCoin) => {
    const res = await api.put('/apis/account/update-coin', { newCoin });
    return { status: res.status };
  },

  // ─── Auth stubs (handled by Firebase client SDK) ────────────
  postRegisterAccount: () => Promise.resolve({ status: 200 }),
  postLogin: () => Promise.resolve({ status: 200 }),
  postLoginWithGoogle: () => Promise.resolve({ status: 200 }),
  postLoginWithFacebook: () => Promise.resolve({ status: 200 }),
  postLogout: () => Promise.resolve({ status: 200 }),
  postResetPassword: () => Promise.resolve({ status: 200 }),
  getSendVerifyCode: () => Promise.resolve({ status: 200 }),
};

export default accountApi;
