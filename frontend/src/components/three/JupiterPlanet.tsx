import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function JupiterPlanet() {
  const groupRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);

  const textures = useMemo(() => {
    // CANVAS PRINCIPAL - 4096x2048 para máxima qualidade
    const mainCanvas = document.createElement('canvas');
    mainCanvas.width = 4096;
    mainCanvas.height = 2048;
    const ctx = mainCanvas.getContext('2d')!;

    // Fundo gradiente suave
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 2048);
    bgGrad.addColorStop(0, '#1A0530');
    bgGrad.addColorStop(0.08, '#2D1070');
    bgGrad.addColorStop(0.15, '#4A2080');
    bgGrad.addColorStop(0.22, '#6B30B0');
    bgGrad.addColorStop(0.28, '#8B40D0');
    bgGrad.addColorStop(0.35, '#A855E0');
    bgGrad.addColorStop(0.42, '#C060F0');
    bgGrad.addColorStop(0.48, '#D468FF');
    bgGrad.addColorStop(0.52, '#C060F0');
    bgGrad.addColorStop(0.58, '#A855E0');
    bgGrad.addColorStop(0.65, '#8B40D0');
    bgGrad.addColorStop(0.72, '#6B30B0');
    bgGrad.addColorStop(0.78, '#4A2080');
    bgGrad.addColorStop(0.85, '#2D1070');
    bgGrad.addColorStop(0.92, '#1A0530');
    bgGrad.addColorStop(1, '#0D0220');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 4096, 2048);

    // Faixas turbilhonadas realistas
    for (let band = 0; band < 200; band++) {
      const y = (band / 200) * 2048;
      const bandHeight = 6 + Math.random() * 14;
      
      for (let x = 0; x < 4096; x += 4) {
        const wave = Math.sin(x * 0.008 + band * 0.5) * 3 + Math.sin(x * 0.02 + band) * 1.5;
        const finalY = y + wave;
        
        const colors = [
          `rgba(180, 76, 255, 0.7)`,
          `rgba(200, 100, 255, 0.6)`,
          `rgba(160, 60, 230, 0.8)`,
          `rgba(220, 130, 255, 0.5)`,
          `rgba(140, 45, 210, 0.7)`,
          `rgba(190, 85, 240, 0.6)`,
          `rgba(170, 70, 220, 0.7)`,
          `rgba(255, 61, 142, 0.4)`,
        ];
        
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, finalY, 4, bandHeight);
      }
    }

    // Grande Mancha Vermelha (roxo/rosa) - mais realista
    const spotCX = 2500;
    const spotCY = 950;
    
    // Oval principal
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const rx = 180 + Math.random() * 40;
      const ry = 80 + Math.random() * 20;
      const x = spotCX + Math.cos(angle) * rx;
      const y = spotCY + Math.sin(angle) * ry;
      
      const grad = ctx.createRadialGradient(x, y, 0, x, y, 30 + Math.random() * 20);
      grad.addColorStop(0, `rgba(255, ${40 + Math.random() * 60}, ${100 + Math.random() * 80}, 0.8)`);
      grad.addColorStop(0.5, `rgba(220, ${60 + Math.random() * 40}, ${140 + Math.random() * 60}, 0.5)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 35 + Math.random() * 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Borda externa da mancha
    ctx.strokeStyle = 'rgba(255, 150, 180, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(spotCX, spotCY, 200, 90, 0.05, 0, Math.PI * 2);
    ctx.stroke();

    // Turbulência dentro da mancha
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 150;
      const x = spotCX + Math.cos(angle) * dist;
      const y = spotCY + Math.sin(angle) * dist * 0.5;
      
      ctx.strokeStyle = `rgba(255, ${100 + Math.random() * 100}, ${150 + Math.random() * 100}, 0.3)`;
      ctx.lineWidth = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 8 + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Pequenas tempestades (ovais brancos)
    for (let i = 0; i < 15; i++) {
      const sx = Math.random() * 3500 + 300;
      const sy = Math.random() * 1800 + 100;
      
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 25 + Math.random() * 30);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      grad.addColorStop(0.4, 'rgba(240, 240, 255, 0.4)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 30 + Math.random() * 20, 15 + Math.random() * 10, Math.random() * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Micro detalhes atmosféricos
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 4096;
      const y = Math.random() * 2048;
      const r = Math.random() * 3 + 0.5;
      
      ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${80 + Math.random() * 100}, ${180 + Math.random() * 75}, ${Math.random() * 0.15})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const mainTexture = new THREE.CanvasTexture(mainCanvas);
    mainTexture.wrapS = THREE.RepeatWrapping;
    mainTexture.wrapU = THREE.RepeatWrapping;
    mainTexture.colorSpace = THREE.SRGBColorSpace;

    // BUMP MAP para relevo
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 2048;
    bumpCanvas.height = 1024;
    const bmp = bumpCanvas.getContext('2d')!;
    
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 2048;
      const y = Math.random() * 1024;
      const r = Math.random() * 5 + 1;
      const alpha = Math.random() * 0.3;
      bmp.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      bmp.beginPath();
      bmp.arc(x, y, r, 0, Math.PI * 2);
      bmp.fill();
    }
    
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    return { mainTexture, bumpTexture };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.00025;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.0004;
    }
  });

  return (
    <group ref={groupRef} position={[-6.5, 3.2, -2.5]}>
      {/* Planeta Júpiter */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1.6, 256, 256]} />
        <meshStandardMaterial
          map={textures.mainTexture}
          bumpMap={textures.bumpTexture}
          bumpScale={0.02}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* Camada de nuvens finas */}
      <mesh>
        <sphereGeometry args={[1.62, 128, 128]} />
        <meshStandardMaterial
          color="#E8D0FF"
          transparent
          opacity={0.04}
          roughness={0.95}
        />
      </mesh>

      {/* Atmosfera externa */}
      <mesh>
        <sphereGeometry args={[1.78, 128, 128]} />
        <shaderMaterial
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(0.69, 0.30, 1.0, 1.0) * intensity * 0.12;
            }
          `}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          depthWrite={false}
        />
      </mesh>

      {/* ANÉIS */}
      {/* Anel principal externo */}
      <mesh rotation={[Math.PI / 2.25, 0.18, 0.04]}>
        <ringGeometry args={[1.95, 3.0, 512]} />
        <meshStandardMaterial
          color="#C080FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.75}
          roughness={0.25}
          emissive="#B44CFF"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Anel médio */}
      <mesh rotation={[Math.PI / 2.3, 0.12, 0.06]}>
        <ringGeometry args={[1.78, 2.0, 512]} />
        <meshStandardMaterial
          color="#FF5E9E"
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
          roughness={0.2}
          emissive="#FF3D8E"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Anel interno fino */}
      <mesh rotation={[Math.PI / 2.4, 0.22, -0.03]}>
        <ringGeometry args={[1.68, 1.82, 512]} />
        <meshStandardMaterial
          color="#D4A5FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
          roughness={0.3}
          emissive="#D4A5FF"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Anel externo tênue */}
      <mesh rotation={[Math.PI / 2.2, -0.08, -0.06]}>
        <ringGeometry args={[2.85, 3.15, 512]} />
        <meshStandardMaterial
          color="#E8C8FF"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
          roughness={0.4}
          emissive="#D4A5FF"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Luas */}
      {/* Io */}
      <mesh position={[3.5, 0.6, 0.2]}>
        <sphereGeometry args={[0.12, 48, 48]} />
        <meshStandardMaterial color="#FFE4B5" roughness={0.3} emissive="#FFD700" emissiveIntensity={0.4} />
      </mesh>
      
      {/* Europa */}
      <mesh position={[-2.8, -0.9, 1.8]}>
        <sphereGeometry args={[0.1, 48, 48]} />
        <meshStandardMaterial color="#E8E8F0" roughness={0.2} />
      </mesh>
      
      {/* Ganimedes */}
      <mesh position={[1.8, -1.2, -2.2]}>
        <sphereGeometry args={[0.14, 48, 48]} />
        <meshStandardMaterial color="#D0D0E0" roughness={0.35} />
      </mesh>
      
      {/* Calisto */}
      <mesh position={[-4, 0.2, 1]}>
        <sphereGeometry args={[0.13, 48, 48]} />
        <meshStandardMaterial color="#A0A0B0" roughness={0.5} />
      </mesh>
    </group>
  );
}
