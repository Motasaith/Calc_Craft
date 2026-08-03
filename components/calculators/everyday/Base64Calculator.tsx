'use client'

import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'encode' | 'decode'

export default function Base64Calculator() {
  const [mode, setMode] = useState<Mode>('encode')
  const [inputVal, setInputVal] = useState('Hello World!')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, output: '', steps: [] as string[] }
    if (!inputVal) return { ...defaultObj, error: 'Please enter an input string.' }

    let output = ''
    let steps: string[] = []

    try {
      if (mode === 'encode') {
        output = btoa(inputVal)
        steps = [
          `Input string: "${inputVal}"`,
          `Binary representation parsed`,
          `Base64 output: "${output}"`
        ]
      } else {
        output = atob(inputVal)
        steps = [
          `Input Base64 string: "${inputVal}"`,
          `Decoding character sets...`,
          `Decoded output: "${output}"`
        ]
      }
    } catch (e) {
      return { ...defaultObj, error: 'Invalid string or format for decoding/encoding.' }
    }

    return {
      error: null,
      output,
      steps
    }
  }, [mode, inputVal])

  return (
    <FormCalculatorShell title="Base64 Encoder & Decoder" subtitle="Convert normal strings to Base64 formats and vice versa" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Operation"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="b64-mode"
            options={[
              { value: 'encode', label: 'Encode String → Base64' },
              { value: 'decode', label: 'Decode Base64 → String' }
            ]}
          />
          <RetroInput label="Input String" value={inputVal} onChange={setInputVal} id="b64-input" />
        </div>

        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <ResultDisplay label="Output Result" value={results.output} large />
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
