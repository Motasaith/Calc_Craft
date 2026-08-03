'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SystemEquationsCalculator() {
  const [a1, setA1] = useState('2')
  const [b1, setB1] = useState('1')
  const [c1, setC1] = useState('8')
  const [a2, setA2] = useState('1')
  const [b2, setB2] = useState('-3')
  const [c2, setC2] = useState('-3')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, x: 0, y: 0 }
    const vA1 = parseFloat(a1)
    const vB1 = parseFloat(b1)
    const vC1 = parseFloat(c1)
    const vA2 = parseFloat(a2)
    const vB2 = parseFloat(b2)
    const vC2 = parseFloat(c2)

    if (isNaN(vA1) || isNaN(vB1) || isNaN(vC1) || isNaN(vA2) || isNaN(vB2) || isNaN(vC2)) {
      return { ...defaultObj, error: 'Please enter valid coefficients.' }
    }

    const det = vA1 * vB2 - vB1 * vA2
    if (det === 0) return { ...defaultObj, error: 'The system has no unique solution (determinant = 0).' }
    const x = (vC1 * vB2 - vB1 * vC2) / det
    const y = (vA1 * vC2 - vC1 * vA2) / det

    return { error: null, x, y }
  }, [a1, b1, c1, a2, b2, c2])

  return (
    <FormCalculatorShell title="Linear Systems Solver" subtitle="Solve 2x2 systems of equations using Cramer's rule" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="border border-neutral-300 rounded p-3 bg-neutral-50/50 space-y-2">
            <p className="text-[10px] font-bold text-neutral-600 font-mono">Equation 1: a₁x + b₁y = c₁</p>
            <div className="grid grid-cols-3 gap-2">
              <RetroInput label="a₁" value={a1} onChange={setA1} id="se-a1" />
              <RetroInput label="b₁" value={b1} onChange={setB1} id="se-b1" />
              <RetroInput label="c₁" value={c1} onChange={setC1} id="se-c1" />
            </div>
          </div>
          <div className="border border-neutral-300 rounded p-3 bg-neutral-50/50 space-y-2">
            <p className="text-[10px] font-bold text-neutral-600 font-mono">Equation 2: a₂x + b₂y = c₂</p>
            <div className="grid grid-cols-3 gap-2">
              <RetroInput label="a₂" value={a2} onChange={setA2} id="se-a2" />
              <RetroInput label="b₂" value={b2} onChange={setB2} id="se-b2" />
              <RetroInput label="c₂" value={c2} onChange={setC2} id="se-c2" />
            </div>
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="x Value" value={results.x.toFixed(4)} large />
              <ResultDisplay label="y Value" value={results.y.toFixed(4)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
