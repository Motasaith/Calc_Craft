'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PowerFactorCalculator() {
  const [realPowerStr, setRealPowerStr] = useState('800') // Watts
  const [appPowerStr, setAppPowerStr] = useState('1000') // VA

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, pf: 0 }
    const p = parseFloat(realPowerStr)
    const s = parseFloat(appPowerStr)

    if (isNaN(p) || isNaN(s) || p < 0 || s <= 0 || p > s) {
      return { ...defaultObj, error: 'Apparent power must be positive and greater than real power.' }
    }

    const pf = p / s
    return { error: null, pf }
  }, [realPowerStr, appPowerStr])

  return (
    <FormCalculatorShell title="Electrical Power Factor Solver" subtitle="Calculate system power factor (PF) efficiency ratios" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Real Power (Watts, W)" value={realPowerStr} onChange={setRealPowerStr} id="pf-p" />
          <RetroInput label="Apparent Power (Volt-Amps, VA)" value={appPowerStr} onChange={setAppPowerStr} id="pf-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Power Factor Efficiency" value={results.pf.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
