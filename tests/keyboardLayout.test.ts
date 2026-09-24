import { describe, it, expect } from 'vitest';
import {
  findKeyItem,
  getFingerForChar,
  getShiftInfo,
  KEYBOARD_KEYS,
  RESTING_FINGER_POSITIONS,
  FINGER_COLORS,
} from '../src/data/keyboardLayout';

describe('Keyboard Layout & Touch Typing Mapping', () => {
  it('should define all essential standard QWERTY keys', () => {
    expect(KEYBOARD_KEYS.length).toBeGreaterThanOrEqual(58);
    const codes = KEYBOARD_KEYS.map((k) => k.code);
    expect(codes).toContain('KeyA');
    expect(codes).toContain('KeyF');
    expect(codes).toContain('KeyJ');
    expect(codes).toContain('Space');
    expect(codes).toContain('Enter');
    expect(codes).toContain('Backspace');
  });

  it('should map home-row keys to correct touch typing fingers', () => {
    // Left Hand Home Row: A S D F
    expect(getFingerForChar('a')).toBe('left-pinky');
    expect(getFingerForChar('s')).toBe('left-ring');
    expect(getFingerForChar('d')).toBe('left-middle');
    expect(getFingerForChar('f')).toBe('left-index');

    // Right Hand Home Row: J K L ;
    expect(getFingerForChar('j')).toBe('right-index');
    expect(getFingerForChar('k')).toBe('right-middle');
    expect(getFingerForChar('l')).toBe('right-ring');
    expect(getFingerForChar(';')).toBe('right-pinky');

    // Spacebar to thumb
    expect(getFingerForChar(' ')).toBe('right-thumb');
  });

  it('should correctly handle reaching keys on upper and lower rows', () => {
    // Top Row
    expect(getFingerForChar('q')).toBe('left-pinky');
    expect(getFingerForChar('w')).toBe('left-ring');
    expect(getFingerForChar('e')).toBe('left-middle');
    expect(getFingerForChar('r')).toBe('left-index');
    expect(getFingerForChar('t')).toBe('left-index');
    expect(getFingerForChar('y')).toBe('right-index');
    expect(getFingerForChar('u')).toBe('right-index');
    expect(getFingerForChar('i')).toBe('right-middle');
    expect(getFingerForChar('o')).toBe('right-ring');
    expect(getFingerForChar('p')).toBe('right-pinky');

    // Bottom Row
    expect(getFingerForChar('z')).toBe('left-pinky');
    expect(getFingerForChar('x')).toBe('left-ring');
    expect(getFingerForChar('c')).toBe('left-middle');
    expect(getFingerForChar('v')).toBe('left-index');
    expect(getFingerForChar('b')).toBe('left-index');
    expect(getFingerForChar('n')).toBe('right-index');
    expect(getFingerForChar('m')).toBe('right-index');
  });

  it('should correctly coordinate opposite-hand Shift keys for capital letters and symbols', () => {
    // Left-hand letter 'A': should use Right Shift (right-pinky)
    const shiftA = getShiftInfo('A');
    expect(shiftA.requiresShift).toBe(true);
    expect(shiftA.shiftFinger).toBe('right-pinky');
    expect(shiftA.shiftKeyId).toBe('ShiftRight');

    // Right-hand letter 'J': should use Left Shift (left-pinky)
    const shiftJ = getShiftInfo('J');
    expect(shiftJ.requiresShift).toBe(true);
    expect(shiftJ.shiftFinger).toBe('left-pinky');
    expect(shiftJ.shiftKeyId).toBe('ShiftLeft');

    // Symbol '!' (above 1 on left pinky): should use Right Shift
    const shiftExcl = getShiftInfo('!');
    expect(shiftExcl.requiresShift).toBe(true);
    expect(shiftExcl.shiftFinger).toBe('right-pinky');

    // Unshifted lowercase 'a': should not require shift
    const noShift = getShiftInfo('a');
    expect(noShift.requiresShift).toBe(false);
  });

  it('should have resting home-row 3D positions for all 10 fingers', () => {
    const fingerIds = Object.keys(RESTING_FINGER_POSITIONS);
    expect(fingerIds.length).toBe(10);
    fingerIds.forEach((fid) => {
      const pos = RESTING_FINGER_POSITIONS[fid as keyof typeof RESTING_FINGER_POSITIONS];
      expect(pos).toHaveLength(3);
      expect(typeof pos[0]).toBe('number');
      expect(typeof pos[1]).toBe('number');
      expect(typeof pos[2]).toBe('number');
    });
  });

  it('should have color mappings for all fingers', () => {
    const colorKeys = Object.keys(FINGER_COLORS);
    expect(colorKeys.length).toBe(10);
    colorKeys.forEach((key) => {
      expect(FINGER_COLORS[key as keyof typeof FINGER_COLORS]).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
