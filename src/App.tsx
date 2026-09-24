import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Header } from './components/ui/Header';
import { TypingDisplay } from './components/ui/TypingDisplay';
import { StatsHUD } from './components/ui/StatsHUD';
import { ControlsBar } from './components/ui/ControlsBar';
import { TypingScene } from './components/3d/TypingScene';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { KeyboardHeatmapModal } from './components/ui/KeyboardHeatmapModal';
import { ResultsModal } from './components/ui/ResultsModal';
import { CustomTextModal } from './components/ui/CustomTextModal';
import { SettingsModal } from './components/ui/SettingsModal';
import { useSettingsStore } from './store/useSettingsStore';

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('WebGL Rendering Error caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function App() {
  const forceWebGLFallback = useSettingsStore((s) => s.forceWebGLFallback);

  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans hologram-grid-bg">
      {/* Top Navigation */}
      <Header />

      {/* Main Interactive Stage */}
      <main className="relative flex-1 flex flex-col justify-between p-3 sm:p-4 overflow-hidden z-10">
        {/* Top Floating Panel: Typing Passage & HUD */}
        <div className="w-full flex flex-col gap-2.5 z-20 pointer-events-auto">
          <StatsHUD />
          <TypingDisplay />
        </div>

        {/* 3D Cyber Keyboard & Holographic Hands Stage */}
        <div className="relative flex-1 w-full min-h-[320px] max-h-full my-1 rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-950/40 shadow-inner flex items-center justify-center">
          {forceWebGLFallback ? (
            <WebGLFallback />
          ) : (
            <WebGLErrorBoundary fallback={<WebGLFallback />}>
              <TypingScene />
            </WebGLErrorBoundary>
          )}
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="w-full z-20 pointer-events-auto">
          <ControlsBar />
        </div>
      </main>

      {/* Modals & Overlays */}
      <KeyboardHeatmapModal />
      <ResultsModal />
      <CustomTextModal />
      <SettingsModal />
    </div>
  );
}
