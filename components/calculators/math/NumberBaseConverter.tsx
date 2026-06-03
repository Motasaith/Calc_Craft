'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'

export default function NumberBaseConverter() {
  const [value, setValue] = useState('')
  const [fromBase, setFromBase] = useState('10')
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState('')

  const bases = [
    { value: '2', label: 'Binary (2)' },
    { value: '8', label: 'Octal (8)' },
    { value: '10', label: 'Decimal (10)' },
    { value: '16', label: 'Hexadecimal (16)' },
  ]

  const calculate = () => {
    setError(''); setResult(null)
    if (!value.trim()) { setError('Enter a value'); return }
    const base = parseInt(fromBase)
    const parsed = parseInt(value, base)
    if (isNaN(parsed)) { setError(`Invalid number for base ${base}`); return }

    setResult({
      Binary: parsed.toString(2),
      Octal: parsed.toString(8),
      Decimal: parsed.toString(10),
      Hexadecimal: parsed.toString(16).toUpperCase(),
    })
  }

  return (
    <FormCalculatorShell title="Number Base Converter" badge="MATH">
      <RetroSelect label="From Base" value={fromBase} onChange={setFromBase} options={bases} id="base-from" />
      <RetroInput label="Value" value={value} onChange={setValue} type="text" placeholder="e.g. 255 or FF" id="base-val" />
      <RetroActionButton onClick={calculate} variant="primary" fullWidth>Convert</RetroActionButton>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && (
        <div className="mt-4 grid gap-2">
          {Object.entries(result).map(([k, v]) => (
            <ResultDisplay key={k} label={k} value={v} />
          ))}
        </div>
      )}
    </FormCalculatorShell>
  )
}
