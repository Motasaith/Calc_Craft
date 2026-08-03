'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CapRateCalculator() {
  const [noiStr, setNoiStr] = useState('24000') // net operating income
  const [valueStr, setValueStr] = useState('300000') // property value

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, capRate: 0, steps: [] as string[] }
    const noi = parseFloat(noiStr)
    const val = parseFloat(valueStr)
    if (isNaN(noi) || isNaN(val) || noi < 0 || val <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const capRate = (noi / val) * 100
    return {
      error: null,
      capRate,
      steps: [
        `Formula: Capitalization Rate = (Net Operating Income / Property Value) × 100`,
        `Cap Rate = (${noi.toLocaleString()} / ${val.toLocaleString()}) × 100 = ${capRate.toFixed(2)}%`
      ]
    }
  }, [noiStr, valueStr])

  return (
    <FormCalculatorShell title="Capitalization Rate Solver" subtitle="Calculate cap rates from Net Operating Income and property value" badge="REAL ESTATE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Net Operating Income (NOI - yearly, $)" value={noiStr} onChange={setNoiStr} id="cr-noi" />
          <RetroInput label="Property Value / Purchase Price ($)" value={valueStr} onChange={setValueStr} id="cr-val" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Capitalization Rate" value={`${results.capRate.toFixed(2)}%`} large />
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
