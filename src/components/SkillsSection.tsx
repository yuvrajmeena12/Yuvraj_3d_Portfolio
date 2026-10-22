import { motion, useReducedMotion } from 'framer-motion'
import {
  headingRevealVariants,
  scrollStaggerContainerVariants,
  cardRevealVariants,
  maskedLineVariants,
  reducedMotionVariants,
} from '../utils/motion'
import { useScrollDirectionReveal } from '../hooks/useScrollDirectionReveal'

interface SkillCategory {
  title: string
  skills: string[]
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: ['TypeScript', 'JavaScript (ES6+)', 'HTML5 & Semantic DOM', 'CSS3 / Modern Layouts', 'SQL'],
  },
  {
    title: 'Frontend Development',
    skills: ['React 19', 'Three.js / WebGL', 'React Three Fiber (R3F)', '@react-three/drei', 'TailwindCSS', 'Framer Motion'],
  },
  {
    title: 'Backend Engineering',
    skills: ['Node.js', 'Express.js', 'RESTful API Design', 'JWT Authentication', 'Middleware & Routing'],
  },
  {
    title: 'Databases & Storage',
    skills: ['PostgreSQL', 'Supabase (Realtime & Auth)', 'MongoDB (Mongoose)', 'Schema Design'],
  },
  {
    title: 'Tools & Deployment',
    skills: ['Git & GitHub', 'Vite', 'Vercel Deployment', 'npm Package Management', 'Oxlint / ESLint', 'Postman'],
  },
]

export const SkillsSection = () => {
  const shouldReduceMotion = useReducedMotion()
  const [headerRef, headerControls] = useScrollDirectionReveal<HTMLElement>()
  const [gridRef, gridControls] = useScrollDirectionReveal<HTMLDivElement>()

  const activeHeader = shouldReduceMotion ? reducedMotionVariants : headingRevealVariants
  const activeMaskedLine = shouldReduceMotion ? reducedMotionVariants : maskedLineVariants
  const activeContainer = shouldReduceMotion ? reducedMotionVariants : scrollStaggerContainerVariants
  const activeCard = shouldReduceMotion ? reducedMotionVariants : cardRevealVariants

  return (
    <section id="skills" className="content-section" aria-label="Technical Capabilities">
      <div className="section-container">
        <motion.header
          ref={headerRef}
          className="section-header"
          initial="hidden"
          animate={headerControls}
          variants={activeHeader}
        >
          <span className="section-eyebrow">03 // Capabilities</span>
          <h2 className="section-title">
            <span className="reveal-mask">
              <motion.span className="reveal-line silver-gradient-text" variants={activeMaskedLine}>
                Technical Capabilities
              </motion.span>
            </span>
          </h2>
          <p className="section-lead">
            Languages, frameworks, and tools applied across web application development and real-time graphics.
          </p>
        </motion.header>

        <motion.div
          ref={gridRef}
          className="skills-grid"
          initial="hidden"
          animate={gridControls}
          variants={activeContainer}
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              className="skill-category-card"
              variants={activeCard}
              whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.2 } }}
            >
              <h3 className="category-title">{category.title}</h3>
              <ul className="skill-badges-list">
                {category.skills.map((skill) => (
                  <li key={skill} className="skill-badge">
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
