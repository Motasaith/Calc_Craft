'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function InsulationCalculator() {
  const [areaStr, setAreaStr] = useState('1000') // sq ft
  const [rValueStr, setRValueStr] = useState('38') // target R-value

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, costEst: 0 }
    const a = parseFloat(areaStr)
    const r = parseFloat(rValueStr)

    if (isNaN(a) || isNaN(r) || a <= 0 || r <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // estimated insulation cost: $0.05 per sq ft per R-value unit approx
    const costEst = a * r * 0.05
    return { error: null, costEst }
  }, [areaStr, rValueStr])

  return (
    <FormCalculatorShell title="Building Insulation R-Value Solver" subtitle="Estimate typical insulation material budget costs for target R-values" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Wall/Attic Area (sq ft)" value={areaStr} onChange={setAreaStr} id="in-a" />
          <RetroInput label="Target Insulation R-Value" value={rValueStr} onChange={setRValueStr} id="in-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Est. Material Cost" value={results.costEst.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
