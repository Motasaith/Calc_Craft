'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('10')
  const [compound, setCompound] = useState('12')
  const [result, setResult] = useState<{ total: string; interest: string } | null>(null)

  const calculate = () => {
    const P = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(time), n = parseInt(compound)
    if ([P, r, t, n].some(isNaN) || P <= 0 || r < 0 || t <= 0 || n <= 0) return
    const A = P * Math.pow(1 + r / n, n * t)
    setResult({ total: `$${Math.round(A).toLocaleString()}`, interest: `$${Math.round(A - P).toLocaleString()}` })
  }

  return (
    <FormCalculatorShell title="Compound Interest Calculator" badge="FINANCE">
      <RetroInput label="Principal Amount" value={principal} onChange={setPrincipal} placeholder="10000" id="ci-p" unit="$" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Annual Rate" value={rate} onChange={setRate} placeholder="5" id="ci-r" unit="%" />
        <RetroInput label="Time Period" value={time} onChange={setTime} placeholder="10" id="ci-t" unit="years" />
      </div>
      <RetroSelect label="Compounding" value={compound} onChange={setCompound} id="ci-c"
        options={[{ value: '1', label: 'Annually' }, { value: '2', label: 'Semi-Annually' }, { value: '4', label: 'Quarterly' }, { value: '12', label: 'Monthly' }, { value: '365', label: 'Daily' }]} />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="Final Amount" value={result.total} large />
          <ResultDisplay label="Interest Earned" value={result.interest} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
