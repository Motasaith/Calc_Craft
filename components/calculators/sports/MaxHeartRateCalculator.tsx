'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MaxHeartRateCalculator() {
  const [ageStr, setAgeStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, mhr: 0, fatBurn: '', cardio: '', peak: '', steps: [] as string[] }
    const age = parseInt(ageStr)
    if (isNaN(age) || age <= 0) return { ...defaultObj, error: 'Please enter a valid age.' }
    // Tanaka formula: 208 - 0.7 * age
    const mhr = 208 - 0.7 * age
    const fbMin = Math.round(mhr * 0.5)
    const fbMax = Math.round(mhr * 0.7)
    const cardMin = Math.round(mhr * 0.7)
    const cardMax = Math.round(mhr * 0.85)
    const peakMin = Math.round(mhr * 0.85)
    return {
      error: null,
      mhr,
      fatBurn: `${fbMin} - ${fbMax} bpm`,
      cardio: `${cardMin} - ${cardMax} bpm`,
      peak: `${peakMin} - ${Math.round(mhr)} bpm`,
      steps: [
        `Tanaka formula: Max HR = 208 - (0.7 × Age)`,
        `Max HR = 208 - (0.7 × ${age}) = ${mhr.toFixed(1)} bpm`,
        `Fat Burn zone = 50% - 70% of Max HR`,
        `Cardio zone = 70% - 85% of Max HR`,
        `Peak zone = 85% - 100% of Max HR`
      ]
    }
  }, [ageStr])

  return (
    <FormCalculatorShell title="Max Heart Rate & Zones Solver" subtitle="Calculate maximum heart rate and target fitness zones" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Age" value={ageStr} onChange={setAgeStr} id="mhr-age" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Max Heart Rate" value={`${results.mhr} bpm`} large />
                <ResultDisplay label="Fat Burn (50-70%)" value={results.fatBurn} />
                <ResultDisplay label="Cardio (70-85%)" value={results.cardio} />
                <ResultDisplay label="Peak (85-100%)" value={results.peak} />
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
