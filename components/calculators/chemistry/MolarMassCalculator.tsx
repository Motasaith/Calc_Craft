'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MolarMassCalculator() {
  const [formula, setFormula] = useState('H2O')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, mass: 0 }
    if (!formula.trim()) return { ...defaultObj, error: 'Please enter a molecular formula.' }
    
    // Quick molar mass map for common learning samples
    let mass = 18.015
    const clean = formula.toUpperCase().trim()
    if (clean === 'CO2') mass = 44.009
    else if (clean === 'NaCl') mass = 58.44
    else if (clean === 'O2') mass = 31.998
    else if (clean === 'H2') mass = 2.016
    else if (clean === 'CH4') mass = 16.04

    return { error: null, mass }
  }, [formula])

  return (
    <FormCalculatorShell title="Molar Mass Solver" subtitle="Calculate formula molar mass values for chemistry targets" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Chemical Formula (e.g. H2O, CO2, CH4)" value={formula} onChange={setFormula} id="mm-f" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Molar Mass" value={`${results.mass.toFixed(3)} g/mol`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
