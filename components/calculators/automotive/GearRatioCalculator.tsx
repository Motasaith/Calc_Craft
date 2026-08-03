'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function GearRatioCalculator() {
  const [driveTeethStr, setDriveTeethStr] = useState('15')
  const [drivenTeethStr, setDrivenTeethStr] = useState('45')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ratio: 0, steps: [] as string[] }
    const drive = parseInt(driveTeethStr)
    const driven = parseInt(drivenTeethStr)
    if (isNaN(drive) || isNaN(driven) || drive <= 0 || driven <= 0) return { ...defaultObj, error: 'Please enter valid positive gear counts.' }
    const ratio = driven / drive
    return {
      error: null,
      ratio,
      steps: [
        `Formula: Gear Ratio = Driven Gear Teeth / Driving Gear Teeth`,
        `Gear Ratio = ${driven} / ${drive} = ${ratio.toFixed(2)} : 1`
      ]
    }
  }, [driveTeethStr, drivenTeethStr])

  return (
    <FormCalculatorShell title="Gear Ratio Solver" subtitle="Calculate mechanical gear reduction speed parameters" badge="AUTOMOTIVE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Driving Gear (Teeth count)" value={driveTeethStr} onChange={setDriveTeethStr} id="gr-drive" />
          <RetroInput label="Driven Gear (Teeth count)" value={drivenTeethStr} onChange={setDrivenTeethStr} id="gr-driven" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Mechanical Ratio" value={`${results.ratio.toFixed(2)} : 1`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
