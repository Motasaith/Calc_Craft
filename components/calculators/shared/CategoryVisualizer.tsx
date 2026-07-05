'use client'

import React, { useMemo } from 'react'

interface CategoryVisualizerProps {
  category: string
  slug: string
  variables: Record<string, number>
  results: { id: string; label: string; value: string; prefix: string; suffix: string }[]
}

// Wobbly line SVG path generator
function wobblyLine(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 5) return `M ${x1} ${y1} L ${x2} ${y2}`
  
  const steps = Math.max(3, Math.floor(dist / 10))
  let path = `M ${x1} ${y1}`
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const jitterX = (Math.random() - 0.5) * 1.5
    const jitterY = (Math.random() - 0.5) * 1.5
    path += ` L ${x1 + dx * t + jitterX} ${y1 + dy * t + jitterY}`
  }
  return path
}

// Wobbly circle SVG path generator
function wobblyCircle(cx: number, cy: number, r: number) {
  const steps = 32
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2
    const jitter = (Math.random() - 0.5) * 1.2
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    if (i === 0) path = `M ${x} ${y}`
    else path += ` L ${x} ${y}`
  }
  path += ' Z'
  return path
}

// Wobbly arc SVG path generator
function wobblyArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const steps = 16
  const step = (endAngle - startAngle) / steps
  let path = ''
  for (let i = 0; i <= steps; i++) {
    const theta = startAngle + step * i
    const jitter = (Math.random() - 0.5) * 0.8
    const x = cx + (r + jitter) * Math.cos(theta)
    const y = cy + (r + jitter) * Math.sin(theta)
    if (i === 0) path = `M ${x} ${y}`
    else path += ` L ${x} ${y}`
  }
  return path
}

export default function CategoryVisualizer({ category, slug, variables, results }: CategoryVisualizerProps) {
  // Normalize category key
  const cat = (category || '').toLowerCase()
  const slugKey = (slug || '').toLowerCase()

  // ═════════════════════════════════════════════════════════════
  // 1. HEALTH VISUALIZER (BMI Dial & general gauges)
  // ═════════════════════════════════════════════════════════════
  if (cat === 'health' || slugKey.includes('bmi') || slugKey.includes('fat') || slugKey.includes('weight')) {
    // Try to find calculated value (e.g. BMI value, Body Fat value)
    const bmiResult = results.find(r => r.label.toLowerCase().includes('bmi') || r.id.toLowerCase().includes('bmi'))
    const bmiVal = bmiResult ? parseFloat(bmiResult.value) : parseFloat(results[0]?.value || '22')
    
    // Scale dial rotation based on BMI range (15 to 35+)
    const val = isNaN(bmiVal) ? 22 : bmiVal
    const minVal = 15
    const maxVal = 35
    const pct = Math.min(1, Math.max(0, (val - minVal) / (maxVal - minVal)))
    const angle = -Math.PI + pct * Math.PI // from -180 deg to 0 deg (semicircle)

    // Needle path pointing from center (100, 120) to edge
    const needleLen = 65
    const nx = 100 + needleLen * Math.cos(angle)
    const ny = 120 + needleLen * Math.sin(angle)

    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Health Gauge</span>
        <svg width="180" height="140" viewBox="0 0 200 150" className="drop-shadow-sm select-none">
          <defs>
            <pattern id="gaugeGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#gaugeGrid)" rx="8" />

          {/* Semicircle gauge track (wobbly arc) */}
          <path d={wobblyArc(100, 120, 75, -Math.PI, 0)} fill="none" stroke="#d1d5db" strokeWidth="6" />
          
          {/* Wobbly outline details */}
          <path d={wobblyArc(100, 120, 80, -Math.PI, 0)} fill="none" stroke="#4b5563" strokeWidth="1.5" />
          <path d={wobblyArc(100, 120, 70, -Math.PI, 0)} fill="none" stroke="#4b5563" strokeWidth="1" />

          {/* Gauge zones ticks */}
          <line x1="25" y1="120" x2="35" y2="120" stroke="#4b5563" strokeWidth="1.5" />
          <line x1="100" y1="45" x2="100" y2="55" stroke="#4b5563" strokeWidth="1.5" />
          <line x1="175" y1="120" x2="165" y2="120" stroke="#4b5563" strokeWidth="1.5" />

          {/* Needle drawing */}
          <path d={wobblyLine(100, 120, nx, ny)} stroke="#b91c1c" strokeWidth="2.5" />
          <circle cx="100" cy="120" r="6" fill="#b91c1c" stroke="#4b5563" strokeWidth="1.5" />

          {/* Labels */}
          <text x="35" y="135" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Low</text>
          <text x="100" y="32" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Normal</text>
          <text x="165" y="135" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">High</text>

          <text x="100" y="105" fill="#2d332f" fontSize="14" fontWeight="black" fontFamily="monospace" textAnchor="middle">
            {val.toFixed(1)}
          </text>
        </svg>
        <span className="text-[10px] font-bold text-neutral-500 font-mono mt-1.5 uppercase tracking-wide">
          {val < 18.5 ? 'Underweight' : val < 25 ? 'Healthy Range' : val < 30 ? 'Overweight' : 'Obese / High'}
        </span>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // 2. FINANCE VISUALIZER (Principal vs Interest breakdown)
  // ═════════════════════════════════════════════════════════════
  if (cat === 'finance' || cat === 'investment' || slugKey.includes('loan') || slugKey.includes('interest') || slugKey.includes('saving')) {
    // Find output values
    const totalResult = results.find(r => r.label.toLowerCase().includes('total') || r.label.toLowerCase().includes('final'))
    const totalVal = totalResult ? parseFloat(totalResult.value.replace(/[^0-9.]/g, '')) : 10000

    const interestResult = results.find(r => r.label.toLowerCase().includes('interest') || r.label.toLowerCase().includes('earnings') || r.label.toLowerCase().includes('profit'))
    const interestVal = interestResult ? parseFloat(interestResult.value.replace(/[^0-9.]/g, '')) : 3000

    const principalVal = Math.max(1, totalVal - interestVal)

    // Calculate percentages
    const totalSum = principalVal + interestVal
    const principalPct = principalVal / totalSum
    const interestPct = interestVal / totalSum

    // Draw comparison bars in wobbly style
    const barWidth = 140
    const pWidth = Math.max(10, barWidth * principalPct)
    const iWidth = Math.max(10, barWidth * interestPct)

    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Principal vs Interest</span>
        <svg width="180" height="140" viewBox="0 0 200 150" className="drop-shadow-sm select-none">
          <defs>
            <pattern id="financeGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#financeGrid)" rx="8" />

          {/* Principal Bar (Fill & Border) */}
          <rect x="30" y="45" width={pWidth} height="25" fill="#cbd8ca" opacity="0.8" />
          <path d={wobblyLine(30, 45, 30 + pWidth, 45)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(30, 70, 30 + pWidth, 70)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(30, 45, 30, 70)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(30 + pWidth, 45, 30 + pWidth, 70)} stroke="#374151" strokeWidth="1.8" />

          {/* Interest Bar (Fill & Border) */}
          <rect x={30 + pWidth} y="45" width={iWidth} height="25" fill="#dfaa44" opacity="0.8" />
          <path d={wobblyLine(30 + pWidth, 45, 30 + pWidth + iWidth, 45)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(30 + pWidth, 70, 30 + pWidth + iWidth, 70)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(30 + pWidth + iWidth, 45, 30 + pWidth + iWidth, 70)} stroke="#374151" strokeWidth="1.8" />

          {/* Legends */}
          <circle cx="40" cy="100" r="4.5" fill="#cbd8ca" stroke="#374151" strokeWidth="1.2" />
          <text x="50" y="103" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="start">
            Principal ({(principalPct * 100).toFixed(0)}%)
          </text>

          <circle cx="40" cy="118" r="4.5" fill="#dfaa44" stroke="#374151" strokeWidth="1.2" />
          <text x="50" y="121" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="start">
            Interest ({(interestPct * 100).toFixed(0)}%)
          </text>
        </svg>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // 3. GEOMETRY / MATH SHAPE VISUALIZER
  // ═════════════════════════════════════════════════════════════
  if (cat === 'geometry' || cat === 'trigonometry' || slugKey.includes('area') || slugKey.includes('volume') || slugKey.includes('perimeter')) {
    // Draw wobbly 3D cube/prism as a default layout representation
    const widthVal = variables['w'] || variables['width'] || variables['a'] || variables['side'] || 5
    const heightVal = variables['h'] || variables['height'] || variables['b'] || 6
    const lengthVal = variables['l'] || variables['length'] || variables['c'] || 4

    // Map ratios
    const scaleX = Math.min(1.3, Math.max(0.6, widthVal / 5))
    const scaleY = Math.min(1.3, Math.max(0.6, heightVal / 6))
    const scaleZ = Math.min(1.3, Math.max(0.6, lengthVal / 4))

    const w = 70 * scaleX
    const h = 70 * scaleY
    const d = 30 * scaleZ // depth offset

    // Center coordinates
    const cx = 95 - w / 2
    const cy = 110 - h / 2

    // Cube vertices
    // Front face
    const f1 = { x: cx, y: cy + h }       // bottom-left
    const f2 = { x: cx + w, y: cy + h }   // bottom-right
    const f3 = { x: cx + w, y: cy }       // top-right
    const f4 = { x: cx, y: cy }           // top-left

    // Back face (offset by d)
    const b1 = { x: cx + d, y: cy + h - d }
    const b2 = { x: cx + w + d, y: cy + h - d }
    const b3 = { x: cx + w + d, y: cy - d }
    const b4 = { x: cx + d, y: cy - d }

    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Shape Outline</span>
        <svg width="180" height="140" viewBox="0 0 200 150" className="drop-shadow-sm select-none">
          <defs>
            <pattern id="geometryGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#geometryGrid)" rx="8" />

          {/* Hidden back edges (dashed) */}
          <path d={wobblyLine(b1.x, b1.y, b2.x, b2.y)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 2" />
          <path d={wobblyLine(b1.x, b1.y, b4.x, b4.y)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 2" />
          <path d={wobblyLine(b1.x, b1.y, f1.x, f1.y)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 2" />

          {/* Solid back edges */}
          <path d={wobblyLine(b4.x, b4.y, b3.x, b3.y)} stroke="#4b5563" strokeWidth="1.5" />
          <path d={wobblyLine(b2.x, b2.y, b3.x, b3.y)} stroke="#4b5563" strokeWidth="1.5" />

          {/* Front face outline */}
          <path d={wobblyLine(f1.x, f1.y, f2.x, f2.y)} stroke="#374151" strokeWidth="2" />
          <path d={wobblyLine(f2.x, f2.y, f3.x, f3.y)} stroke="#374151" strokeWidth="2" />
          <path d={wobblyLine(f3.x, f3.y, f4.x, f4.y)} stroke="#374151" strokeWidth="2" />
          <path d={wobblyLine(f4.x, f4.y, f1.x, f1.y)} stroke="#374151" strokeWidth="2" />

          {/* Connecting edges */}
          <path d={wobblyLine(f4.x, f4.y, b4.x, b4.y)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(f3.x, f3.y, b3.x, b3.y)} stroke="#374151" strokeWidth="1.8" />
          <path d={wobblyLine(f2.x, f2.y, b2.x, b2.y)} stroke="#374151" strokeWidth="1.8" />

          {/* Fill overlays for 3D depth perception */}
          <polygon points={`${f4.x},${f4.y} ${b4.x},${b4.y} ${b3.x},${b3.y} ${f3.x},${f3.y}`} fill="#cbd8ca" opacity="0.3" />
          <polygon points={`${f2.x},${f2.y} ${b2.x},${b2.y} ${b3.x},${b3.y} ${f3.x},${f3.y}`} fill="#4c5c4a" opacity="0.1" />

          {/* Dimension Labels */}
          <text x={cx + w / 2} y={cy + h + 12} fill="#374151" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            w={widthVal.toFixed(0)}
          </text>
          <text x={cx - 8} y={cy + h / 2} fill="#374151" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">
            h={heightVal.toFixed(0)}
          </text>
        </svg>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // 4. CONVERSION VISUALIZER (Dual sliding thermometers)
  // ═════════════════════════════════════════════════════════════
  if (cat === 'conversion' || slugKey.includes('converter') || slugKey.includes('unit')) {
    const inputVal = parseFloat(Object.values(variables)[0] as any || '1')
    const outputVal = parseFloat(results[0]?.value || '1')

    const safeIn = isNaN(inputVal) ? 1 : inputVal
    const safeOut = isNaN(outputVal) ? 1 : outputVal

    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Scale Comparison</span>
        <svg width="180" height="140" viewBox="0 0 200 150" className="drop-shadow-sm select-none">
          <defs>
            <pattern id="conversionGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#conversionGrid)" rx="8" />

          {/* Left thermometer tube */}
          <rect x="55" y="30" width="12" height="80" rx="6" fill="#f3f4f6" stroke="#4b5563" strokeWidth="1.5" />
          <rect x="57" y="60" width="8" height="48" rx="4" fill="#cbd8ca" />
          <circle cx="61" cy="114" r="10" fill="#cbd8ca" stroke="#4b5563" strokeWidth="1.5" />
          
          {/* Right thermometer tube */}
          <rect x="135" y="30" width="12" height="80" rx="6" fill="#f3f4f6" stroke="#4b5563" strokeWidth="1.5" />
          <rect x="137" y="45" width="8" height="63" rx="4" fill="#dfaa44" />
          <circle cx="141" cy="114" r="10" fill="#dfaa44" stroke="#4b5563" strokeWidth="1.5" />

          {/* Connecting comparison arrows */}
          <path d={wobblyLine(75, 75, 125, 75)} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3 3" />

          {/* Values labels */}
          <text x="61" y="20" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Input</text>
          <text x="61" y="117" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{safeIn.toFixed(0)}</text>

          <text x="141" y="20" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Output</text>
          <text x="141" y="117" fill="#4b5563" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{safeOut.toFixed(0)}</text>
        </svg>
      </div>
    )
  }

  // ═════════════════════════════════════════════════════════════
  // 5. DEFAULT MATH & MISC WIDGET (Sketchy Pie Chart representation)
  // ═════════════════════════════════════════════════════════════

  // Physics: wobbly force vector diagram
  if (cat === 'physics') {
    const val = parseFloat(results[0]?.value || '0')
    const arrowLen = Math.min(120, Math.abs(val) * 0.8 + 20)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Force Diagram</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="physGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#physGrid)" rx="8" />
          <path d={wobblyCircle(60, 70, 15)} fill="#fde68a" stroke="#a16207" strokeWidth="2" />
          <path d={wobblyLine(75, 70, 75 + arrowLen, 70)} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <path d={`M ${75 + arrowLen} 70 L ${75 + arrowLen - 8} 64 L ${75 + arrowLen - 8} 76 Z`} fill="#dc2626" />
          <text x="100" y="120" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Chemistry: wobbly molecule / beaker
  if (cat === 'chemistry') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Molecule</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="chemGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#chemGrid)" rx="8" />
          <path d={wobblyCircle(80, 60, 18)} fill="#34d399" fillOpacity="0.2" stroke="#059669" strokeWidth="2" />
          <path d={wobblyCircle(120, 80, 14)} fill="#a78bfa" fillOpacity="0.2" stroke="#7c3aed" strokeWidth="2" />
          <path d={wobblyLine(98, 60, 106, 80)} stroke="#6b7280" strokeWidth="2" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#059669" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Astronomy: wobbly orbit diagram
  if (cat === 'astronomy') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Orbit</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="astroGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#astroGrid)" rx="8" />
          <path d={wobblyCircle(100, 70, 40)} fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d={wobblyCircle(100, 70, 12)} fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
          <circle cx="140" cy="70" r="5" fill="#a78bfa" stroke="#7c3aed" strokeWidth="2" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#7c3aed" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Agriculture: wobbly field plot
  if (cat === 'agriculture') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Field Plot</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="agriGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#agriGrid)" rx="8" />
          <rect x="40" y="30" width="120" height="70" fill="#84cc16" fillOpacity="0.15" stroke="#65a30d" strokeWidth="2" rx="4" />
          {[50, 65, 80, 95, 110, 125, 140].map((x) => (
            <path key={x} d={`M ${x} 35 L ${x} 95`} stroke="#65a30d" strokeWidth="1" strokeDasharray="3 3" />
          ))}
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Photography: wobbly camera/aperture
  if (cat === 'photography') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Aperture</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="photoGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#photoGrid)" rx="8" />
          <path d={wobblyCircle(100, 65, 40)} fill="none" stroke="#78716c" strokeWidth="2.5" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180
            return <path key={deg} d={`M ${100 + 15 * Math.cos(rad)} ${65 + 15 * Math.sin(rad)} L ${100 + 38 * Math.cos(rad)} ${65 + 38 * Math.sin(rad)}`} stroke="#78716c" strokeWidth="1.5" />
          })}
          <path d={wobblyCircle(100, 65, 12)} fill="#78716c" fillOpacity="0.2" stroke="#57534e" strokeWidth="2" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#78716c" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Environment: wobbly leaf/eco gauge
  if (cat === 'environment') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Eco Impact</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="envGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#envGrid)" rx="8" />
          <path d={wobblyCircle(100, 65, 35)} fill="#22c55e" fillOpacity="0.15" stroke="#16a34a" strokeWidth="2.5" />
          <path d={`M 100 30 Q 130 50 100 100 Q 70 50 100 30 Z`} fill="#22c55e" fillOpacity="0.2" stroke="#16a34a" strokeWidth="2" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#16a34a" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Real Estate: wobbly house
  if (cat === 'real-estate') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Property</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="reGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#reGrid)" rx="8" />
          <path d="M 60 100 L 60 60 L 100 35 L 140 60 L 140 100 Z" fill="#fbbf24" fillOpacity="0.15" stroke="#d97706" strokeWidth="2.5" />
          <rect x="85" y="75" width="20" height="25" fill="#d97706" fillOpacity="0.2" stroke="#a16207" strokeWidth="1.5" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#d97706" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Tax: wobbly dollar/percentage gauge
  if (cat === 'tax') {
    const val = parseFloat(results[0]?.value || '0')
    const pct = Math.min(100, Math.abs(val) / 5)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Tax Burden</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="taxGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#taxGrid)" rx="8" />
          <rect x="30" y="50" width="140" height="25" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" rx="4" />
          <rect x="30" y="50" width={(pct / 100) * 140} height="25" fill="#ef4444" fillOpacity="0.4" stroke="#dc2626" strokeWidth="1.5" rx="4" />
          <text x="100" y="40" textAnchor="middle" fontSize="14" fontFamily="monospace" fill="#dc2626" fontWeight="bold">$</text>
          <text x="100" y="110" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#dc2626" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Automotive: wobbly car/speedometer
  if (cat === 'automotive') {
    const val = parseFloat(results[0]?.value || '0')
    const pct = Math.min(1, Math.abs(val) / 200)
    const angle = -Math.PI + pct * Math.PI
    const nx = 100 + 60 * Math.cos(angle)
    const ny = 80 + 60 * Math.sin(angle)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Speedometer</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="autoGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#autoGrid)" rx="8" />
          <path d={wobblyArc(100, 80, 60, -Math.PI, 0)} fill="none" stroke="#d1d5db" strokeWidth="6" />
          <path d={`M 100 80 L ${nx} ${ny}`} stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="80" r="5" fill="#1e1b4b" />
          <text x="100" y="110" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1e1b4b" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Sports: wobbly gauge / performance bar
  if (cat === 'sports') {
    const val = parseFloat(results[0]?.value || '0')
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Performance</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="sportsGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#sportsGrid)" rx="8" />
          <path d={wobblyArc(100, 80, 60, -Math.PI, 0)} fill="none" stroke="#d1d5db" strokeWidth="6" />
          <path d={`M 100 80 L ${100 + 50 * Math.cos(-Math.PI + Math.min(1, Math.abs(val) / 100) * Math.PI)} ${80 + 50 * Math.sin(-Math.PI + Math.min(1, Math.abs(val) / 100) * Math.PI)}`} stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="80" r="5" fill="#ea580c" />
          <text x="100" y="110" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#ea580c" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Cooking: wobbly pot/thermometer
  if (cat === 'cooking') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Recipe</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="cookGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#cookGrid)" rx="8" />
          <path d={wobblyCircle(100, 65, 35)} fill="#fbbf24" fillOpacity="0.15" stroke="#d97706" strokeWidth="2.5" />
          <path d={wobblyCircle(100, 65, 20)} fill="#fbbf24" fillOpacity="0.25" stroke="#d97706" strokeWidth="1.5" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#d97706" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Education: wobbly grade bar
  if (cat === 'education') {
    const val = parseFloat(results[0]?.value || '0')
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Grade</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="eduGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#eduGrid)" rx="8" />
          <path d={wobblyLine(30, 70, 170, 70)} stroke="#9ca3af" strokeWidth="2" />
          <path d={wobblyLine(30, 70, 30 + Math.min(140, (val / 100) * 140), 70)} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          <text x="100" y="110" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#3b82f6" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Business: wobbly chart bars
  if (cat === 'business') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Business</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="bizGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#bizGrid)" rx="8" />
          <path d={wobblyLine(30, 110, 170, 110)} stroke="#6b7280" strokeWidth="1.5" />
          <path d={wobblyLine(30, 110, 30, 30)} stroke="#6b7280" strokeWidth="1.5" />
          <path d={`M 50 110 L 50 ${110 - 40}`} stroke="#22c55e" strokeWidth="8" strokeLinecap="round" />
          <path d={`M 90 110 L 90 ${110 - 60}`} stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
          <path d={`M 130 110 L 130 ${110 - 30}`} stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
          <text x="100" y="130" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#475569" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Science: wobbly atom/molecule
  if (cat === 'science') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Science</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="sciGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#sciGrid)" rx="8" />
          <path d={wobblyCircle(100, 65, 35)} fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="100" cy="65" rx="35" ry="15" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          <ellipse cx="100" cy="65" rx="15" ry="35" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d={wobblyCircle(100, 65, 8)} fill="#14b8a6" fillOpacity="0.3" stroke="#0d9488" strokeWidth="2" />
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#0d9488" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Landscaping: wobbly garden plot
  if (cat === 'landscaping') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Garden</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="landGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#landGrid)" rx="8" />
          <rect x="40" y="30" width="120" height="70" fill="#84cc16" fillOpacity="0.15" stroke="#65a30d" strokeWidth="2" rx="4" />
          {[50, 65, 80, 95, 110, 125, 140].map((x) => (
            <path key={x} d={`M ${x} 35 L ${x} 95`} stroke="#65a30d" strokeWidth="1" strokeDasharray="3 3" />
          ))}
          <text x="100" y="125" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#65a30d" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Plumbing: wobbly pipe
  if (cat === 'plumbing') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Pipe Flow</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="plumbGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#plumbGrid)" rx="8" />
          <rect x="30" y="55" width="140" height="30" fill="#60a5fa" fillOpacity="0.15" stroke="#2563eb" strokeWidth="2.5" rx="4" />
          <path d={wobblyLine(40, 70, 160, 70)} stroke="#2563eb" strokeWidth="2" strokeDasharray="5 3" />
          <text x="100" y="110" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#2563eb" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  // Electrical: wobbly lightning/circuit
  if (cat === 'electrical') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center">
        <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Electrical</span>
        <svg width="180" height="120" viewBox="0 0 200 140" className="select-none">
          <defs>
            <pattern id="elecGrid" width="15" height="15" patternUnits="userSpaceOnUse">
              <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="200" height="140" fill="url(#elecGrid)" rx="8" />
          <path d="M 110 25 L 80 70 L 105 70 L 90 110 L 120 60 L 95 60 L 110 25 Z" fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" />
          <text x="100" y="130" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#d97706" fontWeight="bold">{results[0]?.value || '0'} {results[0]?.suffix || ''}</text>
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <span className="text-[10px] font-bold text-neutral-500 font-mono mb-2 uppercase tracking-wide">Breakdown</span>
      <svg width="180" height="140" viewBox="0 0 200 150" className="drop-shadow-sm select-none">
        <defs>
          <pattern id="defaultGrid" width="15" height="15" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="200" height="150" fill="url(#defaultGrid)" rx="8" />

        {/* Wobbly circle shape */}
        <path d={wobblyCircle(100, 75, 45)} fill="none" stroke="#374151" strokeWidth="2" />
        <path d={wobblyCircle(100, 75, 40)} fill="#cbd8ca" opacity="0.4" />
        
        {/* Partition lines */}
        <path d={wobblyLine(100, 75, 100, 35)} stroke="#374151" strokeWidth="1.8" />
        <path d={wobblyLine(100, 75, 135, 95)} stroke="#374151" strokeWidth="1.8" />

        {/* Floating calculations */}
        <text x="100" y="79" fill="#1a2019" fontSize="11" fontWeight="black" fontFamily="monospace" textAnchor="middle">
          {results[0] ? parseFloat(results[0].value).toFixed(0) : '0'}
        </text>
      </svg>
    </div>
  )
}
