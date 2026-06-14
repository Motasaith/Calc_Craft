'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState('5000')
  const [apr, setApr] = useState('19.99')
  const [mode, setMode] = useState<'fixed' | 'percent'>('fixed')
  const [payment, setPayment] = useState('200')
  const [minPct, setMinPct] = useState('3')
  const [result, setResult] = useState<{months:number,totalInterest:number,totalPaid:number}|null>(null)

  const calculate = () => {
    let bal = parseFloat(balance)
    const rate = parseFloat(apr) / 12 / 100
    if (bal <= 0) { setResult(null); return }
    let months = 0, totalInterest = 0
    const maxMonths = 600
    while (bal > 0 && months < maxMonths) {
      const interest = bal * rate
      totalInterest += interest
      bal += interest
      const pay = mode === 'fixed' ? parseFloat(payment) : Math.max(bal * (parseFloat(minPct)/100), 25)
      if (pay <= 0 || pay < interest) { months = Infinity; break }
      bal -= pay
      months++
    }
    if (months === Infinity || months >= maxMonths) {
      setResult({ months: Infinity, totalInterest: 0, totalPaid: 0 })
    } else {
      setResult({ months, totalInterest, totalPaid: parseFloat(balance) + totalInterest })
    }
  }

  return (
    <FormCalculatorShell title="Credit Card Payoff" badge="FINANCE">
      <RetroInput label="Balance" value={balance} onChange={setBalance} placeholder="5000" id="cc-bal" unit="$" />
      <RetroInput label="APR" value={apr} onChange={setApr} placeholder="19.99" id="cc-apr" unit="%" />
      <RetroSelect label="Payment Mode" value={mode} onChange={(v) => { setMode(v as any); setResult(null) }} options={[{value:'fixed',label:'Fixed Monthly'},{value:'percent',label:'% of Balance'}]} id="cc-mode" />
      {mode === 'fixed' ? <RetroInput label="Monthly Payment" value={payment} onChange={setPayment} placeholder="200" id="cc-pay" unit="$" /> : <RetroInput label="Min Payment %" value={minPct} onChange={setMinPct} placeholder="3" id="cc-pct" unit="%" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Months to Payoff" value={result.months === Infinity ? 'Never' : result.months} large />
          <ResultDisplay label="Total Interest" value={formatCurrency(result.totalInterest)} />
          <ResultDisplay label="Total Paid" value={formatCurrency(result.totalPaid)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
