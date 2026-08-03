'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RedshiftCalculator() {
  const [vStr, setVStr] = useState('15000000') // velocity (m/s)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, z: 0 }
    const v = parseFloat(vStr)
    if (isNaN(v) || v < 0) return { ...defaultObj, error: 'Please enter a valid positive velocity.' }
    const c = 299792458
    if (v >= c) return { ...defaultObj, error: 'Velocity cannot exceed or equal light speed (c).' }
    const z = Math.sqrt((1 + v / c) / (1 - v / c)) - 1
    return { error: null, z }
  }, [vStr])

  return (
    <FormCalculatorShell title="Cosmological Redshift Solver" subtitle="Calculate z parameter from velocity" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Velocity (m/s)" value={vStr} onChange={setVStr} id="red-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Redshift z" value={results.z.toFixed(6)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
