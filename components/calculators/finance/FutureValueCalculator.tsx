'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function FutureValueCalculator() {
  const [pv, setPv] = useState('5000')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('10')
  const [monthly, setMonthly] = useState('100')
  const [result, setResult] = useState('')

  const calculate = () => {
    const p = parseFloat(pv), r = parseFloat(rate) / 100, n = parseFloat(years), m = parseFloat(monthly)
    if (isNaN(p)||isNaN(r)||isNaN(n)) { setResult('Invalid'); return }
    const fvLump = p * Math.pow(1 + r, n)
    const fvMonthly = isNaN(m) || m <= 0 ? 0 : m * 12 * (Math.pow(1 + r / 12, n * 12) - 1) / (r / 12)
    setResult(formatCurrency(fvLump + fvMonthly))
  }

  return (
    <FormCalculatorShell title="Future Value" badge="FINANCE">
      <RetroInput label="Present Value" value={pv} onChange={setPv} placeholder="5000" id="fv-pv" unit="$" />
      <RetroInput label="Annual Rate" value={rate} onChange={setRate} placeholder="5" id="fv-rate" unit="%" />
      <RetroInput label="Years" value={years} onChange={setYears} placeholder="10" id="fv-yr" unit="yr" />
      <RetroInput label="Monthly Contribution" value={monthly} onChange={setMonthly} placeholder="100" id="fv-mon" unit="$" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate FV</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Future Value" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
