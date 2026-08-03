'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BtuCalculator() {
  const [widthStr, setWidthStr] = useState('15') // feet
  const [lengthStr, setLengthStr] = useState('20') // feet
  const [heightStr, setHeightStr] = useState('8') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, btu: 0, steps: [] as string[] }
    const w = parseFloat(widthStr)
    const l = parseFloat(lengthStr)
    const h = parseFloat(heightStr)
    if (isNaN(w) || isNaN(l) || isNaN(h) || w <= 0 || l <= 0 || h <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    // General cooling rule: Cubic Volume * 20 BTU per cubic foot
    const cubicFeet = w * l * h
    const btu = cubicFeet * 20
    return {
      error: null,
      btu,
      steps: [
        `Volume = ${w} × ${l} × ${h} = ${cubicFeet.toFixed(1)} cu ft`,
        `Required Cooling = Volume × 20 BTU/cu ft = ${btu.toLocaleString()} BTU/hr`
      ]
    }
  }, [widthStr, lengthStr, heightStr])

  return (
    <FormCalculatorShell title="BTU Heating/Cooling Solver" subtitle="Calculate air conditioning or heating BTU demands for a room" badge="MISCELLANEOUS">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Room Width (feet)" value={widthStr} onChange={setWidthStr} id="btu-w" />
          <RetroInput label="Room Length (feet)" value={lengthStr} onChange={setLengthStr} id="btu-l" />
          <RetroInput label="Ceiling Height (feet)" value={heightStr} onChange={setHeightStr} id="btu-h" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Cooling Needed" value={`${results.btu.toLocaleString()} BTU/hr`} large />
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
