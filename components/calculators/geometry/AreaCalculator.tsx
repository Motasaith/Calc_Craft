'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

export default function AreaCalculator() {
  const [shape, setShape] = useState('rectangle')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const compute = async () => {
    let expr = '0'
    if (shape === 'rectangle') expr = `${a} * ${b}`
    if (shape === 'triangle') expr = `( ${a} * ${b} ) / 2`
    if (shape === 'circle') expr = `${a} ^ 2 * pi`
    const r = await evaluate(expr)
    setResult(r.ok ? r.formatted : `Error: ${r.error}`)
  }

  return (
    <FormCalculatorShell title="Area Calculator" badge="MATH">
      <RetroSelect label="Shape" value={shape} onChange={setShape} id="area-shape"
        options={[{ value: 'rectangle', label: 'Rectangle (a × b)' }, { value: 'triangle', label: 'Triangle (base × height / 2)' }, { value: 'circle', label: 'Circle (radius)' }]} />
      <RetroInput label={shape === 'circle' ? 'Radius (r)' : 'A (width / base / r)'} value={a} onChange={setA} id="area-a" />
      {shape !== 'circle' && <RetroInput label="B (height)" value={b} onChange={setB} id="area-b" />}
      <div className="mt-3">
        <button className="px-4 py-2 bg-[#4c5c4a] text-white rounded" onClick={compute}>Compute</button>
      </div>
      {result && <div className="mt-4"><ResultDisplay label="Area" value={`${result} units²`} large /></div>}
    </FormCalculatorShell>
  )
}
