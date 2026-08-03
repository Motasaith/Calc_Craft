'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function YieldCalculator() {
  const [actualStr, setActualStr] = useState('8') // actual yield grams
  const [theoryStr, setTheoryStr] = useState('10') // theoretical yield grams

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pct: 0 }
    const act = parseFloat(actualStr)
    const theory = parseFloat(theoryStr)

    if (isNaN(act) || isNaN(theory) || act < 0 || theory <= 0 || act > theory) {
      return { ...defaultObj, error: 'Theoretical yield must be greater than or equal to actual yield.' }
    }

    const pct = (act / theory) * 100
    return { error: null, pct }
  }, [actualStr, theoryStr])

  return (
    <FormCalculatorShell title="Chemical Percent Yield Solver" subtitle="Calculate chemical reaction percent yields" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Actual Yield (grams)" value={actualStr} onChange={setActualStr} id="y-act" />
          <RetroInput label="Theoretical Yield (grams)" value={theoryStr} onChange={setTheoryStr} id="y-theory" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Percent Yield" value={`${results.pct.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
