'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function HeightConverter() {
  const [mode, setMode] = useState<'ft-to-cm' | 'cm-to-ft'>('ft-to-cm')
  const [feet, setFeet] = useState('5')
  const [inches, setInches] = useState('10')
  const [cm, setCm] = useState('178')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'ft-to-cm') {
      const f = parseFloat(feet), i = parseFloat(inches)
      if (isNaN(f)||isNaN(i)) { setResult('Invalid'); return }
      setResult(`${((f * 12 + i) * 2.54).toFixed(1)} cm`)
    } else {
      const c = parseFloat(cm)
      if (isNaN(c)) { setResult('Invalid'); return }
      const totalIn = c / 2.54
      const f = Math.floor(totalIn / 12)
      const i = Math.round(totalIn % 12)
      setResult(`${f} ft ${i} in`)
    }
  }

  return (
    <FormCalculatorShell title="Height Converter" badge="EVERYDAY">
      <RetroSelect label="Direction" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'ft-to-cm',label:'Feet/Inches → CM'},{value:'cm-to-ft',label:'CM → Feet/Inches'}]} id="ht-mode" />
      {mode === 'ft-to-cm' ? (
        <div className="grid grid-cols-2 gap-3">
          <RetroInput label="Feet" value={feet} onChange={setFeet} placeholder="5" id="ht-ft" />
          <RetroInput label="Inches" value={inches} onChange={setInches} placeholder="10" id="ht-in" />
        </div>
      ) : <RetroInput label="Centimeters" value={cm} onChange={setCm} placeholder="178" id="ht-cm" />}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
