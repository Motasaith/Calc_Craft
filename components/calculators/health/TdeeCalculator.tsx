'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function TdeeCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [age, setAge] = useState('30')
  const [activity, setActivity] = useState('moderate')
  const [result, setResult] = useState('')

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age)
    if (isNaN(w)||isNaN(h)||isNaN(a)) { setResult('Invalid'); return }
    const base = 10 * w + 6.25 * h - 5 * a
    const bmr = sex === 'male' ? base + 5 : base - 161
    const factors: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, 'very-active': 1.9 }
    const tdee = Math.round(bmr * (factors[activity] || 1.55))
    setResult(`${tdee} kcal/day`)
  }

  return (
    <FormCalculatorShell title="TDEE Calculator" subtitle="Total Daily Energy Expenditure" badge="HEALTH">
      <RetroSelect label="Sex" value={sex} onChange={(v) => setSex(v as any)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} id="tdee-sex" />
      <div className="grid grid-cols-3 gap-3">
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="tdee-w" unit="kg" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="tdee-h" unit="cm" />
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="tdee-age" unit="yr" />
      </div>
      <RetroSelect label="Activity Level" value={activity} onChange={setActivity} options={[{value:'sedentary',label:'Sedentary'},{value:'light',label:'Light Exercise'},{value:'moderate',label:'Moderate'},{value:'active',label:'Active'},{value:'very-active',label:'Very Active'}]} id="tdee-act" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate TDEE</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="TDEE" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
