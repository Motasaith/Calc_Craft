'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function AprCalculator() {
  const [fees, setFees] = useState('500')
  const [principal, setPrincipal] = useState('10000')
  const [rate, setRate] = useState('6')
  const [years, setYears] = useState('5')
  const [result, setResult] = useState('')

  const calculate = () => {
    const f = parseFloat(fees), p = parseFloat(principal), r = parseFloat(rate) / 100, n = parseInt(years)
    if (isNaN(f)||isNaN(p)||isNaN(r)||isNaN(n) || p <= 0) { setResult('Invalid'); return }
    const totalCost = f + (p * r * n)
    const apr = (totalCost / (p * n)) * 100
    setResult(`${apr.toFixed(3)}%`)
  }

  return (
    <FormCalculatorShell title="APR Calculator" badge="FINANCE">
      <RetroInput label="Loan Amount" value={principal} onChange={setPrincipal} placeholder="10000" id="apr-prin" unit="$" />
      <RetroInput label="Interest Rate" value={rate} onChange={setRate} placeholder="6" id="apr-rate" unit="%" />
      <RetroInput label="Fees" value={fees} onChange={setFees} placeholder="500" id="apr-fees" unit="$" />
      <RetroInput label="Term (years)" value={years} onChange={setYears} placeholder="5" id="apr-yr" unit="yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate APR</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Estimated APR" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
