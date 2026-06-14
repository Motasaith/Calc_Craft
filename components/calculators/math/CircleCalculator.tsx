'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function CircleCalculator() {
  const [mode, setMode] = useState<'radius' | 'diameter' | 'area' | 'circumference'>('radius')
  const [val, setVal] = useState('')
  const [results, setResults] = useState<{r:number,d:number,a:number,c:number}|null>(null)

  const calculate = () => {
    const v = parseFloat(val)
    if (isNaN(v) || v <= 0) { setResults(null); return }
    let r = 0
    switch (mode) {
      case 'radius': r = v; break
      case 'diameter': r = v / 2; break
      case 'area': r = Math.sqrt(v / Math.PI); break
      case 'circumference': r = v / (2 * Math.PI); break
    }
    setResults({ r, d: r * 2, a: Math.PI * r * r, c: 2 * Math.PI * r })
  }

  return (
    <FormCalculatorShell title="Circle Calculator" badge="MATH">
      <RetroSelect label="Known Value" value={mode} onChange={(v) => { setMode(v as any); setResults(null) }} options={[{value:'radius',label:'Radius'},{value:'diameter',label:'Diameter'},{value:'area',label:'Area'},{value:'circumference',label:'Circumference'}]} id="circ-mode" />
      <RetroInput label={mode.charAt(0).toUpperCase() + mode.slice(1)} value={val} onChange={setVal} placeholder="Enter value" id="circ-val" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {results && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <ResultDisplay label="Radius" value={results.r.toFixed(4)} />
          <ResultDisplay label="Diameter" value={results.d.toFixed(4)} />
          <ResultDisplay label="Area" value={results.a.toFixed(4)} />
          <ResultDisplay label="Circumference" value={results.c.toFixed(4)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
