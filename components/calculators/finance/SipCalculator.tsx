'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'

export default function SipCalculator() {
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const n = years * 12
  const r = rate / 12 / 100
  const invested = monthly * n
  const fv = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested
  const wealth = fv - invested

  return (
    <FormCalculatorShell title="SIP Calculator" subtitle="Systematic Investment Plan" badge="FINANCE">
      <RetroSlider label="Monthly Investment" value={monthly} onChange={setMonthly} min={50} max={10000} step={50} displayValue={`$${monthly.toLocaleString()}`} id="sip-m" />
      <RetroSlider label="Expected Return Rate" value={rate} onChange={setRate} min={1} max={30} step={0.5} displayValue={`${rate}%`} id="sip-r" />
      <RetroSlider label="Time Period" value={years} onChange={setYears} min={1} max={40} step={1} displayValue={`${years} Years`} id="sip-y" />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <ResultDisplay label="Invested" value={`$${Math.round(invested).toLocaleString()}`} />
        <ResultDisplay label="Returns" value={`$${Math.round(wealth).toLocaleString()}`} />
        <ResultDisplay label="Total Value" value={`$${Math.round(fv).toLocaleString()}`} large />
      </div>
    </FormCalculatorShell>
  )
}
