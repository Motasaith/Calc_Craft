'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function WireSizeCalculator() {
  const [ampsStr, setAmpsStr] = useState('20')
  const [lengthStr, setLengthStr] = useState('50') // feet

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, awg: '', steps: [] as string[] }
    const a = parseFloat(ampsStr)
    const l = parseFloat(lengthStr)
    if (isNaN(a) || isNaN(l) || a <= 0 || l <= 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    // Very simple AWG guideline for 120V with 3% voltage drop limit
    let awg = '14 AWG'
    if (a > 15 && a <= 20) awg = '12 AWG'
    else if (a > 20 && a <= 30) awg = '10 AWG'
    else if (a > 30 && a <= 50) awg = '8 AWG'
    else if (a > 50) awg = '6 AWG or larger'
    return {
      error: null,
      awg,
      steps: [
        `Standard conductor guidelines (NEC 3% voltage drop limit)`,
        `Current = ${a} A | Distance = ${l} ft`,
        `Recommended Wire size = ${awg}`
      ]
    }
  }, [ampsStr, lengthStr])

  return (
    <FormCalculatorShell title="Electrical Wire Size Solver" subtitle="Calculate target AWG wire gauges for circuit loads" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Circuit Amps" value={ampsStr} onChange={setAmpsStr} id="ws-a" />
          <RetroInput label="One-way Distance (feet)" value={lengthStr} onChange={setLengthStr} id="ws-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Recommended Gauge" value={results.awg} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
