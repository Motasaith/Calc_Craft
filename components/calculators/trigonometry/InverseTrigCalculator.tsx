'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'arcsin' | 'arccos' | 'arctan'

export default function InverseTrigCalculator() {
  const [mode, setMode] = useState<Mode>('arcsin')
  const [valStr, setValStr] = useState('0.5')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      rad: 0,
      deg: 0,
      steps: [] as string[]
    }

    const v = parseFloat(valStr)
    if (isNaN(v)) {
      return { ...defaultObj, error: 'Please enter a valid numeric value.' }
    }

    if ((mode === 'arcsin' || mode === 'arccos') && (v < -1 || v > 1)) {
      return { ...defaultObj, error: 'Input domain must be between -1 and 1 for arcsin/arccos.' }
    }

    let rad = 0
    if (mode === 'arcsin') rad = Math.asin(v)
    else if (mode === 'arccos') rad = Math.acos(v)
    else rad = Math.atan(v)

    const deg = rad * 180 / Math.PI
    const steps = [
      `Function: ${mode}(x)`,
      `Input domain check: Passed`,
      `Output angle = ${rad.toFixed(6)} rad (${deg.toFixed(4)}°)`
    ]

    return {
      error: null,
      rad,
      deg,
      steps
    }
  }, [mode, valStr])

  return (
    <FormCalculatorShell title="Inverse Trig Calculator" subtitle="Solve inverse trigonometric functions (arcsin, arccos, arctan)" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Function"
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            id="inv-trig-mode"
            options={[
              { value: 'arcsin', label: 'arcsin (sin⁻¹)' },
              { value: 'arccos', label: 'arccos (cos⁻¹)' },
              { value: 'arctan', label: 'arctan (tan⁻¹)' }
            ]}
          />
          <RetroInput label="Input value (x)" value={valStr} onChange={setValStr} id="inv-trig-v" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Output (Radians)" value={results.rad.toFixed(6)} large />
                <ResultDisplay label="Output (Degrees)" value={`${results.deg.toFixed(4)}°`} large />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Mathematical Steps</p>
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
