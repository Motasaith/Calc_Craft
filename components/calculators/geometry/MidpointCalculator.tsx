'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MidpointCalculator() {
  const [x1Str, setX1Str] = useState('0')
  const [y1Str, setY1Str] = useState('0')
  const [x2Str, setX2Str] = useState('6')
  const [y2Str, setY2Str] = useState('8')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      midX: 0,
      midY: 0,
      midpoint: '',
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

    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2
    const midpoint = `(${midX}, ${midY})`

    const steps = [
      `Midpoint X = (x₁ + x₂)/2 = (${x1} + ${x2})/2 = ${midX}`,
      `Midpoint Y = (y₁ + y₂)/2 = (${y1} + ${y2})/2 = ${midY}`,
      `Midpoint Coordinate = (Midpoint X, Midpoint Y) = ${midpoint}`
    ]

    return {
      error: null,
      midX,
      midY,
      midpoint,
      steps,
      x1, y1, x2, y2
    }
  }, [x1Str, y1Str, x2Str, y2Str])

  // Coordinate SVG grid
  const svgGrid = useMemo(() => {
    if (results.error) return null
    const maxVal = Math.max(Math.abs(results.x1), Math.abs(results.y1), Math.abs(results.x2), Math.abs(results.y2), 1)
    const scale = 40 / maxVal

    const px1 = 60 + results.x1 * scale
    const py1 = 60 - results.y1 * scale
    const px2 = 60 + results.x2 * scale
    const py2 = 60 - results.y2 * scale
    const pmx = 60 + results.midX * scale
    const pmy = 60 - results.midY * scale

    return { px1, py1, px2, py2, pmx, pmy }
  }, [results])

  return (
    <FormCalculatorShell title="Midpoint Calculator" subtitle="Find the exact center coordinate between two points" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div>
            <span className="block text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 1 (x₁, y₁)</span>
            <div className="grid grid-cols-2 gap-2">
              <RetroInput label="X₁" value={x1Str} onChange={setX1Str} id="mid-x1" />
              <RetroInput label="Y₁" value={y1Str} onChange={setY1Str} id="mid-y1" />
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 2 (x₂, y₂)</span>
            <div className="grid grid-cols-2 gap-2">
              <RetroInput label="X₂" value={x2Str} onChange={setX2Str} id="mid-x2" />
              <RetroInput label="Y₂" value={y2Str} onChange={setY2Str} id="mid-y2" />
            </div>
          </div>
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1 gap-3">
                <ResultDisplay label="Midpoint Coordinate" value={results.midpoint} large />
              </div>

              {svgGrid && (
                <div className="rounded-xl border border-neutral-300 bg-[#cbd8ca]/30 p-4 flex flex-col items-center">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 self-start font-mono">Midpoint Visualizer</p>
                  <svg viewBox="0 0 120 120" className="w-32 h-32 bg-white rounded-lg border border-neutral-300">
                    <line x1="10" y1="60" x2="110" y2="60" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="60" y1="10" x2="60" y2="110" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1={svgGrid.px1} y1={svgGrid.py1} x2={svgGrid.px2} y2={svgGrid.py2} stroke="#b0bdae" strokeWidth="1.5" strokeDasharray="2 2" />
                    <circle cx={svgGrid.px1} cy={svgGrid.py1} r="3" fill="#9ca3af" />
                    <circle cx={svgGrid.px2} cy={svgGrid.py2} r="3" fill="#9ca3af" />
                    <circle cx={svgGrid.pmx} cy={svgGrid.pmy} r="4" fill="#b5655c" />
                  </svg>
                  <span className="text-[9px] text-neutral-500 font-mono mt-1">Midpoint is highlighted in red</span>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Formula Steps</p>
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
