import { Component, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
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

export const Scene3D = () => {
  const [isSupported, setIsSupported] = useState<boolean>(true)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    setIsSupported(checkWebGLSupport())
  }, [])

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
            {/* Cinematic studio dark background */}
            <color attach="background" args={['#08090d']} />

            {/* Soft Ambient Fill */}
            <ambientLight intensity={0.4} color="#8a9ab0" />

            {/* Main Key Light casting realistic directional shadows */}
            <directionalLight
              position={[5, 7, 5]}
              intensity={2.4}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={20}
              shadow-bias={-0.0001}
            />

            {/* Cool Rim/Back Light defining metallic contour edges */}
            <directionalLight
              position={[-5, 4, -4]}
              intensity={3.2}
              color="#4da6ff"
            />

            {/* Subtle warm under-fill light for contrast */}
            <pointLight
              position={[0, -4, 2]}
              intensity={1.2}
              color="#f0ebe1"
            />

            {/* Abstract Metallic Centerpiece */}
            <SculpturalObject reducedMotion={prefersReducedMotion} />

            {/* Studio Floor Contact Shadows */}
            <ContactShadows
              position={[0, -2.1, 0]}
              opacity={0.65}
              scale={10}
              blur={2.4}
              far={4.5}
            />
          </Canvas>
        </Suspense>
      </div>
    </CanvasErrorBoundary>
  )
}
