'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay, RetroSelect } from '../shared/FormCalculatorShell'

type Mode = 'encode' | 'decode'

export default function UrlEncodeCalculator() {
  const [mode, setMode] = useState<Mode>('encode')
  const [inputVal, setInputVal] = useState('https://example.com/?q=hello world')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, output: '' }
    if (!inputVal) return { ...defaultObj, error: 'Please enter a string.' }
    try {
      const output = mode === 'encode' ? encodeURIComponent(inputVal) : decodeURIComponent(inputVal)
      return { error: null, output }
    } catch (e) {
      return { ...defaultObj, error: 'Failed to encode or decode string.' }
    }
  }, [mode, inputVal])

  return (
    <FormCalculatorShell title="URL Encoder & Decoder" subtitle="Convert URL string arguments safely" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroSelect
            label="Operation"
            value={mode}
            onChange={(val) => setMode(val as Mode)}
            id="url-mode"
            options={[{ value: 'encode', label: 'Encode' }, { value: 'decode', label: 'Decode' }]}
          />
          <RetroInput label="Input String" value={inputVal} onChange={setInputVal} id="url-input" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Output Result" value={results.output} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
