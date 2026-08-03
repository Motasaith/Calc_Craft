'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function IbuprofenDoseCalculator() {
  const [weightStr, setWeightStr] = useState('22') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, doseMg: 0, liquidMl: 0 }
    const w = parseFloat(weightStr)
    if (isNaN(w) || w <= 0) return { ...defaultObj, error: 'Please enter a valid weight.' }
    // Pediatric dose: 10 mg/kg
    const kg = w / 2.20462
    const doseMg = kg * 10
    // Standard infant drops concentration: 50 mg per 1.25 mL
    const liquidMl = (doseMg / 50) * 1.25
    return { error: null, doseMg, liquidMl }
  }, [weightStr])

  return (
    <FormCalculatorShell title="Pediatric Ibuprofen Dose Solver" subtitle="Calculate recommended pediatric ibuprofen doses by weight" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Child Weight (lbs)" value={weightStr} onChange={setWeightStr} id="ibu-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Required Dose (mg)" value={`${results.doseMg.toFixed(0)} mg`} large />
              <ResultDisplay label="Infant Drops (50mg/1.25mL)" value={`${results.liquidMl.toFixed(2)} mL`} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
