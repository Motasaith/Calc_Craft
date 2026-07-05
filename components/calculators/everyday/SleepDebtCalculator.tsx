'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function SleepDebtCalculator() {
  const [ideal, setIdeal] = useState('8')
  const [actual, setActual] = useState('6')
  const [days, setDays] = useState('7')
  const [result, setResult] = useState<{ debt: number; surplus: boolean; perNight: number } | null>(null)

  const calculate = () => {
    const i = parseFloat(ideal)
    const a = parseFloat(actual)
    const d = parseInt(days)
    if (isNaN(i) || isNaN(a) || isNaN(d) || i <= 0 || d <= 0) return
    const diff = (i - a) * d
    setResult({ debt: Math.abs(diff), surplus: diff < 0, perNight: i - a })
  }

  return (
    <FormCalculatorShell title="Sleep Debt Calculator" subtitle="Track your sleep deficit" badge="EVERYDAY">
      <RetroInput label="Ideal Sleep Hours" value={ideal} onChange={setIdeal} unit="hrs" id="sleep-ideal" />
      <RetroInput label="Actual Sleep / Night" value={actual} onChange={setActual} unit="hrs" id="sleep-actual" />
      <RetroInput label="Days" value={days} onChange={setDays} id="sleep-days" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Sleep Debt</RetroActionButton></div>
      {result && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label={result.surplus ? 'Sleep Surplus' : 'Sleep Debt'} value={`${result.debt.toFixed(1)} hrs`} large />
          <ResultDisplay label="Per Night" value={`${result.perNight > 0 ? '-' : '+'}${Math.abs(result.perNight).toFixed(1)} hrs`} />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result.debt, 35), 80, Math.min(result.debt, 35))} fill={result.surplus ? '#cbd8ca' : '#ab3232'} stroke={result.surplus ? '#b0bdae' : '#7a2424'} strokeWidth="2" />
            <text x="50" y="48" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Debt</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}