'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SamplingCalculator() {
  const [confidenceStr, setConfidenceStr] = useState('95') // %
  const [errorStr, setErrorStr] = useState('5') // % margin of error

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, size: 0 }
    const conf = parseFloat(confidenceStr)
    const me = parseFloat(errorStr)

    if (isNaN(conf) || isNaN(me) || me <= 0) {
      return { ...defaultObj, error: 'Please enter valid parameters.' }
    }

    // Z-score lookup for common sizes
    let z = 1.96 // default 95%
    if (conf === 90) z = 1.645
    else if (conf === 99) z = 2.576

    const p = 0.5 // maximum variance assumption
    const meDec = me / 100
    const size = (z * z * p * (1 - p)) / (meDec * meDec)

    return { error: null, size: Math.ceil(size) }
  }, [confidenceStr, errorStr])

  return (
    <FormCalculatorShell title="Statistical Sample Size Solver" subtitle="Calculate required sample survey respondents count" badge="STATISTICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Confidence Level (%) (90, 95, or 99)" value={confidenceStr} onChange={setConfidenceStr} id="sm-c" />
          <RetroInput label="Margin of Error (%)" value={errorStr} onChange={setErrorStr} id="sm-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Required Sample Size" value={results.size.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
