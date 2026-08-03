'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AspectRatioCalculator() {
  const [widthStr, setWidthStr] = useState('1920')
  const [heightStr, setHeightStr] = useState('1080')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      ratio: '',
      decimal: 0,
      steps: [] as string[]
    }

    const w = parseInt(widthStr)
    const h = parseInt(heightStr)

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    }

    // Find greatest common divisor
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y))
    const d = gcd(w, h)
    const ratio = `${w / d} : ${h / d}`
    const decimal = w / h

    const steps = [
      `Width = ${w} px | Height = ${h} px`,
      `GCD(${w}, ${h}) = ${d}`,
      `Aspect Ratio = ${w / d} : ${h / d}`,
      `Decimal aspect ratio = ${decimal.toFixed(3)}`
    ]

    return {
      error: null,
      ratio,
      decimal,
      steps
    }
  }, [widthStr, heightStr])

  return (
    <FormCalculatorShell title="Aspect Ratio Calculator" subtitle="Solve aspect ratios and scaling from pixel counts" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (px)" value={widthStr} onChange={setWidthStr} id="ar-w" />
          <RetroInput label="Height (px)" value={heightStr} onChange={setHeightStr} id="ar-h" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Aspect Ratio" value={results.ratio} large />
                <ResultDisplay label="Decimal Ratio" value={results.decimal.toFixed(3)} large />
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
