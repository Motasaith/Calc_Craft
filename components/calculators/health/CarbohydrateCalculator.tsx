'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function CarbohydrateCalculator() {
  const [tdee, setTdee] = useState('2500')
  const [diet, setDiet] = useState('balanced')
  const [result, setResult] = useState('')

  const calculate = () => {
    const t = parseFloat(tdee)
    if (isNaN(t) || t <= 0) { setResult('Invalid'); return }
    const ratios: Record<string, number> = { keto: 0.05, low: 0.20, balanced: 0.45, high: 0.60, athlete: 0.55 }
    const carbs = (t * (ratios[diet] || 0.45)) / 4
    setResult(`${Math.round(carbs)} g/day`)
  }

  return (
    <FormCalculatorShell title="Carbohydrate Calculator" badge="HEALTH">
      <RetroInput label="TDEE (kcal)" value={tdee} onChange={setTdee} placeholder="2500" id="carb-tdee" />
      <RetroSelect label="Diet Type" value={diet} onChange={setDiet} options={[{value:'keto',label:'Keto (5%)'},{value:'low',label:'Low Carb (20%)'},{value:'balanced',label:'Balanced (45%)'},{value:'high',label:'High Carb (60%)'},{value:'athlete',label:'Athlete (55%)'}]} id="carb-diet" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Daily Carbs" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
