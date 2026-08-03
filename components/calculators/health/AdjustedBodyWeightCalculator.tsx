'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AdjustedBodyWeightCalculator() {
  const [actualStr, setActualStr] = useState('80') // kg
  const [idealStr, setIdealStr] = useState('65') // kg

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, adj: 0 }
    const act = parseFloat(actualStr)
    const idl = parseFloat(idealStr)

    if (isNaN(act) || isNaN(idl) || act <= 0 || idl <= 0) {
      return { ...defaultObj, error: 'Please enter valid body weights.' }
    }

    const adj = idl + 0.4 * (act - idl)
    return { error: null, adj }
  }, [actualStr, idealStr])

  return (
    <FormCalculatorShell title="Adjusted Body Weight Solver" subtitle="Calculate adjusted weight metrics for clinical dosing targets" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Actual Weight (kg)" value={actualStr} onChange={setActualStr} id="abw-a" />
          <RetroInput label="Ideal Weight (kg)" value={idealStr} onChange={setIdealStr} id="abw-i" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Adjusted Weight" value={`${results.adj.toFixed(1)} kg`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
