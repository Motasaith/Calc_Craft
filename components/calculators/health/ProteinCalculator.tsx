'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function ProteinCalculator() {
  const [weight, setWeight] = useState('70')
  const [goal, setGoal] = useState('maintain')
  const [activity, setActivity] = useState('moderate')
  const [result, setResult] = useState('')

  const calculate = () => {
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) { setResult('Invalid'); return }
    const goals: Record<string, number> = { lose: 1.6, maintain: 1.2, gain: 1.8, athlete: 2.2 }
    const acts: Record<string, number> = { sedentary: 0.8, light: 1.0, moderate: 1.1, active: 1.2, 'very-active': 1.3 }
    const protein = w * (goals[goal] || 1.2) * (acts[activity] || 1.1)
    setResult(`${Math.round(protein)} g/day`)
  }

  return (
    <FormCalculatorShell title="Protein Calculator" badge="HEALTH">
      <RetroInput label="Weight (kg)" value={weight} onChange={setWeight} placeholder="70" id="prot-w" />
      <RetroSelect label="Goal" value={goal} onChange={setGoal} options={[{value:'lose',label:'Weight Loss'},{value:'maintain',label:'Maintain'},{value:'gain',label:'Muscle Gain'},{value:'athlete',label:'Athlete'}]} id="prot-goal" />
      <RetroSelect label="Activity" value={activity} onChange={setActivity} options={[{value:'sedentary',label:'Sedentary'},{value:'light',label:'Light'},{value:'moderate',label:'Moderate'},{value:'active',label:'Active'},{value:'very-active',label:'Very Active'}]} id="prot-act" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Daily Protein" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
