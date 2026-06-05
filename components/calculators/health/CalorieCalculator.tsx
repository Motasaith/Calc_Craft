'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { calculateBMR, calculateTDEE } from '@/lib/calc-engine'

export default function CalorieCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState(''); const [weight, setWeight] = useState(''); const [height, setHeight] = useState('')
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate')

  const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height)
  const valid = !isNaN(a) && !isNaN(w) && !isNaN(h) && a > 0 && a <= 120 && w > 0 && h > 0

  const bmr = valid ? calculateBMR(w, h, a, gender) : 0
  const tdee = bmr > 0 ? calculateTDEE(bmr, activity) : 0

  return (
    <FormCalculatorShell title="Calorie & TDEE Calculator" subtitle="Mifflin-St Jeor Equation" badge="HEALTH">
      <RetroSelect label="Gender" value={gender} onChange={(v) => setGender(v as 'male' | 'female')} id="cal-g"
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
      <div className="grid grid-cols-3 gap-3">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="25" id="cal-a" unit="yrs" />
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="cal-w" unit="kg" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="cal-h" unit="cm" />
      </div>
      <RetroSelect label="Activity Level" value={activity} onChange={(v) => setActivity(v as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active')} id="cal-act"
        options={[
          { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
          { value: 'light', label: 'Light (1-3 days/week)' },
          { value: 'moderate', label: 'Moderate (3-5 days/week)' },
          { value: 'active', label: 'Active (6-7 days/week)' },
          { value: 'very-active', label: 'Very Active (athlete)' },
        ]} />

      {valid && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <ResultDisplay label="BMR" value={`${Math.round(bmr)}`} unit="cal/day" large />
          <ResultDisplay label="TDEE" value={`${Math.round(tdee)}`} unit="cal/day" large />
          <ResultDisplay label="Lose Weight" value={`${Math.round(tdee - 500)}`} unit="cal/day" />
          <ResultDisplay label="Gain Weight" value={`${Math.round(tdee + 500)}`} unit="cal/day" />
        </div>
      )}
    </FormCalculatorShell>
  )
}
