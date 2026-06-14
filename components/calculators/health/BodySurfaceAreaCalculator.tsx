'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function BodySurfaceAreaCalculator() {
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [formula, setFormula] = useState('du-bois')
  const [result, setResult] = useState('')

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height)
    if (isNaN(w)||isNaN(h) || w <= 0 || h <= 0) { setResult('Invalid'); return }
    let bsa = 0
    switch (formula) {
      case 'du-bois': bsa = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725); break
      case 'mosteller': bsa = Math.sqrt((w * h) / 3600); break
      case 'haycock': bsa = 0.024265 * Math.pow(w, 0.5378) * Math.pow(h, 0.3964); break
      case 'gehan': bsa = 0.0235 * Math.pow(w, 0.51456) * Math.pow(h, 0.42246); break
    }
    setResult(`${bsa.toFixed(3)} m²`)
  }

  return (
    <FormCalculatorShell title="Body Surface Area" badge="HEALTH">
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Weight (kg)" value={weight} onChange={setWeight} placeholder="70" id="bsa-w" />
        <RetroInput label="Height (cm)" value={height} onChange={setHeight} placeholder="175" id="bsa-h" />
      </div>
      <RetroSelect label="Formula" value={formula} onChange={setFormula} options={[{value:'du-bois',label:'Du Bois'},{value:'mosteller',label:'Mosteller'},{value:'haycock',label:'Haycock'},{value:'gehan',label:'Gehan & George'}]} id="bsa-form" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate BSA</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="BSA" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
