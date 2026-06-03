'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CalorieCalculator() {
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState(''); const [weight, setWeight] = useState(''); const [height, setHeight] = useState('')
  const [activity, setActivity] = useState('1.55')

  const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height), act = parseFloat(activity)
  const valid = !isNaN(a) && !isNaN(w) && !isNaN(h) && a > 0 && a <= 120 && w > 0 && h > 0

  // Mifflin-St Jeor Equation
  const bmr = valid
    ? gender === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161
    : 0

  const tdee = bmr * act

  return (
    <FormCalculatorShell title="Calorie & TDEE Calculator" subtitle="Mifflin-St Jeor Equation" badge="HEALTH">
      <RetroSelect label="Gender" value={gender} onChange={setGender} id="cal-g"
        options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
      <div className="grid grid-cols-3 gap-3">
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="25" id="cal-a" unit="yrs" />
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="cal-w" unit="kg" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="cal-h" unit="cm" />
      </div>
      <RetroSelect label="Activity Level" value={activity} onChange={setActivity} id="cal-act"
        options={[
          { value: '1.2', label: 'Sedentary (little/no exercise)' },
          { value: '1.375', label: 'Light (1-3 days/week)' },
          { value: '1.55', label: 'Moderate (3-5 days/week)' },
          { value: '1.725', label: 'Active (6-7 days/week)' },
          { value: '1.9', label: 'Very Active (athlete)' },
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
