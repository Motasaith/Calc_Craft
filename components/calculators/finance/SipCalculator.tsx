'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SipCalculator() {
  const [monthlyStr, setMonthlyStr] = useState('500')
  const [rateStr, setRateStr] = useState('12') // annual rate %
  const [yearsStr, setYearsStr] = useState('10')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, invested: 0, total: 0 }
    const pm = parseFloat(monthlyStr)
    const r = parseFloat(rateStr)
    const y = parseFloat(yearsStr)

    if (isNaN(pm) || isNaN(r) || isNaN(y) || pm <= 0 || r < 0 || y <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const n = y * 12
    const i = r / 12 / 100
    const invested = pm * n
    const total = pm * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)

    return { error: null, invested, total }
  }, [monthlyStr, rateStr, yearsStr])

  return (
    <FormCalculatorShell title="Systematic Investment SIP Solver" subtitle="Calculate compounding returns on regular monthly mutual fund deposits" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Monthly SIP Contribution ($)" value={monthlyStr} onChange={setMonthlyStr} id="sip-m" />
          <RetroInput label="Expected Annual Return (%)" value={rateStr} onChange={setRateStr} id="sip-r" />
          <RetroInput label="Investment Duration (Years)" value={yearsStr} onChange={setYearsStr} id="sip-y" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Total Invested Amount" value={results.invested.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Projected Future Value" value={results.total.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
