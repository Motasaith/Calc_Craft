'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TipCalculatorPlus() {
  const [billStr, setBillStr] = useState('100')
  const [tipStr, setTipStr] = useState('15') // % tip

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tip: 0, total: 0 }
    const bill = parseFloat(billStr)
    const rate = parseFloat(tipStr)

    if (isNaN(bill) || isNaN(rate) || bill <= 0 || rate < 0) {
      return { ...defaultObj, error: 'Please enter valid values.' }
    }

    const tip = bill * (rate / 100)
    const total = bill + tip
    return { error: null, tip, total }
  }, [billStr, tipStr])

  return (
    <FormCalculatorShell title="Dining Tip Solver" subtitle="Calculate tip and total amounts for dining checks" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Check Bill Amount ($)" value={billStr} onChange={setBillStr} id="tp-b" />
          <RetroInput label="Tip Percentage (%)" value={tipStr} onChange={setTipStr} id="tp-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Tip Amount" value={results.tip.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Grand Total (with tip)" value={results.total.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
