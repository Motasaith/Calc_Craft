'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function TrapezoidCalculator() {
  const [a, setA] = useState('8')
  const [b, setB] = useState('5')
  const [c, setC] = useState('4')
  const [d, setD] = useState('4')
  const [height, setHeight] = useState('3')
  const [result, setResult] = useState<{area:number,perimeter:number,median:number}|null>(null)

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b), cv = parseFloat(c), dv = parseFloat(d), h = parseFloat(height)
    if (isNaN(av)||isNaN(bv)||isNaN(cv)||isNaN(dv)||isNaN(h)) { setResult(null); return }
    const area = ((av + bv) / 2) * h
    const perimeter = av + bv + cv + dv
    const median = (av + bv) / 2
    setResult({ area, perimeter, median })
  }

  return (
    <FormCalculatorShell title="Trapezoid" badge="GEOMETRY">
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Base A" value={a} onChange={setA} placeholder="8" id="trap-a" /><RetroInput label="Base B" value={b} onChange={setB} placeholder="5" id="trap-b" /></div>
      <div className="grid grid-cols-2 gap-3"><RetroInput label="Side C" value={c} onChange={setC} placeholder="4" id="trap-c" /><RetroInput label="Side D" value={d} onChange={setD} placeholder="4" id="trap-d" /></div>
      <RetroInput label="Height" value={height} onChange={setHeight} placeholder="3" id="trap-h" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Area" value={result.area.toFixed(2)} />
          <ResultDisplay label="Perimeter" value={result.perimeter.toFixed(2)} />
          <ResultDisplay label="Median" value={result.median.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
