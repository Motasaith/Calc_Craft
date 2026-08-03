'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TrainingLoadCalculator() {
  const [durationStr, setDurationStr] = useState('60') // minutes
  const [rpeStr, setRpeStr] = useState('7') // Rate of Perceived Exertion (1-10)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, load: 0 }
    const d = parseFloat(durationStr)
    const rpe = parseFloat(rpeStr)

    if (isNaN(d) || isNaN(rpe) || d <= 0 || rpe < 1 || rpe > 10) {
      return { ...defaultObj, error: 'Please enter valid duration and RPE between 1 and 10.' }
    }

    // Session RPE load = Duration * RPE
    const load = d * rpe
    return { error: null, load }
  }, [durationStr, rpeStr])

  return (
    <FormCalculatorShell title="Training Exertion Load Solver" subtitle="Calculate daily training load points using duration and RPE values" badge="SPORTS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Duration (minutes)" value={durationStr} onChange={setDurationStr} id="tl-d" />
          <RetroInput label="RPE (Intensity 1 to 10)" value={rpeStr} onChange={setRpeStr} id="tl-r" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Training Load Points" value={results.load.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
