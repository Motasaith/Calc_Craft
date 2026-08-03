'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PizzaDoughCalculator() {
  const [flourStr, setFlourStr] = useState('500') // grams
  const [hydrationStr, setHydrationStr] = useState('65') // %
  const [saltStr, setSaltStr] = useState('2') // %

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, water: 0, salt: 0 }
    const f = parseFloat(flourStr)
    const h = parseFloat(hydrationStr)
    const s = parseFloat(saltStr)
    if (isNaN(f) || isNaN(h) || isNaN(s) || f <= 0 || h <= 0 || s < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }
    const water = f * (h / 100)
    const salt = f * (s / 100)
    return { error: null, water, salt }
  }, [flourStr, hydrationStr, saltStr])

  return (
    <FormCalculatorShell title="Baker's Percentage Pizza Dough Solver" subtitle="Calculate hydration and salt weights for dough" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Flour weight (grams)" value={flourStr} onChange={setFlourStr} id="pd-f" />
          <RetroInput label="Hydration (%)" value={hydrationStr} onChange={setHydrationStr} id="pd-h" />
          <RetroInput label="Salt (%)" value={saltStr} onChange={setSaltStr} id="pd-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Water weight (grams)" value={`${results.water.toFixed(1)} g`} large />
              <ResultDisplay label="Salt weight (grams)" value={`${results.salt.toFixed(1)} g`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
