'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PyramidCalculator() {
  const [lStr, setLStr] = useState('6') // base length
  const [wStr, setWStr] = useState('6') // base width
  const [hStr, setHStr] = useState('8') // height

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      volume: 0,
      surfaceArea: 0,
      steps: [] as string[]
    }

    const l = parseFloat(lStr)
    const w = parseFloat(wStr)
    const h = parseFloat(hStr)

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    const baseArea = l * w
    const volume = (1 / 3) * baseArea * h
    
    // Slant heights for sides
    const slantL = Math.sqrt((w / 2) * (w / 2) + h * h)
    const slantW = Math.sqrt((l / 2) * (l / 2) + h * h)
    const surfaceArea = baseArea + l * slantL + w * slantW

    const steps = [
      `Base Area = length × width = ${l} × ${w} = ${baseArea}`,
      `Volume = (1/3) × Base Area × height = (1/3) × ${baseArea} × ${h} = ${volume.toFixed(4)}`,
      `Slant Height L = √((w/2)² + h²) = ${slantL.toFixed(4)}`,
      `Slant Height W = √((l/2)² + h²) = ${slantW.toFixed(4)}`,
      `Surface Area = Base Area + l×slantL + w×slantW = ${surfaceArea.toFixed(4)}`
    ]

    return {
      error: null,
      volume,
      surfaceArea,
      steps
    }
  }, [lStr, wStr, hStr])

  return (
    <FormCalculatorShell title="Pyramid Calculator" subtitle="Solve volume and surface area of a rectangular pyramid" badge="GEOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Base Length (l)" value={lStr} onChange={setLStr} id="pyr-l" />
          <RetroInput label="Base Width (w)" value={wStr} onChange={setWStr} id="pyr-w" />
          <RetroInput label="Height (h)" value={hStr} onChange={setHStr} id="pyr-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Volume (V)" value={results.volume.toFixed(4)} large />
                <ResultDisplay label="Surface Area (A)" value={results.surfaceArea.toFixed(4)} large />
              </div>

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
