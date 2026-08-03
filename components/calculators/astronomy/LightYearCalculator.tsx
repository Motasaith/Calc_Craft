'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function LightYearCalculator() {
  const [valStr, setValStr] = useState('1')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, km: 0, au: 0, parsecs: 0, steps: [] as string[] }
    const ly = parseFloat(valStr)
    if (isNaN(ly) || ly < 0) return { ...defaultObj, error: 'Please enter a valid positive light year.' }
    const km = ly * 9.46073e12
    const au = ly * 63241.077
    const parsecs = ly * 0.306601
    return {
      error: null,
      km, au, parsecs,
      steps: [
        `1 Light Year = 9.461 × 10¹² km`,
        `1 Light Year = 63,241 AU (Astronomical Units)`,
        `1 Light Year = 0.3066 Parsecs`
      ]
    }
  }, [valStr])

  return (
    <FormCalculatorShell title="Light Year Converter" subtitle="Convert light years to other astronomical distances" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Light Years (ly)" value={valStr} onChange={setValStr} id="ly-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="km" value={results.km.toExponential(4)} />
                <ResultDisplay label="AU" value={results.au.toLocaleString()} />
                <ResultDisplay label="Parsecs" value={results.parsecs.toFixed(4)} />
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
