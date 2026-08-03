'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SugarConverterCooking() {
  const [cupsStr, setCupsStr] = useState('2')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, grams: 0 }
    const cups = parseFloat(cupsStr)
    if (isNaN(cups) || cups < 0) return { ...defaultObj, error: 'Please enter valid values.' }
    // standard: 1 cup of white sugar is ~200 grams
    const grams = cups * 200
    return { error: null, grams }
  }, [cupsStr])

  return (
    <FormCalculatorShell title="Sugar Weight Converter" subtitle="Convert cups of white sugar to exact weight measurements in grams" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cups of Sugar" value={cupsStr} onChange={setCupsStr} id="sg-c" />
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
