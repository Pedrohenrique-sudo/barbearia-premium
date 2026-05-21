import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function StarParticles({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null!);

  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 4 + Math.random() * 5;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const rand = Math.random();
      if (rand < 0.4) {
        colors[i * 3] = 0.71;
        colors[i * 3 + 1] = 0.30;
        colors[i * 3 + 2] = 1.0;
      } else if (rand < 0.7) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.24;
        colors[i * 3 + 2] = 0.56;
      } else {
        colors[i * 3] = 0.77;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 1.0;
      }
    }
    
    return { positions, colors };
  }, [count]);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0005;
      mesh.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlesData.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        sizeAttenuation={true}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function PlanetWithRings() {
  const groupRef = useRef<THREE.Group>(null!);

  const planetTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#3A0066');
    gradient.addColorStop(0.15, '#5B1AE6');
    gradient.addColorStop(0.3, '#7B2FFF');
    gradient.addColorStop(0.45, '#B44CFF');
    gradient.addColorStop(0.5, '#9B4BFF');
    gradient.addColorStop(0.6, '#7B2FFF');
    gradient.addColorStop(0.75, '#5B1AE6');
    gradient.addColorStop(0.9, '#3A0066');
    gradient.addColorStop(1, '#1A0030');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    for (let i = 0; i < 50; i++) {
      const y = Math.random() * 512;
      const height = Math.random() * 8 + 1;
      const alpha = Math.random() * 0.4 + 0.1;
      ctx.fillStyle = `rgba(${180 + Math.random() * 75}, ${Math.random() * 100}, ${200 + Math.random() * 55}, ${alpha})`;
      ctx.fillRect(0, y, 1024, height);
    }
    
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = Math.random() * 30 + 5;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(${100 + Math.random() * 155}, ${Math.random() * 100}, ${150 + Math.random() * 105}, ${Math.random() * 0.5 + 0.2})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    
    const gradient = ctx.createLinearGradient(0, 0, 1024, 0);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.1, 'rgba(180, 76, 255, 0.6)');
    gradient.addColorStop(0.2, 'rgba(255, 61, 142, 0.8)');
    gradient.addColorStop(0.35, 'rgba(200, 100, 255, 0.9)');
    gradient.addColorStop(0.5, 'rgba(180, 76, 255, 0.7)');
    gradient.addColorStop(0.65, 'rgba(255, 100, 200, 0.5)');
    gradient.addColorStop(0.8, 'rgba(150, 50, 255, 0.3)');
    gradient.addColorStop(0.9, 'rgba(100, 30, 200, 0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 64);
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <group ref={groupRef} position={[-5.5, 2.8, -2.5]}>
      <mesh>
        <sphereGeometry args={[1.3, 128, 128]} />
        <meshStandardMaterial map={planetTexture} roughness={0.5} metalness={0.2} />
      </mesh>
      
      <mesh>
        <sphereGeometry args={[1.32, 64, 64]} />
        <meshStandardMaterial color="#D4A5FF" transparent opacity={0.08} roughness={0.8} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.45, 64, 64]} />
        <meshBasicMaterial color="#B44CFF" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      <mesh rotation={[Math.PI / 2.3, 0.15, 0.05]}>
        <ringGeometry args={[1.6, 2.4, 256]} />
        <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent opacity={0.9} roughness={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 2.35, 0.1, 0.08]}>
        <ringGeometry args={[1.45, 1.65, 256]} />
        <meshStandardMaterial color="#FF69B4" side={THREE.DoubleSide} transparent opacity={0.7} emissive="#FF69B4" emissiveIntensity={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 2.25, -0.1, -0.05]}>
        <ringGeometry args={[2.2, 2.5, 256]} />
        <meshStandardMaterial color="#D4A5FF" side={THREE.DoubleSide} transparent opacity={0.4} emissive="#D4A5FF" emissiveIntensity={0.15} />
      </mesh>

      <mesh position={[2.5, 0.3, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
      </mesh>
      <mesh position={[-1.8, -0.5, 1.5]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#D4A5FF" roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10" style={{ pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0.5, 6], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[5, 3, 4]} intensity={0.6} color="#B44CFF" />
        <pointLight position={[-3, -1, 5]} intensity={0.4} color="#FF3D8E" />
        <directionalLight position={[1, 1, 2]} intensity={0.3} color="#FFFFFF" />
        
        <PlanetWithRings />
        <StarParticles count={500} />
      </Canvas>
    </div>
  );
}
