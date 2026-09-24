import { create } from 'zustand';
import { FingerId, FingerStat, KeyStat, TestResult } from '../types/typing';

interface StatsState {
  history: TestResult[];
  keyStats: Record<string, KeyStat>;
  fingerStats: Record<FingerId, FingerStat>;

  recordKeypress: (keyId: string, fingerId: FingerId, isCorrect: boolean, timeMs: number) => void;
  recordTestResult: (result: Omit<TestResult, 'id'>) => TestResult;
  clearStats: () => void;
  getBestWpm: () => number;
  getAverageWpm: () => number;
}

const STORAGE_KEY = 'cybertype_stats_v1';

const INITIAL_FINGERS: Record<FingerId, FingerStat> = {
  'left-pinky': { hits: 0, errors: 0, accuracy: 100 },
  'left-ring': { hits: 0, errors: 0, accuracy: 100 },
  'left-middle': { hits: 0, errors: 0, accuracy: 100 },
  'left-index': { hits: 0, errors: 0, accuracy: 100 },
  'left-thumb': { hits: 0, errors: 0, accuracy: 100 },
  'right-thumb': { hits: 0, errors: 0, accuracy: 100 },
  'right-index': { hits: 0, errors: 0, accuracy: 100 },
  'right-middle': { hits: 0, errors: 0, accuracy: 100 },
  'right-ring': { hits: 0, errors: 0, accuracy: 100 },
  'right-pinky': { hits: 0, errors: 0, accuracy: 100 },
};

function loadStoredStats(): {
  history: TestResult[];
  keyStats: Record<string, KeyStat>;
  fingerStats: Record<FingerId, FingerStat>;
} {
  if (typeof window === 'undefined') {
    return { history: [], keyStats: {}, fingerStats: INITIAL_FINGERS };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { history: [], keyStats: {}, fingerStats: INITIAL_FINGERS };
    const parsed = JSON.parse(raw);
    return {
      history: Array.isArray(parsed.history) ? parsed.history : [],
      keyStats: parsed.keyStats || {},
      fingerStats: { ...INITIAL_FINGERS, ...(parsed.fingerStats || {}) },
    };
  } catch {
    return { history: [], keyStats: {}, fingerStats: INITIAL_FINGERS };
  }
}

export const useStatsStore = create<StatsState>((set, get) => {
  const initial = loadStoredStats();

  const persist = (data: {
    history: TestResult[];
    keyStats: Record<string, KeyStat>;
    fingerStats: Record<FingerId, FingerStat>;
  }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  };

  return {
    history: initial.history,
    keyStats: initial.keyStats,
    fingerStats: initial.fingerStats,

    recordKeypress: (keyId, fingerId, isCorrect, timeMs) => {
      set((state) => {
        // Update key stats
        const currentKey = state.keyStats[keyId] || { hits: 0, errors: 0, totalTimeMs: 0 };
        const updatedKey: KeyStat = {
          hits: currentKey.hits + (isCorrect ? 1 : 0),
          errors: currentKey.errors + (isCorrect ? 0 : 1),
          totalTimeMs: currentKey.totalTimeMs + timeMs,
        };

        // Update finger stats
        const currentFinger = state.fingerStats[fingerId] || { hits: 0, errors: 0, accuracy: 100 };
        const hits = currentFinger.hits + (isCorrect ? 1 : 0);
        const errors = currentFinger.errors + (isCorrect ? 0 : 1);
        const total = hits + errors;
        const accuracy = total > 0 ? Math.round((hits / total) * 100) : 100;

        const updatedKeyStats = { ...state.keyStats, [keyId]: updatedKey };
        const updatedFingerStats = {
          ...state.fingerStats,
          [fingerId]: { hits, errors, accuracy },
        };

        persist({
          history: state.history,
          keyStats: updatedKeyStats,
          fingerStats: updatedFingerStats,
        });

        return {
          keyStats: updatedKeyStats,
          fingerStats: updatedFingerStats,
        };
      });
    },

    recordTestResult: (resultData) => {
      const newResult: TestResult = {
        ...resultData,
        id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };

      set((state) => {
        const history = [newResult, ...state.history].slice(0, 50); // Keep last 50 tests
        persist({
          history,
          keyStats: state.keyStats,
          fingerStats: state.fingerStats,
        });
        return { history };
      });

      return newResult;
    },

    clearStats: () => {
      const reset = {
        history: [],
        keyStats: {},
        fingerStats: INITIAL_FINGERS,
      };
      persist(reset);
      set(reset);
    },

    getBestWpm: () => {
      const hist = get().history;
      if (hist.length === 0) return 0;
      return Math.max(...hist.map((h) => h.wpm));
    },

    getAverageWpm: () => {
      const hist = get().history;
      if (hist.length === 0) return 0;
      const sum = hist.reduce((acc, h) => acc + h.wpm, 0);
      return Math.round(sum / hist.length);
    },
  };
});
