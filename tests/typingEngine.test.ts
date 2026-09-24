import { describe, it, expect, beforeEach } from 'vitest';
import { useTypingStore } from '../src/store/useTypingStore';
import { useStatsStore } from '../src/store/useStatsStore';

describe('Typing Engine & Analytics State', () => {
  beforeEach(() => {
    useTypingStore.getState().restart();
    useStatsStore.getState().clearStats();
  });

  it('should initialize with idle status and clean metrics', () => {
    const state = useTypingStore.getState();
    expect(state.status).toBe('idle');
    expect(state.currentIndex).toBe(0);
    expect(state.wpm).toBe(0);
    expect(state.accuracy).toBe(100);
    expect(state.errors).toBe(0);
    expect(state.history).toHaveLength(0);
  });

  it('should advance index and record keystroke when typing correct character', () => {
    const text = useTypingStore.getState().text;
    const firstChar = text[0];

    useTypingStore.getState().handleVirtualKeyPress(firstChar);

    const updated = useTypingStore.getState();
    expect(updated.status).toBe('running');
    expect(updated.currentIndex).toBe(1);
    expect(updated.errors).toBe(0);
    expect(updated.history).toHaveLength(1);
    expect(updated.history[0].correct).toBe(true);
    expect(updated.streak).toBe(1);
  });

  it('should flag error and increment error count on incorrect character', () => {
    const text = useTypingStore.getState().text;
    const wrongChar = text[0] === 'z' ? 'x' : 'z';

    useTypingStore.getState().handleVirtualKeyPress(wrongChar);

    const updated = useTypingStore.getState();
    expect(updated.currentIndex).toBe(1);
    expect(updated.errors).toBe(1);
    expect(updated.history[0].correct).toBe(false);
    expect(updated.streak).toBe(0);
  });

  it('should support switching modes and reset position cleanly', () => {
    useTypingStore.getState().setMode('code-snippets');
    const state = useTypingStore.getState();
    expect(state.mode).toBe('code-snippets');
    expect(state.currentIndex).toBe(0);
    expect(state.status).toBe('idle');
  });

  it('should record keypress in stats store and compute accuracy', () => {
    const stats = useStatsStore.getState();
    stats.recordKeypress('KeyA', 'left-pinky', true, 120);
    stats.recordKeypress('KeyA', 'left-pinky', true, 110);
    stats.recordKeypress('KeyA', 'left-pinky', false, 150);

    const updated = useStatsStore.getState();
    expect(updated.keyStats['KeyA'].hits).toBe(2);
    expect(updated.keyStats['KeyA'].errors).toBe(1);

    const finger = updated.fingerStats['left-pinky'];
    expect(finger.hits).toBe(2);
    expect(finger.errors).toBe(1);
    expect(finger.accuracy).toBe(67);
  });
});
