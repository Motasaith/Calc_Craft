'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function Distance2dCalculator() {
  const [x1Str, setX1Str] = useState('0')
  const [y1Str, setY1Str] = useState('0')
  const [x2Str, setX2Str] = useState('3')
  const [y2Str, setY2Str] = useState('4')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      distance: 0,
      midpoint: '',
      slope: 0,
      isVertical: false,
      steps: [] as string[],
      x1: 0, y1: 0, x2: 0, y2: 0
    }

    const x1 = parseFloat(x1Str)
    const y1 = parseFloat(y1Str)
    const x2 = parseFloat(x2Str)
    const y2 = parseFloat(y2Str)

    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
      return { ...defaultObj, error: 'Please enter valid coordinate values.' }
    }

    const dx = x2 - x1
    const dy = y2 - y1
    const distance = Math.sqrt(dx * dx + dy * dy)
    const midpoint = `(${(x1 + x2) / 2}, ${(y1 + y2) / 2})`
    const isVertical = dx === 0
    const slope = isVertical ? Infinity : dy / dx

    const steps = [
      `dx = x₂ - x₁ = ${x2} - ${x1} = ${dx}`,
      `dy = y₂ - y₁ = ${y2} - ${y1} = ${dy}`,
      `Distance = √(dx² + dy²) = √(${dx}² + ${dy}²) = √(${dx * dx} + ${dy * dy}) = √(${dx * dx + dy * dy}) = ${distance.toFixed(4)}`,
      `Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((${x1} + ${x2})/2, (${y1} + ${y2})/2) = ${midpoint}`,
      `Slope = dy / dx = ${isVertical ? 'Undefined (vertical line)' : `${dy} / ${dx} = ${slope.toFixed(4)}`}`
    ]

    return {
      error: null,
      distance,
      midpoint,
      slope,
      isVertical,
      steps,
      x1, y1, x2, y2
    }
  }, [x1Str, y1Str, x2Str, y2Str])

  // Coordinate SVG grid
  const svgGrid = useMemo(() => {
    if (results.error) return null
    // Map coords to SVG box: 120x120
    // Center at (60, 60)
    // Scale coords dynamically
    const maxVal = Math.max(Math.abs(results.x1), Math.abs(results.y1), Math.abs(results.x2), Math.abs(results.y2), 1)
    const scale = 40 / maxVal

    const px1 = 60 + results.x1 * scale
    const py1 = 60 - results.y1 * scale
    const px2 = 60 + results.x2 * scale
    const py2 = 60 - results.y2 * scale

    return { px1, py1, px2, py2 }
  }, [results])

  return (
    <FormCalculatorShell title="2D Distance & Coordinate Calculator" subtitle="Solve distance, midpoint, and slope between two coordinate points" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div>
            <span className="block text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 1 (x₁, y₁)</span>
            <div className="grid grid-cols-2 gap-2">
              <RetroInput label="X₁" value={x1Str} onChange={setX1Str} id="d2-x1" />
              <RetroInput label="Y₁" value={y1Str} onChange={setY1Str} id="d2-y1" />
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 2 (x₂, y₂)</span>
            <div className="grid grid-cols-2 gap-2">
              <RetroInput label="X₂" value={x2Str} onChange={setX2Str} id="d2-x2" />
              <RetroInput label="Y₂" value={y2Str} onChange={setY2Str} id="d2-y2" />
            </div>
          </div>
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="Distance" value={results.distance.toFixed(4)} large />
                <ResultDisplay label="Midpoint" value={results.midpoint} />
                <ResultDisplay label="Slope" value={results.isVertical ? '∞' : results.slope.toFixed(4)} />
              </div>

              {svgGrid && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">2D Coordinates Visual</p>
                  <svg viewBox="0 0 120 120" className="w-32 h-32 bg-white rounded-lg border border-neutral-300">
                    <line x1="10" y1="60" x2="110" y2="60" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="60" y1="10" x2="60" y2="110" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1={svgGrid.px1} y1={svgGrid.py1} x2={svgGrid.px2} y2={svgGrid.py2} stroke="#b5655c" strokeWidth="2" />
                    <circle cx={svgGrid.px1} cy={svgGrid.py1} r="3.5" fill="#4c5c4a" />
                    <circle cx={svgGrid.px2} cy={svgGrid.py2} r="3.5" fill="#4c5c4a" />
                  </svg>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Step-by-Step Solutions</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
