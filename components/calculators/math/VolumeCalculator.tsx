'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function VolumeCalculator() {
  const [lStr, setLStr] = useState('5')
  const [wStr, setWStr] = useState('4')
  const [hStr, setHStr] = useState('3')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      volume: 0,
      steps: [] as string[]
    }

    const l = parseFloat(lStr)
    const w = parseFloat(wStr)
    const h = parseFloat(hStr)

    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    const volume = l * w * h

    const steps = [
      `Volume = length × width × height`,
      `Volume = ${l} × ${w} × ${h} = ${volume.toFixed(4)}`
    ]

    return {
      error: null,
      volume,
      steps
    }
  }, [lStr, wStr, hStr])

  return (
    <FormCalculatorShell title="Volume Box Calculator" subtitle="Solve the volume of a rectangular prism" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Length" value={lStr} onChange={setLStr} id="vbox-l" />
          <RetroInput label="Width" value={wStr} onChange={setWStr} id="vbox-w" />
          <RetroInput label="Height" value={hStr} onChange={setHStr} id="vbox-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Volume" value={results.volume.toFixed(4)} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Steps</p>
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
