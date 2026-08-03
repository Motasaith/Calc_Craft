'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function Distance3dCalculator() {
  const [x1Str, setX1Str] = useState('0')
  const [y1Str, setY1Str] = useState('0')
  const [z1Str, setZ1Str] = useState('0')
  const [x2Str, setX2Str] = useState('2')
  const [y2Str, setY2Str] = useState('3')
  const [z2Str, setZ2Str] = useState('6')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      distance: 0,
      midpoint: '',
      steps: [] as string[]
    }

    const x1 = parseFloat(x1Str)
    const y1 = parseFloat(y1Str)
    const z1 = parseFloat(z1Str)
    const x2 = parseFloat(x2Str)
    const y2 = parseFloat(y2Str)
    const z2 = parseFloat(z2Str)

    if (isNaN(x1) || isNaN(y1) || isNaN(z1) || isNaN(x2) || isNaN(y2) || isNaN(z2)) {
      return { ...defaultObj, error: 'Please enter valid coordinate values.' }
    }

    const dx = x2 - x1
    const dy = y2 - y1
    const dz = z2 - z1
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const midpoint = `(${(x1 + x2) / 2}, ${(y1 + y2) / 2}, ${(z1 + z2) / 2})`

    const steps = [
      `dx = x₂ - x₁ = ${x2} - ${x1} = ${dx}`,
      `dy = y₂ - y₁ = ${y2} - ${y1} = ${dy}`,
      `dz = z₂ - z₁ = ${z2} - ${z1} = ${dz}`,
      `Distance = √(dx² + dy² + dz²) = √(${dx}² + ${dy}² + ${dz}²) = √(${dx * dx} + ${dy * dy} + ${dz * dz}) = √(${dx * dx + dy * dy + dz * dz}) = ${distance.toFixed(4)}`,
      `Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2, (z₁ + z₂)/2) = ${midpoint}`
    ]

    return {
      error: null,
      distance,
      midpoint,
      steps
    }
  }, [x1Str, y1Str, z1Str, x2Str, y2Str, z2Str])

  return (
    <FormCalculatorShell title="3D Distance Calculator" subtitle="Solve distance and midpoint in three-dimensional space" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div>
            <span className="block text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 1 (x₁, y₁, z₁)</span>
            <div className="grid grid-cols-3 gap-2">
              <RetroInput label="X₁" value={x1Str} onChange={setX1Str} id="d3-x1" />
              <RetroInput label="Y₁" value={y1Str} onChange={setY1Str} id="d3-y1" />
              <RetroInput label="Z₁" value={z1Str} onChange={setZ1Str} id="d3-z1" />
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Point 2 (x₂, y₂, z₂)</span>
            <div className="grid grid-cols-3 gap-2">
              <RetroInput label="X₂" value={x2Str} onChange={setX2Str} id="d3-x2" />
              <RetroInput label="Y₂" value={y2Str} onChange={setY2Str} id="d3-y2" />
              <RetroInput label="Z₂" value={z2Str} onChange={setZ2Str} id="d3-z2" />
            </div>
          </div>
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="3D Distance" value={results.distance.toFixed(4)} large />
                <ResultDisplay label="3D Midpoint" value={results.midpoint} large />
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">3D Step-by-Step Solver</p>
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
