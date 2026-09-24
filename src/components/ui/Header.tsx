import React from 'react';
import { Activity, Sliders, FileText, Volume2, VolumeX } from 'lucide-react';
import { useTypingStore } from '../../store/useTypingStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { TestMode } from '../../types/typing';

const MODES: { id: TestMode; label: string }[] = [
  { id: 'home-row', label: 'Home Row' },
  { id: 'top-row', label: 'Top Row' },
  { id: 'bottom-row', label: 'Bottom Row' },
  { id: 'numbers-symbols', label: 'Numbers & Symbols' },
  { id: 'common-words', label: 'Core Words' },
  { id: 'code-snippets', label: 'Code' },
  { id: 'quotes', label: 'Quotes' },
];

export function Header() {
  const {
    mode,
    setMode,
    setShowHeatmapModal,
    setShowCustomModal,
    setShowSettingsModal,
  } = useTypingStore();

  const { soundEnabled, setSoundEnabled } = useSettingsStore();

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md z-30 select-none">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.location.reload();
        }}
        className="text-lg font-bold tracking-wider text-cyan-400 font-display flex items-center gap-2 hover:text-cyan-300 transition-colors"
      >
        <span>CYBERTYPE 3D</span>
      </a>

      {/* Zone 2: Navigation Links (Drill Modes) */}
      <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-slate-400">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`transition-colors py-1 hover:text-slate-100 relative ${
              mode === m.id
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-400'
            }`}
          >
            {m.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: Functional Interactive Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-900 rounded-lg transition-colors"
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          aria-label={soundEnabled ? 'Mute audio' : 'Enable audio'}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-slate-600" />}
        </button>

        <button
          onClick={() => setShowCustomModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
        >
          <FileText size={14} className="text-cyan-400" />
          <span>Custom</span>
        </button>

        <button
          onClick={() => setShowHeatmapModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
        >
          <Activity size={14} className="text-emerald-400" />
          <span>Heatmap & Stats</span>
        </button>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 rounded-lg transition-colors"
          title="Open Settings"
          aria-label="Settings"
        >
          <Sliders size={16} />
        </button>
      </div>
    </header>
  );
}
