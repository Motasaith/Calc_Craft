'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RetirementCountdownCalculator() {
  const [targetAgeStr, setTargetAgeStr] = useState('65')
  const [currentAgeStr, setCurrentAgeStr] = useState('30')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, years: 0 }
    const target = parseInt(targetAgeStr)
    const current = parseInt(currentAgeStr)

    if (isNaN(target) || isNaN(current) || target <= current || current <= 0) {
      return { ...defaultObj, error: 'Target age must exceed current age.' }
    }

    const years = target - current
    return { error: null, years }
  }, [targetAgeStr, currentAgeStr])

  return (
    <FormCalculatorShell title="Retirement Countdown Solver" subtitle="Estimate years remaining before retirement targets" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Current Age" value={currentAgeStr} onChange={setCurrentAgeStr} id="rcc-c" />
          <RetroInput label="Target Retirement Age" value={targetAgeStr} onChange={setTargetAgeStr} id="rcc-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Years Remaining" value={`${results.years} years`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
