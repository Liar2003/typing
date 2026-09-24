import { create } from 'zustand';
import { CameraPreset, ThemeId } from '../types/typing';
import { soundEngine } from '../audio/soundEngine';

interface SettingsState {
  soundEnabled: boolean;
  soundVolume: number;
  reducedMotion: boolean;
  theme: ThemeId;
  cameraPreset: CameraPreset;
  handOpacity: number;
  showHeatmapOnKeys: boolean;
  showFingerGuides: boolean;
  showKeyLabels: boolean;
  forceWebGLFallback: boolean;

  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setReducedMotion: (reduced: boolean) => void;
  setTheme: (theme: ThemeId) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setHandOpacity: (opacity: number) => void;
  setShowHeatmapOnKeys: (show: boolean) => void;
  setShowFingerGuides: (show: boolean) => void;
  setShowKeyLabels: (show: boolean) => void;
  setForceWebGLFallback: (force: boolean) => void;
}

const STORAGE_KEY = 'cybertype_settings_v1';

function getStoredSettings(): Partial<SettingsState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = getStoredSettings();

  const sync = (partial: Partial<SettingsState>) => {
    set(partial);
    try {
      const state = get();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          soundEnabled: state.soundEnabled,
          soundVolume: state.soundVolume,
          reducedMotion: state.reducedMotion,
          theme: state.theme,
          cameraPreset: state.cameraPreset,
          handOpacity: state.handOpacity,
          showHeatmapOnKeys: state.showHeatmapOnKeys,
          showFingerGuides: state.showFingerGuides,
          showKeyLabels: state.showKeyLabels,
          forceWebGLFallback: state.forceWebGLFallback,
        })
      );
    } catch {
      // Ignore localStorage errors
    }
  };

  const initialSound = initial.soundEnabled ?? true;
  const initialVolume = initial.soundVolume ?? 0.6;
  soundEngine.setEnabled(initialSound);
  soundEngine.setVolume(initialVolume);

  return {
    soundEnabled: initialSound,
    soundVolume: initialVolume,
    reducedMotion: initial.reducedMotion ?? false,
    theme: initial.theme ?? 'cyan',
    cameraPreset: initial.cameraPreset ?? 'angled',
    handOpacity: initial.handOpacity ?? 0.65,
    showHeatmapOnKeys: initial.showHeatmapOnKeys ?? false,
    showFingerGuides: initial.showFingerGuides ?? true,
    showKeyLabels: initial.showKeyLabels ?? true,
    forceWebGLFallback: initial.forceWebGLFallback ?? false,

    setSoundEnabled: (enabled) => {
      soundEngine.setEnabled(enabled);
      sync({ soundEnabled: enabled });
    },
    setSoundVolume: (volume) => {
      soundEngine.setVolume(volume);
      sync({ soundVolume: volume });
    },
    setReducedMotion: (reduced) => sync({ reducedMotion: reduced }),
    setTheme: (theme) => sync({ theme }),
    setCameraPreset: (preset) => sync({ cameraPreset: preset }),
    setHandOpacity: (opacity) => sync({ handOpacity: opacity }),
    setShowHeatmapOnKeys: (show) => sync({ showHeatmapOnKeys: show }),
    setShowFingerGuides: (show) => sync({ showFingerGuides: show }),
    setShowKeyLabels: (show) => sync({ showKeyLabels: show }),
    setForceWebGLFallback: (force) => sync({ forceWebGLFallback: force }),
  };
});
