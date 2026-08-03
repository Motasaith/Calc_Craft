'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PohCalculator() {
  const [concStr, setConcStr] = useState('0.0001')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      ph: 0,
      poh: 0,
      classification: '',
      color: '#22c55e',
      steps: [] as string[]
    }

    const c = parseFloat(concStr)
    if (isNaN(c) || c <= 0) {
      return { ...defaultObj, error: 'Please enter a valid positive OH⁻ concentration.' }
    }

    const poh = -Math.log10(c)
    const ph = 14 - poh
    const isAcid = ph < 6.5
    const isNeutral = ph >= 6.5 && ph <= 7.5
    const classification = isNeutral ? 'Neutral' : isAcid ? 'Acidic' : 'Basic (Alkaline)'
    const color = isNeutral ? '#22c55e' : isAcid ? '#dc2626' : '#1d4ed8'

    const steps = [
      `Formula: pOH = -log₁₀[OH⁻]`,
      `pOH = -log₁₀(dots) = ${poh.toFixed(4)}`,
      `pH = 14 - pOH = 14 - ${poh.toFixed(2)} = ${ph.toFixed(4)}`
    ]

    return {
      error: null,
      ph,
      poh,
      classification,
      color,
      steps
    }
  }, [concStr])

  return (
    <FormCalculatorShell title="pOH Calculator" subtitle="Solve pOH, pH, and concentration balances" badge="CHEMISTRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="OH⁻ Concentration (mol/L)" value={concStr} onChange={setConcStr} id="poh-c" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="pOH" value={results.poh.toFixed(2)} large />
                <ResultDisplay label="pH" value={results.ph.toFixed(2)} />
                <ResultDisplay label="Nature" value={results.classification} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Chemical Steps</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 font-mono p-6 text-center">
              {results.error}
            </div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
