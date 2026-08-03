'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AnionGapCalculator() {
  const [naStr, setNaStr] = useState('140')
  const [clStr, setClStr] = useState('104')
  const [hco3Str, setHco3Str] = useState('24')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, gap: 0 }
    const na = parseFloat(naStr)
    const cl = parseFloat(clStr)
    const hco3 = parseFloat(hco3Str)

    if (isNaN(na) || isNaN(cl) || isNaN(hco3) || na <= 0 || cl <= 0 || hco3 <= 0) {
      return { ...defaultObj, error: 'Please enter valid electrolytes.' }
    }

    const gap = na - (cl + hco3)
    return { error: null, gap }
  }, [naStr, clStr, hco3Str])

  return (
    <FormCalculatorShell title="Serum Anion Gap Solver" subtitle="Calculate the serum anion gap to evaluate metabolic acidosis" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Sodium (Na⁺, mEq/L)" value={naStr} onChange={setNaStr} id="ag-na" />
          <RetroInput label="Chloride (Cl⁻, mEq/L)" value={clStr} onChange={setClStr} id="ag-cl" />
          <RetroInput label="Bicarbonate (HCO₃⁻, mEq/L)" value={hco3Str} onChange={setHco3Str} id="ag-hc" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Anion Gap" value={`${results.gap.toFixed(1)} mEq/L`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
