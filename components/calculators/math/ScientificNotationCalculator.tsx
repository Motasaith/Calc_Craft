'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function ScientificNotationCalculator() {
  const [mode, setMode] = useState<'toSci' | 'fromSci'>('toSci')
  const [mantissa, setMantissa] = useState('')
  const [exponent, setExponent] = useState('')
  const [decimal, setDecimal] = useState('')
  const [result, setResult] = useState('')

  const calculate = () => {
    if (mode === 'toSci') {
      const v = parseFloat(decimal)
      if (isNaN(v)) { setResult('Invalid number'); return }
      const exp = Math.floor(Math.log10(Math.abs(v)))
      const mant = v / Math.pow(10, exp)
      setResult(`${mant.toFixed(4)} × 10^${exp}`)
    } else {
      const m = parseFloat(mantissa), e = parseInt(exponent)
      if (isNaN(m) || isNaN(e)) { setResult('Invalid input'); return }
      setResult((m * Math.pow(10, e)).toString())
    }
  }

  return (
    <FormCalculatorShell title="Scientific Notation" badge="MATH">
      <RetroSelect label="Direction" value={mode} onChange={(v) => { setMode(v as any); setResult('') }} options={[{value:'toSci',label:'Decimal → Scientific'},{value:'fromSci',label:'Scientific → Decimal'}]} id="sn-mode" />
      {mode === 'toSci' ? (
        <RetroInput label="Decimal Number" value={decimal} onChange={setDecimal} placeholder="e.g. 5600000" id="sn-dec" />
      ) : (
        <>
          <RetroInput label="Mantissa" value={mantissa} onChange={setMantissa} placeholder="e.g. 5.6" id="sn-man" />
          <RetroInput label="Exponent" value={exponent} onChange={setExponent} placeholder="e.g. 6" id="sn-exp" />
        </>
      )}
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton></div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
