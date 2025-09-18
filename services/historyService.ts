import type { HistoryItem } from '../types';

const HISTORY_KEY = 'lexiguard_analysis_history';

export const getHistory = (): HistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    const history = JSON.parse(historyJson) as HistoryItem[];
    // Sort by date, newest first
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    localStorage.removeItem(HISTORY_KEY);
    return [];
  }
};

export const saveToHistory = (item: HistoryItem): HistoryItem[] => {
  let history = getHistory();
  // Prevent duplicates and insert the new item at the beginning.
  history = [item, ...history.filter(h => h.id !== item.id)];
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
  return history;
};
