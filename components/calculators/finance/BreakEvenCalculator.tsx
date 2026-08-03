'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function BreakEvenCalculator() {
  const [fixedStr, setFixedStr] = useState('5000')
  const [variableStr, setVariableStr] = useState('10')
  const [priceStr, setPriceStr] = useState('25')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, units: 0 }
    const f = parseFloat(fixedStr)
    const v = parseFloat(variableStr)
    const p = parseFloat(priceStr)
    if (isNaN(f) || isNaN(v) || isNaN(p) || f < 0 || v < 0 || p <= 0) return { ...defaultObj, error: 'Please enter valid parameters.' }
    if (p <= v) return { ...defaultObj, error: 'Selling price must exceed variable costs to break even.' }
    const units = f / (p - v)
    return { error: null, units }
  }, [fixedStr, variableStr, priceStr])

  return (
    <FormCalculatorShell title="Break-Even Solver" subtitle="Calculate units needed to cover operational fixed costs" badge="FINANCE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Fixed Costs ($)" value={fixedStr} onChange={setFixedStr} id="be-f" />
          <RetroInput label="Variable Cost per Unit ($)" value={variableStr} onChange={setVariableStr} id="be-v" />
          <RetroInput label="Selling Price per Unit ($)" value={priceStr} onChange={setPriceStr} id="be-p" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Break-Even Units" value={Math.ceil(results.units).toLocaleString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
