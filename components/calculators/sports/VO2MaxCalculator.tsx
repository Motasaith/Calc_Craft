'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function VO2MaxCalculator() {
  const [maxHrStr, setMaxHrStr] = useState('190')
  const [restHrStr, setRestHrStr] = useState('60')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, vo2Max: 0 }
    const max = parseFloat(maxHrStr)
    const rest = parseFloat(restHrStr)

    if (isNaN(max) || isNaN(rest) || max <= 0 || rest <= 0 || rest >= max) {
      return { ...defaultObj, error: 'Max HR must be greater than Resting HR.' }
    }

    // Uth-Sorensen-Overgaard-Pedersen formula: VO2max = 15.3 * (HRmax / HRrest)
    const vo2Max = 15.3 * (max / rest)
    return { error: null, vo2Max }
  }, [maxHrStr, restHrStr])

  return (
    <FormCalculatorShell title="VO2 Max Hydration Solver" subtitle="Estimate maximum oxygen volume consumption from heart rates" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Max Heart Rate (bpm)" value={maxHrStr} onChange={setMaxHrStr} id="vo2-max" />
          <RetroInput label="Resting Heart Rate (bpm)" value={restHrStr} onChange={setRestHrStr} id="vo2-rest" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="VO2 Max (mL/kg/min)" value={results.vo2Max.toFixed(1)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
