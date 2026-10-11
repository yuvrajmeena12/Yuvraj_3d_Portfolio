import React from 'react'

interface WebGLFallbackProps {
  reason?: string
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  reason = 'Hardware-accelerated 3D graphics (WebGL) are disabled or unavailable in this browser.',
}) => {
  return (
    <div className="webgl-fallback" role="alert">
      <div className="fallback-card">
        <div className="fallback-status-dot"></div>
        <h2 className="fallback-title">3D Acceleration Unavailable</h2>
        <p className="fallback-description">{reason}</p>
        <p className="fallback-subtext">
          To view this 3D proof-of-concept, please enable hardware acceleration in your browser
          settings or try a modern Chromium/Firefox/Safari browser.
        </p>
      </div>
    </div>
  )
}
