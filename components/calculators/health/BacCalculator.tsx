'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function BacCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('70')
  const [drinks, setDrinks] = useState('3')
  const [hours, setHours] = useState('2')
  const [result, setResult] = useState('')

  const calculate = () => {
    const w = parseFloat(weight), d = parseFloat(drinks), h = parseFloat(hours)
    if (isNaN(w)||isNaN(d)||isNaN(h) || w <= 0) { setResult('Invalid'); return }
    const widmark = sex === 'male' ? 0.73 : 0.66
    const bac = (d * 14) / (w * 453.592 * widmark) * 100 - 0.015 * h
    const final = Math.max(0, bac)
    let status = 'Sober'
    if (final > 0.02) status = 'Impaired'
    if (final > 0.05) status = 'Legally Intoxicated (many countries)'
    if (final > 0.08) status = 'Legally Drunk (US)'
    setResult(`${final.toFixed(3)}% — ${status}`)
  }

  return (
    <FormCalculatorShell title="BAC Calculator" subtitle="Blood Alcohol Content" badge="HEALTH">
      <RetroSelect label="Sex" value={sex} onChange={(v) => setSex(v as any)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} id="bac-sex" />
      <RetroInput label="Weight (kg)" value={weight} onChange={setWeight} placeholder="70" id="bac-w" />
      <RetroInput label="Standard Drinks" value={drinks} onChange={setDrinks} placeholder="3" id="bac-d" />
      <RetroInput label="Hours Since First Drink" value={hours} onChange={setHours} placeholder="2" id="bac-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate BAC</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="BAC" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
