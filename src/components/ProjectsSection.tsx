import { motion, useReducedMotion } from 'framer-motion'
import {
  headingRevealVariants,
  scrollStaggerContainerVariants,
  slideInLeftVariants,
  slideInRightVariants,
  maskedLineVariants,
  reducedMotionVariants,
} from '../utils/motion'
import { useScrollDirectionReveal } from '../hooks/useScrollDirectionReveal'

interface Project {
  id: string
  title: string
  category: string
  tagline: string
  description: string
  keyFeatures: string[]
  technologies: string[]
  liveDemoUrl: string
  sourceCodeUrl?: string
}

const projectsData: Project[] = [
  {
    id: 'skillswap',
    title: 'SkillSwap',
    category: 'Peer-to-Peer Knowledge Platform',
    tagline: 'Collaborative Skill-Exchange & Mentorship Platform',
    description:
      'A full-stack web application designed for peer-to-peer skill trading without monetary transactions. Users list competencies they can offer and learn, discover compatible exchange partners, coordinate sessions, and manage their learning profiles.',
    keyFeatures: [
      'Skill Indexing & Discovery: Publish and browse verified skill offerings categorized by domain.',
      'Reciprocal Swap Requests: Initiate and manage bidirectional skill-exchange proposals.',
      'Session Scheduling: Coordinate swap meeting slots with status tracking and completion reviews.',
      'User Profiles & Feedback: Dedicated member profiles with rating feedback and notifications.',
    ],
    technologies: ['MongoDB', 'Express.js', 'React', 'Node.js', 'REST APIs', 'JWT Auth'],
    liveDemoUrl: 'https://itr-project-gray.vercel.app/',
    sourceCodeUrl: 'https://github.com/yuvrajmeena12/Skill_Swap',
  },
  {
    id: 'saffron-sage',
    title: 'Saffron & Sage',
    category: 'Cafe Management & Ordering System',
    tagline: 'Modern Hospitality Ordering & Administrative Platform',
    description:
      'A cafe ordering and administrative management application combining customer-facing menu discovery, real-time cart and order workflows, and a comprehensive backend portal for kitchen staff and management.',
    keyFeatures: [
      'Dynamic Menu Browsing: Filter and search food and drink categories with instant price calculation.',
      'Real-Time Cart & Checkout: Multi-item cart management with discount verification and order dispatch.',
      'Live Order Tracking: Real-time order fulfillment updates powered by Supabase Realtime subscriptions.',
      'Role-Based Admin Panel: Comprehensive dashboard for catalog changes, kitchen queues, and order status.',
    ],
    technologies: ['React', 'TypeScript', 'Supabase (PostgreSQL)', 'TailwindCSS', 'Vite', 'Realtime APIs'],
    liveDemoUrl: 'https://cafe-management-hazel.vercel.app/',
    sourceCodeUrl: 'https://github.com/yuvrajmeena12/cafe-management',
  },
]

export const ProjectsSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const [headerRef, headerControls] = useScrollDirectionReveal<HTMLElement>()
  const [gridRef, gridControls] = useScrollDirectionReveal<HTMLDivElement>()

  const activeHeader = shouldReduceMotion ? reducedMotionVariants : headingRevealVariants
  const activeMaskedLine = shouldReduceMotion ? reducedMotionVariants : maskedLineVariants
  const activeContainer = shouldReduceMotion ? reducedMotionVariants : scrollStaggerContainerVariants

  return (
    <section id="projects" className="content-section" aria-label="Featured Projects">
      <div className="section-container">
        <motion.header
          ref={headerRef}
          className="section-header"
          initial="hidden"
          animate={headerControls}
          variants={activeHeader}
        >
          <span className="section-eyebrow">01 // Selected Works</span>
          <h2 className="section-title">
            <span className="reveal-mask">
              <motion.span className="reveal-line silver-gradient-text" variants={activeMaskedLine}>
                Featured Projects
              </motion.span>
            </span>
          </h2>
          <p className="section-lead">
            Production-focused software applications demonstrating full-stack architecture, clean database design, and real-time state synchronization.
          </p>
        </motion.header>

        <motion.div
          ref={gridRef}
          className="projects-grid"
          initial="hidden"
          animate={gridControls}
          variants={activeContainer}
        >
          {projectsData.map((project, index) => {
            // Alternating directional reveals: Card 0 enters from left, Card 1 enters from right
            const cardVariant = shouldReduceMotion
              ? reducedMotionVariants
              : index % 2 === 0
                ? slideInLeftVariants
                : slideInRightVariants

            return (
              <motion.article
                key={project.id}
                className="project-card"
                variants={cardVariant}
                whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.25 } }}
              >
                <div className="project-card-header">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-tagline">{project.tagline}</p>
                </div>

                <div className="project-card-body">
                  <p className="project-description">{project.description}</p>

                  <div className="project-highlights">
                    <h4 className="highlights-heading">Key Capabilities &amp; Features:</h4>
                    <ul className="highlights-list">
                      {project.keyFeatures.map((feature, fIndex) => (
                        <li key={fIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="project-card-footer">
                  <div className="tech-tags-list">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <motion.a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-project-live"
                      aria-label={`Open live demo for ${project.title} (opens in new tab)`}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className="live-pulse-dot" aria-hidden="true" />
                      Live Demo ↗
                    </motion.a>

                    {project.sourceCodeUrl && (
                      <motion.a
                        href={project.sourceCodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-project-source"
                        aria-label={`View source code of ${project.title} on GitHub (opens in new tab)`}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                      >
                        View Source Code ↗
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
