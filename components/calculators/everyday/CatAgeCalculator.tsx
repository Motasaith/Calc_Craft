'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function CatAgeCalculator() {
  const [catAge, setCatAge] = useState('4')
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const age = parseFloat(catAge)
    if (isNaN(age) || age < 0) return
    // First year = 15, second year = +9, each subsequent = +4
    let human: number
    if (age <= 1) human = age * 15
    else if (age <= 2) human = 15 + (age - 1) * 9
    else human = 24 + (age - 2) * 4
    setResult(Math.round(human * 10) / 10)
  }

  return (
    <FormCalculatorShell title="Cat Age Calculator" subtitle="Convert cat years to human years" badge="EVERYDAY">
      <RetroInput label="Cat Age" value={catAge} onChange={setCatAge} unit="yrs" id="cat-age" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Human Age</RetroActionButton></div>
      {result !== null && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Human Equivalent" value={result} unit="years" large />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result, 40), 40, Math.min(result, 40))} fill="#cbd8ca" stroke="#b0bdae" strokeWidth="2" />
            <text x="30" y="48" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Cat→Human</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}