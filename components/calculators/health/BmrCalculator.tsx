'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function BmrCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [age, setAge] = useState('30')
  const [result, setResult] = useState('')

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age)
    if (isNaN(w)||isNaN(h)||isNaN(a)) { setResult('Invalid'); return }
    const base = 10 * w + 6.25 * h - 5 * a
    const bmr = sex === 'male' ? base + 5 : base - 161
    setResult(`${Math.round(bmr)} kcal/day`)
  }

  return (
    <FormCalculatorShell title="BMR Calculator" subtitle="Basal Metabolic Rate" badge="HEALTH">
      <RetroSelect label="Sex" value={sex} onChange={(v) => setSex(v as any)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} id="bmr-sex" />
      <div className="grid grid-cols-3 gap-3">
        <RetroInput label="Weight" value={weight} onChange={setWeight} placeholder="70" id="bmr-w" unit="kg" />
        <RetroInput label="Height" value={height} onChange={setHeight} placeholder="175" id="bmr-h" unit="cm" />
        <RetroInput label="Age" value={age} onChange={setAge} placeholder="30" id="bmr-age" unit="yr" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate BMR</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="BMR" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
