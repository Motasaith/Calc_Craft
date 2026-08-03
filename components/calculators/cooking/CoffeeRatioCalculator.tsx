'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CoffeeRatioCalculator() {
  const [waterStr, setWaterStr] = useState('300') // grams/mL
  const [ratioStr, setRatioStr] = useState('16') // 1:16 default

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, coffee: 0 }
    const water = parseFloat(waterStr)
    const ratio = parseFloat(ratioStr)

    if (isNaN(water) || isNaN(ratio) || water <= 0 || ratio <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    const coffee = water / ratio
    return { error: null, coffee }
  }, [waterStr, ratioStr])

  return (
    <FormCalculatorShell title="Coffee Brewing Ratio Solver" subtitle="Calculate ideal coffee grounds weight from water capacity volumes" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Water Amount (mL/grams)" value={waterStr} onChange={setWaterStr} id="cfr-w" />
          <RetroInput label="Brewing Ratio (1:x)" value={ratioStr} onChange={setRatioStr} id="cfr-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Coffee Grounds Required" value={`${results.coffee.toFixed(1)} grams`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
