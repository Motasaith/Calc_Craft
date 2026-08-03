'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MassPercentCalculator() {
  const [soluteStr, setSoluteStr] = useState('10') // grams solute
  const [solventStr, setSolventStr] = useState('90') // grams solvent

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, percent: 0 }
    const solute = parseFloat(soluteStr)
    const solvent = parseFloat(solventStr)

    if (isNaN(solute) || isNaN(solvent) || solute < 0 || solvent <= 0) {
      return { ...defaultObj, error: 'Please enter valid mass values.' }
    }

    const percent = (solute / (solute + solvent)) * 100
    return { error: null, percent }
  }, [soluteStr, solventStr])

  return (
    <FormCalculatorShell title="Solution Mass Percent Solver" subtitle="Calculate solute mass percentage concentration of solutions" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Solute Mass (grams)" value={soluteStr} onChange={setSoluteStr} id="mp-solute" />
          <RetroInput label="Solvent Mass (grams)" value={solventStr} onChange={setSolventStr} id="mp-solvent" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Mass Percentage (w/w %)" value={`${results.percent.toFixed(2)}%`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
