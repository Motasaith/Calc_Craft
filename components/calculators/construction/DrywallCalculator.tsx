'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function DrywallCalculator() {
  const [areaStr, setAreaStr] = useState('400') // sq ft

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, sheets4x8: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    if (isNaN(a) || a <= 0) return { ...defaultObj, error: 'Please enter a valid positive area.' }
    const sheets4x8 = a / 32 // 4x8 sheet is 32 sq ft
    return {
      error: null,
      sheets4x8: Math.ceil(sheets4x8),
      steps: [
        `Area of one 4x8 drywall sheet = 32 sq ft`,
        `Sheets needed = Area / 32 = ${Math.ceil(sheets4x8)} sheets`
      ]
    }
  }, [areaStr])

  return (
    <FormCalculatorShell title="Drywall Sheet Solver" subtitle="Calculate sheets needed for walls and ceilings" badge="CONSTRUCTION">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Wall/Ceiling Area (sq ft)" value={areaStr} onChange={setAreaStr} id="dw-a" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="4x8 Sheets Needed" value={results.sheets4x8.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
