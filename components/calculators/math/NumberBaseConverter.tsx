'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Base = '2' | '8' | '10' | '16'

export default function NumberBaseConverter() {
  const [valueStr, setValueStr] = useState('42')
  const [fromBase, setFromBase] = useState<Base>('10')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, bin: '', oct: '', dec: '', hex: '', steps: [] as string[] }
    if (!valueStr.trim()) return { ...defaultObj, error: 'Please enter a value.' }

    try {
      const parsed = parseInt(valueStr, parseInt(fromBase))
      if (isNaN(parsed)) return { ...defaultObj, error: 'Invalid digits for the selected base.' }

      return {
        error: null,
        bin: parsed.toString(2),
        oct: parsed.toString(8),
        dec: parsed.toString(10),
        hex: parsed.toString(16).toUpperCase(),
        steps: [
          `Parsed Base ${fromBase} Input: "${valueStr}" → Decimal ${parsed}`,
          `Binary (Base 2): ${parsed.toString(2)}`,
          `Octal (Base 8): ${parsed.toString(8)}`,
          `Hexadecimal (Base 16): ${parsed.toString(16).toUpperCase()}`
        ]
      }
    } catch (e) {
      return { ...defaultObj, error: 'Conversion error.' }
    }
  }, [valueStr, fromBase])

  return (
    <FormCalculatorShell title="Number Base Converter" subtitle="Convert numerical values between Binary, Octal, Decimal, and Hexadecimal" badge="MATH">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Input Base"
            value={fromBase}
            onChange={(val) => setFromBase(val as Base)}
            id="nbc-base"
            options={[
              { value: '2', label: 'Binary (Base 2)' },
              { value: '8', label: 'Octal (Base 8)' },
              { value: '10', label: 'Decimal (Base 10)' },
              { value: '16', label: 'Hexadecimal (Base 16)' }
            ]}
          />
          <RetroInput label="Number Value" value={valueStr} onChange={setValueStr} id="nbc-val" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Decimal (Base 10)" value={results.dec} large />
                <ResultDisplay label="Binary (Base 2)" value={results.bin} />
                <ResultDisplay label="Hexadecimal (Base 16)" value={results.hex} />
                <ResultDisplay label="Octal (Base 8)" value={results.oct} />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white/60">
                <p className="border-b border-neutral-200 px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-neutral-600 font-mono">Calculations</p>
                <div className="p-3 bg-neutral-50/50 space-y-1.5 font-mono text-xs text-neutral-800">
                  {results.steps.map((s, i) => <div key={i}>[{i + 1}] {s}</div>)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>
          )}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
