'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function AutoLoanCalculator() {
  const [price, setPrice] = useState('25000')
  const [downPayment, setDownPayment] = useState('5000')
  const [rate, setRate] = useState('6')
  const [months, setMonths] = useState('60')
  const [result, setResult] = useState<{emi:number,total:number,interest:number}|null>(null)

  const calculate = () => {
    const p = parseFloat(price) - parseFloat(downPayment)
    const r = parseFloat(rate) / 12 / 100
    const n = parseInt(months)
    if (p <= 0 || n <= 0) { setResult(null); return }
    if (r === 0) { const emi = p / n; setResult({ emi, total: p, interest: 0 }); return }
    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    setResult({ emi, total, interest: total - p })
  }

  return (
    <FormCalculatorShell title="Auto Loan Calculator" badge="FINANCE">
      <RetroInput label="Car Price" value={price} onChange={setPrice} placeholder="25000" id="al-price" unit="$" />
      <RetroInput label="Down Payment" value={downPayment} onChange={setDownPayment} placeholder="5000" id="al-down" unit="$" />
      <RetroInput label="Annual Interest Rate" value={rate} onChange={setRate} placeholder="6" id="al-rate" unit="%" />
      <RetroInput label="Loan Term (months)" value={months} onChange={setMonths} placeholder="60" id="al-months" unit="mo" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Monthly Payment" value={formatCurrency(result.emi)} large />
          <ResultDisplay label="Total Payment" value={formatCurrency(result.total)} />
          <ResultDisplay label="Total Interest" value={formatCurrency(result.interest)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
