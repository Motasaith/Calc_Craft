'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Size = 'small' | 'medium' | 'large'

export default function DogAgeCalculator() {
  const [ageStr, setAgeStr] = useState('5')
  const [size, setSize] = useState<Size>('medium')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, humanAge: 0, steps: [] as string[] }
    const dogAge = parseFloat(ageStr)
    if (isNaN(dogAge) || dogAge < 0) {
      return { ...defaultObj, error: 'Please enter a valid positive dog age.' }
    }

    let humanAge = 0
    let factor = size === 'small' ? 4 : size === 'medium' ? 5 : 6

    if (dogAge === 0) humanAge = 0
    else if (dogAge <= 1) humanAge = 15
    else if (dogAge <= 2) humanAge = 24
    else humanAge = 24 + (dogAge - 2) * factor

    return {
      error: null,
      humanAge,
      steps: [
        `Dog age: ${dogAge} years | Size: ${size}`,
        `1st year = 15 human years | 2nd year = 24 human years`,
        `Subsequent years add ${factor} human years each`,
        `Estimated human equivalent = ${humanAge.toFixed(1)} years`
      ]
    }
  }, [ageStr, size])

  return (
    <FormCalculatorShell title="Dog Age Calculator" subtitle="Convert dog years to human age equivalent based on breed size" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Dog Size"
            value={size}
            onChange={(val) => setSize(val as Size)}
            id="dog-size"
            options={[
              { value: 'small', label: 'Small (< 20 lbs)' },
              { value: 'medium', label: 'Medium (20-50 lbs)' },
              { value: 'large', label: 'Large (> 50 lbs)' }
            ]}
          />
          <RetroInput label="Dog Age (years)" value={ageStr} onChange={setAgeStr} id="dog-age" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Human Age Equivalent" value={`${results.humanAge.toFixed(1)} years`} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
