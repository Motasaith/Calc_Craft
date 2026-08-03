'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CoterminalCalculator() {
  const [valStr, setValStr] = useState('450')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      positive: 0,
      negative: 0,
      steps: [] as string[]
    }

    const v = parseFloat(valStr)
    if (isNaN(v)) {
      return { ...defaultObj, error: 'Please enter a valid angle value.' }
    }

    const normalized = (v % 360 + 360) % 360
    const positive = normalized === 0 ? 360 : normalized
    const negative = positive - 360

    const steps = [
      `Angle: ${v}°`,
      `To find positive coterminal angle: add/subtract multiples of 360° until 0° <= angle < 360° = ${positive}°`,
      `To find negative coterminal angle: subtract 360° from positive coterminal = ${negative}°`
    ]

    return {
      error: null,
      positive,
      negative,
      steps
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Coterminal Angle Calculator" subtitle="Find positive and negative coterminal angles" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Angle (degrees)" value={valStr} onChange={setValStr} id="cot-deg" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Positive Coterminal" value={`${results.positive}°`} large />
                <ResultDisplay label="Negative Coterminal" value={`${results.negative}°`} large />
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
