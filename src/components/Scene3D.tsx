import { Component, Suspense, useState, useEffect, useMemo, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SculpturalObject } from './SculpturalObject'
import { WebGLFallback } from './WebGLFallback'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          (canvas as any).getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * High-Contrast Studio Lightbank Environment.
 * Generates an offline HDR PMREM cubemap composed of pure white studio softbox strips
 * floating against a pitch-black (#000000) void.
 * Guarantees razor-sharp silver-white highlight reflections separated by deep obsidian shadow valleys.
 */
function StudioLightbankEnvironment() {
  const gl = useThree((state) => state.gl)

  const envTexture = useMemo(() => {
    const studioScene = new THREE.Scene()
    studioScene.background = new THREE.Color(0x000000)

    const keyMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const rimMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f4f8 })

    // 1. Overhead Main Softbox: Creates broad silver crescent highlights on upper crests
    const geomOverhead = new THREE.PlaneGeometry(8, 4)
    const meshOverhead = new THREE.Mesh(geomOverhead, keyMaterial)
    meshOverhead.position.set(0, 6, 2)
    meshOverhead.rotation.x = Math.PI / 2 + 0.3
    studioScene.add(meshOverhead)

    // 2. Key Vertical Strip Softbox: Produces brilliant vertical highlight ribbons
    const geomKeyStrip = new THREE.PlaneGeometry(1.6, 10)
    const meshKeyStrip = new THREE.Mesh(geomKeyStrip, keyMaterial)
    meshKeyStrip.position.set(5.5, 1, 4.5)
    meshKeyStrip.rotation.y = -Math.PI / 4
    studioScene.add(meshKeyStrip)

    // 3. Rim Vertical Strip Softbox: Defines crisp silver contour silhouette on rear-left
    const geomRimStrip = new THREE.PlaneGeometry(1.2, 9)
    const meshRimStrip = new THREE.Mesh(geomRimStrip, rimMaterial)
    meshRimStrip.position.set(-5.5, 2, -3.5)
    meshRimStrip.rotation.y = Math.PI * 0.6
    studioScene.add(meshRimStrip)

    // 4. Low Horizon Accent Strip: Provides subtle lower edge reflection
    const geomLowStrip = new THREE.PlaneGeometry(7, 1)
    const meshLowStrip = new THREE.Mesh(geomLowStrip, rimMaterial)
    meshLowStrip.position.set(0, -4.5, 3)
    meshLowStrip.rotation.x = -Math.PI / 3
    studioScene.add(meshLowStrip)

    const pmremGenerator = new THREE.PMREMGenerator(gl)
    pmremGenerator.compileEquirectangularShader()
    const texture = pmremGenerator.fromScene(studioScene, 0.02).texture

    // Clean up temporary procedural scene geometry and generator
    geomOverhead.dispose()
    geomKeyStrip.dispose()
    geomRimStrip.dispose()
    geomLowStrip.dispose()
    keyMaterial.dispose()
    rimMaterial.dispose()
    pmremGenerator.dispose()

    return texture
  }, [gl])

  useEffect(() => {
    return () => {
      envTexture.dispose()
    }
  }, [envTexture])

  return <primitive object={envTexture} attach="environment" />
}

export const Scene3D = () => {
  const [isSupported] = useState<boolean>(() => checkWebGLSupport())
  const prefersReducedMotion = usePrefersReducedMotion()

  if (!isSupported) {
    return <WebGLFallback reason="WebGL context could not be created on this device/browser." />
  }

  return (
    <CanvasErrorBoundary
      fallback={<WebGLFallback reason="An unexpected error occurred while initializing the 3D canvas." />}
    >
      <div className="canvas-wrapper">
        <Suspense
          fallback={
            <div className="scene-loader">
              <div className="loader-spinner" />
              <p>Initializing 3D Environment...</p>
            </div>
          }
        >
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5.2], fov: 42 }}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
          >
            {/* The Black Void: Pure #020204 background */}
            <color attach="background" args={['#020204']} />

            {/* High-contrast studio lightbank reflection environment */}
            <StudioLightbankEnvironment />

            {/* Controlled Key Directional Light for crisp specular glints */}
            <directionalLight
              position={[5, 8, 4]}
              intensity={2.2}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={20}
              shadow-bias={-0.0001}
            />

            {/* Crisp Rim Light defining the metallic silhouette edge */}
            <directionalLight
              position={[-6, 3, -4]}
              intensity={2.8}
              color="#e2e8f0"
            />

            {/* Minimal Ambient Baseline to preserve pure black shadow cavities */}
            <ambientLight intensity={0.05} color="#ffffff" />

            {/* The Single Dominant Liquid Chrome Sculpture */}
            <SculpturalObject reducedMotion={prefersReducedMotion} />
          </Canvas>
        </Suspense>
      </div>
    </CanvasErrorBoundary>
  )
}
