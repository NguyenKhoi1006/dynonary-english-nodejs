import api from 'services/api';

const commonApi = {
  getWordPackTotal: async (packInfo) => {
    try {
      const res = await api.get('/apis/word/pack', {
        params: { page: 1, perPage: 1, packInfo: JSON.stringify(packInfo || {}) },
      });
      return { status: res.status, data: { total: res.data.total || 0 } };
    } catch {
      return { status: 200, data: { total: 0 } };
    }
  },
};

export default commonApi;
