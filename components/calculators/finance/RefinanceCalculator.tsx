'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState('200000')
  const [currentRate, setCurrentRate] = useState('7')
  const [currentMonthsLeft, setCurrentMonthsLeft] = useState('300')
  const [newRate, setNewRate] = useState('5.5')
  const [newTermYears, setNewTermYears] = useState('25')
  const [closingCosts, setClosingCosts] = useState('3000')
  const [result, setResult] = useState<{currentPayment:number,newPayment:number,monthlySavings:number,breakEven:number}|null>(null)

  const calculate = () => {
    const bal = parseFloat(currentBalance)
    const cr = parseFloat(currentRate) / 12 / 100
    const cl = parseInt(currentMonthsLeft)
    const nr = parseFloat(newRate) / 12 / 100
    const nt = parseInt(newTermYears) * 12
    const cc = parseFloat(closingCosts)
    if (bal <= 0 || cl <= 0 || nt <= 0) { setResult(null); return }
    const curPay = cr === 0 ? bal / cl : bal * cr * Math.pow(1 + cr, cl) / (Math.pow(1 + cr, cl) - 1)
    const newPay = nr === 0 ? bal / nt : bal * nr * Math.pow(1 + nr, nt) / (Math.pow(1 + nr, nt) - 1)
    const savings = curPay - newPay
    setResult({ currentPayment: curPay, newPayment: newPay, monthlySavings: savings, breakEven: savings > 0 ? cc / savings : Infinity })
  }

  return (
    <FormCalculatorShell title="Refinance Calculator" badge="FINANCE">
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2">Current Loan</div>
      <RetroInput label="Remaining Balance" value={currentBalance} onChange={setCurrentBalance} placeholder="200000" id="ref-bal" unit="$" />
      <RetroInput label="Current Rate" value={currentRate} onChange={setCurrentRate} placeholder="7" id="ref-crate" unit="%" />
      <RetroInput label="Months Left" value={currentMonthsLeft} onChange={setCurrentMonthsLeft} placeholder="300" id="ref-cmon" unit="mo" />
      <div className="text-[10px] font-bold text-neutral-500 font-mono uppercase mb-2 mt-3">New Loan</div>
      <RetroInput label="New Rate" value={newRate} onChange={setNewRate} placeholder="5.5" id="ref-nrate" unit="%" />
      <RetroInput label="New Term (years)" value={newTermYears} onChange={setNewTermYears} placeholder="25" id="ref-nyr" unit="yr" />
      <RetroInput label="Closing Costs" value={closingCosts} onChange={setClosingCosts} placeholder="3000" id="ref-cc" unit="$" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Compare</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Current Payment" value={formatCurrency(result.currentPayment)} />
          <ResultDisplay label="New Payment" value={formatCurrency(result.newPayment)} />
          <ResultDisplay label="Monthly Savings" value={formatCurrency(result.monthlySavings)} large />
          <ResultDisplay label="Break-Even (months)" value={result.breakEven === Infinity ? 'N/A' : Math.ceil(result.breakEven).toString()} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
