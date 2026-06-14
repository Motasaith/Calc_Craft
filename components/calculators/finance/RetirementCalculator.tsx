'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { formatCurrency } from '@/lib/calc-engine'

export default function RetirementCalculator() {
  const [age, setAge] = useState('30')
  const [retireAge, setRetireAge] = useState('65')
  const [income, setIncome] = useState('60000')
  const [saved, setSaved] = useState('50000')
  const [monthlySave, setMonthlySave] = useState('500')
  const [rate, setRate] = useState('7')
  const [result, setResult] = useState<{needed:number,projected:number,shortfall:number}|null>(null)

  const calculate = () => {
    const a = parseInt(age), ra = parseInt(retireAge), inc = parseFloat(income)
    const sav = parseFloat(saved), ms = parseFloat(monthlySave), r = parseFloat(rate) / 100
    const years = ra - a
    if (years <= 0) { setResult(null); return }
    const needed = inc * 25
    const projected = sav * Math.pow(1 + r, years) + ms * 12 * (Math.pow(1 + r / 12, years * 12) - 1) / (r / 12)
    setResult({ needed, projected, shortfall: needed - projected })
  }

  return (
    <FormCalculatorShell title="Retirement Calculator" badge="FINANCE">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Current Age" value={age} onChange={setAge} placeholder="30" id="ret-age" />
        <RetroInput label="Retirement Age" value={retireAge} onChange={setRetireAge} placeholder="65" id="ret-rage" />
      </div>
      <RetroInput label="Annual Income" value={income} onChange={setIncome} placeholder="60000" id="ret-inc" unit="$" />
      <RetroInput label="Current Savings" value={saved} onChange={setSaved} placeholder="50000" id="ret-sav" unit="$" />
      <RetroInput label="Monthly Savings" value={monthlySave} onChange={setMonthlySave} placeholder="500" id="ret-ms" unit="$" />
      <RetroInput label="Expected Return" value={rate} onChange={setRate} placeholder="7" id="ret-rate" unit="%" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Amount Needed" value={formatCurrency(result.needed)} />
          <ResultDisplay label="Projected Savings" value={formatCurrency(result.projected)} large />
          <ResultDisplay label="Shortfall" value={formatCurrency(Math.max(0, result.shortfall))} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
