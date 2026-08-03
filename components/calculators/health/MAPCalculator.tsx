'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function MAPCalculator() {
  const [sbpStr, setSbpStr] = useState('120')
  const [dbpStr, setDbpStr] = useState('80')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, mapVal: 0 }
    const sbp = parseFloat(sbpStr)
    const dbp = parseFloat(dbpStr)

    if (isNaN(sbp) || isNaN(dbp) || sbp <= 0 || dbp <= 0) {
      return { ...defaultObj, error: 'Please enter valid blood pressures.' }
    }

    const mapVal = (sbp + 2 * dbp) / 3
    return { error: null, mapVal }
  }, [sbpStr, dbpStr])

  return (
    <FormCalculatorShell title="Mean Arterial Pressure Solver" subtitle="Calculate mean arterial pressure (MAP) from blood pressure" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Systolic (mmHg)" value={sbpStr} onChange={setSbpStr} id="map-s" />
          <RetroInput label="Diastolic (mmHg)" value={dbpStr} onChange={setDbpStr} id="map-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Mean Arterial Pressure (MAP)" value={`${results.mapVal.toFixed(1)} mmHg`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
