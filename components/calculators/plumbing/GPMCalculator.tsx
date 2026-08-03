'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GPMCalculator() {
  const [volStr, setVolStr] = useState('10') // gallons
  const [secStr, setSecStr] = useState('30') // seconds

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gpm: 0 }
    const v = parseFloat(volStr)
    const s = parseFloat(secStr)

    if (isNaN(v) || isNaN(s) || v <= 0 || s <= 0) {
      return { ...defaultObj, error: 'Please enter valid values.' }
    }

    const gpm = (v / s) * 60
    return { error: null, gpm }
  }, [volStr, secStr])

  return (
    <FormCalculatorShell title="Water Velocity GPM Solver" subtitle="Calculate Gallons Per Minute (GPM) flow from filling times" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Volume filled (gallons)" value={volStr} onChange={setVolStr} id="gpm-v" />
          <RetroInput label="Time to fill (seconds)" value={secStr} onChange={setSecStr} id="gpm-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Flow Rate" value={`${results.gpm.toFixed(2)} GPM`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
