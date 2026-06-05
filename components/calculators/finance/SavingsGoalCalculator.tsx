'use client'
import React, { useEffect, useState } from 'react'
import FormCalculatorShell, { ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'
import { evaluateBig, formatCurrency } from '@/lib/calc-engine'

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState(10000)
  const [current, setCurrent] = useState(0)
  const [months, setMonths] = useState(24)
  const [rate, setRate] = useState(5)

  const remaining = Math.max(goal - current, 0)
  const [monthlyNeeded, setMonthlyNeeded] = useState(0)

  useEffect(() => {
    let cancelled = false
    if (remaining <= 0 || months <= 0) { setMonthlyNeeded(0); return }
    const r = rate / 12 / 100
    // Future value of annuity: FV = P * ((1+r)^n - 1) / r
    // Solve for P: P = FV * r / ((1+r)^n - 1)
    const expr = r > 0
      ? `(${remaining} * ${r}) / ((1 + ${r})^(${months}) - 1)`
      : `${remaining} / ${months}`
    evaluateBig(expr).then((res) => {
      if (cancelled) return
      setMonthlyNeeded(res.ok ? res.value : remaining / months)
    })
    return () => { cancelled = true }
  }, [remaining, months, rate])

  return (
    <FormCalculatorShell title="Savings Goal Calculator" badge="FINANCE">
      <RetroSlider label="Goal Amount" value={goal} onChange={setGoal} min={100} max={500000} step={100} displayValue={`$${goal.toLocaleString()}`} id="sg-goal" />
      <RetroSlider label="Current Savings" value={current} onChange={setCurrent} min={0} max={goal} step={100} displayValue={`$${current.toLocaleString()}`} id="sg-cur" />
      <RetroSlider label="Time Frame" value={months} onChange={setMonths} min={1} max={120} step={1} displayValue={`${months} months`} id="sg-m" />
      <RetroSlider label="Annual Interest" value={rate} onChange={setRate} min={0} max={15} step={0.5} displayValue={`${rate}%`} id="sg-r" />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ResultDisplay label="Monthly Savings Needed" value={formatCurrency(monthlyNeeded)} large />
        <ResultDisplay label="Remaining to Save" value={formatCurrency(remaining)} />
      </div>
    </FormCalculatorShell>
  )
}
