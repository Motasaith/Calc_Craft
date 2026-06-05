'use client'

import React, { useState } from 'react'
import FormCalculatorShell, { RetroInput, RetroSelect, ResultDisplay, RetroActionButton } from '../shared/FormCalculatorShell'
import { evaluate } from '@/lib/calc-engine'

export default function LogarithmCalculator() {
  const [value, setValue] = useState('')
  const [base, setBase] = useState('e')
  const [customBase, setCustomBase] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState('')

  const calculate = () => {
    ;(async () => {
      setError(''); setResult(null)
      const v = parseFloat(value)
      if (isNaN(v) || v <= 0) { setError('Value must be a positive number'); return }

      try {
        let expr = ''
        if (base === 'e') expr = `log(${v})`
        else if (base === '10') expr = `log10(${v})`
        else if (base === '2') expr = `log2(${v})`
        else {
          const b = parseFloat(customBase)
          if (isNaN(b) || b <= 0 || b === 1) { setError('Base must be positive and ≠ 1'); return }
          expr = `log(${v}, ${b})`
        }
        const res = await evaluate(expr)
        if (!res.ok) { setError(res.error); return }
        setResult(res.formatted)
      } catch (err) { setError('Error') }
    })()
  }

  return (
    <FormCalculatorShell title="Logarithm Calculator" badge="MATH">
      <RetroSelect label="Base" value={base} onChange={setBase} id="log-base"
        options={[{ value: 'e', label: 'Natural (ln, base e)' }, { value: '10', label: 'Common (log₁₀)' }, { value: '2', label: 'Binary (log₂)' }, { value: 'custom', label: 'Custom Base' }]} />
      {base === 'custom' && <RetroInput label="Custom Base" value={customBase} onChange={setCustomBase} placeholder="e.g. 5" id="log-custom" />}
      <RetroInput label="Value" value={value} onChange={setValue} placeholder="e.g. 100" id="log-val" />
      <div className="mt-4"><RetroActionButton onClick={calculate} variant="primary" fullWidth>Calculate</RetroActionButton></div>
      {error && <div className="mt-3 text-xs font-mono text-red-600 text-center font-bold">{error}</div>}
      {result && <div className="mt-4"><ResultDisplay label={`log${base === 'custom' ? customBase : base === 'e' ? 'ₑ' : base === '10' ? '₁₀' : '₂'}(${value})`} value={result} large /></div>}
    </FormCalculatorShell>
  )
}
