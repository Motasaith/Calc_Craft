'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CookingConverter() {
  const [cupsStr, setCupsStr] = useState('2')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, tbsp: 0, tsp: 0, ml: 0 }
    const cups = parseFloat(cupsStr)
    if (isNaN(cups) || cups < 0) return { ...defaultObj, error: 'Please enter valid values.' }
    const tbsp = cups * 16
    const tsp = cups * 48
    const ml = cups * 236.588
    return { error: null, tbsp, tsp, ml }
  }, [cupsStr])

  return (
    <FormCalculatorShell title="Culinary Cooking Volume Solver" subtitle="Convert cups to tablespoons, teaspoons, and milliliters" badge="CONVERSION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cups" value={cupsStr} onChange={setCupsStr} id="ckc-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="Tablespoons" value={results.tbsp.toFixed(1)} />
              <ResultDisplay label="Teaspoons" value={results.tsp.toFixed(1)} />
              <ResultDisplay label="Milliliters (mL)" value={results.ml.toFixed(1)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
