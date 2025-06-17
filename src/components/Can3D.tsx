import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';

interface Can3DProps {
  color: string;
  flavor: string;
  isAnimating: boolean;
}

const CanMesh = ({ color, flavor, isAnimating }: Can3DProps) => {
  const canRef = useRef<Group>(null);

  // Color mapping for the different flavors
  const getCanColors = (color: string) => {
    switch (color) {
      case 'bg-mava-sage':
        return { primary: '#8fbc8f', secondary: '#6b8e23', accent: '#90ee90' };
      case 'bg-mava-coral':
        return { primary: '#ff7f7f', secondary: '#dc143c', accent: '#ffc0cb' };
      case 'bg-mava-yellow':
        return { primary: '#ffd700', secondary: '#ffa500', accent: '#ffff00' };
      default:
        return { primary: '#8fbc8f', secondary: '#6b8e23', accent: '#90ee90' };
    }
  };

  const colors = getCanColors(color);

  useFrame((state) => {
    if (canRef.current && !isAnimating) {
      // Gentle rotation animation
      canRef.current.rotation.y += 0.005;
      // Subtle floating effect
      canRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={canRef}>
      {/* Main can body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1, 2.5, 32]} />
        <meshStandardMaterial
          color={colors.primary}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[1.02, 1.02, 0.1, 32]} />
        <meshStandardMaterial
          color={colors.secondary}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[1.02, 1.02, 0.1, 32]} />
        <meshStandardMaterial
          color={colors.secondary}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Label band */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.01, 1.01, 0.8, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Accent ring */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.03, 1.03, 0.05, 32]} />
        <meshStandardMaterial
          color={colors.accent}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Tab/opener on top */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.2]} />
        <meshStandardMaterial
          color={colors.secondary}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const Can3D = ({ color, flavor, isAnimating }: Can3DProps) => {
  return (
    <div className="w-64 h-80 md:w-80 md:h-96">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.5}
        />
        <pointLight
          position={[0, 0, 3]}
          intensity={0.3}
          color="#ffffff"
        />

        {/* The 3D can */}
        <CanMesh color={color} flavor={flavor} isAnimating={isAnimating} />
      </Canvas>
    </div>
  );
};

export default Can3D;