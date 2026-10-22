import { lazy, Suspense } from 'react'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { ProjectsSection } from './components/ProjectsSection'
import { AboutSection } from './components/AboutSection'
import { SkillsSection } from './components/SkillsSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'

// Lazy-load the heavy 3D WebGL scene to preserve instant First Contentful Paint
const Scene3D = lazy(() =>
  import('./components/Scene3D').then((module) => ({ default: module.Scene3D }))
)

export function App() {
  return (
    <div className="portfolio-app">
      {/* Accessible skip-link for keyboard users */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Subtle Hardware-Accelerated Desktop Pointer Follower */}
      <CustomCursor />

      {/* Persistent 3D Visual Anchor (Loaded asynchronously with zero layout shift) */}
      <Suspense fallback={<div className="canvas-placeholder" aria-hidden="true" />}>
        <Scene3D />
      </Suspense>

      {/* Semantic Top Navigation */}
      <Navbar />

      {/* Main Scrollable Content */}
      <main id="main-content" className="content-scroll-flow">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <SkillsSection />
        <ContactSection />
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  )
}

export default App
