import api from 'services/api';

const sentenceApi = {
  postContributeSentence: async (sentence, mean, note, topics) => {
    // For now, this still uses direct Firestore since the Python backend
    // doesn't have a sentence contribution endpoint yet
    const { getFirebaseDb } = await import('configs/firebase');
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    const db = getFirebaseDb();
    await addDoc(collection(db, 'sentences'), {
      sentence,
      meaning: mean,
      note,
      topics: topics || [],
      createdAt: serverTimestamp(),
    });
    return { status: 200 };
  },

  getTotalSentences: async (topics = []) => {
    try {
      const res = await api.get('/apis/sentence/', {
        params: { limit: 500 },
      });
      const list = res.data.sentenceList || [];
      const filtered = topics.length > 0
        ? list.filter((s) => topics.includes(s.topic))
        : list;
      return { status: 200, data: { total: filtered.length } };
    } catch {
      return { status: 200, data: { total: 0 } };
    }
  },

  getSentenceList: async (page = 1, perPage = 20, topics = []) => {
    try {
      const res = await api.get('/apis/sentence/', {
        params: { limit: page * perPage },
      });
      let list = res.data.sentenceList || [];
      if (topics.length > 0) {
        list = list.filter((s) => topics.includes(s.topic));
      }
      const startIdx = (page - 1) * perPage;
      const sentenceList = list.slice(startIdx, startIdx + perPage);
      return { status: 200, data: { sentenceList } };
    } catch {
      return { status: 200, data: { sentenceList: [] } };
    }
  },
};

export default sentenceApi;
