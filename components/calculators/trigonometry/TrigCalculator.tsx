'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

export default function TrigCalculator() {
  const [valStr, setValStr] = useState('30')
  const [unit, setUnit] = useState<'deg' | 'rad'>('deg')

  const results = useMemo(() => {
    const defaultObj = {
      error: null as string | null,
      sin: 0, cos: 0, tan: 0,
      sec: 0, csc: 0, cot: 0,
      steps: [] as string[]
    }

    const val = parseFloat(valStr)
    if (isNaN(val)) {
      return { ...defaultObj, error: 'Please enter a valid angle value.' }
    }

    const rad = unit === 'deg' ? val * Math.PI / 180 : val
    const sinVal = Math.sin(rad)
    const cosVal = Math.cos(rad)
    const tanVal = Math.abs(cosVal) > 1e-10 ? sinVal / cosVal : Infinity
    const secVal = Math.abs(cosVal) > 1e-10 ? 1 / cosVal : Infinity
    const cscVal = Math.abs(sinVal) > 1e-10 ? 1 / sinVal : Infinity
    const cotVal = Math.abs(sinVal) > 1e-10 ? cosVal / sinVal : Infinity

    const steps = [
      `Angle in Radians = ${rad.toFixed(6)} rad`,
      `sin(θ) = ${sinVal.toFixed(6)}`,
      `cos(θ) = ${cosVal.toFixed(6)}`,
      `tan(θ) = ${tanVal === Infinity ? 'Undefined' : tanVal.toFixed(6)}`
    ]

    return {
      error: null,
      sin: sinVal,
      cos: cosVal,
      tan: tanVal,
      sec: secVal,
      csc: cscVal,
      cot: cotVal,
      steps
    }
  }, [valStr, unit])

  return (
    <FormCalculatorShell title="Trig Functions Calculator" subtitle="Compute six basic trigonometric values" badge="TRIGONOMETRY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Angle Unit"
            value={unit}
            onChange={(v) => setUnit(v as 'deg' | 'rad')}
            id="trig-unit"
            options={[{ value: 'deg', label: 'Degrees (°)' }, { value: 'rad', label: 'Radians (rad)' }]}
          />
          <RetroInput label="Angle Value" value={valStr} onChange={setValStr} id="trig-v" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                <ResultDisplay label="sin(θ)" value={results.sin.toFixed(4)} />
                <ResultDisplay label="cos(θ)" value={results.cos.toFixed(4)} />
                <ResultDisplay label="tan(θ)" value={results.tan === Infinity ? 'Undefined' : results.tan.toFixed(4)} />
                <ResultDisplay label="csc(θ)" value={results.csc === Infinity ? 'Undefined' : results.csc.toFixed(4)} />
                <ResultDisplay label="sec(θ)" value={results.sec === Infinity ? 'Undefined' : results.sec.toFixed(4)} />
                <ResultDisplay label="cot(θ)" value={results.cot === Infinity ? 'Undefined' : results.cot.toFixed(4)} />
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
