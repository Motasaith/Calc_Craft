'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CatAgeCalculator() {
  const [ageStr, setAgeStr] = useState('3') // cat years

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, humanAge: 0, steps: [] as string[] }
    const catAge = parseFloat(ageStr)
    if (isNaN(catAge) || catAge < 0) {
      return { ...defaultObj, error: 'Please enter a valid positive cat age.' }
    }

    let humanAge = 0
    if (catAge === 0) humanAge = 0
    else if (catAge <= 1) humanAge = catAge * 15
    else if (catAge <= 2) humanAge = 15 + (catAge - 1) * 9
    else humanAge = 24 + (catAge - 2) * 4

    return {
      error: null,
      humanAge,
      steps: [
        `Cat age: ${catAge} years`,
        `1st year equals 15 human years`,
        `2nd year adds 9 human years (Total 24)`,
        `Subsequent years add 4 human years each`,
        `Estimated human equivalent = ${humanAge.toFixed(1)} years`
      ]
    }
  }, [ageStr])

  return (
    <FormCalculatorShell title="Cat Age Calculator" subtitle="Convert cat years to human age equivalent" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Cat Age (years)" value={ageStr} onChange={setAgeStr} id="cat-age" />
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
