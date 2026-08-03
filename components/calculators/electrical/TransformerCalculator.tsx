'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function TransformerCalculator() {
  const [priVoltsStr, setPriVoltsStr] = useState('240')
  const [secVoltsStr, setSecVoltsStr] = useState('120')
  const [priTurnsStr, setPriTurnsStr] = useState('500')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, secTurns: 0 }
    const vp = parseFloat(priVoltsStr)
    const vs = parseFloat(secVoltsStr)
    const np = parseFloat(priTurnsStr)

    if (isNaN(vp) || isNaN(vs) || isNaN(np) || vp <= 0 || vs <= 0 || np <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }

    // Turns Ratio: Ns / Np = Vs / Vp => Ns = Np * Vs / Vp
    const secTurns = np * (vs / vp)
    return { error: null, secTurns }
  }, [priVoltsStr, secVoltsStr, priTurnsStr])

  return (
    <FormCalculatorShell title="Transformer Coil Turns Solver" subtitle="Calculate secondary coil turns from turns ratios" badge="ELECTRICAL">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Primary Voltage (Vp)" value={priVoltsStr} onChange={setPriVoltsStr} id="tr-vp" />
          <RetroInput label="Secondary Voltage (Vs)" value={secVoltsStr} onChange={setSecVoltsStr} id="tr-vs" />
          <RetroInput label="Primary Coil Turns (Np)" value={priTurnsStr} onChange={setPriTurnsStr} id="tr-np" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Secondary Coil Turns Required" value={results.secTurns.toFixed(0)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
