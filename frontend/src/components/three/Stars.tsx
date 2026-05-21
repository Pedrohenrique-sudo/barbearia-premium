import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import JupiterPlanet from './JupiterPlanet';

function StarsOnly() {
  const ref = useRef<THREE.Points>(null!);
  
  const count = 600;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    
    const rand = Math.random();
    if (rand < 0.3) {
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
    } else if (rand < 0.55) {
      colors[i * 3] = 0.71; colors[i * 3 + 1] = 0.30; colors[i * 3 + 2] = 1.0;
    } else if (rand < 0.75) {
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.24; colors[i * 3 + 2] = 0.56;
    } else {
      colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0;
    }
  }

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0002;
      ref.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        sizeAttenuation={true}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Stars() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 1, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 3, 4]} intensity={0.5} color="#B44CFF" />
        <pointLight position={[-4, -2, 5]} intensity={0.3} color="#FF3D8E" />
        <directionalLight position={[2, 2, 3]} intensity={0.3} color="#FFFFFF" />
        
        <JupiterPlanet />
        <StarsOnly />
      </Canvas>
    </div>
  );
}
