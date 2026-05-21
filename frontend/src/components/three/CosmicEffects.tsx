import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NebulaClouds() {
  const groupRef = useRef<THREE.Group>(null!);
  
  const clouds = useMemo(() => {
    return Array.from({ length: 3 }, () => ({
      size: 2 + Math.random() * 2,
      position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5, -4 - Math.random() * 2],
      color: new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 0.5, 0.3),
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x += Math.sin(state.clock.elapsedTime * 0.08 + i) * 0.002;
        child.position.y += Math.cos(state.clock.elapsedTime * 0.06 + i) * 0.002;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position as [number, number, number]}>
          <sphereGeometry args={[cloud.size, 16, 16]} />
          <meshBasicMaterial color={cloud.color} transparent opacity={0.05} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function MeteorShower() {
  const groupRef = useRef<THREE.Group>(null!);
  
  const meteors = useMemo(() => {
    return Array.from({ length: 8 }, () => ({
      startX: (Math.random() - 0.5) * 12,
      startY: 4 + Math.random() * 3,
      startZ: -3,
      delay: Math.random() * 8,
      length: 0.3 + Math.random() * 0.4,
      color: Math.random() < 0.5 ? '#B44CFF' : '#FF3D8E',
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const t = ((state.clock.elapsedTime + meteors[i].delay) % 8) / 8;
        child.position.x = meteors[i].startX - t * 10;
        child.position.y = meteors[i].startY - t * 6;
        (child as THREE.Mesh).material.opacity = t < 0.2 ? t / 0.2 : (1 - t) / 0.8;
        child.visible = t < 0.9;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {meteors.map((meteor, i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[meteor.length, 0.02]} />
          <meshBasicMaterial color={meteor.color} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function EnergyOrbs() {
  const groupRef = useRef<THREE.Group>(null!);
  
  const orbs = useMemo(() => {
    return Array.from({ length: 5 }, () => ({
      position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, -2],
      speed: 0.3 + Math.random() * 0.4,
      amplitude: 0.5 + Math.random() * 1,
      phase: Math.random() * Math.PI * 2,
      size: 0.08 + Math.random() * 0.12,
      color: ['#B44CFF', '#FF3D8E', '#D4A5FF'][Math.floor(Math.random() * 3)],
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const orb = orbs[i];
        child.position.y = orb.position[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.phase) * orb.amplitude;
        child.position.x = orb.position[0] + Math.cos(state.clock.elapsedTime * orb.speed * 0.7 + orb.phase) * orb.amplitude * 0.5;
        child.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + orb.phase) * 0.2);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position as [number, number, number]}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function PulsingRings() {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.12;
      groupRef.current.children.forEach((child) => {
        child.scale.setScalar(pulse);
        ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={[-6.5, 3.2, -2.5]}>
      <mesh rotation={[Math.PI / 2.25, 0.18, 0.04]}>
        <ringGeometry args={[1.95, 3.0, 128]} />
        <meshBasicMaterial color="#B44CFF" side={THREE.DoubleSide} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.1, 0.08]}>
        <ringGeometry args={[1.7, 1.9, 128]} />
        <meshBasicMaterial color="#FF3D8E" side={THREE.DoubleSide} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function CosmicEffects() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 1, 7], fov: 60 }} 
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }} 
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.15} />
        <NebulaClouds />
        <EnergyOrbs />
        <PulsingRings />
        <MeteorShower />
      </Canvas>
    </div>
  );
}
