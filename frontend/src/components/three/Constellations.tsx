import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ConstellationLines() {
  const groupRef = useRef<THREE.Group>(null!);
  
  const { stars, lines } = useMemo(() => {
    // Criar estrelas principais (mais brilhantes)
    const starData = [];
    for (let i = 0; i < 30; i++) {
      starData.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          -1 - Math.random() * 3
        ],
        size: 0.03 + Math.random() * 0.06,
        brightness: 0.6 + Math.random() * 0.4,
      });
    }

    // Criar conexões (linhas entre estrelas próximas)
    const lineData = [];
    for (let i = 0; i < starData.length; i++) {
      for (let j = i + 1; j < starData.length; j++) {
        const dx = starData[i].position[0] - starData[j].position[0];
        const dy = starData[i].position[1] - starData[j].position[1];
        const dz = starData[i].position[2] - starData[j].position[2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        // Conectar apenas estrelas próximas
        if (dist < 2.5) {
          lineData.push({
            start: starData[i].position,
            end: starData[j].position,
            opacity: 0.3 + Math.random() * 0.4,
          });
        }
      }
    }

    return { stars: starData, lines: lineData };
  }, []);

  // Criar geometria das linhas
  const lineGeometries = useMemo(() => {
    return lines.map(line => {
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        ...line.start,
        ...line.end,
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      return geometry;
    });
  }, [lines]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002;
      groupRef.current.rotation.x += 0.0001;
      
      // Pulsar brilho das constelações
      groupRef.current.children.forEach((child, i) => {
        if (child.type === 'Line' || child.type === 'LineSegments') {
          const material = (child as THREE.Line).material as THREE.LineBasicMaterial;
          if (Array.isArray(material)) {
            material.forEach(m => {
              m.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.2;
            });
          } else {
            material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + i) * 0.2;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Linhas de conexão douradas/roxas/rosa */}
      {lines.map((line, i) => (
        <line key={i} geometry={lineGeometries[i]}>
          <lineBasicMaterial
            color={i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#B44CFF' : '#FF3D8E'}
            transparent
            opacity={line.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}

      {/* Estrelas brilhantes */}
      {stars.map((star, i) => (
        <mesh key={`star-${i}`} position={star.position as [number, number, number]}>
          <sphereGeometry args={[star.size, 16, 16]} />
          <meshBasicMaterial
            color={i % 4 === 0 ? '#D4AF37' : i % 4 === 1 ? '#B44CFF' : i % 4 === 2 ? '#FF3D8E' : '#FFFFFF'}
            transparent
            opacity={star.brightness}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Brilho nos vértices das constelações */}
      {stars.filter((_, i) => i % 3 === 0).map((star, i) => (
        <mesh key={`glow-${i}`} position={star.position as [number, number, number]}>
          <sphereGeometry args={[star.size * 2.5, 8, 8]} />
          <meshBasicMaterial
            color="#D4AF37"
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Constellations() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <ambientLight intensity={0.1} />
        <ConstellationLines />
      </Canvas>
    </div>
  );
}
