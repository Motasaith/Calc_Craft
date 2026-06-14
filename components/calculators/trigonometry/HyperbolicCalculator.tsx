'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function HyperbolicCalculator() {
  const [func, setFunc] = useState<'sinh' | 'cosh' | 'tanh' | 'asinh' | 'acosh' | 'atanh'>('sinh')
  const [value, setValue] = useState('1')
  const [result, setResult] = useState('')

  const calculate = () => {
    const v = parseFloat(value)
    if (isNaN(v)) { setResult('Invalid'); return }
    let res = 0
    switch (func) {
      case 'sinh': res = Math.sinh(v); break
      case 'cosh': res = Math.cosh(v); break
      case 'tanh': res = Math.tanh(v); break
      case 'asinh': res = Math.asinh(v); break
      case 'acosh': if (v < 1) { setResult('Domain error (v < 1)'); return } res = Math.acosh(v); break
      case 'atanh': if (Math.abs(v) >= 1) { setResult('Domain error (|v| ≥ 1)'); return } res = Math.atanh(v); break
    }
    setResult(`${func}(${v}) = ${res.toFixed(6)}`)
  }

  return (
    <FormCalculatorShell title="Hyperbolic Functions" badge="TRIGONOMETRY">
      <RetroSelect label="Function" value={func} onChange={(v) => { setFunc(v as any); setResult('') }} options={[{value:'sinh',label:'sinh'},{value:'cosh',label:'cosh'},{value:'tanh',label:'tanh'},{value:'asinh',label:'arsinh'},{value:'acosh',label:'arcosh'},{value:'atanh',label:'artanh'}]} id="hyp-f" />
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="1" id="hyp-v" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
