'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroSelect, RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

function wobblyBar(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`
}

export default function DogAgeCalculator() {
  const [dogAge, setDogAge] = useState('3')
  const [size, setSize] = useState('medium')
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const age = parseFloat(dogAge)
    if (isNaN(age) || age < 0) return
    // AVMA guideline approximation
    let human: number
    if (age <= 1) {
      human = age * 15
    } else if (age <= 2) {
      human = 15 + (age - 1) * 9
    } else {
      const base = 24
      const extra = age - 2
      if (size === 'small') human = base + extra * 4
      else if (size === 'medium') human = base + extra * 5
      else human = base + extra * 6
    }
    setResult(Math.round(human * 10) / 10)
  }

  return (
    <FormCalculatorShell title="Dog Age Calculator" subtitle="Convert dog years to human years" badge="EVERYDAY">
      <RetroInput label="Dog Age" value={dogAge} onChange={setDogAge} unit="yrs" id="dog-age" />
      <RetroSelect label="Dog Size" value={size} onChange={setSize} options={[
        { value: 'small', label: 'Small (0-20 lbs)' },
        { value: 'medium', label: 'Medium (21-50 lbs)' },
        { value: 'large', label: 'Large (50+ lbs)' },
      ]} id="dog-size" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate Human Age</RetroActionButton></div>
      {result !== null && (
        <div className="mt-4 space-y-2">
          <ResultDisplay label="Human Equivalent" value={result} unit="years" large />
          <svg viewBox="0 0 200 50" className="w-full h-12 mt-2">
            <path d={wobblyBar(10, 40 - Math.min(result, 40), 40, Math.min(result, 40))} fill="#dfaa44" stroke="#be8b32" strokeWidth="2" />
            <text x="30" y="48" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#4c5c4a">Dog→Human</text>
          </svg>
        </div>
      )}
    </FormCalculatorShell>
  )
}