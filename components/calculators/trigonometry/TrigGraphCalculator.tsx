'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function TrigGraphCalculator() {
  const [func, setFunc] = useState<'sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot'>('sin')
  const [angle, setAngle] = useState('30')
  const [result, setResult] = useState('')

  const calculate = () => {
    const a = parseFloat(angle) * Math.PI / 180
    if (isNaN(a)) { setResult('Invalid'); return }
    const sin = Math.sin(a), cos = Math.cos(a), tan = Math.tan(a)
    let val = 0
    switch (func) {
      case 'sin': val = sin; break
      case 'cos': val = cos; break
      case 'tan': val = tan; break
      case 'sec': val = 1/cos; break
      case 'csc': val = 1/sin; break
      case 'cot': val = 1/tan; break
    }
    setResult(`${func}(${angle}°) = ${val.toFixed(6)}`)
  }

  return (
    <FormCalculatorShell title="Trig Evaluator" badge="TRIGONOMETRY">
      <RetroSelect label="Function" value={func} onChange={(v) => { setFunc(v as any); setResult('') }} options={[{value:'sin',label:'sin'},{value:'cos',label:'cos'},{value:'tan',label:'tan'},{value:'sec',label:'sec'},{value:'csc',label:'csc'},{value:'cot',label:'cot'}]} id="tg-f" />
      <RetroInput label="Angle (°)" value={angle} onChange={setAngle} placeholder="30" id="tg-a" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Evaluate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
