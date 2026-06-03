'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function PercentageCalculator() {
  const [mode, setMode] = useState<'of' | 'change' | 'isWhat'>('of')
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const a = parseFloat(val1), b = parseFloat(val2)
    if (isNaN(a) || isNaN(b)) { setResult('Enter valid numbers'); return }
    let r = 0
    switch (mode) {
      case 'of': r = (a / 100) * b; setResult(`${a}% of ${b} = ${parseFloat(r.toFixed(8))}`); break
      case 'change':
        if (a === 0) { setResult('Original value cannot be 0'); return }
        r = ((b - a) / Math.abs(a)) * 100
        setResult(`Change: ${parseFloat(r.toFixed(4))}% (${r >= 0 ? 'increase' : 'decrease'})`)
        break
      case 'isWhat':
        if (b === 0) { setResult('Total cannot be 0'); return }
        r = (a / b) * 100
        setResult(`${a} is ${parseFloat(r.toFixed(4))}% of ${b}`)
        break
    }
  }

  const modes = [
    { key: 'of' as const, label: 'X% of Y' },
    { key: 'change' as const, label: '% Change' },
    { key: 'isWhat' as const, label: 'X is what % of Y' },
  ]

  return (
    <FormCalculatorShell title="Percentage Calculator" badge="MATH">
      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 bg-neutral-200 p-1 rounded-lg border border-neutral-300">
        {modes.map((m) => (
          <button key={m.key} onClick={() => { setMode(m.key); setResult(null) }}
            className={`flex-1 py-1.5 text-[10px] font-bold font-mono rounded-md transition-all ${mode === m.key ? 'bg-[#fcfbfa] shadow text-neutral-800 border border-neutral-300' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'of' && (
        <>
          <RetroInput label="Percentage (%)" value={val1} onChange={setVal1} placeholder="e.g. 25" id="pct-percent" unit="%" />
          <RetroInput label="Of Value" value={val2} onChange={setVal2} placeholder="e.g. 200" id="pct-value" />
        </>
      )}
      {mode === 'change' && (
        <>
          <RetroInput label="Original Value" value={val1} onChange={setVal1} placeholder="e.g. 100" id="pct-original" />
          <RetroInput label="New Value" value={val2} onChange={setVal2} placeholder="e.g. 125" id="pct-new" />
        </>
      )}
      {mode === 'isWhat' && (
        <>
          <RetroInput label="Part Value" value={val1} onChange={setVal1} placeholder="e.g. 50" id="pct-part" />
          <RetroInput label="Total Value" value={val2} onChange={setVal2} placeholder="e.g. 200" id="pct-total" />
        </>
      )}

      <div className="mt-4">
        <RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton>
      </div>

      {result && (
        <div className="mt-4">
          <ResultDisplay label="Result" value={result} large />
        </div>
      )}
    </FormCalculatorShell>
  )
}
