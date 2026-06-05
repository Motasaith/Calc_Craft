'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { calculateCompoundInterest, formatCurrency } from '@/lib/calc-engine'

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('5')
  const [time, setTime] = useState('10')
  const [compound, setCompound] = useState('12')
  const [result, setResult] = useState<{ amount: number; interest: number } | null>(null)

  const calculate = async () => {
    const P = parseFloat(principal), r = parseFloat(rate), t = parseFloat(time), n = parseInt(compound)
    if ([P, r, t, n].some(isNaN) || P <= 0 || r < 0 || t <= 0 || n <= 0) {
      setResult(null); return
    }
    setResult(await calculateCompoundInterest(P, r, t, n))
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
          <ResultDisplay label="Final Amount" value={formatCurrency(result.amount)} large />
          <ResultDisplay label="Interest Earned" value={formatCurrency(result.interest)} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
