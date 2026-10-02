import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

const Fang = ({ position, rotation, scale, color }) => {
  return (
    <motion.mesh
      position={position}
      rotation={rotation}
      scale={scale}
      initial={{ y: position[1] - 5, opacity: 0 }}
      animate={{ y: position[1], opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <coneGeometry args={[0.5, 2, 4]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
    </motion.mesh>
  );
};

const BloodDrop = ({ position }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <motion.mesh
        position={position}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0.8, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshPhysicalMaterial 
          color="#8a0303" 
          transmission={0.9} 
          opacity={1} 
          metalness={0.1} 
          roughness={0.1} 
          ior={1.5} 
          thickness={1} 
        />
      </motion.mesh>
    </Float>
  );
};

const Bat = ({ position, offset }) => {
  const batRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + offset;
    batRef.current.position.y = position[1] + Math.sin(t * 2) * 1.5;
    batRef.current.position.x = position[0] + Math.cos(t * 1.5) * 2;
    batRef.current.rotation.z = Math.sin(t * 4) * 0.2;
    batRef.current.rotation.y = Math.cos(t * 2) * 0.2;
  });

  return (
    <group ref={batRef} position={position}>
      {/* Body */}
      <mesh>
        <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      {/* Left Wing */}
      <mesh position={[-0.8, 0, 0]} rotation={[0, 0, 0.5]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#050505" side={THREE.DoubleSide} />
      </mesh>
      {/* Right Wing */}
      <mesh position={[0.8, 0, 0]} rotation={[0, 0, -0.5]}>
        <planeGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#050505" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export default function VampireScene() {
  const fangs = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#ffffff' : '#dddddd'
    }));
  }, []);

  const bloodDrops = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 5],
    }));
  }, []);

  const bats = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      position: [(Math.random() - 0.5) * 25, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10 - 5],
      offset: Math.random() * 10
    }));
  }, []);

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={['#050000']} />
        <fog attach="fog" args={['#050000', 5, 20]} />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ff0000" />
        <pointLight position={[-5, -5, -5]} intensity={2} color="#8a0303" />

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={1} fade speed={1} />

        {fangs.map((props, i) => <Fang key={`fang-${i}`} {...props} />)}
        {bloodDrops.map((props, i) => <BloodDrop key={`blood-${i}`} {...props} />)}
        {bats.map((props, i) => <Bat key={`bat-${i}`} {...props} />)}
      </Canvas>
    </div>
  );
}
