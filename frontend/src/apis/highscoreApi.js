import api from 'services/api';

const highscoreApi = {
  putUpdateHighscore: async (name = '', score = 0) => {
    try {
      await api.post('/apis/highscore/upsert-score', {
        gameType: name,
        score,
        displayName: name,
        photoURL: '',
      });
      return { status: 200 };
    } catch {
      return { status: 200 };
    }
  },

  getLeaderboard: async (name = '') => {
    try {
      const res = await api.get('/apis/highscore/leaderboard', {
        params: { gameType: name, limit: 20 },
      });
      return { status: 200, data: { list: res.data.leaderboard || [] } };
    } catch {
      return { status: 200, data: { list: [] } };
    }
  },
};

export default highscoreApi;
