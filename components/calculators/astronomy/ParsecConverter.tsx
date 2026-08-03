'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ParsecConverter() {
  const [valStr, setValStr] = useState('1')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ly: 0, au: 0, km: 0 }
    const pc = parseFloat(valStr)
    if (isNaN(pc) || pc < 0) return { ...defaultObj, error: 'Please enter a valid parsec value.' }
    const ly = pc * 3.26156
    const au = pc * 206265
    const km = pc * 3.0857e13
    return { error: null, ly, au, km }
  }, [valStr])

  return (
    <FormCalculatorShell title="Parsec Converter" subtitle="Convert parsecs to light years, AU, and km" badge="ASTRONOMY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Parsecs (pc)" value={valStr} onChange={setValStr} id="pc-v" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-3 gap-2">
              <ResultDisplay label="Light Years" value={results.ly.toFixed(4)} />
              <ResultDisplay label="AU" value={results.au.toLocaleString()} />
              <ResultDisplay label="km" value={results.km.toExponential(4)} />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
