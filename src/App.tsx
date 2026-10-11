import { Scene3D } from './components/Scene3D'

export function App() {
  return (
    <main className="app-viewport">
      {/* 3D Scene Proof of Concept */}
      <Scene3D />

      {/* Restrained Technical HUD Overlay */}
      <aside className="hud-overlay" aria-label="Technical Prototype HUD">
        <header className="hud-header">
          <div className="brand-meta">
            <span className="brand-name">Yuvraj</span>
            <span className="brand-subtitle">Real-Time 3D Portfolio • Milestone 1</span>
          </div>

          <div className="status-badge" role="status">
            <span className="status-indicator" aria-hidden="true" />
            <span>WebGL 3D Active</span>
          </div>
        </header>

        <footer className="hud-footer">
          <div className="hud-details">
            <h1>Sculptural Study</h1>
            <p>
              Hardware-accelerated physical metallic mesh with studio rim lighting and continuous parallax damping.
            </p>
          </div>

          <div className="hud-spec">
            <span>Interact • Move pointer to tilt</span>
            <span>R3F v9 • Three.js v0.186 • Vite</span>
          </div>
        </footer>
      </aside>
    </main>
  )
}

export default App
