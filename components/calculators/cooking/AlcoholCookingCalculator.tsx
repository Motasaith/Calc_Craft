'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

export default function AlcoholCookingCalculator() {
  const [method, setMethod] = useState<'stir-in' | 'simmer-15' | 'simmer-60' | 'baked-25'>('stir-in')
  const [volStr, setVolStr] = useState('100') // mL

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, retained: 0 }
    const v = parseFloat(volStr)
    if (isNaN(v) || v <= 0) return { ...defaultObj, error: 'Please enter a valid volume.' }
    let rate = 0.85 // stir in
    if (method === 'simmer-15') rate = 0.40
    else if (method === 'simmer-60') rate = 0.25
    else if (method === 'baked-25') rate = 0.45
    return { error: null, retained: v * rate }
  }, [method, volStr])

  return (
    <FormCalculatorShell title="Alcohol Retained in Cooking Solver" subtitle="Calculate remaining alcohol content after boiling or baking" badge="COOKING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Cooking Method"
            value={method}
            onChange={(val) => setMethod(val as any)}
            id="alc-m"
            options={[
              { value: 'stir-in', label: 'Stirred in / boiled briefly (85% retained)' },
              { value: 'simmer-15', label: 'Simmered 15 mins (40% retained)' },
              { value: 'simmer-60', label: 'Simmered 1 hour (25% retained)' },
              { value: 'baked-25', label: 'Baked 25 mins (45% retained)' }
            ]}
          />
          <RetroInput label="Initial Alcohol Volume (mL)" value={volStr} onChange={setVolStr} id="alc-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Retained Alcohol Volume" value={`${results.retained.toFixed(1)} mL`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
