'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PresentValueCalculator() {
  const [futureStr, setFutureStr] = useState('15000')
  const [rateStr, setRateStr] = useState('5.0')
  const [periodsStr, setPeriodsStr] = useState('5') // years

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pv: 0 }
    const f = parseFloat(futureStr)
    const r = parseFloat(rateStr)
    const n = parseFloat(periodsStr)

    if (isNaN(f) || isNaN(r) || isNaN(n) || f < 0 || r < 0 || n < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const pv = f / Math.pow(1 + r / 100, n)
    return { error: null, pv }
  }, [futureStr, rateStr, periodsStr])

  return (
    <FormCalculatorShell title="Present Value Solver" subtitle="Calculate present value of future capital sums" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Future Sum ($)" value={futureStr} onChange={setFutureStr} id="pv-f" />
          <RetroInput label="Discount Rate (%)" value={rateStr} onChange={setRateStr} id="pv-r" />
          <RetroInput label="Duration (Years)" value={periodsStr} onChange={setPeriodsStr} id="pv-n" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Present Value" value={results.pv.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
