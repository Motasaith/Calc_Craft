'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AtomCountCalculator() {
  const [molesStr, setMolesStr] = useState('1')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, count: '' }
    const moles = parseFloat(molesStr)
    if (isNaN(moles) || moles < 0) return { ...defaultObj, error: 'Please enter valid moles.' }
    // N_A = 6.022e23
    const atomsVal = moles * 6.02214076e23
    return { error: null, count: atomsVal.toExponential(4) }
  }, [molesStr])

  return (
    <FormCalculatorShell title="Avogadro Atom Count Solver" subtitle="Calculate total atoms count from mole measurements" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Moles of Substance" value={molesStr} onChange={setMolesStr} id="ac-m" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Atom Count" value={results.count} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
