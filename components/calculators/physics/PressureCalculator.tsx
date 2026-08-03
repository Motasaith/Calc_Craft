'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PressureCalculator() {
  const [forceStr, setForceStr] = useState('100') // Newtons
  const [areaStr, setAreaStr] = useState('2') // square meters

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, p: 0 }
    const f = parseFloat(forceStr)
    const a = parseFloat(areaStr)

    if (isNaN(f) || isNaN(a) || f < 0 || a <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const p = f / a
    return { error: null, p }
  }, [forceStr, areaStr])

  return (
    <FormCalculatorShell title="Physical Pressure Solver" subtitle="Calculate surface pressure P = F / A in Pascals" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Force Exerted (Newtons)" value={forceStr} onChange={setForceStr} id="pr-f" />
          <RetroInput label="Contact Surface Area (m²)" value={areaStr} onChange={setAreaStr} id="pr-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Pressure (P)" value={`${results.p.toFixed(2)} Pa (N/m²)`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
