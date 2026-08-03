'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BohrRadiusCalculator() {
  const [nStr, setNStr] = useState('1') // principal quantum number

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, radius: 0 }
    const n = parseInt(nStr)
    if (isNaN(n) || n <= 0) return { ...defaultObj, error: 'Please enter a valid quantum level n.' }
    // Bohr radius formula: r_n = n^2 * a_0 where a_0 = 5.291772109e-11 meters (approx 0.529 Angstroms)
    const radius = n * n * 0.529177
    return { error: null, radius }
  }, [nStr])

  return (
    <FormCalculatorShell title="Bohr Orbit Radius Solver" subtitle="Calculate Bohr atomic orbit radius in Angstroms (10^-10 m)" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Principal Quantum Number (n)" value={nStr} onChange={setNStr} id="br-n" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Orbit Radius" value={`${results.radius.toFixed(4)} Å`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
