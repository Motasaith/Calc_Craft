'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PulsePressureCalculator() {
  const [sbpStr, setSbpStr] = useState('120')
  const [dbpStr, setDbpStr] = useState('80')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pp: 0 }
    const sbp = parseFloat(sbpStr)
    const dbp = parseFloat(dbpStr)

    if (isNaN(sbp) || isNaN(dbp) || sbp <= 0 || dbp <= 0) {
      return { ...defaultObj, error: 'Please enter valid blood pressures.' }
    }

    const pp = sbp - dbp
    return { error: null, pp }
  }, [sbpStr, dbpStr])

  return (
    <FormCalculatorShell title="Pulse Pressure Solver" subtitle="Calculate arterial pulse pressures from SBP/DBP limits" badge="HEALTH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Systolic (mmHg)" value={sbpStr} onChange={setSbpStr} id="pp-s" />
          <RetroInput label="Diastolic (mmHg)" value={dbpStr} onChange={setDbpStr} id="pp-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Pulse Pressure" value={`${results.pp.toFixed(0)} mmHg`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
