import api from 'services/api';

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function getWordPackFromApi({
  type = '-1',
  level = '-1',
  nQuestion = 50,
}) {
  try {
    const res = await api.get('/apis/word/pack', {
      params: {
        page: 1,
        perPage: nQuestion,
        packInfo: JSON.stringify({
          ...(type !== '-1' ? { type } : {}),
          ...(level !== '-1' ? { level } : {}),
        }),
      },
    });
    let wordPack = res.data.packList || [];
    wordPack = shuffleArray(wordPack).slice(0, nQuestion);
    return { status: 200, data: { wordPack } };
  } catch {
    return { status: 200, data: { wordPack: [] } };
  }
}

const gameApi = {
  getWordPackCWG: async (type = '-1', level = '-1', ...args) => {
    return getWordPackFromApi({ type, level, nQuestion: 50 });
  },

  getWordPackWordMatch: async (type = '-1', level = '-1', ...args) => {
    return getWordPackFromApi({ type, level, nQuestion: 50 });
  },

  getWordPackFG: async (topic = 0) => {
    try {
      const res = await api.get('/apis/word/pack', {
        params: { page: 1, perPage: 50, packInfo: '{}' },
      });
      let wordPack = res.data.packList || [];
      wordPack = shuffleArray(wordPack).slice(0, 20);
      return { status: 200, data: { wordPack } };
    } catch {
      return { status: 200, data: { wordPack: [] } };
    }
  },
};

export default gameApi;
