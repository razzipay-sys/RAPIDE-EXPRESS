'use client';

import { Environment, Float, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import type * as THREE from 'three';

function BikeModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  // Fallback geometry when no .glb model is loaded yet
  return (
    <group ref={groupRef}>
      {/* Motorcycle body placeholder */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 0.8, 0.8]} />
        <meshStandardMaterial color="#FF6B00" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.9, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.12, 16, 32]} />
        <meshStandardMaterial color="#1A1A26" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.9, -0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.12, 16, 32]} />
        <meshStandardMaterial color="#1A1A26" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Delivery box */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#FF8C3A" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const count = 60;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#FF6B00" size={0.04} transparent opacity={0.6} />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FF8C3A" castShadow />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#FF6B00" />

      <Environment preset="city" />

      <Suspense fallback={null}>
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <BikeModel />
        </Float>
      </Suspense>

      <ParticleField />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
