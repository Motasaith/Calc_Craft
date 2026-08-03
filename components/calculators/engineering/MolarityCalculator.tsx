'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MolarityCalculator() {
  const [molesStr, setMolesStr] = useState('0.5')
  const [volStr, setVolStr] = useState('2.0') // liters

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, molarity: 0 }
    const mol = parseFloat(molesStr)
    const v = parseFloat(volStr)

    if (isNaN(mol) || isNaN(v) || mol < 0 || v <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const molarity = mol / v
    return { error: null, molarity }
  }, [molesStr, volStr])

  return (
    <FormCalculatorShell title="Chemical Molarity Solver" subtitle="Calculate solution concentration molarity M = moles / liters" badge="ENGINEERING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Moles of Solute" value={molesStr} onChange={setMolesStr} id="mol-s" />
          <RetroInput label="Volume of Solution (Liters)" value={volStr} onChange={setVolStr} id="mol-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Molarity (M)" value={`${results.molarity.toFixed(4)} M (mol/L)`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
