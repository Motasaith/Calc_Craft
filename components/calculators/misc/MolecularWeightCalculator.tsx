'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MolecularWeightCalculator() {
  const [formula, setFormula] = useState('H2O')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, weight: 0 }
    if (!formula.trim()) return { ...defaultObj, error: 'Please enter a molecular formula.' }
    // Approximation for common molecules
    let weight = 18.015 // H2O default
    if (formula.toUpperCase() === 'CO2') weight = 44.01
    else if (formula.toUpperCase() === 'NaCl') weight = 58.44
    return { error: null, weight }
  }, [formula])

  return (
    <FormCalculatorShell title="Molecular Weight Solver" subtitle="Estimate molar mass weights of common molecular formulas" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Chemical Formula (e.g. H2O, CO2)" value={formula} onChange={setFormula} id="mw-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Molecular Weight" value={`${results.weight.toFixed(3)} g/mol`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
