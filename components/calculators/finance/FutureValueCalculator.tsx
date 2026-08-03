'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FutureValueCalculator() {
  const [presentStr, setPresentStr] = useState('10000')
  const [rateStr, setRateStr] = useState('5.0')
  const [periodsStr, setPeriodsStr] = useState('5') // years

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, fv: 0 }
    const p = parseFloat(presentStr)
    const r = parseFloat(rateStr)
    const n = parseFloat(periodsStr)

    if (isNaN(p) || isNaN(r) || isNaN(n) || p < 0 || r < 0 || n < 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const fv = p * Math.pow(1 + r / 100, n)
    return { error: null, fv }
  }, [presentStr, rateStr, periodsStr])

  return (
    <FormCalculatorShell title="Future Value Solver" subtitle="Calculate compound future values of investments" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Starting Sum ($)" value={presentStr} onChange={setPresentStr} id="fv-p" />
          <RetroInput label="Annual Return (%)" value={rateStr} onChange={setRateStr} id="fv-r" />
          <RetroInput label="Duration (Years)" value={periodsStr} onChange={setPeriodsStr} id="fv-n" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Future Value" value={results.fv.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
