import api from 'services/api';

const flashcardApi = {
  getWordPack: async (page = 1, perPage = 8, packInfo) => {
    try {
      const res = await api.get('/apis/word/pack', {
        params: { page, perPage, packInfo: JSON.stringify(packInfo || {}) },
      });
      return { status: res.status, data: { packList: res.data.packList || [] } };
    } catch {
      return { status: 200, data: { packList: [] } };
    }
  },
};

export default flashcardApi;
