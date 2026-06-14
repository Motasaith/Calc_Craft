'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function GfrCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState('40')
  const [creatinine, setCreatinine] = useState('1.0')
  const [unit, setUnit] = useState<'mg' | 'umol'>('mg')
  const [result, setResult] = useState('')

  const calculate = () => {
    const a = parseInt(age), cr = parseFloat(creatinine)
    if (isNaN(a)||isNaN(cr) || a <= 0 || cr <= 0) { setResult('Invalid'); return }
    const scr = unit === 'umol' ? cr / 88.4 : cr
    let gfr = 175 * Math.pow(scr, -1.154) * Math.pow(a, -0.203)
    if (sex === 'female') gfr *= 0.742
    let stage = 'Normal'
    if (gfr < 90) stage = 'Stage 2 (Mild decrease)'
    if (gfr < 60) stage = 'Stage 3 (Moderate decrease)'
    if (gfr < 30) stage = 'Stage 4 (Severe decrease)'
    if (gfr < 15) stage = 'Stage 5 (Kidney failure)'
    setResult(`${gfr.toFixed(1)} mL/min (${stage})`)
  }

  return (
    <FormCalculatorShell title="GFR Calculator" subtitle="eGFR (MDRD)" badge="HEALTH">
      <RetroSelect label="Sex" value={sex} onChange={(v) => setSex(v as any)} options={[{value:'male',label:'Male'},{value:'female',label:'Female'}]} id="gfr-sex" />
      <RetroInput label="Age" value={age} onChange={setAge} placeholder="40" id="gfr-age" />
      <RetroInput label="Serum Creatinine" value={creatinine} onChange={setCreatinine} placeholder="1.0" id="gfr-cr" />
      <RetroSelect label="Unit" value={unit} onChange={(v) => setUnit(v as any)} options={[{value:'mg',label:'mg/dL'},{value:'umol',label:'μmol/L'}]} id="gfr-unit" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate eGFR</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="eGFR" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
