import React, { useEffect, useRef } from 'react';
import { useTypingStore } from '../../store/useTypingStore';
import { FINGER_COLORS, FINGER_LABELS, getFingerForChar, getShiftInfo } from '../../data/keyboardLayout';

export function TypingDisplay() {
  const {
    text,
    currentIndex,
    history,
    lessonTitle,
    status,
    handleKeyDown,
    handleKeyUp,
    startTest,
  } = useTypingStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Global physical keyboard listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input or textarea modal is focused
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      handleKeyDown(e);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      handleKeyUp(e);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Keep active character scrolled into comfortable view
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const charEl = activeCharRef.current;
      const offsetTop = charEl.offsetTop - container.offsetTop;
      container.scrollTo({
        top: Math.max(0, offsetTop - 60),
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const nextChar = text[currentIndex] ?? '';
  const nextFinger = nextChar ? getFingerForChar(nextChar) : null;
  const shiftInfo = nextChar ? getShiftInfo(nextChar) : { requiresShift: false };
  const fingerColor = nextFinger ? FINGER_COLORS[nextFinger] : '#00f0ff';
  const fingerName = nextFinger ? FINGER_LABELS[nextFinger] : '';

  return (
    <div
      onClick={startTest}
      className="w-full max-w-4xl mx-auto px-6 py-4 bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-xl transition-all"
    >
      {/* Lesson Meta Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800/60 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-200">{lessonTitle}</span>
          <span aria-hidden="true">·</span>
          <span>{text.length} characters</span>
          <span aria-hidden="true">·</span>
          <span>{text.split(/\s+/).filter(Boolean).length} words</span>
        </div>

        {/* Dynamic Finger Guide Hint */}
        {nextChar && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400">Target:</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold border border-slate-700">
              {nextChar === ' ' ? 'SPACE' : nextChar === '\n' ? 'ENTER' : nextChar}
            </span>
            {shiftInfo.requiresShift && (
              <span className="text-amber-400 font-semibold">
                + SHIFT ({shiftInfo.shiftFinger?.includes('right') ? 'Right' : 'Left'})
              </span>
            )}
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: fingerColor }}
              />
              <span style={{ color: fingerColor }} className="font-semibold">
                {fingerName}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Text Stream Viewport */}
      <div
        ref={containerRef}
        tabIndex={0}
        className="max-h-28 overflow-y-auto font-mono text-xl sm:text-2xl leading-relaxed tracking-wide select-none focus:outline-none scroll-smooth relative"
      >
        {status === 'idle' && currentIndex === 0 && (
          <div className="absolute right-2 top-0 pointer-events-none text-xs font-sans text-cyan-400/80 animate-pulse">
            Click or press any key to initiate...
          </div>
        )}

        {text.split('').map((char, index) => {
          let charClass = 'text-slate-600';
          const isCurrent = index === currentIndex;
          const isTyped = index < currentIndex;

          if (isTyped) {
            const hist = history[index];
            if (hist && hist.correct) {
              charClass = 'text-slate-100 font-medium';
            } else {
              charClass = 'text-rose-400 bg-rose-500/20 underline decoration-rose-500 rounded-xs';
            }
          }

          if (isCurrent) {
            return (
              <span
                key={index}
                ref={activeCharRef}
                className="relative text-cyan-300 font-bold bg-cyan-500/25 px-0.5 rounded ring-1 ring-cyan-400/70 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
              >
                {char === ' ' ? '␣' : char === '\n' ? '↵\n' : char}
                {/* Holographic glowing caret beam */}
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 animate-pulse" />
              </span>
            );
          }

          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
