import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { KeypressImpact } from '../../types/typing';
import { FINGER_COLORS } from '../../data/keyboardLayout';

interface ImpactRipplesProps {
  impacts: KeypressImpact[];
  onExpire: (id: string) => void;
}

function SingleRipple({
  impact,
  onExpire,
}: {
  impact: KeypressImpact;
  onExpire: (id: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = impact.isCorrect
    ? FINGER_COLORS[impact.fingerId] || '#00f0ff'
    : '#ef4444';

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const age = (Date.now() - impact.timestamp) / 1000;
    const maxAge = 0.45;

    if (age >= maxAge) {
      onExpire(impact.id);
      return;
    }

    const progress = age / maxAge;
    const scale = 0.5 + progress * 1.8;
    meshRef.current.scale.set(scale, scale, scale);

    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (material) {
      material.opacity = Math.max(0, 1 - progress);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[impact.x, impact.y + 0.05, impact.z]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[0.3, 0.42, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function ImpactRipples({ impacts, onExpire }: ImpactRipplesProps) {
  return (
    <group>
      {impacts.map((impact) => (
        <SingleRipple key={impact.id} impact={impact} onExpire={onExpire} />
      ))}
    </group>
  );
}
