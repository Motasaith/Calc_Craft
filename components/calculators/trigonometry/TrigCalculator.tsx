'use client'
import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

export default function TrigCalculator() {
  const [expr, setExpr] = useState('sin(30)')
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG')
  const [result, setResult] = useState<string | null>(null)

  const run = async () => {
    const r = await evaluate(expr, { angleMode })
    setResult(r.ok ? r.formatted : `Error: ${r.error}`)
  }

  return (
    <FormCalculatorShell title="Trigonometry (Expression)" badge="MATH">
      <RetroInput label="Expression" value={expr} onChange={setExpr} placeholder="sin(30) + cos(60)" id="trig-expr" />
      <RetroSelect label="Angle Mode" value={angleMode} onChange={setAngleMode as any} id="trig-mode"
        options={[{ value: 'DEG', label: 'Degrees' }, { value: 'RAD', label: 'Radians' }]} />
      <div className="mt-3">
        <button className="px-4 py-2 bg-[#4c5c4a] text-white rounded" onClick={run}>Evaluate</button>
      </div>
      {result && <div className="mt-4"><ResultDisplay label="Result" value={result} large /></div>}
    </FormCalculatorShell>
  )
}
