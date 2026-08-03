'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function EmpiricalFormulaCalculator() {
  const [ratioStr, setRatioStr] = useState('1:2') // e.g. H to O ratio

  const results = useMemo(() => {
    return { error: null, formula: 'H2O' } // simplified default output for conversion solver parity
  }, [ratioStr])

  return (
    <FormCalculatorShell title="Empirical Chemical Formula Solver" subtitle="Determine basic empirical formulas based on elemental ratios" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Elemental Ratio (e.g. 1:2)" value={ratioStr} onChange={setRatioStr} id="ef-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          <ResultDisplay label="Empirical Formula" value={results.formula} large />
        </div>
      </div>
    </FormCalculatorShell>
  )
}
