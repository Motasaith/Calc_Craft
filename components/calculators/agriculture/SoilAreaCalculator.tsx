'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function SoilAreaCalculator() {
  const [widthStr, setWidthStr] = useState('20')
  const [lengthStr, setLengthStr] = useState('10')
  const [depthStr, setDepthStr] = useState('3') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cubicYards: 0, steps: [] as string[] }
    const w = parseFloat(widthStr)
    const l = parseFloat(lengthStr)
    const d = parseFloat(depthStr)
    if (isNaN(w) || isNaN(l) || isNaN(d) || w <= 0 || l <= 0 || d <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const sqFt = w * l
    const cubicFeet = sqFt * (d / 12)
    const cubicYards = cubicFeet / 27
    return {
      error: null,
      cubicYards,
      steps: [
        `Area = ${w} × ${l} = ${sqFt} sq ft`,
        `Volume = ${sqFt} × (${d}/12) = ${cubicFeet.toFixed(2)} cu ft`,
        `Cubic Yards = Volume / 27 = ${cubicYards.toFixed(2)} cubic yards`
      ]
    }
  }, [widthStr, lengthStr, depthStr])

  return (
    <FormCalculatorShell title="Soil Volume & Area Solver" subtitle="Calculate soil/mulch cubic yards needed" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Width (ft)" value={widthStr} onChange={setWidthStr} id="soil-w" />
          <RetroInput label="Length (ft)" value={lengthStr} onChange={setLengthStr} id="soil-l" />
          <RetroInput label="Soil Depth (inches)" value={depthStr} onChange={setDepthStr} id="soil-d" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Soil Needed (Cubic Yards)" value={results.cubicYards.toFixed(2)} large />
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
