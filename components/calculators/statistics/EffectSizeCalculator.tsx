'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EffectSizeCalculator() {
  const [mean1Str, setMean1Str] = useState('15')
  const [mean2Str, setMean2Str] = useState('12')
  const [sdStr, setSdStr] = useState('2.5') // pooled standard deviation

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, d: 0 }
    const m1 = parseFloat(mean1Str)
    const m2 = parseFloat(mean2Str)
    const sd = parseFloat(sdStr)

    if (isNaN(m1) || isNaN(m2) || isNaN(sd) || sd <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Cohen's d = (m1 - m2) / sd
    const d = (m1 - m2) / sd
    return { error: null, d }
  }, [mean1Str, mean2Str, sdStr])

  return (
    <FormCalculatorShell title="Cohen's d Effect Size Solver" subtitle="Evaluate standardized magnitude differences between two group means" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Mean Group 1" value={mean1Str} onChange={setMean1Str} id="es-m1" />
          <RetroInput label="Mean Group 2" value={mean2Str} onChange={setMean2Str} id="es-m2" />
          <RetroInput label="Pooled Standard Deviation" value={sdStr} onChange={setSdStr} id="es-sd" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Cohen's d Value" value={results.d.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
