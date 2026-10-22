import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollProgress } from '../hooks/useScrollProgress'

interface SculpturalObjectProps {
  reducedMotion?: boolean
}

interface ChoreographyTarget {
  // Sculpture spatial coordinates
  posX: number
  posY: number
  posZ: number
  rotX: number
  rotY: number
  rotZ: number
  scale: number
  // Cinematic camera choreography
  camX: number
  camY: number
  camZ: number
  lookAtX: number
  lookAtY: number
  lookAtZ: number
}

// Cinematic scroll keyframe sequence (Ora-inspired continuous camera & monolith storytelling)
const desktopKeyframes: (ChoreographyTarget & { p: number })[] = [
  // 0.00: Chapter 01 — Introduction / Hero (Dominant centerpiece, framed with generous negative space)
  {
    p: 0.0,
    posX: 0.65, posY: 0.05, posZ: 0,
    rotX: 0.12, rotY: -0.32, rotZ: 0.08, scale: 0.92,
    camX: 0, camY: 0, camZ: 5.2,
    lookAtX: 0.2, lookAtY: 0, lookAtZ: 0,
  },
  // 0.12: Chapter 01 Exit — Subtle cinematic camera push-in and forward chrome tilt
  {
    p: 0.12,
    posX: 0.58, posY: 0.02, posZ: 0.12,
    rotX: 0.18, rotY: -0.25, rotZ: 0.12, scale: 0.95,
    camX: 0.08, camY: 0.02, camZ: 4.88,
    lookAtX: 0.22, lookAtY: 0, lookAtZ: 0,
  },
  // 0.28: Chapter 02 — About / Philosophy (Sculpture glides left, framing narrative panel on right)
  {
    p: 0.28,
    posX: -1.6, posY: -0.1, posZ: -0.22,
    rotX: -0.16, rotY: -0.55, rotZ: 0.20, scale: 0.82,
    camX: -0.25, camY: 0.04, camZ: 5.0,
    lookAtX: -0.35, lookAtY: -0.05, lookAtZ: 0,
  },
  // 0.48: Chapter 03A — Selected Works: SkillSwap (Sweeps right, presenting vertical reflective blade)
  {
    p: 0.48,
    posX: 1.62, posY: 0.14, posZ: -0.2,
    rotX: 0.22, rotY: 0.48, rotZ: -0.14, scale: 0.80,
    camX: 0.28, camY: -0.02, camZ: 4.95,
    lookAtX: 0.38, lookAtY: 0.05, lookAtZ: 0,
  },
  // 0.66: Chapter 03B — Selected Works: Saffron & Sage (Sweeps left, revealing opposite aerodynamic facet)
  {
    p: 0.66,
    posX: -1.52, posY: 0.06, posZ: -0.18,
    rotX: -0.14, rotY: -0.42, rotZ: 0.16, scale: 0.78,
    camX: -0.24, camY: 0.04, camZ: 5.05,
    lookAtX: -0.32, lookAtY: 0, lookAtZ: 0,
  },
  // 0.82: Chapter 04 — Capabilities / Skills (Recedes to deep background as luminous halo)
  {
    p: 0.82,
    posX: 0, posY: 0.16, posZ: -1.15,
    rotX: 0.28, rotY: 0.65, rotZ: -0.1, scale: 0.64,
    camX: 0, camY: 0.05, camZ: 5.3,
    lookAtX: 0, lookAtY: 0.08, lookAtZ: 0,
  },
  // 1.00: Chapter 05 — Contact / Inquiries (Serene grounded resolution at lower base)
  {
    p: 1.0,
    posX: 0, posY: -0.32, posZ: 0.08,
    rotX: 0.06, rotY: 0.18, rotZ: 0, scale: 0.86,
    camX: 0, camY: -0.08, camZ: 5.1,
    lookAtX: 0, lookAtY: -0.24, lookAtZ: 0,
  },
]

// Mobile choreography restricts lateral excursions while keeping vertical balance
const mobileKeyframes: (ChoreographyTarget & { p: number })[] = [
  {
    p: 0.0,
    posX: 0, posY: -0.05, posZ: 0,
    rotX: 0.08, rotY: 0, rotZ: 0, scale: 0.58,
    camX: 0, camY: 0, camZ: 5.6,
    lookAtX: 0, lookAtY: 0, lookAtZ: 0,
  },
  {
    p: 0.12,
    posX: 0, posY: 0.02, posZ: -0.1,
    rotX: 0.1, rotY: 0.1, rotZ: 0, scale: 0.55,
    camX: 0, camY: 0, camZ: 5.5,
    lookAtX: 0, lookAtY: 0, lookAtZ: 0,
  },
  {
    p: 0.28,
    posX: 0, posY: -0.24, posZ: -0.4,
    rotX: -0.12, rotY: -0.25, rotZ: 0, scale: 0.50,
    camX: 0, camY: 0, camZ: 5.6,
    lookAtX: 0, lookAtY: -0.1, lookAtZ: 0,
  },
  {
    p: 0.48,
    posX: 0, posY: 0.24, posZ: -0.35,
    rotX: 0.15, rotY: 0.3, rotZ: 0, scale: 0.52,
    camX: 0, camY: 0, camZ: 5.5,
    lookAtX: 0, lookAtY: 0.1, lookAtZ: 0,
  },
  {
    p: 0.66,
    posX: 0, posY: -0.22, posZ: -0.35,
    rotX: -0.12, rotY: -0.2, rotZ: 0, scale: 0.50,
    camX: 0, camY: 0, camZ: 5.5,
    lookAtX: 0, lookAtY: -0.1, lookAtZ: 0,
  },
  {
    p: 0.82,
    posX: 0, posY: 0.22, posZ: -0.7,
    rotX: 0.18, rotY: 0.35, rotZ: 0, scale: 0.44,
    camX: 0, camY: 0, camZ: 5.7,
    lookAtX: 0, lookAtY: 0.1, lookAtZ: 0,
  },
  {
    p: 1.0,
    posX: 0, posY: -0.28, posZ: 0,
    rotX: 0.06, rotY: 0.1, rotZ: 0, scale: 0.54,
    camX: 0, camY: -0.05, camZ: 5.6,
    lookAtX: 0, lookAtY: -0.2, lookAtZ: 0,
  },
]

function interpolateChoreography(progress: number, isMobile: boolean): ChoreographyTarget {
  const keyframes = isMobile ? mobileKeyframes : desktopKeyframes

  // Clamp boundaries
  if (progress <= keyframes[0].p) return keyframes[0]
  if (progress >= keyframes[keyframes.length - 1].p) return keyframes[keyframes.length - 1]

  // Find surrounding keyframe segments
  let i = 0
  while (i < keyframes.length - 1 && keyframes[i + 1].p < progress) {
    i++
  }

  const kfA = keyframes[i]
  const kfB = keyframes[i + 1]
  const segmentRange = kfB.p - kfA.p
  const t = segmentRange > 0 ? (progress - kfA.p) / segmentRange : 0

  // Hermite smoothstep easing curve for continuous C1 transitions without velocity jumps
  const smoothT = t * t * (3 - 2 * t)

  const lerp = (a: number, b: number) => a + (b - a) * smoothT

  return {
    posX: lerp(kfA.posX, kfB.posX),
    posY: lerp(kfA.posY, kfB.posY),
    posZ: lerp(kfA.posZ, kfB.posZ),
    rotX: lerp(kfA.rotX, kfB.rotX),
    rotY: lerp(kfA.rotY, kfB.rotY),
    rotZ: lerp(kfA.rotZ, kfB.rotZ),
    scale: lerp(kfA.scale, kfB.scale),
    camX: lerp(kfA.camX, kfB.camX),
    camY: lerp(kfA.camY, kfB.camY),
    camZ: lerp(kfA.camZ, kfB.camZ),
    lookAtX: lerp(kfA.lookAtX, kfB.lookAtX),
    lookAtY: lerp(kfA.lookAtY, kfB.lookAtY),
    lookAtZ: lerp(kfA.lookAtZ, kfB.lookAtZ),
  }
}

/**
 * Procedurally generates ONE dominant Liquid Chrome Monolith.
 * Features a grand asymmetric architectural gesture with broad reflective blades,
 * generous negative spaces, continuous Bishop-frame closure, and aerodynamic beveled cross-sections.
 */
function createLiquidChromeMonolith(): THREE.BufferGeometry {
  const segments = 240
  const radialSegments = 24
  const geom = new THREE.BufferGeometry()

  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Backbone 3D curve: majestic, soaring architectural space curve
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const u = t * Math.PI * 2
    const x = 1.65 * Math.sin(u) + 0.38 * Math.sin(2 * u)
    const y = 1.3 * Math.cos(u) - 0.45 * Math.cos(2 * u) + 0.15 * Math.sin(3 * u)
    const z = 0.9 * Math.sin(2 * u) + 0.32 * Math.cos(u)
    points.push(new THREE.Vector3(x, y, z))
  }

  // Tangents along curve
  const tangents: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(segments, i + 1)]
    tangents.push(new THREE.Vector3().subVectors(next, prev).normalize())
  }

  // Parallel transport frames (Bishop frames) to avoid gimbal lock
  const rawNormals: THREE.Vector3[] = []
  let initNorm = new THREE.Vector3(0, 0, 1)
  if (Math.abs(tangents[0].dot(initNorm)) > 0.85) initNorm = new THREE.Vector3(0, 1, 0)
  const n0 = new THREE.Vector3().crossVectors(tangents[0], initNorm).normalize()
  rawNormals.push(n0)

  for (let i = 1; i <= segments; i++) {
    const v1 = tangents[i - 1]
    const v2 = tangents[i]
    const axis = new THREE.Vector3().crossVectors(v1, v2)
    let n = rawNormals[i - 1].clone()
    if (axis.length() > 0.0001) {
      axis.normalize()
      const angle = Math.acos(Math.min(Math.max(v1.dot(v2), -1), 1))
      n.applyAxisAngle(axis, angle)
    }
    rawNormals.push(n.normalize())
  }

  // Compensate for holonomy drift to guarantee seamless 100% loop closure
  const lastN = rawNormals[segments]
  const firstN = rawNormals[0]
  const cross = new THREE.Vector3().crossVectors(lastN, firstN)
  const sign = Math.sign(cross.dot(tangents[0])) || 1
  const driftAngle = lastN.angleTo(firstN) * sign

  const normals: THREE.Vector3[] = []
  const binormals: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const n = rawNormals[i].clone()
    n.applyAxisAngle(tangents[i], t * driftAngle)
    normals.push(n.normalize())
    binormals.push(new THREE.Vector3().crossVectors(tangents[i], n).normalize())
  }

  // Generate vertices along the closed sculptural blade
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const u = t * Math.PI * 2
    const center = points[i]
    const normal = normals[i]
    const binormal = binormals[i]

    // Controlled twist: exactly 1 full rotation + harmonious sinusoidal modulation
    const twist = u + 0.5 * Math.sin(2 * u)
    const cosT = Math.cos(twist)
    const sinT = Math.sin(twist)

    // Broad blade width: 0.95 to 1.6 units — creates large, mirror-reflective liquid chrome faces
    const width = 1.15 + 0.42 * Math.sin(2 * u)
    // Substantial metallic slab thickness with aerodynamic beveled edges
    const thickness = 0.16 + 0.05 * Math.cos(u)

    const dirU = new THREE.Vector3().addScaledVector(normal, cosT).addScaledVector(binormal, sinT)
    const dirV = new THREE.Vector3().addScaledVector(normal, -sinT).addScaledVector(binormal, cosT)

    for (let j = 0; j <= radialSegments; j++) {
      const v = (j / radialSegments) * Math.PI * 2
      // Superelliptical hydrodynamic profile with beveled rims
      const cosV = Math.cos(v)
      const sinV = Math.sin(v)
      const px = Math.sign(cosV) * Math.pow(Math.abs(cosV), 0.72) * (width * 0.5)
      const py = Math.sign(sinV) * Math.pow(Math.abs(sinV), 0.72) * (thickness * 0.5)

      const vertex = center.clone().addScaledVector(dirU, px).addScaledVector(dirV, py)
      positions.push(vertex.x, vertex.y, vertex.z)
      uvs.push(t, j / radialSegments)
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j
      const b = (i + 1) * (radialSegments + 1) + j
      const c = (i + 1) * (radialSegments + 1) + (j + 1)
      const d = i * (radialSegments + 1) + (j + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geom.setIndex(indices)
  geom.computeVertexNormals()
  return geom
}

export const SculpturalObject = ({ reducedMotion = false }: SculpturalObjectProps) => {
  const groupRef = useRef<THREE.Group>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)
  const scrollProgressRef = useScrollProgress()

  const monolithGeometry = useMemo(() => createLiquidChromeMonolith(), [])

  useEffect(() => {
    return () => {
      monolithGeometry.dispose()
    }
  }, [monolithGeometry])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const isMobile = state.size.width < 768

    // Derive choreography targets from normalized scroll progress
    const targets = reducedMotion
      ? {
          posX: isMobile ? 0 : 0.55,
          posY: 0.05,
          posZ: 0,
          rotX: 0.12,
          rotY: -0.3,
          rotZ: 0.08,
          scale: isMobile ? 0.58 : 0.92,
        }
      : interpolateChoreography(scrollProgressRef.current, isMobile)

    // Smooth position interpolation (damping)
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targets.posX,
      2.8,
      delta
    )
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targets.posY,
      2.8,
      delta
    )
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targets.posZ,
      2.8,
      delta
    )

    // Smooth scale interpolation
    const currentScale = groupRef.current.scale.x
    const nextScale = THREE.MathUtils.damp(currentScale, targets.scale, 2.8, delta)
    groupRef.current.scale.setScalar(nextScale)

    // Pointer-responsive parallax layered additively over scroll-choreographed rotation
    const pointerRotY = state.pointer.x * 0.35
    const pointerRotX = -state.pointer.y * 0.25

    const targetRotY = targets.rotY + pointerRotY
    const targetRotX = targets.rotX + pointerRotX
    const targetRotZ = targets.rotZ

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotY,
      3.2,
      delta
    )
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.2,
      delta
    )
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotZ,
      3.2,
      delta
    )

    // Organic continuous ambient rotation for the monolithic sculpture
    if (!reducedMotion && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.14
      meshRef.current.rotation.z += delta * 0.04
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* The Single Dominant Liquid Chrome Sculpture */}
      <mesh ref={meshRef} geometry={monolithGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#f8fafc"
          metalness={0.98}
          roughness={0.04}
          clearcoat={0.9}
          clearcoatRoughness={0.03}
          reflectivity={1.0}
          envMapIntensity={2.2}
        />
      </mesh>
    </group>
  )
}
