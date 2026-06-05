'use client'

import React, { useEffect, useState } from 'react'
import FormCalculatorShell, { ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'
import { calculateSIP, formatCurrency } from '@/lib/calc-engine'

export default function SipCalculator() {
  const [monthly, setMonthly] = useState(500)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const [invested, setInvested] = useState(0)
  const [wealth, setWealth] = useState(0)
  const [fv, setFv] = useState(0)

  useEffect(() => {
    let cancelled = false
    calculateSIP(monthly, rate, years * 12).then((r) => {
      if (cancelled) return
      setInvested(r.invested)
      setWealth(r.returns)
      setFv(r.futureValue)
    })
    return () => { cancelled = true }
  }, [monthly, rate, years])

  return (
    <FormCalculatorShell title="SIP Calculator" subtitle="Systematic Investment Plan" badge="FINANCE">
      <RetroSlider label="Monthly Investment" value={monthly} onChange={setMonthly} min={50} max={10000} step={50} displayValue={`$${monthly.toLocaleString()}`} id="sip-m" />
      <RetroSlider label="Expected Return Rate" value={rate} onChange={setRate} min={1} max={30} step={0.5} displayValue={`${rate}%`} id="sip-r" />
      <RetroSlider label="Time Period" value={years} onChange={setYears} min={1} max={40} step={1} displayValue={`${years} Years`} id="sip-y" />

      <div className="grid grid-cols-3 gap-2 mt-4">
        <ResultDisplay label="Invested" value={formatCurrency(invested)} />
        <ResultDisplay label="Returns" value={formatCurrency(wealth)} />
        <ResultDisplay label="Total Value" value={formatCurrency(fv)} large />
      </div>
    </FormCalculatorShell>
  )
}
