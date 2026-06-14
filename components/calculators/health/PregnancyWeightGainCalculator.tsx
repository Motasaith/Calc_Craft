'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function PregnancyWeightGainCalculator() {
  const [preWeight, setPreWeight] = useState('65')
  const [height, setHeight] = useState('165')
  const [weeks, setWeeks] = useState('20')
  const [result, setResult] = useState<{bmi:number,category:string,totalGain:string,currentGain:string}|null>(null)

  const calculate = () => {
    const w = parseFloat(preWeight), h = parseFloat(height), wk = parseInt(weeks)
    if (isNaN(w)||isNaN(h)||isNaN(wk) || h <= 0) { setResult(null); return }
    const bmi = w / Math.pow(h / 100, 2)
    let category = 'Normal weight', minGain = 11.5, maxGain = 16
    if (bmi < 18.5) { category = 'Underweight'; minGain = 12.5; maxGain = 18 }
    else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; minGain = 7; maxGain = 11.5 }
    else if (bmi >= 30) { category = 'Obese'; minGain = 5; maxGain = 9 }
    const totalGain = `${minGain}–${maxGain} kg`
    const expectedSoFar = (wk / 40) * maxGain
    setResult({ bmi, category, totalGain, currentGain: `~${expectedSoFar.toFixed(1)} kg by week ${wk}` })
  }

  return (
    <FormCalculatorShell title="Pregnancy Weight Gain" badge="HEALTH">
      <RetroInput label="Pre-Pregnancy Weight (kg)" value={preWeight} onChange={setPreWeight} placeholder="65" id="pwg-w" />
      <RetroInput label="Height (cm)" value={height} onChange={setHeight} placeholder="165" id="pwg-h" />
      <RetroInput label="Current Week" value={weeks} onChange={setWeeks} placeholder="20" id="pwg-wk" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Pre-Pregnancy BMI" value={result.bmi.toFixed(1)} />
          <ResultDisplay label="Category" value={result.category} />
          <ResultDisplay label="Total Recommended Gain" value={result.totalGain} />
          <ResultDisplay label="Expected by Now" value={result.currentGain} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
