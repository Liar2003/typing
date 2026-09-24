import React from 'react';
import { RotateCcw, Video, Flame, Eye, Layers } from 'lucide-react';
import { useTypingStore } from '../../store/useTypingStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { CameraPreset, DurationOption } from '../../types/typing';

const DURATIONS: { id: DurationOption; label: string }[] = [
  { id: 15, label: '15s' },
  { id: 30, label: '30s' },
  { id: 60, label: '60s' },
  { id: 120, label: '120s' },
  { id: 'words-25', label: '25 words' },
  { id: 'words-50', label: '50 words' },
  { id: 'free', label: 'Free' },
];

const CAMERAS: { id: CameraPreset; label: string }[] = [
  { id: 'angled', label: 'Angled' },
  { id: 'first-person', label: 'First-Person' },
  { id: 'tactical-top', label: 'Top-Down' },
  { id: 'close-up', label: 'Close-Up' },
];

export function ControlsBar() {
  const {
    durationOption,
    setDurationOption,
    restart,
  } = useTypingStore();

  const {
    cameraPreset,
    setCameraPreset,
    showHeatmapOnKeys,
    setShowHeatmapOnKeys,
    showFingerGuides,
    setShowFingerGuides,
    forceWebGLFallback,
    setForceWebGLFallback,
  } = useSettingsStore();

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-950/60 backdrop-blur-sm border border-slate-800/60 rounded-xl text-xs select-none">
      {/* Duration / Length Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
        {DURATIONS.map((d) => (
          <button
            key={String(d.id)}
            onClick={() => setDurationOption(d.id)}
            className={`px-2.5 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
              durationOption === d.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Camera Presets (when in 3D mode) */}
      {!forceWebGLFallback && (
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <span className="flex items-center px-1 text-slate-500" title="Camera Perspective">
            <Video size={13} />
          </span>
          {CAMERAS.map((c) => (
            <button
              key={c.id}
              onClick={() => setCameraPreset(c.id)}
              className={`px-2 py-1 font-medium rounded-md transition-colors whitespace-nowrap ${
                cameraPreset === c.id
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Visual Toggles & Restart */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowHeatmapOnKeys(!showHeatmapOnKeys)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
            showHeatmapOnKeys
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle Key Heatmap Glow"
        >
          <Flame size={13} />
          <span>Heatmap</span>
        </button>

        <button
          onClick={() => setShowFingerGuides(!showFingerGuides)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
            showFingerGuides
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle Finger Guide Colors"
        >
          <Eye size={13} />
          <span>Guides</span>
        </button>

        <button
          onClick={() => setForceWebGLFallback(!forceWebGLFallback)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap ${
            forceWebGLFallback
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
          title="Toggle 2D / 3D Mode"
        >
          <Layers size={13} />
          <span>{forceWebGLFallback ? '2D View' : '3D View'}</span>
        </button>

        <button
          onClick={restart}
          className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 rounded-lg transition-colors font-medium whitespace-nowrap"
          title="Restart Test (Esc)"
        >
          <RotateCcw size={13} />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
}
