'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function RetirementCountdownCalculator() {
  const [age, setAge] = useState('35')
  const [target, setTarget] = useState('65')
  const [savings, setSavings] = useState('50000')
  const [monthly, setMonthly] = useState('500')
  const [result, setResult] = useState<{ yearsLeft: number; projected: number; contributions: number } | null>(null)

  const calculate = () => {
    const a = parseFloat(age)
    const t = parseFloat(target)
    const s = parseFloat(savings)
    const m = parseFloat(monthly)
    if (isNaN(a) || isNaN(t) || isNaN(s) || isNaN(m) || a < 0 || t <= a) return
    const yearsLeft = t - a
    const annualReturn = 0.07
    // Future value of current savings + future value of monthly contributions
    const fvSavings = s * Math.pow(1 + annualReturn, yearsLeft)
    const monthlyRate = annualReturn / 12
    const months = yearsLeft * 12
    const fvContrib = m * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    const projected = fvSavings + fvContrib
    const contributions = m * months
    setResult({ yearsLeft, projected, contributions })
  }

  return (
    <FormCalculatorShell title="Retirement Countdown" subtitle="Years to retirement & projected savings" badge="EVERYDAY">
      <RetroInput label="Current Age" value={age} onChange={setAge} unit="yrs" id="ret-age" />
      <RetroInput label="Target Retirement Age" value={target} onChange={setTarget} unit="yrs" id="ret-target" />
      <RetroInput label="Current Savings" value={savings} onChange={setSavings} unit="$" id="ret-savings" />
      <RetroInput label="Monthly Contribution" value={monthly} onChange={setMonthly} unit="$" id="ret-monthly" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Years to Retirement" value={result.yearsLeft} unit="years" large />
          <ResultDisplay label="Projected Savings" value={`$${result.projected.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <ResultDisplay label="Total Contributions" value={`$${result.contributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result.yearsLeft * 2, 35), 50, Math.min(result.yearsLeft * 2, 35))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <path d={wobblyBar(70, 40 - Math.min(result.projected / 50000, 35), 50, Math.min(result.projected / 50000, 35))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <path d={wobblyBar(130, 40 - Math.min(result.contributions / 30000, 35), 50, Math.min(result.contributions / 30000, 35))} fill="#dad6cd" stroke="#b0bdae" strokeWidth="2" />
            <text x="35" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Yrs</text>
            <text x="95" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Proj</text>
            <text x="155" y="48" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4c5c4a">Contrib</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}