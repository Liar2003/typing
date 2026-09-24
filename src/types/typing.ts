/**
 * Strict TypeScript types for 3D Holographic Typing Tutor
 */

export type HandId = 'left' | 'right';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyLayoutItem {
  id: string;            // unique identifier e.g. "KeyA", "Digit1", "Space"
  code: string;          // event.code
  char: string;          // primary character 'a', '1', ' '
  shiftChar?: string;    // character when shifted 'A', '!', etc.
  finger: FingerId;
  row: number;           // 0: numbers, 1: QWERTY, 2: ASDF, 3: ZXCV, 4: Space
  col: number;
  width: number;         // 1 = standard 1U
  x: number;             // 3D local X coordinate
  z: number;             // 3D local Z coordinate
  isHomeKey?: boolean;   // F, J, A, S, D, K, L, ;, Space
}

export type FingerPhase = 'idle' | 'striking' | 'recovering';

export interface FingerAnimationState {
  fingerId: FingerId;
  phase: FingerPhase;
  progress: number;      // 0 to 1
  startTime: number;
  duration: number;
  targetKeyId: string | null;
  targetPosition: [number, number, number] | null;
  currentTipPosition: [number, number, number];
}

export interface KeypressImpact {
  id: string;
  keyId: string;
  x: number;
  y: number;
  z: number;
  timestamp: number;
  isCorrect: boolean;
  fingerId: FingerId;
}

export type TestMode =
  | 'home-row'
  | 'top-row'
  | 'bottom-row'
  | 'numbers-symbols'
  | 'common-words'
  | 'code-snippets'
  | 'quotes'
  | 'custom';

export type DurationOption = 15 | 30 | 60 | 120 | 'words-25' | 'words-50' | 'free';

export type ThemeId = 'cyan' | 'amber' | 'emerald' | 'violet';

export type CameraPreset = 'first-person' | 'angled' | 'tactical-top' | 'close-up';

export interface TypedCharacterRecord {
  char: string;
  expected: string;
  correct: boolean;
  timestamp: number;
  keyId: string;
  fingerId: FingerId;
}

export interface KeyStat {
  hits: number;
  errors: number;
  totalTimeMs: number;
}

export interface FingerStat {
  hits: number;
  errors: number;
  accuracy: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  durationSeconds: number;
  mode: TestMode;
  keystrokes: number;
  rank: string;
}
