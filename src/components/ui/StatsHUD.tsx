import React, { useEffect } from 'react';
import { useTypingStore } from '../../store/useTypingStore';

export function StatsHUD() {
  const {
    wpm,
    rawWpm,
    accuracy,
    errors,
    streak,
    durationOption,
    remainingSeconds,
    elapsedSeconds,
    currentIndex,
    text,
    status,
    tickTimer,
  } = useTypingStore();

  // Run timer interval
  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => {
      tickTimer();
    }, 250);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  const isTimed = typeof durationOption === 'number';
  const progressPercent =
    text.length > 0 ? Math.min(100, Math.round((currentIndex / text.length) * 100)) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-2.5 bg-slate-950/70 backdrop-blur-md border border-slate-800/80 rounded-xl select-none">
      {/* Metric 1: WPM */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs uppercase text-slate-400 font-medium">Speed</span>
        <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
          {wpm}
        </span>
        <span className="text-xs text-slate-500 font-mono">
          WPM <span className="text-slate-600">({rawWpm} raw)</span>
        </span>
      </div>

      {/* Metric 2: Accuracy */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs uppercase text-slate-400 font-medium">Accuracy</span>
        <span
          className={`text-2xl font-bold font-mono tabular-nums ${
            accuracy >= 95 ? 'text-emerald-400' : accuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
          }`}
        >
          {accuracy}%
        </span>
        <span className="text-xs text-slate-500 font-mono">
          ({errors} {errors === 1 ? 'error' : 'errors'})
        </span>
      </div>

      {/* Metric 3: Time / Progress */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs uppercase text-slate-400 font-medium">
          {isTimed ? 'Time' : 'Elapsed'}
        </span>
        <span className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
          {isTimed ? `${remainingSeconds}s` : `${elapsedSeconds}s`}
        </span>
        <span className="text-xs text-slate-500 font-mono">
          · {progressPercent}% done
        </span>
      </div>

      {/* Metric 4: Streak */}
      <div className="flex items-baseline gap-2">
        <span className="text-xs uppercase text-slate-400 font-medium">Streak</span>
        <span
          className={`text-2xl font-bold font-mono tabular-nums ${
            streak >= 30
              ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
              : streak >= 15
              ? 'text-amber-400'
              : 'text-slate-300'
          }`}
        >
          {streak}
        </span>
        <span className="text-xs text-slate-500 font-mono">combo</span>
      </div>
    </div>
  );
}
