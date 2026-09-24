import React from 'react';
import { X, Sliders, Volume2, Shield, Eye, Palette } from 'lucide-react';
import { useTypingStore } from '../../store/useTypingStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { ThemeId } from '../../types/typing';

const THEMES: { id: ThemeId; label: string; color: string }[] = [
  { id: 'cyan', label: 'Electric Cyan', color: '#00f0ff' },
  { id: 'amber', label: 'Neon Amber', color: '#f59e0b' },
  { id: 'emerald', label: 'Matrix Emerald', color: '#10b981' },
  { id: 'violet', label: 'Synthwave Violet', color: '#a855f7' },
];

export function SettingsModal() {
  const { showSettingsModal, setShowSettingsModal } = useTypingStore();
  const {
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    reducedMotion,
    setReducedMotion,
    theme,
    setTheme,
    handOpacity,
    setHandOpacity,
    showFingerGuides,
    setShowFingerGuides,
    showKeyLabels,
    setShowKeyLabels,
    forceWebGLFallback,
    setForceWebGLFallback,
  } = useSettingsStore();

  if (!showSettingsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="text-cyan-400" size={18} />
            <h2 className="text-base font-bold text-white font-display">
              Environment Settings
            </h2>
          </div>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Hologram Color Theme */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Palette size={14} className="text-cyan-400" />
              <span>Holographic Theme</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    theme === th.id
                      ? 'bg-slate-800 border-cyan-400/80 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: th.color }}
                  />
                  <span>{th.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 size={15} className="text-cyan-400" />
                <span className="text-xs font-semibold text-slate-300">Mechanical Key Sounds</span>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {soundEnabled && (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Volume</span>
                  <span>{Math.round(soundVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 3D Holographic Hand Opacity */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Holographic Hand Opacity</span>
              <span className="font-mono text-cyan-400">{Math.round(handOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={handOpacity}
              onChange={(e) => setHandOpacity(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Accessibility & Visual Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Eye size={14} className="text-emerald-400" />
              <span>Visual Assist & Accessibility</span>
            </label>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Show Finger Color Guides</span>
              <input
                type="checkbox"
                checked={showFingerGuides}
                onChange={(e) => setShowFingerGuides(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Show Keycap Labels</span>
              <input
                type="checkbox"
                checked={showKeyLabels}
                onChange={(e) => setShowKeyLabels(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Reduced Motion (Minimize Drift & Particle Density)</span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Force 2D Interactive Fallback View</span>
              <input
                type="checkbox"
                checked={forceWebGLFallback}
                onChange={(e) => setForceWebGLFallback(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={() => setShowSettingsModal(false)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
