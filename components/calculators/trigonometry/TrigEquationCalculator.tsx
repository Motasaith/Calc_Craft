'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function TrigEquationCalculator() {
  const [func, setFunc] = useState<'sin' | 'cos' | 'tan'>('sin')
  const [value, setValue] = useState('0.5')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v)) { setResult('Invalid'); return }
    let sol1 = 0, sol2 = 0
    switch (func) {
      case 'sin':
        if (v < -1 || v > 1) { setResult('No solution (|v| > 1)'); return }
        sol1 = Math.asin(v) * 180 / Math.PI
        sol2 = 180 - sol1
        break
      case 'cos':
        if (v < -1 || v > 1) { setResult('No solution (|v| > 1)'); return }
        sol1 = Math.acos(v) * 180 / Math.PI
        sol2 = 360 - sol1
        break
      case 'tan':
        sol1 = Math.atan(v) * 180 / Math.PI
        sol2 = sol1 + 180
        break
    }
    setResult(`${sol1.toFixed(2)}°, ${sol2.toFixed(2)}° (+ n·360°)`)
  }

  return (
    <FormCalculatorShell title="Trig Equation Solver" badge="TRIGONOMETRY">
      <RetroSelect label="Function" value={func} onChange={(v) => { setFunc(v as any); setResult('') }} options={[{value:'sin',label:'sin(x) = v'},{value:'cos',label:'cos(x) = v'},{value:'tan',label:'tan(x) = v'}]} id="te-f" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="0.5" id="te-v" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Solve</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Solutions" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
