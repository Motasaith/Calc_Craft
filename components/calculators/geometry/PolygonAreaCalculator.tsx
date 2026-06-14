'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton, RetroSelect } from '../shared/FormCalculatorShell'

export default function PolygonAreaCalculator() {
  const [sides, setSides] = useState('6')
  const [sideLength, setSideLength] = useState('5')
  const [result, setResult] = useState<{area:number,perimeter:number,apothem:number}|null>(null)

  const calculate = () => {
    const n = parseFloat(sides), s = parseFloat(sideLength)
    if (isNaN(n)||isNaN(s) || n<3 || s<=0) { setResult(null); return }
    const area = (n * s * s) / (4 * Math.tan(Math.PI / n))
    const perimeter = n * s
    const apothem = s / (2 * Math.tan(Math.PI / n))
    setResult({ area, perimeter, apothem })
  }

  return (
    <FormCalculatorShell title="Polygon Area" badge="GEOMETRY">
      <RetroInput label="Number of Sides" value={sides} onChange={setSides} placeholder="6" id="poly-n" />
      <RetroInput label="Side Length" value={sideLength} onChange={setSideLength} placeholder="5" id="poly-s" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {result && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          <ResultDisplay label="Area" value={result.area.toFixed(2)} />
          <ResultDisplay label="Perimeter" value={result.perimeter.toFixed(2)} />
          <ResultDisplay label="Apothem" value={result.apothem.toFixed(2)} />
        </div>
      )}
    </FormCalculatorShell>
  )
}
