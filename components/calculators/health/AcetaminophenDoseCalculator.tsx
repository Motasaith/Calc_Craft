'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AcetaminophenDoseCalculator() {
  const [weightStr, setWeightStr] = useState('22') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, doseMg: 0, liquidMl: 0 }
    const w = parseFloat(weightStr)
    if (isNaN(w) || w <= 0) return { ...defaultObj, error: 'Please enter a valid weight.' }
    // Pediatric dose: 15 mg/kg. 1 kg = 2.20462 lbs.
    const kg = w / 2.20462
    const doseMg = kg * 15
    // Standard liquid concentration: 160 mg per 5 mL
    const liquidMl = (doseMg / 160) * 5
    return { error: null, doseMg, liquidMl }
  }, [weightStr])

  return (
    <FormCalculatorShell title="Pediatric Acetaminophen Dose Solver" subtitle="Calculate recommended pediatric acetaminophen doses by weight" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Child Weight (lbs)" value={weightStr} onChange={setWeightStr} id="ace-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Required Dose (mg)" value={`${results.doseMg.toFixed(0)} mg`} large />
              <ResultDisplay label="Liquid Volume (160mg/5mL)" value={`${results.liquidMl.toFixed(2)} mL`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
