'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function FlourWeightCalculator() {
  const [cupsStr, setCupsStr] = useState('2')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, grams: 0 }
    const cups = parseFloat(cupsStr)
    if (isNaN(cups) || cups < 0) return { ...defaultObj, error: 'Please enter valid values.' }
    // standard: 1 cup of all-purpose flour is ~120 grams
    const grams = cups * 120
    return { error: null, grams }
  }, [cupsStr])

  return (
    <FormCalculatorShell title="Flour Weight Converter" subtitle="Convert cups of flour to exact weight measurements in grams" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cups of Flour" value={cupsStr} onChange={setCupsStr} id="fw-c" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Weight (Grams)" value={`${results.grams.toFixed(0)}g`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
