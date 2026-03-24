import { useState, useCallback } from 'react';

const STORAGE_KEY = 'adsb-feed-history';
const MAX_HISTORY = 8;

export function useFeedHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const addUrl = useCallback((url: string) => {
    setHistory((prev) => {
      const next = [url, ...prev.filter((u) => u !== url)].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeUrl = useCallback((url: string) => {
    setHistory((prev) => {
      const next = prev.filter((u) => u !== url);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { history, addUrl, removeUrl };
}
