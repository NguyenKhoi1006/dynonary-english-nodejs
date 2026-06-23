import api from 'services/api';

const wordApi = {
  postContributeWord: async (wordInfo) => {
    const payload = {
      word: wordInfo.word || '',
      mean: wordInfo.mean || wordInfo.meaning || '',
      type: wordInfo.type || '',
      phonetic: wordInfo.phonetic || '',
      examples: wordInfo.examples || (wordInfo.example ? [wordInfo.example] : undefined),
    };
    const res = await api.post('/apis/word/contribute/add-word', payload);
    return { status: res.status, data: res.data };
  },

  getCheckWordExistence: async (word) => {
    const res = await api.get('/apis/word/exist', { params: { word } });
    return { status: res.status, data: res.data };
  },

  getWordList: async (page = 1, perPage = 8, packInfo, sortType = 'rand') => {
    try {
      const res = await api.get('/apis/word/pack', {
        params: { page, perPage, packInfo: JSON.stringify(packInfo || {}) },
      });
      return { status: res.status, data: res.data };
    } catch {
      return { status: 200, data: { packList: [] } };
    }
  },

  getSearchWord: async (word = '', isCompact = false) => {
    try {
      const res = await api.get('/apis/word/search-word', {
        params: { searchWord: word, limit: isCompact ? 5 : 20 },
      });
      return { status: res.status, data: { packList: res.data.list || [] } };
    } catch {
      return { status: 200, data: { packList: [] } };
    }
  },

  getWordDetails: async (word = '') => {
    try {
      const res = await api.get('/apis/word/word-details', { params: { word } });
      return { status: res.status, data: res.data.wordDetails };
    } catch {
      return { status: 200, data: null };
    }
  },

  getUserFavoriteList: async (page = 0, perPage = 20, sortType = 'rand') => {
    try {
      const res = await api.get('/apis/word/favorite-list');
      return { status: res.status, data: res.data };
    } catch {
      return { status: 200, data: { wordPack: [] } };
    }
  },
};

export default wordApi;
