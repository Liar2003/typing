import React, { useState } from 'react';
import { X, Trash2, TrendingUp, BarChart2 } from 'lucide-react';
import { useTypingStore } from '../../store/useTypingStore';
import { useStatsStore } from '../../store/useStatsStore';
import { FINGER_COLORS, FINGER_LABELS, KEYBOARD_KEYS } from '../../data/keyboardLayout';
import { FingerId } from '../../types/typing';

export function KeyboardHeatmapModal() {
  const { showHeatmapModal, setShowHeatmapModal } = useTypingStore();
  const { keyStats, fingerStats, clearStats, history, getBestWpm, getAverageWpm } = useStatsStore();
  const [activeTab, setActiveTab] = useState<'keyboard' | 'fingers' | 'history'>('keyboard');

  if (!showHeatmapModal) return null;

  const rows = [0, 1, 2, 3, 4].map((r) =>
    KEYBOARD_KEYS.filter((k) => k.row === r).sort((a, b) => a.col - b.col)
  );

  // Find max hits across keys to normalize heat
  const allHits = Object.values(keyStats).map((s) => s.hits);
  const maxKeyHits = allHits.length > 0 ? Math.max(...allHits, 1) : 1;

  const fingerList: FingerId[] = [
    'left-pinky',
    'left-ring',
    'left-middle',
    'left-index',
    'left-thumb',
    'right-thumb',
    'right-index',
    'right-middle',
    'right-ring',
    'right-pinky',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BarChart2 className="text-cyan-400" size={20} />
            <h2 className="text-lg font-bold text-white font-display">
              Keyboard Analytics & Finger Heatmap
            </h2>
          </div>
          <button
            onClick={() => setShowHeatmapModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('keyboard')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'keyboard'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Heatmap
            </button>
            <button
              onClick={() => setActiveTab('fingers')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'fingers'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Finger Breakdown
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Session History ({history.length})
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>Best:</span>
              <span className="font-bold text-cyan-400 font-mono">{getBestWpm()} WPM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Avg:</span>
              <span className="font-bold text-slate-200 font-mono">{getAverageWpm()} WPM</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'keyboard' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span>Color intensity shows key usage frequency & error density:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700 inline-block" />
                    <span>Untyped</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-cyan-900 border border-cyan-500 inline-block" />
                    <span>Frequent</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-rose-900 border border-rose-500 inline-block" />
                    <span>High Errors</span>
                  </div>
                </div>
              </div>

              {/* 2D Heatmap Grid */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                {rows.map((rowKeys, rIdx) => (
                  <div key={rIdx} className="flex gap-1 justify-center w-full">
                    {rowKeys.map((k) => {
                      const stat = keyStats[k.id];
                      const hits = stat ? stat.hits : 0;
                      const errors = stat ? stat.errors : 0;
                      const total = hits + errors;
                      const errorRate = total > 0 ? errors / total : 0;
                      const heatRatio = hits / maxKeyHits;

                      let bg = 'bg-slate-900 border-slate-800 text-slate-400';
                      if (total > 0) {
                        if (errorRate > 0.25) {
                          bg = 'bg-rose-950/80 border-rose-500/70 text-rose-200';
                        } else if (heatRatio > 0.5) {
                          bg = 'bg-cyan-900/80 border-cyan-400 text-cyan-200 shadow-xs';
                        } else if (heatRatio > 0.2) {
                          bg = 'bg-sky-950/80 border-sky-600/70 text-sky-200';
                        } else {
                          bg = 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200';
                        }
                      }

                      return (
                        <div
                          key={k.id}
                          style={{
                            flexBasis: `${Math.max(34, k.width * 46)}px`,
                            flexGrow: k.code === 'Space' ? 4 : k.width > 1.5 ? 2 : 1,
                          }}
                          className={`h-11 rounded border flex flex-col items-center justify-center p-1 text-[11px] font-mono transition-colors relative group ${bg}`}
                        >
                          <span className="font-bold">
                            {k.code === 'Space' ? 'SPACE' : k.char.toUpperCase()}
                          </span>
                          {total > 0 && (
                            <span className="text-[9px] opacity-75">
                              {hits}h/{errors}e
                            </span>
                          )}

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 bg-slate-800 border border-slate-700 text-slate-200 text-[10px] rounded p-1.5 whitespace-nowrap shadow-lg pointer-events-none">
                            <div className="font-semibold text-white">{k.id}</div>
                            <div>Hits: {hits}</div>
                            <div>Errors: {errors}</div>
                            <div>
                              Accuracy: {total > 0 ? Math.round((hits / total) * 100) : 100}%
                            </div>
                            <div className="text-cyan-400">
                              Finger: {FINGER_LABELS[k.finger]}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fingers' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Track how balanced and accurate your touch-typing fingers are. Ideal touch typists distribute keystrokes evenly across fingers while maintaining &gt;95% accuracy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fingerList.map((fid) => {
                  const stat = fingerStats[fid] || { hits: 0, errors: 0, accuracy: 100 };
                  const fColor = FINGER_COLORS[fid];
                  const total = stat.hits + stat.errors;

                  return (
                    <div
                      key={fid}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: fColor }}
                        />
                        <div>
                          <div className="text-sm font-semibold text-white font-display">
                            {FINGER_LABELS[fid]}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {stat.hits} hits · {stat.errors} errors
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-bold font-mono ${
                            stat.accuracy >= 95
                              ? 'text-emerald-400'
                              : stat.accuracy >= 85
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {total > 0 ? `${stat.accuracy}%` : '—'}
                        </div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                          Accuracy
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No completed tests yet. Start typing on the home screen to log session data!
                </div>
              ) : (
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-medium">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Mode</th>
                        <th className="p-3">WPM</th>
                        <th className="p-3">Raw</th>
                        <th className="p-3">Accuracy</th>
                        <th className="p-3">Rank</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {history.map((test) => (
                        <tr key={test.id} className="hover:bg-slate-800/40">
                          <td className="p-3 text-slate-400">
                            {new Date(test.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-sans text-slate-300 capitalize">{test.mode}</td>
                          <td className="p-3 font-bold text-cyan-400">{test.wpm}</td>
                          <td className="p-3 text-slate-400">{test.rawWpm}</td>
                          <td className="p-3 text-emerald-400">{test.accuracy}%</td>
                          <td className="p-3 font-sans text-xs text-amber-300">{test.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={() => {
              if (window.confirm('Reset all keyboard statistics and history?')) {
                clearStats();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 py-1.5 px-3 rounded-lg hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 size={13} />
            <span>Reset Stats</span>
          </button>

          <button
            onClick={() => setShowHeatmapModal(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
