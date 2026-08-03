'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ChiSquareCalculator() {
  const [obsStr, setObsStr] = useState('10, 20, 30')
  const [expStr, setExpStr] = useState('15, 15, 30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, chi: 0 }
    const obs = obsStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))
    const exp = expStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n))

    if (obs.length !== exp.length || obs.length < 1) {
      return { ...defaultObj, error: 'Datasets must have same sizes and at least 1 category.' }
    }

    let chi = 0
    for (let i = 0; i < obs.length; i++) {
      if (exp[i] === 0) return { ...defaultObj, error: 'Expected value cannot be zero.' }
      chi += Math.pow(obs[i] - exp[i], 2) / exp[i]
    }

    return { error: null, chi }
  }, [obsStr, expStr])

  return (
    <FormCalculatorShell title="Chi-Square Goodness of Fit Solver" subtitle="Calculate Chi-Square test statistics from observed distributions" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Observed Frequencies" value={obsStr} onChange={setObsStr} id="cs-o" />
          <RetroInput label="Expected Frequencies" value={expStr} onChange={setExpStr} id="cs-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Chi-Square Value (χ²)" value={results.chi.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
