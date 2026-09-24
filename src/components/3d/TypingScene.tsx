import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraPreset, ThemeId } from '../../types/typing';
import { Keyboard3D } from './Keyboard3D';
import { HolographicHand } from './HolographicHand';
import { ImpactRipples } from './ImpactRipples';
import { CyberParticles } from './CyberParticles';
import { useTypingStore } from '../../store/useTypingStore';
import { useStatsStore } from '../../store/useStatsStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface CameraRigProps {
  preset: CameraPreset;
  reducedMotion: boolean;
}

const CAMERA_POSITIONS: Record<CameraPreset, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
  'first-person': {
    pos: [0, 4.8, 5.2],
    lookAt: [0, 0.1, 0.4],
  },
  'angled': {
    pos: [0, 6.2, 6.4],
    lookAt: [0, 0.1, 0.2],
  },
  'tactical-top': {
    pos: [0, 9.2, 2.0],
    lookAt: [0, 0, 0],
  },
  'close-up': {
    pos: [0, 3.8, 3.8],
    lookAt: [0, 0.1, 0.6],
  },
};

function CameraRig({ preset, reducedMotion }: CameraRigProps) {
  const currentPos = useRef(new THREE.Vector3(...CAMERA_POSITIONS['angled'].pos));
  const currentLookAt = useRef(new THREE.Vector3(...CAMERA_POSITIONS['angled'].lookAt));

  useFrame((state, delta) => {
    const config = CAMERA_POSITIONS[preset] || CAMERA_POSITIONS['angled'];
    const targetPos = new THREE.Vector3(...config.pos);
    const targetLookAt = new THREE.Vector3(...config.lookAt);

    // Subtle breathing drift if reduced motion is disabled
    if (!reducedMotion) {
      const t = state.clock.getElapsedTime();
      targetPos.x += Math.sin(t * 0.4) * 0.08;
      targetPos.y += Math.cos(t * 0.5) * 0.04;
    }

    currentPos.current.lerp(targetPos, Math.min(1, delta * 5));
    currentLookAt.current.lerp(targetLookAt, Math.min(1, delta * 5));

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

export function TypingScene() {
  const {
    activeKeyCodes,
    text,
    currentIndex,
    fingerStrikeQueue,
    recentImpacts,
    consumeImpact,
    handleVirtualKeyPress,
  } = useTypingStore();

  const keyStats = useStatsStore((s) => s.keyStats);

  const {
    theme,
    cameraPreset,
    handOpacity,
    showHeatmapOnKeys,
    showFingerGuides,
    showKeyLabels,
    reducedMotion,
  } = useSettingsStore();

  const expectedChar = text[currentIndex] ?? null;

  const handleKeyClick = (char: string, code: string) => {
    handleVirtualKeyPress(char, code);
  };

  return (
    <div className="relative w-full h-full select-none">
      <Canvas
        camera={{ position: [0, 6.2, 6.4], fov: 46 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <CameraRig preset={cameraPreset} reducedMotion={reducedMotion} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 12, 6]}
          intensity={1.2}
          color="#e0f2fe"
          castShadow
        />
        <pointLight
          position={[-6, 4, 3]}
          intensity={0.8}
          color="#00f0ff"
          distance={16}
        />
        <pointLight
          position={[6, 4, 3]}
          intensity={0.8}
          color="#38bdf8"
          distance={16}
        />
        <pointLight
          position={[0, 6, -4]}
          intensity={0.5}
          color="#818cf8"
          distance={14}
        />

        {/* Ambient Holographic Dust Particles */}
        <CyberParticles theme={theme} reducedMotion={reducedMotion} />

        {/* 3D Keyboard */}
        <Keyboard3D
          activeKeyCodes={activeKeyCodes}
          expectedKeyChar={expectedChar}
          keyStats={keyStats}
          showHeatmap={showHeatmapOnKeys}
          showFingerGuides={showFingerGuides}
          showKeyLabels={showKeyLabels}
          theme={theme}
          onKeyClick={handleKeyClick}
        />

        {/* Left Holographic Hand */}
        <HolographicHand
          hand="left"
          strikeQueue={fingerStrikeQueue}
          theme={theme}
          opacity={handOpacity}
        />

        {/* Right Holographic Hand */}
        <HolographicHand
          hand="right"
          strikeQueue={fingerStrikeQueue}
          theme={theme}
          opacity={handOpacity}
        />

        {/* Keypress Impact Ripples */}
        <ImpactRipples impacts={recentImpacts} onExpire={consumeImpact} />
      </Canvas>
    </div>
  );
}
