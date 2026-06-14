'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function EllipseCalculator() {
  const [a, setA] = useState('5')
  const [b, setB] = useState('3')
  const [result, setResult] = useState<{area:number,circumference:number,eccentricity:number}|null>(null)

  const calculate = () => {
    const av = parseFloat(a), bv = parseFloat(b)
    if (isNaN(av)||isNaN(bv) || av<=0 || bv<=0) { setResult(null); return }
    const area = Math.PI * av * bv
    const h = Math.pow((av - bv) / (av + bv), 2)
    const circumference = Math.PI * (av + bv) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)))
    const eccentricity = Math.sqrt(1 - (bv * bv) / (av * av))
    setResult({ area, circumference, eccentricity })
  }

  return (
    <FormCalculatorShell title="Ellipse Calculator" badge="GEOMETRY">
      <RetroInput label="Semi-Major Axis (a)" value={a} onChange={setA} placeholder="5" id="ell-a" />
      <RetroInput label="Semi-Minor Axis (b)" value={b} onChange={setB} placeholder="3" id="ell-b" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Area" value={result.area.toFixed(2)} />
          <ResultDisplay label="Circumference" value={result.circumference.toFixed(2)} />
          <ResultDisplay label="Eccentricity" value={result.eccentricity.toFixed(4)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
