'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'
import { AlertCircle } from 'lucide-react'

type Mode = 'hypotenuse' | 'leg'

export default function PythagoreanCalculator() {
  const [mode, setMode] = useState<Mode>('hypotenuse')

  // Inputs
  const [sideAStr, setSideAStr] = useState('3')
  const [sideBStr, setSideBStr] = useState('4')
  const [sideCStr, setSideCStr] = useState('5')

  // Calculations
  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      a: 0,
      b: 0,
      c: 0,
      area: 0,
      perimeter: 0,
      angleA: 0, // opposite a
      angleB: 0, // opposite b
      angleC: 90, // right angle
      steps: [] as string[]
    }

    if (mode === 'hypotenuse') {
      const a = parseFloat(sideAStr)
      const b = parseFloat(sideBStr)

      if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive side lengths.' }
      }

      const c = Math.sqrt(a * a + b * b)
      const perimeter = a + b + c
      const area = (a * b) / 2
      const angleA = Math.asin(a / c) * (180 / Math.PI)
      const angleB = Math.asin(b / c) * (180 / Math.PI)

      const steps = [
        `c² = a² + b²`,
        `c² = ${a}² + ${b}²`,
        `c² = ${a * a} + ${b * b}`,
        `c² = ${a * a + b * b}`,
        `c = √${a * a + b * b} = ${c.toFixed(4)}`
      ]

      return {
        error: null,
        a,
        b,
        c,
        area,
        perimeter,
        angleA,
        angleB,
        angleC: 90,
        steps
      }
    } else {
      const c = parseFloat(sideCStr)
      const a = parseFloat(sideAStr)

      if (isNaN(c) || isNaN(a) || c <= 0 || a <= 0) {
        return { ...defaultObj, error: 'Please enter valid positive side/hypotenuse lengths.' }
      }

      if (a >= c) {
        return { ...defaultObj, error: 'Leg side (a) must be shorter than Hypotenuse (c).' }
      }

      const b = Math.sqrt(c * c - a * a)
      const perimeter = a + b + c
      const area = (a * b) / 2
      const angleA = Math.asin(a / c) * (180 / Math.PI)
      const angleB = Math.asin(b / c) * (180 / Math.PI)

      const steps = [
        `b² = c² - a²`,
        `b² = ${c}² - ${a}²`,
        `b² = ${c * c} - ${a * a}`,
        `b² = ${c * c - a * a}`,
        `b = √${c * c - a * a} = ${b.toFixed(4)}`
      ]

      return {
        error: null,
        a,
        b,
        c,
        area,
        perimeter,
        angleA,
        angleB,
        angleC: 90,
        steps
      }
    }
  }, [mode, sideAStr, sideBStr, sideCStr])

  // SVG dimensions
  const svgTriangle = useMemo(() => {
    if (results.error || results.a === 0 || results.b === 0) return null

    // Determine scale: max dimension of side a or b will be 90 pixels
    const maxVal = Math.max(results.a, results.b)
    const scale = 90 / maxVal

    const scaledA = results.a * scale
    const scaledB = results.b * scale

    // Vertices:
    // Right angle (C) at (20, 110)
    // Vertical leg vertex (A) at (20, 110 - scaledA)
    // Horizontal leg vertex (B) at (20 + scaledB, 110)
    return {
      cx: 20,
      cy: 110,
      ax: 20,
      ay: 110 - scaledA,
      bx: 20 + scaledB,
      by: 110,
      // midpoints for labels
      labelA_x: 10,
      labelA_y: 110 - scaledA / 2,
      labelB_x: 20 + scaledB / 2,
      labelB_y: 125,
      labelC_x: 20 + scaledB / 2 + 10,
      labelC_y: 110 - scaledA / 2 - 10
    }
  }, [results])

  return (
    <FormCalculatorShell title="Pythagorean Theorem Calculator" subtitle="Solve right triangles by finding sides, perimeter, area, and angles" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        
        {/* ── Left Column: Inputs ── */}
        <div className="space-y-4">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-neutral-200 p-1">
            <button
              onClick={() => setMode('hypotenuse')}
              className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                mode === 'hypotenuse' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Find Hypotenuse (c)
            </button>
            <button
              onClick={() => setMode('leg')}
              className={`py-1.5 text-xs font-mono font-bold uppercase rounded-lg transition ${
                mode === 'leg' ? 'bg-white text-neutral-900 shadow' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Find Leg (b)
            </button>
          </div>

          <div className="space-y-3.5">
            {mode === 'hypotenuse' ? (
              <>
                <RetroInput label="Side length a" value={sideAStr} onChange={setSideAStr} placeholder="3" id="py-a" />
                <RetroInput label="Side length b" value={sideBStr} onChange={setSideBStr} placeholder="4" id="py-b" />
              </>
            ) : (
              <>
                <RetroInput label="Hypotenuse c" value={sideCStr} onChange={setSideCStr} placeholder="5" id="py-c" />
                <RetroInput label="Leg side a" value={sideAStr} onChange={setSideAStr} placeholder="3" id="py-a2" />
              </>
            )}
          </div>
        </div>

        {/* ── Right Column: Results & Visualization ── */}
        <div className="min-h-[440px]">
          {results && !results.error ? (
            <div className="space-y-4">
              
              {/* Primary Side Output */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ResultDisplay
                  label={mode === 'hypotenuse' ? "Hypotenuse (c)" : "Unknown Leg (b)"}
                  value={mode === 'hypotenuse' ? results.c.toFixed(4) : results.b.toFixed(4)}
                  large
                />
                <ResultDisplay label="Perimeter" value={results.perimeter.toFixed(4)} />
              </div>

              {/* Secondary Details */}
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Area" value={results.area.toFixed(4)} />
                <ResultDisplay label="Angle α (Opposite a)" value={`${results.angleA.toFixed(1)}°`} />
                <ResultDisplay label="Angle β (Opposite b)" value={`${results.angleB.toFixed(1)}°`} />
              </div>

              {/* Triangle SVG */}
              {svgTriangle && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">
                    Triangular Dimension Visual (scaled)
                  </p>
                  <svg viewBox="0 0 140 140" className="w-36 h-36" role="img" aria-label="A scaled right-angled triangle mapping side lengths and vertices dynamically.">
                    {/* The Triangle */}
                    <polygon
                      points={`${svgTriangle.cx},${svgTriangle.cy} ${svgTriangle.ax},${svgTriangle.ay} ${svgTriangle.bx},${svgTriangle.by}`}
                      fill="#8ab4a0"
                      stroke="#4c5c4a"
                      strokeWidth="2.5"
                    />

                    {/* Right angle marker box */}
                    <rect
                      x={svgTriangle.cx}
                      y={svgTriangle.cy - 8}
                      width="8"
                      height="8"
                      fill="none"
                      stroke="#4c5c4a"
                      strokeWidth="1.5"
                    />

                    {/* Labels */}
                    {/* Side a */}
                    <text x={svgTriangle.labelA_x} y={svgTriangle.labelA_y} fontSize="8" fontWeight="bold" fill="#1f2937" fontFamily="monospace">
                      a={results.a.toFixed(1)}
                    </text>
                    {/* Side b */}
                    <text x={svgTriangle.labelB_x} y={svgTriangle.labelB_y} fontSize="8" fontWeight="bold" fill="#1f2937" fontFamily="monospace" textAnchor="middle">
                      b={results.b.toFixed(1)}
                    </text>
                    {/* Hypotenuse c */}
                    <text x={svgTriangle.labelC_x} y={svgTriangle.labelC_y} fontSize="8" fontWeight="bold" fill="#1f2937" fontFamily="monospace">
                      c={results.c.toFixed(1)}
                    </text>

                    {/* Right Angle marker label */}
                    <text x={svgTriangle.cx + 12} y={svgTriangle.cy - 12} fontSize="7" fill="#6b7280" fontFamily="monospace">90°</text>
                  </svg>
                </div>
              )}

              {/* Steps breakdown */}
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
                  Step-by-Step Solver
                </p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-neutral-450">[{idx + 1}]</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results?.error || 'Enter side values to calculate triangle properties.'}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
