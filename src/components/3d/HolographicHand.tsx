import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FingerId, HandId, ThemeId } from '../../types/typing';
import { FINGER_COLORS, HAND_BASE_POSITIONS, RESTING_FINGER_POSITIONS } from '../../data/keyboardLayout';

interface HolographicHandProps {
  hand: HandId;
  strikeQueue: Array<{
    fingerId: FingerId;
    targetKeyId: string;
    targetPosition: [number, number, number];
    timestamp: number;
  }>;
  theme: ThemeId;
  opacity: number;
}

interface FingerRuntimeState {
  fingerId: FingerId;
  phase: 'idle' | 'striking' | 'recovering';
  progress: number;
  strikeStartTime: number;
  strikeDuration: number;
  recoverDuration: number;
  targetPos: [number, number, number];
  restPos: [number, number, number];
  currentTipPos: THREE.Vector3;
}

const THEME_GLOW: Record<ThemeId, string> = {
  cyan: '#00f0ff',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#a855f7',
};

// Knuckle (MCP) base anchors relative to palm center for each finger
const FINGER_MCP_OFFSETS: Record<FingerId, [number, number, number]> = {
  // Left Hand: Pinky to Thumb
  'left-pinky': [-1.35, 0.05, -0.65],
  'left-ring': [-0.65, 0.08, -0.80],
  'left-middle': [0.05, 0.10, -0.85],
  'left-index': [0.75, 0.08, -0.75],
  'left-thumb': [1.15, -0.15, -0.15],

  // Right Hand: Thumb to Pinky
  'right-thumb': [-1.15, -0.15, -0.15],
  'right-index': [-0.75, 0.08, -0.75],
  'right-middle': [-0.05, 0.10, -0.85],
  'right-ring': [0.65, 0.08, -0.80],
  'right-pinky': [1.35, 0.05, -0.65],
};

const FINGER_ORDER: Record<HandId, FingerId[]> = {
  left: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'left-thumb'],
  right: ['right-thumb', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
};

/**
 * Procedural bone segment connecting two 3D joint points
 */
function BoneSegment({
  start,
  end,
  radius,
  color,
  opacity,
  wireframeColor,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius: number;
  color: string;
  opacity: number;
  wireframeColor: string;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const distance = start.distanceTo(end);
    if (distance <= 0.001) return;

    // Position at midpoint
    meshRef.current.position.copy(start).add(end).multiplyScalar(0.5);

    // Orientation: point from start to end (Y axis aligned to vector)
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, direction);
    meshRef.current.quaternion.copy(quat);

    // Scale Y by distance
    meshRef.current.scale.set(1, distance, 1);
  });

  return (
    <group ref={meshRef}>
      {/* Translucent cyber core */}
      <mesh>
        <cylinderGeometry args={[radius * 0.85, radius, 1, 10]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          transparent
          opacity={opacity}
          roughness={0.15}
          metalness={0.8}
          transmission={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Cyber wireframe cage */}
      <mesh>
        <cylinderGeometry args={[radius * 0.95, radius * 1.05, 1, 8]} />
        <meshBasicMaterial
          color={wireframeColor}
          wireframe
          transparent
          opacity={opacity * 0.75}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Glowing Knuckle Joint Node (MCP, PIP, DIP)
 */
function JointNode({
  position,
  radius,
  color,
  isTip = false,
}: {
  position: THREE.Vector3;
  radius: number;
  color: string;
  isTip?: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Glowing joint core sphere */}
      <mesh>
        <sphereGeometry args={[radius, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isTip ? 0.9 : 0.6}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Joint Ring / Laser Torus */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.35, radius * 0.25, 8, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isTip ? 0.9 : 0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function HolographicHand({
  hand,
  strikeQueue,
  theme,
  opacity,
}: HolographicHandProps) {
  const themeGlow = THEME_GLOW[theme] || '#00f0ff';
  const handBase = HAND_BASE_POSITIONS[hand];
  const palmGroupRef = useRef<THREE.Group>(null);
  const processedTimestamps = useRef<Set<number>>(new Set());

  // Joint position vectors for all 5 fingers:
  // [MCP, PIP, DIP, TIP]
  const fingerVectors = useRef<
    Record<
      FingerId,
      {
        mcp: THREE.Vector3;
        pip: THREE.Vector3;
        dip: THREE.Vector3;
        tip: THREE.Vector3;
      }
    >
  >(
    {} as Record<
      FingerId,
      {
        mcp: THREE.Vector3;
        pip: THREE.Vector3;
        dip: THREE.Vector3;
        tip: THREE.Vector3;
      }
    >
  );

  // Initialize runtime state for the 5 fingers of this hand
  const fingerStates = useRef<Record<FingerId, FingerRuntimeState>>(
    {} as Record<FingerId, FingerRuntimeState>
  );

  useMemo(() => {
    const fingers = FINGER_ORDER[hand];
    fingers.forEach((fid) => {
      const rest = RESTING_FINGER_POSITIONS[fid];
      const mcpOffset = FINGER_MCP_OFFSETS[fid];
      const palmPos = new THREE.Vector3(...handBase.palm);

      // World MCP position
      const mcpPos = new THREE.Vector3(
        palmPos.x + mcpOffset[0],
        palmPos.y + mcpOffset[1],
        palmPos.z + mcpOffset[2]
      );

      const restTip = new THREE.Vector3(...rest);

      fingerStates.current[fid] = {
        fingerId: fid,
        phase: 'idle',
        progress: 0,
        strikeStartTime: 0,
        strikeDuration: 0.08,  // 80ms fast strike
        recoverDuration: 0.11, // 110ms smooth return
        targetPos: [...rest],
        restPos: [...rest],
        currentTipPos: restTip.clone(),
      };

      // Default joint vectors
      fingerVectors.current[fid] = {
        mcp: mcpPos,
        pip: mcpPos.clone().lerp(restTip, 0.42).add(new THREE.Vector3(0, 0.22, 0)),
        dip: mcpPos.clone().lerp(restTip, 0.75).add(new THREE.Vector3(0, 0.14, 0)),
        tip: restTip.clone(),
      };
    });
  }, [hand, handBase]);

  // Frame animation loop: Update independent finger state machines
  useFrame((state) => {
    const now = Date.now();
    const fingers = FINGER_ORDER[hand];

    // 1. Process new strikes targeting fingers of this hand
    strikeQueue.forEach((strike) => {
      if (
        fingers.includes(strike.fingerId) &&
        !processedTimestamps.current.has(strike.timestamp)
      ) {
        processedTimestamps.current.add(strike.timestamp);
        const fState = fingerStates.current[strike.fingerId];
        if (fState) {
          fState.phase = 'striking';
          fState.progress = 0;
          fState.strikeStartTime = now;
          fState.targetPos = [...strike.targetPosition];
        }
      }
    });

    // Cleanup timestamp set
    if (processedTimestamps.current.size > 50) {
      processedTimestamps.current.clear();
    }

    // 2. Animate each finger independently
    fingers.forEach((fid) => {
      const fState = fingerStates.current[fid];
      const fVecs = fingerVectors.current[fid];
      if (!fState || !fVecs) return;

      const restTip = new THREE.Vector3(...fState.restPos);
      const targetTip = new THREE.Vector3(...fState.targetPos);

      // Micro idle float
      const idleFloat = Math.sin(state.clock.getElapsedTime() * 2 + (fid.charCodeAt(0) % 5)) * 0.02;
      restTip.y += idleFloat;

      if (fState.phase === 'striking') {
        const elapsed = (now - fState.strikeStartTime) / 1000;
        fState.progress = Math.min(1, elapsed / fState.strikeDuration);

        // Strike trajectory: lifts slightly mid-flight, then impacts downward
        const t = fState.progress;
        // Ease in-out curve
        const curve = t * t * (3 - 2 * t);
        const arcY = Math.sin(t * Math.PI) * 0.15; // mid-flight arch

        fState.currentTipPos.lerpVectors(restTip, targetTip, curve);
        fState.currentTipPos.y += arcY;

        if (fState.progress >= 1) {
          fState.phase = 'recovering';
          fState.strikeStartTime = now;
          fState.progress = 0;
        }
      } else if (fState.phase === 'recovering') {
        const elapsed = (now - fState.strikeStartTime) / 1000;
        fState.progress = Math.min(1, elapsed / fState.recoverDuration);

        const t = fState.progress;
        const curve = t * t * (3 - 2 * t);

        fState.currentTipPos.lerpVectors(targetTip, restTip, curve);

        if (fState.progress >= 1) {
          fState.phase = 'idle';
          fState.progress = 0;
          fState.currentTipPos.copy(restTip);
        }
      } else {
        // Idle: stay at home row rest position
        fState.currentTipPos.copy(restTip);
      }

      // Compute natural anatomical joint curve between fixed MCP and currentTipPos
      const mcp = fVecs.mcp;
      const tip = fState.currentTipPos;
      fVecs.tip.copy(tip);

      // Interpolate PIP and DIP along curve
      const vDir = new THREE.Vector3().subVectors(tip, mcp);
      const isThumb = fid.includes('thumb');

      // Arch heights
      const pipArch = isThumb ? 0.12 : 0.22;
      const dipArch = isThumb ? 0.08 : 0.14;

      fVecs.pip
        .copy(mcp)
        .addScaledVector(vDir, 0.42)
        .add(new THREE.Vector3(0, pipArch, 0));

      fVecs.dip
        .copy(mcp)
        .addScaledVector(vDir, 0.74)
        .add(new THREE.Vector3(0, dipArch, 0));
    });
  });

  const fingers = FINGER_ORDER[hand];

  return (
    <group>
      {/* Wrist & Forearm Cyber Bracket */}
      <group position={handBase.wrist} rotation={handBase.rotation}>
        {/* Outer Wrist Cuff */}
        <mesh>
          <cylinderGeometry args={[0.75, 0.85, 0.5, 16]} />
          <meshPhysicalMaterial
            color="#082f49"
            emissive={themeGlow}
            emissiveIntensity={0.3}
            transparent
            opacity={opacity * 0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Wrist Holographic Pulse Ring */}
        <mesh position={[0, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.82, 0.04, 8, 24]} />
          <meshBasicMaterial
            color={themeGlow}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Palm Matrix Plate */}
      <group ref={palmGroupRef} position={handBase.palm} rotation={handBase.rotation}>
        {/* Translucent cybernetic palm body */}
        <mesh>
          <boxGeometry args={[2.5, 0.22, 1.8]} />
          <meshPhysicalMaterial
            color="#0c4a6e"
            emissive={themeGlow}
            emissiveIntensity={0.25}
            transparent
            opacity={opacity * 0.7}
            roughness={0.15}
            metalness={0.85}
            transmission={0.3}
            depthWrite={false}
          />
        </mesh>

        {/* Palm Holographic Lattice Wireframe */}
        <mesh position={[0, 0.12, 0]}>
          <planeGeometry args={[2.4, 1.7, 4, 3]} />
          <meshBasicMaterial
            color={themeGlow}
            wireframe
            transparent
            opacity={opacity * 0.9}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 5 Articulated Holographic Fingers */}
      {fingers.map((fid) => {
        const fVec = fingerVectors.current[fid];
        const fColor = FINGER_COLORS[fid] || themeGlow;
        const isThumb = fid.includes('thumb');
        const bRad = isThumb ? 0.085 : 0.075;

        return (
          <group key={fid}>
            {/* Joints: MCP, PIP, DIP, Fingertip */}
            <JointNode position={fVec.mcp} radius={bRad * 1.15} color={fColor} />
            <JointNode position={fVec.pip} radius={bRad} color={fColor} />
            <JointNode position={fVec.dip} radius={bRad * 0.9} color={fColor} />
            <JointNode position={fVec.tip} radius={bRad * 0.95} color={fColor} isTip />

            {/* Bone Segments: MCP -> PIP -> DIP -> Tip */}
            <BoneSegment
              start={fVec.mcp}
              end={fVec.pip}
              radius={bRad}
              color={fColor}
              opacity={opacity}
              wireframeColor={themeGlow}
            />
            <BoneSegment
              start={fVec.pip}
              end={fVec.dip}
              radius={bRad * 0.92}
              color={fColor}
              opacity={opacity}
              wireframeColor={themeGlow}
            />
            <BoneSegment
              start={fVec.dip}
              end={fVec.tip}
              radius={bRad * 0.85}
              color={fColor}
              opacity={opacity}
              wireframeColor={themeGlow}
            />
          </group>
        );
      })}
    </group>
  );
}
