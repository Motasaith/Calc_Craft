'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function AnovaCalculator() {
  const [ssBetweenStr, setSsBetweenStr] = useState('120')
  const [ssWithinStr, setSsWithinStr] = useState('200')
  const [dfBetweenStr, setDfBetweenStr] = useState('2')
  const [dfWithinStr, setDfWithinStr] = useState('27')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, f: 0 }
    const ssb = parseFloat(ssBetweenStr)
    const ssw = parseFloat(ssWithinStr)
    const dfb = parseFloat(dfBetweenStr)
    const dfw = parseFloat(dfWithinStr)

    if (isNaN(ssb) || isNaN(ssw) || isNaN(dfb) || isNaN(dfw) || dfb <= 0 || dfw <= 0 || ssw <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive inputs.' }
    }

    const msBetween = ssb / dfb
    const msWithin = ssw / dfw
    const f = msBetween / msWithin

    return { error: null, f }
  }, [ssBetweenStr, ssWithinStr, dfBetweenStr, dfWithinStr])

  return (
    <FormCalculatorShell title="One-Way ANOVA F-Statistic Solver" subtitle="Evaluate statistical variance bounds between groups" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="SS Between" value={ssBetweenStr} onChange={setSsBetweenStr} id="an-ssb" />
            <RetroInput label="SS Within" value={ssWithinStr} onChange={setSsWithinStr} id="an-ssw" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="df Between" value={dfBetweenStr} onChange={setDfBetweenStr} id="an-dfb" />
            <RetroInput label="df Within" value={dfWithinStr} onChange={setDfWithinStr} id="an-dfw" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="F-Statistic Ratio" value={results.f.toFixed(4)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
