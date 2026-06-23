import { useEffect, useCallback, useState } from 'react';
import { getTopics, getIrregularVerbs } from './contentApi';

// ─── useTopics ──────────────────────────────────────────
export function useTopics(type: 'vocab' | 'sentence' = 'vocab') {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopics(type);
      setTopics(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { topics, loading, error, refresh };
}

// ─── useIrregularVerbs ──────────────────────────────────
export function useIrregularVerbs() {
  const [verbs, setVerbs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIrregularVerbs();
      setVerbs(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load irregular verbs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { verbs, loading, error, refresh };
}
