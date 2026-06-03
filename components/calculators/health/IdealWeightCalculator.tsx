'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState('')

  const h = parseFloat(height)
  const valid = !isNaN(h) && h >= 100 && h <= 250
  const hInches = valid ? h / 2.54 : 0
  const over60 = Math.max(hInches - 60, 0)

  // Multiple formulas
  const devine = valid ? (gender === 'male' ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60) : 0
  const robinson = valid ? (gender === 'male' ? 52 + 1.9 * over60 : 49 + 1.7 * over60) : 0
  const miller = valid ? (gender === 'male' ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60) : 0
  const hamwi = valid ? (gender === 'male' ? 48 + 2.7 * over60 : 45.5 + 2.2 * over60) : 0

  return (
    <FormCalculatorShell title="Ideal Weight Calculator" badge="HEALTH">
      <RetroSelect label="Gender" value={gender} onChange={setGender} id="iw-g"
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="iw-h" unit="cm" />

      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ResultDisplay label="Devine Formula" value={`${devine.toFixed(1)} kg`} />
          <ResultDisplay label="Robinson Formula" value={`${robinson.toFixed(1)} kg`} />
          <ResultDisplay label="Miller Formula" value={`${miller.toFixed(1)} kg`} />
          <ResultDisplay label="Hamwi Formula" value={`${hamwi.toFixed(1)} kg`} />
          <div className="col-span-2">
            <ResultDisplay label="Healthy Range (BMI 18.5-25)" value={`${(18.5 * (h / 100) ** 2).toFixed(1)} – ${(25 * (h / 100) ** 2).toFixed(1)} kg`} large />
          </div>
        </div>
      )}
    </FormCalculatorShell>
  )
}
