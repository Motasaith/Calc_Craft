'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function InflationCalculator() {
  const [amount, setAmount] = useState(''); const [rate, setRate] = useState(''); const [years, setYears] = useState('')

  const av = parseFloat(amount), rv = parseFloat(rate), yv = parseFloat(years)
  const valid = !isNaN(av) && !isNaN(rv) && !isNaN(yv) && av > 0 && rv > 0 && yv > 0
  const future = valid ? av * Math.pow(1 + rv / 100, yv) : 0
  const purchasing = valid ? av / Math.pow(1 + rv / 100, yv) : 0

  return (
    <FormCalculatorShell title="Inflation Calculator" badge="FINANCE">
      <RetroInput label="Current Amount" value={amount} onChange={setAmount} placeholder="e.g. 10000" id="inf-a" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Inflation Rate" value={rate} onChange={setRate} placeholder="e.g. 3" id="inf-r" unit="% / yr" />
        <RetroInput label="Years" value={years} onChange={setYears} placeholder="e.g. 10" id="inf-y" />
      </div>
      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Future Cost" value={`$${Math.round(future).toLocaleString()}`} large />
          <ResultDisplay label="Purchasing Power" value={`$${Math.round(purchasing).toLocaleString()}`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
