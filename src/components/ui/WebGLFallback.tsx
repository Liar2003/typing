import React from 'react';
import { FINGER_COLORS, FINGER_LABELS, KEYBOARD_KEYS } from '../../data/keyboardLayout';
import { useTypingStore } from '../../store/useTypingStore';
import { useStatsStore } from '../../store/useStatsStore';
import { useSettingsStore } from '../../store/useSettingsStore';

export function WebGLFallback() {
  const {
    activeKeyCodes,
    text,
    currentIndex,
    handleVirtualKeyPress,
  } = useTypingStore();

  const keyStats = useStatsStore((s) => s.keyStats);
  const { showHeatmapOnKeys, showFingerGuides, theme } = useSettingsStore();

  const expectedChar = text[currentIndex] ?? null;

  // Group keys by row
  const rows = [0, 1, 2, 3, 4].map((r) =>
    KEYBOARD_KEYS.filter((k) => k.row === r).sort((a, b) => a.col - b.col)
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="mb-4 text-center">
        <span className="text-xs uppercase tracking-wider text-cyan-400 font-display">
          2D Holographic Matrix Keyboard
        </span>
        <p className="text-xs text-slate-400">
          Touch-typing finger positioning active. Click or type with your physical keyboard.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-2xl relative">
        <div className="flex flex-col gap-2">
          {rows.map((rowKeys, rowIdx) => (
            <div key={rowIdx} className="flex gap-1.5 justify-center w-full">
              {rowKeys.map((k) => {
                const isPressed = activeKeyCodes.has(k.code);
                const isTarget =
                  expectedChar !== null &&
                  (k.char.toLowerCase() === expectedChar.toLowerCase() ||
                    k.shiftChar === expectedChar ||
                    (expectedChar === ' ' && k.code === 'Space') ||
                    (expectedChar === '\n' && k.code === 'Enter'));

                const fingerColor = FINGER_COLORS[k.finger];
                const stat = keyStats[k.id];

                let heatBg = '';
                if (showHeatmapOnKeys && stat) {
                  const total = stat.hits + stat.errors;
                  if (total > 0) {
                    const ratio = stat.errors / total;
                    if (ratio > 0.3) heatBg = 'border-rose-500 text-rose-300';
                    else if (ratio > 0.1) heatBg = 'border-amber-500 text-amber-300';
                    else heatBg = 'border-emerald-500 text-emerald-300';
                  }
                }

                // Width scale
                const flexBasis = `${Math.max(38, k.width * 52)}px`;

                return (
                  <button
                    key={k.id}
                    onClick={() => handleVirtualKeyPress(k.char, k.code)}
                    style={{
                      flexBasis,
                      flexGrow: k.code === 'Space' ? 4 : k.width > 1.5 ? 2 : 1,
                      borderColor: isTarget
                        ? fingerColor
                        : isPressed
                        ? '#38bdf8'
                        : showFingerGuides
                        ? `${fingerColor}40`
                        : undefined,
                      boxShadow: isTarget
                        ? `0 0 12px ${fingerColor}80`
                        : isPressed
                        ? '0 0 12px #38bdf8'
                        : undefined,
                    }}
                    className={`h-11 rounded-md text-xs font-mono font-medium transition-all duration-75 flex flex-col items-center justify-center relative border ${
                      isPressed
                        ? 'bg-cyan-500/30 translate-y-0.5 text-white'
                        : isTarget
                        ? 'bg-slate-800 text-white font-bold ring-2 ring-cyan-400/40 animate-pulse'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    } ${heatBg}`}
                  >
                    {k.shiftChar && k.width <= 1.2 && (
                      <span className="text-[10px] text-slate-500 leading-none">
                        {k.shiftChar}
                      </span>
                    )}
                    <span className="leading-tight">
                      {k.code === 'Space' ? 'SPACE' : k.char.toUpperCase()}
                    </span>

                    {/* Small finger dot on bottom */}
                    {showFingerGuides && (
                      <span
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: fingerColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Finger color legend bar */}
        {showFingerGuides && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400">
            {(
              [
                'left-pinky',
                'left-ring',
                'left-middle',
                'left-index',
                'left-thumb',
                'right-index',
                'right-middle',
                'right-ring',
                'right-pinky',
              ] as const
            ).map((fid) => (
              <div key={fid} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: FINGER_COLORS[fid] }}
                />
                <span>{FINGER_LABELS[fid]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
