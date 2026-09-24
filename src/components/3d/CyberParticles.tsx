import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThemeId } from '../../types/typing';

interface CyberParticlesProps {
  theme: ThemeId;
  reducedMotion: boolean;
}

const THEME_COLORS: Record<ThemeId, string> = {
  cyan: '#00f0ff',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#a855f7',
};

export function CyberParticles({ theme, reducedMotion }: CyberParticlesProps) {
  const count = reducedMotion ? 40 : 150;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, initialY] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const inits = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = 0.2 + Math.random() * 3.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      inits[i] = pos[i * 3 + 1];
    }
    return [pos, inits];
  }, [count]);

  const color = THEME_COLORS[theme] || '#00f0ff';

  useFrame((state) => {
    if (reducedMotion || !pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    if (!posAttr) return;

    const t = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const y = initialY[i] + Math.sin(t * 0.8 + i) * 0.35;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
