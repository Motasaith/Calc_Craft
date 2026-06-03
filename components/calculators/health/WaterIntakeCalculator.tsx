'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroSelect, ResultDisplay, RetroSlider } from '../shared/FormCalculatorShell'

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState(70)
  const [activity, setActivity] = useState('moderate')
  const [climate, setClimate] = useState('temperate')

  const baseML = weight * 33 // 33ml per kg baseline
  const actMult = activity === 'sedentary' ? 1 : activity === 'light' ? 1.1 : activity === 'moderate' ? 1.2 : activity === 'intense' ? 1.4 : 1.5
  const climMult = climate === 'cold' ? 0.9 : climate === 'temperate' ? 1 : 1.15
  const total = baseML * actMult * climMult
  const glasses = total / 250

  return (
    <FormCalculatorShell title="Water Intake Calculator" badge="HEALTH">
      <RetroSlider label="Weight" value={weight} onChange={setWeight} min={30} max={150} step={1} displayValue={`${weight} kg`} id="water-w" />
      <RetroSelect label="Activity Level" value={activity} onChange={setActivity} id="water-a"
        options={[
          { value: 'sedentary', label: 'Sedentary' },
          { value: 'light', label: 'Light Exercise' },
          { value: 'moderate', label: 'Moderate Exercise' },
          { value: 'intense', label: 'Intense Exercise' },
          { value: 'athlete', label: 'Professional Athlete' },
        ]} />
      <RetroSelect label="Climate" value={climate} onChange={setClimate} id="water-c"
        options={[{ value: 'cold', label: 'Cold' }, { value: 'temperate', label: 'Temperate' }, { value: 'hot', label: 'Hot & Humid' }]} />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <ResultDisplay label="Daily Intake" value={`${Math.round(total)} ml`} large />
        <ResultDisplay label="Glasses (250ml)" value={`~${Math.round(glasses)}`} large />
        <ResultDisplay label="Liters" value={`${(total / 1000).toFixed(1)} L`} />
        <ResultDisplay label="Oz" value={`${Math.round(total * 0.0338)} oz`} />
      </div>
    </FormCalculatorShell>
  )
}
