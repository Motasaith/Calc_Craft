'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ButterConverterCalculator() {
  const [sticksStr, setSticksStr] = useState('2')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, grams: 0, tbsp: 0 }
    const sticks = parseFloat(sticksStr)
    if (isNaN(sticks) || sticks < 0) return { ...defaultObj, error: 'Please enter valid values.' }
    // standard: 1 stick of butter = 113g = 8 tablespoons
    const grams = sticks * 113
    const tbsp = sticks * 8
    return { error: null, grams, tbsp }
  }, [sticksStr])

  return (
    <FormCalculatorShell title="Butter Weight Converter" subtitle="Convert sticks of butter to grams and tablespoons equivalents" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Sticks of Butter" value={sticksStr} onChange={setSticksStr} id="bt-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Weight (Grams)" value={`${results.grams.toFixed(0)}g`} />
              <ResultDisplay label="Tablespoons" value={results.tbsp.toString()} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
