'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BloodPressureCategoryCalculator() {
  const [sbpStr, setSbpStr] = useState('120') // systolic
  const [dbpStr, setDbpStr] = useState('80') // diastolic

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, category: '' }
    const sbp = parseInt(sbpStr)
    const dbp = parseInt(dbpStr)

    if (isNaN(sbp) || isNaN(dbp) || sbp <= 0 || dbp <= 0) {
      return { ...defaultObj, error: 'Please enter valid blood pressures.' }
    }

    let category = ''
    if (sbp < 120 && dbp < 80) category = 'Normal'
    else if (sbp >= 120 && sbp <= 129 && dbp < 80) category = 'Elevated'
    else if ((sbp >= 130 && sbp <= 139) || (dbp >= 80 && dbp <= 89)) category = 'Stage 1 Hypertension'
    else category = 'Stage 2 Hypertension'

    return { error: null, category }
  }, [sbpStr, dbpStr])

  return (
    <FormCalculatorShell title="Blood Pressure Guidelines Solver" subtitle="Categorize blood pressure readings based on AHA guidelines" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Systolic (mmHg)" value={sbpStr} onChange={setSbpStr} id="bp-sbp" />
          <RetroInput label="Diastolic (mmHg)" value={dbpStr} onChange={setDbpStr} id="bp-dbp" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="BP Category" value={results.category} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
