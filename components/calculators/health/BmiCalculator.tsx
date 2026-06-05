'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, StatusBar } from '../shared/FormCalculatorShell'
import { calculateBMI } from '@/lib/calc-engine'

export default function BmiCalculator() {
  const [unit, setUnit] = useState('metric')
  const [weight, setWeight] = useState(''); const [height, setHeight] = useState('')
  const [feet, setFeet] = useState(''); const [inches, setInches] = useState(''); const [lbs, setLbs] = useState('')

  const calculate = (): { bmi: number; category: string } | null => {
    if (unit === 'metric') {
      const w = parseFloat(weight), h = parseFloat(height)
      if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null
      if (h < 50 || h > 280) return null
      if (w < 2 || w > 650) return null
      const bmi = calculateBMI(w, h)
      return { bmi, category: getCategory(bmi) }
    } else {
      const f = parseFloat(feet), i = parseFloat(inches || '0'), w = parseFloat(lbs)
      if (isNaN(f) || isNaN(w) || f <= 0 || w <= 0) return null
      const totalInches = f * 12 + (isNaN(i) ? 0 : i)
      if (totalInches < 20 || totalInches > 110) return null
      if (w < 5 || w > 1400) return null
      // Convert imperial to metric for the engine
      const bmi = calculateBMI(w * 0.453592, totalInches * 2.54)
      return { bmi, category: getCategory(bmi) }
    }
  }

  const getCategory = (bmi: number) => {
    if (bmi < 16) return 'Severe Underweight'
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    if (bmi < 35) return 'Obese (Class I)'
    if (bmi < 40) return 'Obese (Class II)'
    return 'Obese (Class III)'
  }

  const result = calculate()

  return (
    <FormCalculatorShell title="BMI Calculator" subtitle="Body Mass Index" badge="HEALTH">
      <div className="flex gap-1 mb-4 bg-neutral-200 p-1 rounded-lg border border-neutral-300">
        <button onClick={() => setUnit('metric')}
          className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${unit === 'metric' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>Metric (kg/cm)</button>
        <button onClick={() => setUnit('imperial')}
          className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${unit === 'imperial' ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500'}`}>Imperial (lbs/ft)</button>
      </div>

      {unit === 'metric' ? (
        <div className="grid grid-cols-2 gap-3">
          <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="bmi-w" unit="kg" min={2} max={650} />
          <RetroInput label="Height" value={height} onChange={setHeight} placeholder="170" id="bmi-h" unit="cm" min={50} max={280} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <RetroInput label="Feet" value={feet} onChange={setFeet} placeholder="5" id="bmi-ft" />
            <RetroInput label="Inches" value={inches} onChange={setInches} placeholder="10" id="bmi-in" />
          </div>
          <RetroInput label="Weight" value={lbs} onChange={setLbs} placeholder="160" id="bmi-lbs" unit="lbs" />
        </>
      )}

      {result && (
        <>
          <div className="mt-4">
            <ResultDisplay label="Your BMI" value={result.bmi.toFixed(1)} unit="kg/m²" large />
          </div>
          <div className="mt-2">
            <ResultDisplay label="Category" value={result.category} />
          </div>
          <StatusBar items={[
            { label: 'UNDER', active: result.bmi < 18.5 },
            { label: 'NORMAL', active: result.bmi >= 18.5 && result.bmi < 25 },
            { label: 'OVER', active: result.bmi >= 25 && result.bmi < 30 },
            { label: 'OBESE', active: result.bmi >= 30 },
          ]} />
        </>
      )}
    </FormCalculatorShell>
  )
}
