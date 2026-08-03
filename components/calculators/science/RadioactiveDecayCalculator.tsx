'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function RadioactiveDecayCalculator() {
  const [initialStr, setInitialStr] = useState('100') // quantity N0
  const [halfLifeStr, setHalfLifeStr] = useState('8') // days T
  const [timeStr, setTimeStr] = useState('24') // days t

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, remaining: 0, steps: [] as string[] }
    const n0 = parseFloat(initialStr)
    const T = parseFloat(halfLifeStr)
    const t = parseFloat(timeStr)

    if (isNaN(n0) || isNaN(T) || isNaN(t) || n0 <= 0 || T <= 0 || t < 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    const remaining = n0 * Math.pow(0.5, t / T)

    return {
      error: null,
      remaining,
      steps: [
        `Formula: N(t) = N₀ × (1/2)^(t / T)`,
        `Elapsed half-lives = ${t} / ${T} = ${(t / T).toFixed(4)}`,
        `N(${t}) = ${n0} × 0.5^(${(t / T).toFixed(2)}) = dots = ${remaining.toFixed(4)}`
      ]
    }
  }, [initialStr, halfLifeStr, timeStr])

  return (
    <FormCalculatorShell title="Radioactive Decay Solver" subtitle="Calculate remaining quantity of radioactive isotopes" badge="SCIENCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Initial Quantity (N₀)" value={initialStr} onChange={setInitialStr} id="rd-n0" />
          <RetroInput label="Isotope Half-Life (T)" value={halfLifeStr} onChange={setHalfLifeStr} id="rd-hl" />
          <RetroInput label="Elapsed Time (t)" value={timeStr} onChange={setTimeStr} id="rd-t" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Remaining Quantity" value={results.remaining.toFixed(4)} large />
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
