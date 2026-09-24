import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, Award, CheckCircle2, AlertTriangle, Zap, Target } from 'lucide-react';
import { useTypingStore } from '../../store/useTypingStore';

export function ResultsModal() {
  const {
    showResultsModal,
    closeResultsModal,
    lastTestResult,
    restart,
    setMode,
    mode,
  } = useTypingStore();

  useEffect(() => {
    if (showResultsModal && lastTestResult) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#38bdf8', '#10b981', '#f59e0b'],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [showResultsModal, lastTestResult]);

  if (!showResultsModal || !lastTestResult) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 mb-3 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Award size={24} />
          </div>

          <h2 className="text-xl font-bold text-white font-display uppercase tracking-wider">
            Test Protocol Complete
          </h2>
          <div className="text-sm font-semibold text-cyan-400 mt-1">
            {lastTestResult.rank}
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* WPM */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Zap size={14} className="text-cyan-400" />
                <span>Net Speed</span>
              </div>
              <div className="text-4xl font-extrabold font-mono text-cyan-400 tabular-nums">
                {lastTestResult.wpm}
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                Raw: {lastTestResult.rawWpm} WPM
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-1">
                <Target size={14} className="text-emerald-400" />
                <span>Accuracy</span>
              </div>
              <div
                className={`text-4xl font-extrabold font-mono tabular-nums ${
                  lastTestResult.accuracy >= 95
                    ? 'text-emerald-400'
                    : lastTestResult.accuracy >= 85
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {lastTestResult.accuracy}%
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {lastTestResult.errors} {lastTestResult.errors === 1 ? 'error' : 'errors'}
              </div>
            </div>
          </div>

          {/* Breakdown List */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Keystrokes:</span>
              <span className="font-mono text-slate-200">{lastTestResult.keystrokes}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Duration:</span>
              <span className="font-mono text-slate-200">{lastTestResult.durationSeconds}s</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Mode:</span>
              <span className="font-mono text-slate-200 capitalize">{lastTestResult.mode}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                closeResultsModal();
                restart();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-xs transition-colors"
            >
              <RotateCcw size={14} />
              <span>Retry Test</span>
            </button>

            <button
              onClick={() => {
                closeResultsModal();
                const modes: typeof mode[] = [
                  'home-row',
                  'top-row',
                  'bottom-row',
                  'numbers-symbols',
                  'common-words',
                  'code-snippets',
                  'quotes',
                ];
                const nextIdx = (modes.indexOf(mode) + 1) % modes.length;
                setMode(modes[nextIdx]);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-xs transition-colors shadow-md shadow-cyan-600/30"
            >
              <span>Next Exercise</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
