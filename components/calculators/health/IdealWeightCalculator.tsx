'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateIdealWeightAll } from '@/lib/calc-engine'

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState('')

  const h = parseFloat(height)
  const valid = !isNaN(h) && h >= 100 && h <= 250
  const r = valid ? calculateIdealWeightAll(gender as 'male' | 'female', h) : null

  return (
    <FormCalculatorShell title="Ideal Weight Calculator" badge="HEALTH">
      <RetroSelect label="Gender" value={gender} onChange={setGender} id="iw-g"
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="iw-h" unit="cm" />

      {r && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ResultDisplay label="Devine Formula" value={`${r.devine.toFixed(1)} kg`} />
          <ResultDisplay label="Robinson Formula" value={`${r.robinson.toFixed(1)} kg`} />
          <ResultDisplay label="Miller Formula" value={`${r.miller.toFixed(1)} kg`} />
          <ResultDisplay label="Hamwi Formula" value={`${r.hamwi.toFixed(1)} kg`} />
          <div className="col-span-2">
            <ResultDisplay label="Healthy Range (BMI 18.5-25)" value={`${r.bmiRange.min.toFixed(1)} – ${r.bmiRange.max.toFixed(1)} kg`} large />
          </div>
        </div>
      )}
    </FormCalculatorShell>
  )
}
