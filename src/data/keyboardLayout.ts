import { FingerId, KeyLayoutItem } from '../types/typing';

/**
 * Standard Finger Colors for touch typing visualization
 */
export const FINGER_COLORS: Record<FingerId, string> = {
  'left-pinky': '#f43f5e',   // Rose
  'left-ring': '#fb923c',    // Orange
  'left-middle': '#facc15',  // Yellow
  'left-index': '#34d399',   // Emerald
  'left-thumb': '#38bdf8',   // Sky
  'right-thumb': '#38bdf8',  // Sky
  'right-index': '#60a5fa',  // Blue
  'right-middle': '#818cf8', // Indigo
  'right-ring': '#c084fc',   // Purple
  'right-pinky': '#f472b6',  // Pink
};

export const FINGER_LABELS: Record<FingerId, string> = {
  'left-pinky': 'Left Pinky',
  'left-ring': 'Left Ring',
  'left-middle': 'Left Middle',
  'left-index': 'Left Index',
  'left-thumb': 'Left Thumb',
  'right-thumb': 'Right Thumb',
  'right-index': 'Right Index',
  'right-middle': 'Right Middle',
  'right-ring': 'Right Ring',
  'right-pinky': 'Right Pinky',
};

// ANSI 60%/TKL Key Definitions with 3D positions
// Base unit: 1U = 0.95 units width + 0.05 gap = 1.0 spacing
const START_X = -7.0;

export const KEYBOARD_KEYS: KeyLayoutItem[] = [
  // --- ROW 0 (Numbers, Z = -2.0) ---
  { id: 'Backquote', code: 'Backquote', char: '`', shiftChar: '~', finger: 'left-pinky', row: 0, col: 0, width: 1.0, x: START_X + 0.5, z: -2.0 },
  { id: 'Digit1', code: 'Digit1', char: '1', shiftChar: '!', finger: 'left-pinky', row: 0, col: 1, width: 1.0, x: START_X + 1.5, z: -2.0 },
  { id: 'Digit2', code: 'Digit2', char: '2', shiftChar: '@', finger: 'left-ring', row: 0, col: 2, width: 1.0, x: START_X + 2.5, z: -2.0 },
  { id: 'Digit3', code: 'Digit3', char: '3', shiftChar: '#', finger: 'left-middle', row: 0, col: 3, width: 1.0, x: START_X + 3.5, z: -2.0 },
  { id: 'Digit4', code: 'Digit4', char: '4', shiftChar: '$', finger: 'left-index', row: 0, col: 4, width: 1.0, x: START_X + 4.5, z: -2.0 },
  { id: 'Digit5', code: 'Digit5', char: '5', shiftChar: '%', finger: 'left-index', row: 0, col: 5, width: 1.0, x: START_X + 5.5, z: -2.0 },
  { id: 'Digit6', code: 'Digit6', char: '6', shiftChar: '^', finger: 'right-index', row: 0, col: 6, width: 1.0, x: START_X + 6.5, z: -2.0 },
  { id: 'Digit7', code: 'Digit7', char: '7', shiftChar: '&', finger: 'right-index', row: 0, col: 7, width: 1.0, x: START_X + 7.5, z: -2.0 },
  { id: 'Digit8', code: 'Digit8', char: '8', shiftChar: '*', finger: 'right-middle', row: 0, col: 8, width: 1.0, x: START_X + 8.5, z: -2.0 },
  { id: 'Digit9', code: 'Digit9', char: '9', shiftChar: '(', finger: 'right-ring', row: 0, col: 9, width: 1.0, x: START_X + 9.5, z: -2.0 },
  { id: 'Digit0', code: 'Digit0', char: '0', shiftChar: ')', finger: 'right-pinky', row: 0, col: 10, width: 1.0, x: START_X + 10.5, z: -2.0 },
  { id: 'Minus', code: 'Minus', char: '-', shiftChar: '_', finger: 'right-pinky', row: 0, col: 11, width: 1.0, x: START_X + 11.5, z: -2.0 },
  { id: 'Equal', code: 'Equal', char: '=', shiftChar: '+', finger: 'right-pinky', row: 0, col: 12, width: 1.0, x: START_X + 12.5, z: -2.0 },
  { id: 'Backspace', code: 'Backspace', char: 'Backspace', finger: 'right-pinky', row: 0, col: 13, width: 2.0, x: START_X + 14.0, z: -2.0 },

  // --- ROW 1 (Tab, QWERTY, Z = -1.0) ---
  { id: 'Tab', code: 'Tab', char: 'Tab', finger: 'left-pinky', row: 1, col: 0, width: 1.5, x: START_X + 0.75, z: -1.0 },
  { id: 'KeyQ', code: 'KeyQ', char: 'q', shiftChar: 'Q', finger: 'left-pinky', row: 1, col: 1, width: 1.0, x: START_X + 2.0, z: -1.0 },
  { id: 'KeyW', code: 'KeyW', char: 'w', shiftChar: 'W', finger: 'left-ring', row: 1, col: 2, width: 1.0, x: START_X + 3.0, z: -1.0 },
  { id: 'KeyE', code: 'KeyE', char: 'e', shiftChar: 'E', finger: 'left-middle', row: 1, col: 3, width: 1.0, x: START_X + 4.0, z: -1.0 },
  { id: 'KeyR', code: 'KeyR', char: 'r', shiftChar: 'R', finger: 'left-index', row: 1, col: 4, width: 1.0, x: START_X + 5.0, z: -1.0 },
  { id: 'KeyT', code: 'KeyT', char: 't', shiftChar: 'T', finger: 'left-index', row: 1, col: 5, width: 1.0, x: START_X + 6.0, z: -1.0 },
  { id: 'KeyY', code: 'KeyY', char: 'y', shiftChar: 'Y', finger: 'right-index', row: 1, col: 6, width: 1.0, x: START_X + 7.0, z: -1.0 },
  { id: 'KeyU', code: 'KeyU', char: 'u', shiftChar: 'U', finger: 'right-index', row: 1, col: 7, width: 1.0, x: START_X + 8.0, z: -1.0 },
  { id: 'KeyI', code: 'KeyI', char: 'i', shiftChar: 'I', finger: 'right-middle', row: 1, col: 8, width: 1.0, x: START_X + 9.0, z: -1.0 },
  { id: 'KeyO', code: 'KeyO', char: 'o', shiftChar: 'O', finger: 'right-ring', row: 1, col: 9, width: 1.0, x: START_X + 10.0, z: -1.0 },
  { id: 'KeyP', code: 'KeyP', char: 'p', shiftChar: 'P', finger: 'right-pinky', row: 1, col: 10, width: 1.0, x: START_X + 11.0, z: -1.0 },
  { id: 'BracketLeft', code: 'BracketLeft', char: '[', shiftChar: '{', finger: 'right-pinky', row: 1, col: 11, width: 1.0, x: START_X + 12.0, z: -1.0 },
  { id: 'BracketRight', code: 'BracketRight', char: ']', shiftChar: '}', finger: 'right-pinky', row: 1, col: 12, width: 1.0, x: START_X + 13.0, z: -1.0 },
  { id: 'Backslash', code: 'Backslash', char: '\\', shiftChar: '|', finger: 'right-pinky', row: 1, col: 13, width: 1.5, x: START_X + 14.25, z: -1.0 },

  // --- ROW 2 (Caps, ASDF - HOME ROW, Z = 0.0) ---
  { id: 'CapsLock', code: 'CapsLock', char: 'Caps', finger: 'left-pinky', row: 2, col: 0, width: 1.75, x: START_X + 0.875, z: 0.0 },
  { id: 'KeyA', code: 'KeyA', char: 'a', shiftChar: 'A', finger: 'left-pinky', row: 2, col: 1, width: 1.0, x: START_X + 2.25, z: 0.0, isHomeKey: true },
  { id: 'KeyS', code: 'KeyS', char: 's', shiftChar: 'S', finger: 'left-ring', row: 2, col: 2, width: 1.0, x: START_X + 3.25, z: 0.0, isHomeKey: true },
  { id: 'KeyD', code: 'KeyD', char: 'd', shiftChar: 'D', finger: 'left-middle', row: 2, col: 3, width: 1.0, x: START_X + 4.25, z: 0.0, isHomeKey: true },
  { id: 'KeyF', code: 'KeyF', char: 'f', shiftChar: 'F', finger: 'left-index', row: 2, col: 4, width: 1.0, x: START_X + 5.25, z: 0.0, isHomeKey: true },
  { id: 'KeyG', code: 'KeyG', char: 'g', shiftChar: 'G', finger: 'left-index', row: 2, col: 5, width: 1.0, x: START_X + 6.25, z: 0.0 },
  { id: 'KeyH', code: 'KeyH', char: 'h', shiftChar: 'H', finger: 'right-index', row: 2, col: 6, width: 1.0, x: START_X + 7.25, z: 0.0 },
  { id: 'KeyJ', code: 'KeyJ', char: 'j', shiftChar: 'J', finger: 'right-index', row: 2, col: 7, width: 1.0, x: START_X + 8.25, z: 0.0, isHomeKey: true },
  { id: 'KeyK', code: 'KeyK', char: 'k', shiftChar: 'K', finger: 'right-middle', row: 2, col: 8, width: 1.0, x: START_X + 9.25, z: 0.0, isHomeKey: true },
  { id: 'KeyL', code: 'KeyL', char: 'l', shiftChar: 'L', finger: 'right-ring', row: 2, col: 9, width: 1.0, x: START_X + 10.25, z: 0.0, isHomeKey: true },
  { id: 'Semicolon', code: 'Semicolon', char: ';', shiftChar: ':', finger: 'right-pinky', row: 2, col: 10, width: 1.0, x: START_X + 11.25, z: 0.0, isHomeKey: true },
  { id: 'Quote', code: 'Quote', char: "'", shiftChar: '"', finger: 'right-pinky', row: 2, col: 11, width: 1.0, x: START_X + 12.25, z: 0.0 },
  { id: 'Enter', code: 'Enter', char: 'Enter', finger: 'right-pinky', row: 2, col: 12, width: 2.25, x: START_X + 13.875, z: 0.0 },

  // --- ROW 3 (Shift, ZXCV, Z = 1.0) ---
  { id: 'ShiftLeft', code: 'ShiftLeft', char: 'Shift', finger: 'left-pinky', row: 3, col: 0, width: 2.25, x: START_X + 1.125, z: 1.0 },
  { id: 'KeyZ', code: 'KeyZ', char: 'z', shiftChar: 'Z', finger: 'left-pinky', row: 3, col: 1, width: 1.0, x: START_X + 2.75, z: 1.0 },
  { id: 'KeyX', code: 'KeyX', char: 'x', shiftChar: 'X', finger: 'left-ring', row: 3, col: 2, width: 1.0, x: START_X + 3.75, z: 1.0 },
  { id: 'KeyC', code: 'KeyC', char: 'c', shiftChar: 'C', finger: 'left-middle', row: 3, col: 3, width: 1.0, x: START_X + 4.75, z: 1.0 },
  { id: 'KeyV', code: 'KeyV', char: 'v', shiftChar: 'V', finger: 'left-index', row: 3, col: 4, width: 1.0, x: START_X + 5.75, z: 1.0 },
  { id: 'KeyB', code: 'KeyB', char: 'b', shiftChar: 'B', finger: 'left-index', row: 3, col: 5, width: 1.0, x: START_X + 6.75, z: 1.0 },
  { id: 'KeyN', code: 'KeyN', char: 'n', shiftChar: 'N', finger: 'right-index', row: 3, col: 6, width: 1.0, x: START_X + 7.75, z: 1.0 },
  { id: 'KeyM', code: 'KeyM', char: 'm', shiftChar: 'M', finger: 'right-index', row: 3, col: 7, width: 1.0, x: START_X + 8.75, z: 1.0 },
  { id: 'Comma', code: 'Comma', char: ',', shiftChar: '<', finger: 'right-middle', row: 3, col: 8, width: 1.0, x: START_X + 9.75, z: 1.0 },
  { id: 'Period', code: 'Period', char: '.', shiftChar: '>', finger: 'right-ring', row: 3, col: 9, width: 1.0, x: START_X + 10.75, z: 1.0 },
  { id: 'Slash', code: 'Slash', char: '/', shiftChar: '?', finger: 'right-pinky', row: 3, col: 10, width: 1.0, x: START_X + 11.75, z: 1.0 },
  { id: 'ShiftRight', code: 'ShiftRight', char: 'Shift', finger: 'right-pinky', row: 3, col: 11, width: 2.75, x: START_X + 13.625, z: 1.0 },

  // --- ROW 4 (Bottom / Spacebar, Z = 2.0) ---
  { id: 'ControlLeft', code: 'ControlLeft', char: 'Ctrl', finger: 'left-pinky', row: 4, col: 0, width: 1.25, x: START_X + 0.625, z: 2.0 },
  { id: 'MetaLeft', code: 'MetaLeft', char: 'Win', finger: 'left-pinky', row: 4, col: 1, width: 1.25, x: START_X + 1.875, z: 2.0 },
  { id: 'AltLeft', code: 'AltLeft', char: 'Alt', finger: 'left-thumb', row: 4, col: 2, width: 1.25, x: START_X + 3.125, z: 2.0 },
  { id: 'Space', code: 'Space', char: ' ', finger: 'right-thumb', row: 4, col: 3, width: 6.25, x: START_X + 6.875, z: 2.0, isHomeKey: true },
  { id: 'AltRight', code: 'AltRight', char: 'Alt', finger: 'right-thumb', row: 4, col: 4, width: 1.25, x: START_X + 10.625, z: 2.0 },
  { id: 'MetaRight', code: 'MetaRight', char: 'Win', finger: 'right-pinky', row: 4, col: 5, width: 1.25, x: START_X + 11.875, z: 2.0 },
  { id: 'ControlRight', code: 'ControlRight', char: 'Ctrl', finger: 'right-pinky', row: 4, col: 6, width: 1.75, x: START_X + 13.375, z: 2.0 },
];

// Quick index map for keys
export const KEY_BY_CODE = new Map<string, KeyLayoutItem>();
export const KEY_BY_CHAR = new Map<string, KeyLayoutItem>();
export const KEY_BY_SHIFT_CHAR = new Map<string, KeyLayoutItem>();

KEYBOARD_KEYS.forEach((k) => {
  KEY_BY_CODE.set(k.code, k);
  KEY_BY_CHAR.set(k.char.toLowerCase(), k);
  if (k.shiftChar) {
    KEY_BY_SHIFT_CHAR.set(k.shiftChar, k);
  }
});

/**
 * Standard Home Row resting 3D coordinates for each finger:
 * [X, Y, Z]
 * Y is slightly above the key surface (surface is around Y=0.25)
 */
export const RESTING_FINGER_POSITIONS: Record<FingerId, [number, number, number]> = {
  // Left Hand: A, S, D, F, Space (left side)
  'left-pinky': [-4.75, 0.45, 0.0],   // Resting over 'A'
  'left-ring': [-3.75, 0.45, 0.0],    // Resting over 'S'
  'left-middle': [-2.75, 0.45, 0.0],  // Resting over 'D'
  'left-index': [-1.75, 0.45, 0.0],   // Resting over 'F'
  'left-thumb': [-0.85, 0.45, 1.85],  // Resting over left half of Space

  // Right Hand: Space (right side), J, K, L, ;
  'right-thumb': [0.85, 0.45, 1.85],  // Resting over right half of Space
  'right-index': [1.25, 0.45, 0.0],   // Resting over 'J'
  'right-middle': [2.25, 0.45, 0.0],  // Resting over 'K'
  'right-ring': [3.25, 0.45, 0.0],    // Resting over 'L'
  'right-pinky': [4.25, 0.45, 0.0],   // Resting over ';'
};

/**
 * Palm & Wrist reference base origins
 */
export const HAND_BASE_POSITIONS = {
  left: {
    wrist: [-3.8, 0.95, 3.2] as [number, number, number],
    palm: [-3.2, 0.70, 1.6] as [number, number, number],
    rotation: [0.12, 0.16, -0.06] as [number, number, number],
  },
  right: {
    wrist: [3.8, 0.95, 3.2] as [number, number, number],
    palm: [3.2, 0.70, 1.6] as [number, number, number],
    rotation: [0.12, -0.16, 0.06] as [number, number, number],
  },
};

/**
 * Finds the KeyLayoutItem corresponding to a typed character or keycode
 */
export function findKeyItem(charOrCode: string): KeyLayoutItem | undefined {
  if (charOrCode === ' ') {
    return KEY_BY_CODE.get('Space');
  }
  if (KEY_BY_CODE.has(charOrCode)) {
    return KEY_BY_CODE.get(charOrCode);
  }
  if (KEY_BY_SHIFT_CHAR.has(charOrCode)) {
    return KEY_BY_SHIFT_CHAR.get(charOrCode);
  }
  return KEY_BY_CHAR.get(charOrCode.toLowerCase());
}

/**
 * Determines which finger should type a given character
 */
export function getFingerForChar(char: string): FingerId {
  const item = findKeyItem(char);
  if (item) {
    return item.finger;
  }
  // Default to right index if not mapped
  return 'right-index';
}

/**
 * Determines if a character requires Shift and which shift key to use
 */
export function getShiftInfo(char: string): { requiresShift: boolean; shiftKeyId?: string; shiftFinger?: FingerId } {
  const isUpper = char.length === 1 && char >= 'A' && char <= 'Z';
  const isShiftSymbol = KEY_BY_SHIFT_CHAR.has(char);

  if (!isUpper && !isShiftSymbol) {
    return { requiresShift: false };
  }

  // Find base key
  const baseKey = findKeyItem(char);
  if (!baseKey) {
    return { requiresShift: true, shiftKeyId: 'ShiftRight', shiftFinger: 'right-pinky' };
  }

  // If primary key is on the left hand, use Right Shift (right pinky)
  if (baseKey.finger.startsWith('left')) {
    return { requiresShift: true, shiftKeyId: 'ShiftRight', shiftFinger: 'right-pinky' };
  } else {
    // If primary key is on right hand, use Left Shift (left pinky)
    return { requiresShift: true, shiftKeyId: 'ShiftLeft', shiftFinger: 'left-pinky' };
  }
}
