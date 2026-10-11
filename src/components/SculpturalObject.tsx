import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SculpturalObjectProps {
  reducedMotion?: boolean
}

export const SculpturalObject = ({ reducedMotion = false }: SculpturalObjectProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const primaryMeshRef = useRef<THREE.Mesh>(null!)
  const innerRingRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Subtle pointer parallax: smooth interpolation toward mouse coordinates
    const targetRotY = state.pointer.x * 0.45
    const targetRotX = -state.pointer.y * 0.35

    // Smooth damping for natural responsiveness
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      3.5,
      delta
    )
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    )

    // Gentle continuous motion if user has not requested reduced motion
    if (!reducedMotion) {
      if (primaryMeshRef.current) {
        primaryMeshRef.current.rotation.y += delta * 0.22
        primaryMeshRef.current.rotation.z += delta * 0.08
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.x -= delta * 0.18
        innerRingRef.current.rotation.y -= delta * 0.12
      }
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Primary Abstract Metallic Sculpture: High-density Torus Knot */}
      <mesh ref={primaryMeshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[1.35, 0.38, 256, 48, 2, 3]} />
        <meshPhysicalMaterial
          color="#d3d7de"
          metalness={0.92}
          roughness={0.16}
          clearcoat={0.35}
          clearcoatRoughness={0.12}
          reflectivity={0.9}
        />
      </mesh>

      {/* Orbiting Minimalist Studio Ring providing dimensional depth */}
      <mesh ref={innerRingRef} castShadow receiveShadow>
        <torusGeometry args={[2.2, 0.04, 32, 100]} />
        <meshStandardMaterial
          color="#8ca0b8"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
    </group>
  )
}
