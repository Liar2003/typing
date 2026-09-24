import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FINGER_COLORS, KEYBOARD_KEYS } from '../../data/keyboardLayout';
import { KeyLayoutItem, KeyStat, ThemeId } from '../../types/typing';

interface Keyboard3DProps {
  activeKeyCodes: Set<string>;
  expectedKeyChar: string | null;
  keyStats: Record<string, KeyStat>;
  showHeatmap: boolean;
  showFingerGuides: boolean;
  showKeyLabels: boolean;
  theme: ThemeId;
  onKeyClick: (char: string, code: string) => void;
}

const THEME_ACCENTS: Record<ThemeId, string> = {
  cyan: '#00f0ff',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#a855f7',
};

function Keycap({
  item,
  isPressed,
  isTarget,
  stat,
  showHeatmap,
  showFingerGuides,
  showKeyLabels,
  themeAccent,
  onClick,
}: {
  item: KeyLayoutItem;
  isPressed: boolean;
  isTarget: boolean;
  stat?: KeyStat;
  showHeatmap: boolean;
  showFingerGuides: boolean;
  showKeyLabels: boolean;
  themeAccent: string;
  onClick: (char: string, code: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const currentY = useRef(0);

  // Compute keycap color
  const fingerColor = FINGER_COLORS[item.finger] || '#00f0ff';

  const [baseColor, emissiveColor, emissiveIntensity] = useMemo(() => {
    if (isPressed) {
      return ['#38bdf8', '#00f0ff', 0.9];
    }
    if (isTarget) {
      return [fingerColor, fingerColor, 0.75];
    }
    if (showHeatmap && stat) {
      const total = stat.hits + stat.errors;
      if (total > 0) {
        const errorRatio = stat.errors / total;
        if (errorRatio > 0.3) {
          return ['#ef4444', '#ef4444', 0.6];
        } else if (errorRatio > 0.1) {
          return ['#f59e0b', '#f59e0b', 0.45];
        } else {
          return ['#10b981', '#10b981', 0.4];
        }
      }
    }
    if (showFingerGuides) {
      // Subtle tint of finger color on base key
      return ['#0f172a', fingerColor, 0.12];
    }
    return ['#0f172a', themeAccent, 0.05];
  }, [isPressed, isTarget, showHeatmap, stat, showFingerGuides, fingerColor, themeAccent]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetY = isPressed ? -0.12 : 0;
    // Fast spring-like damping for tactile key travel
    currentY.current = THREE.MathUtils.damp(currentY.current, targetY, 35, delta);
    groupRef.current.position.y = currentY.current;

    // Subtle pulsing glow for target key
    if (isTarget) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 8) * 0.2 + 0.8;
      const mesh = groupRef.current.children[0] as THREE.Mesh;
      if (mesh && (mesh.material as THREE.MeshStandardMaterial)) {
        (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 * pulse;
      }
    }
  });

  const keyWidth = item.width * 0.92;
  const keyDepth = 0.92;
  const keyHeight = 0.28;

  // Format display label
  const primaryLabel = item.char === ' ' ? 'SPACE' : item.char.toUpperCase();

  return (
    <group position={[item.x, 0.14, item.z]}>
      <group
        ref={groupRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          onClick(item.char, item.code);
        }}
      >
        {/* Main Keycap Mesh */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[keyWidth, keyHeight, keyDepth]} />
          <meshStandardMaterial
            color={baseColor}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            roughness={0.25}
            metalness={0.65}
          />
        </mesh>

        {/* Home Row Tactile Bumps on F and J */}
        {(item.id === 'KeyF' || item.id === 'KeyJ') && (
          <mesh position={[0, keyHeight / 2 + 0.015, 0.2]}>
            <boxGeometry args={[keyWidth * 0.28, 0.02, 0.06]} />
            <meshBasicMaterial color={fingerColor} />
          </mesh>
        )}

        {/* Target key beacon ring on top */}
        {isTarget && (
          <mesh position={[0, keyHeight / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[keyWidth * 0.35, keyWidth * 0.42, 24]} />
            <meshBasicMaterial color={fingerColor} transparent opacity={0.8} />
          </mesh>
        )}

        {/* Key Legend Labels */}
        {showKeyLabels && (
          <group position={[0, keyHeight / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <Text
              position={[0, item.shiftChar ? -0.1 : 0, 0]}
              fontSize={item.width > 1.5 ? 0.22 : 0.28}
              color={isPressed ? '#ffffff' : isTarget ? '#ffffff' : '#94a3b8'}
              anchorX="center"
              anchorY="middle"
              font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_263g.woff"
            >
              {primaryLabel}
            </Text>

            {item.shiftChar && item.width <= 1.2 && (
              <Text
                position={[0, 0.16, 0]}
                fontSize={0.2}
                color="#64748b"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_263g.woff"
              >
                {item.shiftChar}
              </Text>
            )}
          </group>
        )}
      </group>
    </group>
  );
}

export function Keyboard3D({
  activeKeyCodes,
  expectedKeyChar,
  keyStats,
  showHeatmap,
  showFingerGuides,
  showKeyLabels,
  theme,
  onKeyClick,
}: Keyboard3DProps) {
  const themeAccent = THEME_ACCENTS[theme] || '#00f0ff';

  // Determine which key is the target key
  const targetKeyId = useMemo(() => {
    if (!expectedKeyChar) return null;
    const lower = expectedKeyChar.toLowerCase();
    const found = KEYBOARD_KEYS.find(
      (k) =>
        k.char.toLowerCase() === lower ||
        k.shiftChar === expectedKeyChar ||
        (expectedKeyChar === ' ' && k.code === 'Space') ||
        (expectedKeyChar === '\n' && k.code === 'Enter')
    );
    return found ? found.id : null;
  }, [expectedKeyChar]);

  return (
    <group position={[0, 0, 0]}>
      {/* Keyboard Case Base (Chassis) */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[15.8, 0.4, 5.8]} />
        <meshStandardMaterial
          color="#060913"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Futuristic Chassis Chamfer / Bevel Accent Rim */}
      <mesh position={[0, 0.105, 0]}>
        <boxGeometry args={[15.6, 0.02, 5.6]} />
        <meshBasicMaterial color="#0b1329" />
      </mesh>

      {/* Cyber Perimeter Glow Strip */}
      <mesh position={[0, -0.05, 2.91]}>
        <boxGeometry args={[15.6, 0.08, 0.05]} />
        <meshBasicMaterial color={themeAccent} />
      </mesh>
      <mesh position={[0, -0.05, -2.91]}>
        <boxGeometry args={[15.6, 0.08, 0.05]} />
        <meshBasicMaterial color={themeAccent} />
      </mesh>
      <mesh position={[-7.91, -0.05, 0]}>
        <boxGeometry args={[0.05, 0.08, 5.8]} />
        <meshBasicMaterial color={themeAccent} />
      </mesh>
      <mesh position={[7.91, -0.05, 0]}>
        <boxGeometry args={[0.05, 0.08, 5.8]} />
        <meshBasicMaterial color={themeAccent} />
      </mesh>

      {/* Backlight Glow Diffuser Plane under Keys */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15.2, 5.2]} />
        <meshBasicMaterial
          color={themeAccent}
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Keys */}
      {KEYBOARD_KEYS.map((item) => (
        <Keycap
          key={item.id}
          item={item}
          isPressed={activeKeyCodes.has(item.code)}
          isTarget={item.id === targetKeyId}
          stat={keyStats[item.id]}
          showHeatmap={showHeatmap}
          showFingerGuides={showFingerGuides}
          showKeyLabels={showKeyLabels}
          themeAccent={themeAccent}
          onClick={onKeyClick}
        />
      ))}
    </group>
  );
}
