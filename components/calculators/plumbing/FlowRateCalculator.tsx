'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FlowRateCalculator() {
  const [volStr, setVolStr] = useState('50') // gallons
  const [timeStr, setTimeStr] = useState('5') // minutes

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gpm: 0 }
    const v = parseFloat(volStr)
    const t = parseFloat(timeStr)

    if (isNaN(v) || isNaN(t) || v <= 0 || t <= 0) {
      return { ...defaultObj, error: 'Please enter valid volume and time.' }
    }

    const gpm = v / t
    return { error: null, gpm }
  }, [volStr, timeStr])

  return (
    <FormCalculatorShell title="Plumbing Flow Rate GPM Solver" subtitle="Calculate flow rates in Gallons Per Minute (GPM)" badge="PLUMBING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Water Volume (gallons)" value={volStr} onChange={setVolStr} id="fl-v" />
          <RetroInput label="Elapsed Time (minutes)" value={timeStr} onChange={setTimeStr} id="fl-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Flow Rate (GPM)" value={`${results.gpm.toFixed(2)} GPM`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
