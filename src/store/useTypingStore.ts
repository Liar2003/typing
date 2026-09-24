import { create } from 'zustand';
import {
  DurationOption,
  FingerId,
  KeypressImpact,
  TestMode,
  TestResult,
  TypedCharacterRecord,
} from '../types/typing';
import { getRandomLesson, LESSONS } from '../data/lessons';
import { findKeyItem, getFingerForChar, getShiftInfo, KEY_BY_CODE } from '../data/keyboardLayout';
import { soundEngine } from '../audio/soundEngine';
import { useStatsStore } from './useStatsStore';

interface TypingState {
  // Test configuration
  mode: TestMode;
  lessonTitle: string;
  text: string;
  durationOption: DurationOption;
  customText: string;

  // Runtime typing state
  status: 'idle' | 'running' | 'completed' | 'paused';
  currentIndex: number;
  history: TypedCharacterRecord[];
  errors: number;
  streak: number;
  maxStreak: number;
  startTime: number | null;
  endTime: number | null;
  elapsedSeconds: number;
  remainingSeconds: number;

  // Realtime calculated metrics
  wpm: number;
  rawWpm: number;
  accuracy: number;

  // 3D Visual synchronization state
  activeKeyCodes: Set<string>;
  fingerStrikeQueue: Array<{
    fingerId: FingerId;
    targetKeyId: string;
    targetPosition: [number, number, number];
    timestamp: number;
  }>;
  recentImpacts: KeypressImpact[];

  // Modal visibility
  showResultsModal: boolean;
  showCustomModal: boolean;
  showHeatmapModal: boolean;
  showSettingsModal: boolean;
  lastTestResult: TestResult | null;

  // Actions
  setMode: (mode: TestMode) => void;
  setDurationOption: (opt: DurationOption) => void;
  setCustomText: (text: string) => void;
  startTest: () => void;
  restart: () => void;
  tickTimer: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
  handleVirtualKeyPress: (char: string, code?: string) => void;
  finishTest: () => void;
  closeResultsModal: () => void;
  setShowCustomModal: (show: boolean) => void;
  setShowHeatmapModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  consumeImpact: (id: string) => void;
}

function calculateWpm(keystrokes: number, errorCount: number, seconds: number) {
  if (seconds <= 0 || keystrokes <= 0) return { wpm: 0, rawWpm: 0, accuracy: 100 };
  const minutes = seconds / 60;
  const rawWpm = Math.round((keystrokes / 5) / minutes);
  const netWpm = Math.max(0, Math.round(((keystrokes - errorCount) / 5) / minutes));
  const accuracy = Math.max(0, Math.min(100, Math.round(((keystrokes - errorCount) / keystrokes) * 100)));
  return { wpm: netWpm, rawWpm, accuracy };
}

function getRank(wpm: number, accuracy: number): string {
  if (wpm >= 100 && accuracy >= 98) return 'Cyber Overlord (S+)';
  if (wpm >= 80 && accuracy >= 95) return 'Quantum Hacker (S)';
  if (wpm >= 60 && accuracy >= 90) return 'Neon Runner (A)';
  if (wpm >= 40 && accuracy >= 85) return 'Matrix Operator (B)';
  if (wpm >= 25) return 'Console Initiate (C)';
  return 'Neural Novice (D)';
}

export const useTypingStore = create<TypingState>((set, get) => {
  const initialLesson = getRandomLesson('home-row');

  return {
    mode: 'home-row',
    lessonTitle: initialLesson.title,
    text: initialLesson.text,
    durationOption: 60,
    customText: '',

    status: 'idle',
    currentIndex: 0,
    history: [],
    errors: 0,
    streak: 0,
    maxStreak: 0,
    startTime: null,
    endTime: null,
    elapsedSeconds: 0,
    remainingSeconds: 60,

    wpm: 0,
    rawWpm: 0,
    accuracy: 100,

    activeKeyCodes: new Set<string>(),
    fingerStrikeQueue: [],
    recentImpacts: [],

    showResultsModal: false,
    showCustomModal: false,
    showHeatmapModal: false,
    showSettingsModal: false,
    lastTestResult: null,

    setMode: (mode) => {
      let lesson = getRandomLesson(mode);
      if (mode === 'custom') {
        const custom = get().customText.trim();
        lesson = {
          id: 'custom',
          title: 'Custom Practice Passage',
          text: custom.length > 0 ? custom : LESSONS['custom'][0].text,
        };
      }
      set({
        mode,
        lessonTitle: lesson.title,
        text: lesson.text,
        status: 'idle',
        currentIndex: 0,
        history: [],
        errors: 0,
        streak: 0,
        maxStreak: 0,
        startTime: null,
        endTime: null,
        elapsedSeconds: 0,
        remainingSeconds: typeof get().durationOption === 'number' ? (get().durationOption as number) : 60,
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        activeKeyCodes: new Set(),
        fingerStrikeQueue: [],
        recentImpacts: [],
        showResultsModal: false,
      });
    },

    setDurationOption: (opt) => {
      const isSeconds = typeof opt === 'number';
      set({
        durationOption: opt,
        remainingSeconds: isSeconds ? opt : 0,
      });
      get().restart();
    },

    setCustomText: (text) => {
      const trimmed = text.trim();
      set({
        customText: trimmed,
        mode: 'custom',
        lessonTitle: 'Custom Technical Buffer',
        text: trimmed.length > 0 ? trimmed : LESSONS['custom'][0].text,
      });
      get().restart();
    },

    startTest: () => {
      if (get().status === 'idle') {
        set({
          status: 'running',
          startTime: Date.now(),
        });
      }
    },

    restart: () => {
      const { mode, durationOption, customText } = get();
      let lesson = getRandomLesson(mode);
      if (mode === 'custom' && customText.trim().length > 0) {
        lesson = {
          id: 'custom',
          title: 'Custom Technical Buffer',
          text: customText.trim(),
        };
      }

      set({
        lessonTitle: lesson.title,
        text: lesson.text,
        status: 'idle',
        currentIndex: 0,
        history: [],
        errors: 0,
        streak: 0,
        maxStreak: 0,
        startTime: null,
        endTime: null,
        elapsedSeconds: 0,
        remainingSeconds: typeof durationOption === 'number' ? durationOption : 60,
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        activeKeyCodes: new Set(),
        fingerStrikeQueue: [],
        recentImpacts: [],
        showResultsModal: false,
      });
    },

    tickTimer: () => {
      const state = get();
      if (state.status !== 'running' || !state.startTime) return;

      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const isTimed = typeof state.durationOption === 'number';

      if (isTimed) {
        const remaining = Math.max(0, (state.durationOption as number) - elapsed);
        const { wpm, rawWpm, accuracy } = calculateWpm(
          state.history.length,
          state.errors,
          Math.max(1, elapsed)
        );

        set({
          elapsedSeconds: elapsed,
          remainingSeconds: remaining,
          wpm,
          rawWpm,
          accuracy,
        });

        if (remaining <= 0) {
          get().finishTest();
        }
      } else {
        // Free practice or word-based
        const { wpm, rawWpm, accuracy } = calculateWpm(
          state.history.length,
          state.errors,
          Math.max(1, elapsed)
        );

        set({
          elapsedSeconds: elapsed,
          wpm,
          rawWpm,
          accuracy,
        });
      }
    },

    finishTest: () => {
      const state = get();
      if (state.status === 'completed') return;

      const now = Date.now();
      const durationSeconds = state.startTime ? Math.max(1, Math.round((now - state.startTime) / 1000)) : 1;
      const { wpm, rawWpm, accuracy } = calculateWpm(state.history.length, state.errors, durationSeconds);
      const rank = getRank(wpm, accuracy);

      soundEngine.playCompletion();

      const result = useStatsStore.getState().recordTestResult({
        timestamp: now,
        wpm,
        rawWpm,
        accuracy,
        errors: state.errors,
        durationSeconds,
        mode: state.mode,
        keystrokes: state.history.length,
        rank,
      });

      set({
        status: 'completed',
        endTime: now,
        wpm,
        rawWpm,
        accuracy,
        lastTestResult: result,
        showResultsModal: true,
        activeKeyCodes: new Set(),
      });
    },

    handleKeyUp: (e: KeyboardEvent) => {
      const active = new Set(get().activeKeyCodes);
      active.delete(e.code);
      set({ activeKeyCodes: active });
    },

    handleKeyDown: (e: KeyboardEvent) => {
      const state = get();

      // Don't intercept shortcuts like Ctrl+R, F5, F12, Tab (unless typing tab)
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Escape') {
        get().restart();
        return;
      }

      // Add to active keys for 3D key depression
      const active = new Set(state.activeKeyCodes);
      active.add(e.code);
      set({ activeKeyCodes: active });

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (state.currentIndex > 0) {
          const newIndex = state.currentIndex - 1;
          const newHistory = state.history.slice(0, -1);
          set({
            currentIndex: newIndex,
            history: newHistory,
          });
        }
        return;
      }

      // Check single printable character or space or enter
      if (e.key.length === 1 || e.key === 'Enter') {
        e.preventDefault();
        const char = e.key === 'Enter' ? '\n' : e.key;
        get().handleVirtualKeyPress(char, e.code);
      }
    },

    handleVirtualKeyPress: (inputChar: string, inputCode?: string) => {
      const state = get();
      if (state.status === 'completed') return;

      // Start test on first keypress
      if (state.status === 'idle') {
        set({
          status: 'running',
          startTime: Date.now(),
        });
      }

      const expectedChar = state.text[state.currentIndex];
      if (!expectedChar) {
        get().finishTest();
        return;
      }

      const isCorrect = inputChar === expectedChar;
      const finger = getFingerForChar(inputChar);
      const keyItem = findKeyItem(inputChar) || (inputCode ? KEY_BY_CODE.get(inputCode) : undefined);
      const keyId = keyItem ? keyItem.id : 'Unknown';

      // Audio feedback
      if (isCorrect) {
        soundEngine.playKeyClick(inputChar === ' ');
      } else {
        soundEngine.playError();
      }

      // Record in stats store
      useStatsStore.getState().recordKeypress(keyId, finger, isCorrect, 100);

      // Trigger 3D Finger & Key Animation
      const targetPos: [number, number, number] = keyItem
        ? [keyItem.x, 0.25, keyItem.z]
        : [0, 0.25, 0];

      // Handle Shift coordination if shifted
      const shiftInfo = getShiftInfo(inputChar);
      const newStrikes = [...state.fingerStrikeQueue];

      if (shiftInfo.requiresShift && shiftInfo.shiftFinger && shiftInfo.shiftKeyId) {
        const shiftKeyItem = KEY_BY_CODE.get(shiftInfo.shiftKeyId);
        if (shiftKeyItem) {
          newStrikes.push({
            fingerId: shiftInfo.shiftFinger,
            targetKeyId: shiftKeyItem.id,
            targetPosition: [shiftKeyItem.x, 0.25, shiftKeyItem.z],
            timestamp: Date.now(),
          });
        }
      }

      newStrikes.push({
        fingerId: finger,
        targetKeyId: keyId,
        targetPosition: targetPos,
        timestamp: Date.now(),
      });

      // Spawn impact ring
      const impact: KeypressImpact = {
        id: `impact-${Date.now()}-${Math.random()}`,
        keyId,
        x: targetPos[0],
        y: targetPos[1],
        z: targetPos[2],
        timestamp: Date.now(),
        isCorrect,
        fingerId: finger,
      };

      const newHistory: TypedCharacterRecord[] = [
        ...state.history,
        {
          char: inputChar,
          expected: expectedChar,
          correct: isCorrect,
          timestamp: Date.now(),
          keyId,
          fingerId: finger,
        },
      ];

      const newIndex = state.currentIndex + 1;
      const newErrors = isCorrect ? state.errors : state.errors + 1;
      const newStreak = isCorrect ? state.streak + 1 : 0;
      const newMaxStreak = Math.max(state.maxStreak, newStreak);

      set({
        currentIndex: newIndex,
        history: newHistory,
        errors: newErrors,
        streak: newStreak,
        maxStreak: newMaxStreak,
        fingerStrikeQueue: newStrikes.slice(-10),
        recentImpacts: [...state.recentImpacts.slice(-15), impact],
      });

      // Check word count mode goal
      if (typeof state.durationOption === 'string' && state.durationOption.startsWith('words-')) {
        const targetWords = parseInt(state.durationOption.replace('words-', ''), 10);
        const typedWords = state.text.slice(0, newIndex).split(/\s+/).filter(Boolean).length;
        if (typedWords >= targetWords) {
          get().finishTest();
          return;
        }
      }

      // Check text end
      if (newIndex >= state.text.length) {
        get().finishTest();
      }
    },

    consumeImpact: (id) => {
      set((s) => ({
        recentImpacts: s.recentImpacts.filter((item) => item.id !== id),
      }));
    },

    closeResultsModal: () => set({ showResultsModal: false }),
    setShowCustomModal: (show) => set({ showCustomModal: show }),
    setShowHeatmapModal: (show) => set({ showHeatmapModal: show }),
    setShowSettingsModal: (show) => set({ showSettingsModal: show }),
  };
});
