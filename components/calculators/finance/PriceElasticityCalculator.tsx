'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PriceElasticityCalculator() {
  const [p1, setP1] = useState('10')
  const [p2, setP2] = useState('12')
  const [q1, setQ1] = useState('100')
  const [q2, setQ2] = useState('80')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, elasticity: 0 }
    const valP1 = parseFloat(p1)
    const valP2 = parseFloat(p2)
    const valQ1 = parseFloat(q1)
    const valQ2 = parseFloat(q2)

    if (isNaN(valP1) || isNaN(valP2) || isNaN(valQ1) || isNaN(valQ2) || valP1 <= 0 || valP2 <= 0 || valQ1 <= 0 || valQ2 <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const pctQ = (valQ2 - valQ1) / ((valQ1 + valQ2) / 2)
    const pctP = (valP2 - valP1) / ((valP1 + valP2) / 2)
    if (pctP === 0) return { ...defaultObj, error: 'Price change cannot be zero.' }
    const elasticity = Math.abs(pctQ / pctP)

    return { error: null, elasticity }
  }, [p1, p2, q1, q2])

  return (
    <FormCalculatorShell title="Price Elasticity of Demand Solver" subtitle="Calculate elasticity coefficients using the Midpoint Method" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Initial Price (P₁)" value={p1} onChange={setP1} id="pe-p1" />
            <RetroInput label="New Price (P₂)" value={p2} onChange={setP2} id="pe-p2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Initial Quantity (Q₁)" value={q1} onChange={setQ1} id="pe-q1" />
            <RetroInput label="New Quantity (Q₂)" value={q2} onChange={setQ2} id="pe-q2" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Elasticity Coefficient" value={results.elasticity.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
