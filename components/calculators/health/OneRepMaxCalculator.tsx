'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('80')
  const [reps, setReps] = useState('5')
  const [formula, setFormula] = useState('epley')
  const [result, setResult] = useState('')

  const calculate = () => {
    const w = parseFloat(weight), r = parseInt(reps)
    if (isNaN(w)||isNaN(r) || r < 1 || w <= 0) { setResult('Invalid'); return }
    let rm = 0
    switch (formula) {
      case 'epley': rm = w * (1 + r / 30); break
      case 'brzycki': rm = w / (1.0278 - 0.0278 * r); break
      case 'lombardi': rm = w * Math.pow(r, 0.10); break
      case 'mayhew': rm = w * 100 / (52.2 + 41.9 * Math.exp(-0.055 * r)); break
    }
    setResult(`${rm.toFixed(1)} kg`)
  }

  return (
    <FormCalculatorShell title="One Rep Max" subtitle="1RM Estimator" badge="HEALTH">
      <RetroInput label="Weight Lifted" value={weight} onChange={setWeight} placeholder="80" id="1rm-w" unit="kg" />
      <RetroInput label="Reps" value={reps} onChange={setReps} placeholder="5" id="1rm-r" />
      <RetroSelect label="Formula" value={formula} onChange={setFormula} options={[{value:'epley',label:'Epley'},{value:'brzycki',label:'Brzycki'},{value:'lombardi',label:'Lombardi'},{value:'mayhew',label:'Mayhew'}]} id="1rm-form" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Estimate 1RM</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Estimated 1RM" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
