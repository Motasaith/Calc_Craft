'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function AnnuityCalculator() {
  const [mode, setMode] = useState<'ordinary' | 'due'>('ordinary')
  const [payment, setPayment] = useState('500')
  const [rate, setRate] = useState('5')
  const [years, setYears] = useState('20')
  const [result, setResult] = useState('')

  const calculate = () => {
    const pmt = parseFloat(payment), r = parseFloat(rate) / 100, n = parseFloat(years)
    if (isNaN(pmt)||isNaN(r)||isNaN(n) || r <= 0) { setResult('Invalid'); return }
    const factor = (Math.pow(1 + r, n) - 1) / r
    const fv = mode === 'due' ? pmt * factor * (1 + r) : pmt * factor
    setResult(formatCurrency(fv))
  }

  return (
    <FormCalculatorShell title="Annuity Calculator" badge="FINANCE">
      <RetroSelect label="Type" value={mode} onChange={(v) => setMode(v as any)} options={[{value:'ordinary',label:'Ordinary'},{value:'due',label:'Annuity Due'}]} id="ann-mode" />
      <RetroInput label="Payment" value={payment} onChange={setPayment} placeholder="500" id="ann-pmt" unit="$" />
      <RetroInput label="Annual Rate" value={rate} onChange={setRate} placeholder="5" id="ann-rate" unit="%" />
      <RetroInput label="Years" value={years} onChange={setYears} placeholder="20" id="ann-yr" unit="yr" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate FV</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Future Value" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
