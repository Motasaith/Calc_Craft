'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function PresentValueCalculator() {
  const [fv, setFv] = useState('10000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('10')
  const [result, setResult] = useState('')

  const calculate = () => {
    const future = parseFloat(fv), r = parseFloat(rate) / 100, n = parseFloat(years)
    if (isNaN(future)||isNaN(r)||isNaN(n)) { setResult('Invalid'); return }
    const pv = future / Math.pow(1 + r, n)
    setResult(formatCurrency(pv))
  }

  return (
    <FormCalculatorShell title="Present Value" badge="FINANCE">
      <RetroInput label="Future Value" value={fv} onChange={setFv} placeholder="10000" id="pv-fv" unit="$" />
      <RetroInput label="Annual Rate" value={rate} onChange={setRate} placeholder="5" id="pv-rate" unit="%" />
      <RetroInput label="Years" value={years} onChange={setYears} placeholder="10" id="pv-yr" unit="yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate PV</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Present Value" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
