'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FlooringCalculator() {
  const [areaStr, setAreaStr] = useState('200')
  const [wasteStr, setWasteStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, total: 0 }
    const a = parseFloat(areaStr)
    const w = parseFloat(wasteStr)
    if (isNaN(a) || isNaN(w) || a <= 0 || w < 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const total = a * (1 + w / 100)
    return { error: null, total }
  }, [areaStr, wasteStr])

  return (
    <FormCalculatorShell title="Flooring Area Solver" subtitle="Calculate flooring coverage with waste factors" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Room Area (sq ft)" value={areaStr} onChange={setAreaStr} id="fl-a" />
          <RetroInput label="Waste Factor (%)" value={wasteStr} onChange={setWasteStr} id="fl-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Flooring Needed" value={`${results.total.toFixed(1)} sq ft`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
