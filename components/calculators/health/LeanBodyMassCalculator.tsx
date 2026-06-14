'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function LeanBodyMassCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('70')
  const [height, setHeight] = useState('175')
  const [result, setResult] = useState<{lbm:number,boer:number,james:number,hume:number}|null>(null)

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height)
    if (isNaN(w)||isNaN(h) || w <= 0 || h <= 0) { setResult(null); return }
    let boer = 0, james = 0, hume = 0
    if (sex === 'male') {
      boer = 0.407 * w + 0.267 * h - 19.2
      james = 1.1 * w - 128 * Math.pow(w / h, 2)
      hume = 0.32810 * w + 0.33929 * h - 29.5336
    } else {
      boer = 0.252 * w + 0.473 * h - 48.3
      james = 1.07 * w - 148 * Math.pow(w / h, 2)
      hume = 0.29569 * w + 0.41813 * h - 43.2933
    }
    setResult({ lbm: boer, boer, james, hume })
  }

  return (
    <FormCalculatorShell title="Lean Body Mass" badge="HEALTH">
      <RetroSelect label="Sex" value={sex} onChange={(v) => setSex(v as any)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} id="lbm-sex" />
      <div className="grid grid-cols-2 gap-3">
        <RetroInput label="Weight (kg)" value={weight} onChange={setWeight} placeholder="70" id="lbm-w" />
        <RetroInput label="Height (cm)" value={height} onChange={setHeight} placeholder="175" id="lbm-h" />
      </div>
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate LBM</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Boer Formula" value={`${result.boer.toFixed(1)} kg`} />
          <ResultDisplay label="James Formula" value={`${result.james.toFixed(1)} kg`} />
          <ResultDisplay label="Hume Formula" value={`${result.hume.toFixed(1)} kg`} />
          <ResultDisplay label="Average LBM" value={`${((result.boer+result.james+result.hume)/3).toFixed(1)} kg`} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
