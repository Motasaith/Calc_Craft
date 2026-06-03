'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'

export default function SavingsGoalCalculator() {
  const [goal, setGoal] = useState(10000)
  const [current, setCurrent] = useState(0)
  const [months, setMonths] = useState(24)
  const [rate, setRate] = useState(5)

  const remaining = Math.max(goal - current, 0)
  const r = rate / 12 / 100
  const monthlyNeeded = r > 0 ? (remaining * r) / (Math.pow(1 + r, months) - 1) : remaining / months

  return (
    <FormCalculatorShell title="Savings Goal Calculator" badge="FINANCE">
      <RetroSlider label="Goal Amount" value={goal} onChange={setGoal} min={100} max={500000} step={100} displayValue={`$${goal.toLocaleString()}`} id="sg-goal" />
      <RetroSlider label="Current Savings" value={current} onChange={setCurrent} min={0} max={goal} step={100} displayValue={`$${current.toLocaleString()}`} id="sg-cur" />
      <RetroSlider label="Time Frame" value={months} onChange={setMonths} min={1} max={120} step={1} displayValue={`${months} months`} id="sg-m" />
      <RetroSlider label="Annual Interest" value={rate} onChange={setRate} min={0} max={15} step={0.5} displayValue={`${rate}%`} id="sg-r" />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ResultDisplay label="Monthly Savings Needed" value={`$${Math.round(monthlyNeeded).toLocaleString()}`} large />
        <ResultDisplay label="Remaining to Save" value={`$${remaining.toLocaleString()}`} />
      </div>
    </FormCalculatorShell>
  )
}
