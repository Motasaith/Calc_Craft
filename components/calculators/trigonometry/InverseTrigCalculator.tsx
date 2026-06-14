'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function InverseTrigCalculator() {
  const [func, setFunc] = useState<'asin' | 'acos' | 'atan'>('asin')
  const [value, setValue] = useState('0.5')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v)) { setResult('Invalid'); return }
    let rad = 0
    switch (func) {
      case 'asin': if (v < -1 || v > 1) { setResult('Domain error'); return } rad = Math.asin(v); break
      case 'acos': if (v < -1 || v > 1) { setResult('Domain error'); return } rad = Math.acos(v); break
      case 'atan': rad = Math.atan(v); break
    }
    const deg = rad * 180 / Math.PI
    setResult(`${rad.toFixed(6)} rad = ${deg.toFixed(2)}°`)
  }

  return (
    <FormCalculatorShell title="Inverse Trig" badge="TRIGONOMETRY">
      <RetroSelect label="Function" value={func} onChange={(v) => { setFunc(v as any); setResult('') }} options={[{value:'asin',label:'arcsin'},{value:'acos',label:'arccos'},{value:'atan',label:'arctan'}]} id="inv-f" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="0.5" id="inv-v" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
