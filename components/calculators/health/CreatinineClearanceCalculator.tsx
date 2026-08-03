'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CreatinineClearanceCalculator() {
  const [ageStr, setAgeStr] = useState('60')
  const [weightStr, setWeightStr] = useState('70') // kg
  const [scrStr, setScrStr] = useState('1.0') // serum creatinine mg/dL

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, crcl: 0 }
    const a = parseFloat(ageStr)
    const w = parseFloat(weightStr)
    const scr = parseFloat(scrStr)

    if (isNaN(a) || isNaN(w) || isNaN(scr) || a <= 0 || w <= 0 || scr <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Cockcroft-Gault equation for males
    const crcl = ((140 - a) * w) / (72 * scr)
    return { error: null, crcl }
  }, [ageStr, weightStr, scrStr])

  return (
    <FormCalculatorShell title="Creatinine Clearance CrCl Solver" subtitle="Estimate renal function clearance using the Cockcroft-Gault equation" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Age" value={ageStr} onChange={setAgeStr} id="cr-age" />
          <RetroInput label="Weight (kg)" value={weightStr} onChange={setWeightStr} id="cr-w" />
          <RetroInput label="Serum Creatinine (mg/dL)" value={scrStr} onChange={setScrStr} id="cr-scr" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Creatinine Clearance (CrCl)" value={`${results.crcl.toFixed(1)} mL/min`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
