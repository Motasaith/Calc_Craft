'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SpecificHeatCalculator() {
  const [qStr, setQStr] = useState('4184') // Heat added (J)
  const [mStr, setMStr] = useState('1') // Mass (kg)
  const [dtStr, setDtStr] = useState('1') // Temp diff (K or C)

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      c: 0,
      steps: [] as string[]
    }

    const q = parseFloat(qStr)
    const m = parseFloat(mStr)
    const dt = parseFloat(dtStr)

    if (isNaN(q) || isNaN(m) || isNaN(dt) || m <= 0 || dt === 0) {
      return { ...defaultObj, error: 'Please enter valid numbers (mass must be positive, temp diff non-zero).' }
    }

    const c = q / (m * dt)
    const steps = [
      `Formula: c = Q / (m × ΔT)`,
      `c = ${q} J / (${m} kg × ${dt} K) = ${c.toFixed(2)} J/(kg·K)`
    ]

    return {
      error: null,
      c,
      steps
    }
  }, [qStr, mStr, dtStr])

  return (
    <FormCalculatorShell title="Specific Heat Calculator" subtitle="Solve specific heat capacity from thermodynamic factors" badge="PHYSICS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Heat Energy Q (Joules)" value={qStr} onChange={setQStr} id="sh-q" />
          <RetroInput label="Mass m (kg)" value={mStr} onChange={setMStr} id="sh-m" />
          <RetroInput label="Temp Change ΔT (K or °C)" value={dtStr} onChange={setDtStr} id="sh-dt" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-1">
                <ResultDisplay label="Specific Heat c" value={`${results.c.toFixed(2)} J/(kg·K)`} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Thermodynamic Steps</p>
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
