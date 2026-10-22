import type { SVGProps } from 'react'

interface MonogramProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  showAccent?: boolean
  title?: string
}

/**
 * Custom Geometric Monogram 'Y'
 * 
 * Architectural, faceted signature mark inspired by the precision and reflective
 * geometry of the central liquid-chrome sculpture.
 * 
 * Features:
 * - Scalable vector geometry optimized for 20px–48px rasterization
 * - Faceted light/shadow planes emulating polished titanium & liquid chrome
 * - Precision diamond nexus at the central junction with restrained cyan accent
 * - Pure SVG vectors without bitmap dependencies or performance overhead
 */
export const Monogram = ({
  size = 30,
  className = '',
  showAccent = true,
  title = 'Yuvraj Monogram',
  ...props
}: MonogramProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`monogram-mark ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...props}
    >
      {title && <title>{title}</title>}
      <defs>
        {/* Specular Light Blade Gradient (Left Wing Outer) */}
        <linearGradient id="mono-specular-left" x1="5" y1="4" x2="18" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Ambient Reflective Silver (Left Wing Inner) */}
        <linearGradient id="mono-silver-left" x1="10" y1="4" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Brushed Chrome (Right Wing Outer) */}
        <linearGradient id="mono-chrome-right" x1="31" y1="6" x2="18" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Shadowed Inward Facet (Right Wing Inner) */}
        <linearGradient id="mono-shadow-right" x1="26" y1="4" x2="18" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Stem Left Facet (Light Silver Column) */}
        <linearGradient id="mono-stem-left" x1="13.5" y1="18.5" x2="18" y2="33" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="70%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Stem Right Facet (Graphite Column Shadow) */}
        <linearGradient id="mono-stem-right" x1="18" y1="18.5" x2="22.5" y2="33" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Restrained Cyan Nexus Accent */}
        <linearGradient id="mono-nexus-cyan" x1="18" y1="14.5" x2="18" y2="19.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Main Faceted Monogram Group */}
      <g className="monogram-facets">
        {/* Facet 1: Left Wing Outer (Specular Highlight Plane) */}
        <polygon
          points="5,6 10,4 18,18.5 13.5,18.5"
          fill="url(#mono-specular-left)"
        />

        {/* Facet 2: Left Wing Inner (Recessed Valley Plane) */}
        <polygon
          points="10,4 14.5,6.5 18,12 18,18.5"
          fill="url(#mono-silver-left)"
        />

        {/* Facet 3: Right Wing Inner (Counter-Reflective Valley Plane) */}
        <polygon
          points="18,12 21.5,6.5 26,4 18,18.5"
          fill="url(#mono-shadow-right)"
        />

        {/* Facet 4: Right Wing Outer (Brushed Titanium Plane) */}
        <polygon
          points="26,4 31,6 22.5,18.5 18,18.5"
          fill="url(#mono-chrome-right)"
        />

        {/* Facet 5: Central Stem Left (Vertical Reflective Pillar) */}
        <polygon
          points="13.5,18.5 18,18.5 18,33 14.5,30"
          fill="url(#mono-stem-left)"
        />

        {/* Facet 6: Central Stem Right (Vertical Shadow Pillar) */}
        <polygon
          points="18,18.5 22.5,18.5 21.5,30 18,33"
          fill="url(#mono-stem-right)"
        />

        {/* Architectural Central Ridge Bevel - Hairline specular definition */}
        <line
          x1="18"
          y1="18.5"
          x2="18"
          y2="33"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />

        {/* Central Nexus Core: Precision Architectural Keystone */}
        {showAccent ? (
          <polygon
            points="18,14.5 20,17 18,19.5 16,17"
            fill="url(#mono-nexus-cyan)"
            stroke="#38bdf8"
            strokeWidth="0.5"
            strokeOpacity="0.8"
            className="monogram-nexus"
          />
        ) : (
          <polygon
            points="18,14.5 20,17 18,19.5 16,17"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="0.5"
            className="monogram-nexus"
          />
        )}
      </g>
    </svg>
  )
}
