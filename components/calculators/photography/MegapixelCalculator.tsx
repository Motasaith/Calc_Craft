'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MegapixelCalculator() {
  const [widthStr, setWidthStr] = useState('6000')
  const [heightStr, setHeightStr] = useState('4000')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      mp: 0,
      totalPixels: 0,
      steps: [] as string[]
    }

    const w = parseInt(widthStr)
    const h = parseInt(heightStr)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    const totalPixels = w * h
    const mp = totalPixels / 1000000

    const steps = [
      `Total Pixels = Width × Height = ${w} × ${h} = ${totalPixels.toLocaleString()}`,
      `Megapixels = Total Pixels / 1,000,000 = ${mp.toFixed(2)} MP`
    ]

    return {
      error: null,
      mp,
      totalPixels,
      steps
    }
  }, [widthStr, heightStr])

  return (
    <FormCalculatorShell title="Megapixel Calculator" subtitle="Solve megapixel counts from resolution dimensions" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (pixels)" value={widthStr} onChange={setWidthStr} id="mp-w" />
          <RetroInput label="Height (pixels)" value={heightStr} onChange={setHeightStr} id="mp-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Megapixels" value={`${results.mp.toFixed(2)} MP`} large />
                <ResultDisplay label="Total Pixels" value={results.totalPixels.toLocaleString()} large />
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
