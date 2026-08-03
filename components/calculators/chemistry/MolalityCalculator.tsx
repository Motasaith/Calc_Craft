'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MolalityCalculator() {
  const [molesStr, setMolesStr] = useState('0.5')
  const [massSolventStr, setMassSolventStr] = useState('1.0') // kg of solvent

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, molality: 0 }
    const moles = parseFloat(molesStr)
    const mass = parseFloat(massSolventStr)

    if (isNaN(moles) || isNaN(mass) || moles < 0 || mass <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const molality = moles / mass
    return { error: null, molality }
  }, [molesStr, massSolventStr])

  return (
    <FormCalculatorShell title="Solution Molality Solver" subtitle="Calculate molality concentration m = moles solute / kg solvent" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Moles of Solute" value={molesStr} onChange={setMolesStr} id="ml-moles" />
          <RetroInput label="Solvent Mass (kg)" value={massSolventStr} onChange={setMassSolventStr} id="ml-mass" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Molality (m)" value={`${results.molality.toFixed(4)} m (mol/kg)`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
