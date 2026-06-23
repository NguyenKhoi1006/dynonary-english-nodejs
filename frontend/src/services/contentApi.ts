import api from 'services/api';

// ─── Topics ─────────────────────────────────────────────
// Cache topics to avoid repeated API calls
let topicsCache: { type: string; data: any[]; timestamp: number }[] = [];
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getTopics(type: 'vocab' | 'sentence' = 'vocab'): Promise<any[]> {
  const cached = topicsCache.find((c) => c.type === type);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await api.get('/apis/topics/', { params: { type } });
    const topics = res.data.topics || [];

    // Remove old cache entry for this type
    topicsCache = topicsCache.filter((c) => c.type !== type);
    topicsCache.push({ type, data: topics, timestamp: Date.now() });

    return topics;
  } catch {
    return [];
  }
}

export function clearTopicsCache() {
  topicsCache = [];
}

// ─── Irregular Verbs ────────────────────────────────────
let verbsCache: any[] | null = null;
let verbsCacheTimestamp = 0;

export async function getIrregularVerbs(): Promise<any[]> {
  if (verbsCache && Date.now() - verbsCacheTimestamp < CACHE_TTL) {
    return verbsCache;
  }

  try {
    const res = await api.get('/apis/irregular-verbs/');
    const verbs = res.data.verbs || [];
    verbsCache = verbs;
    verbsCacheTimestamp = Date.now();
    return verbs;
  } catch {
    return [];
  }
}

export function clearVerbsCache() {
  verbsCache = null;
  verbsCacheTimestamp = 0;
}
