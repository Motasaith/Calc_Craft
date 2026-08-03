'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PrintSizeCalculator() {
  const [pixelsStr, setPixelsStr] = useState('3000')
  const [ppiStr, setPPIStr] = useState('300')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, inches: 0, cm: 0 }
    const p = parseFloat(pixelsStr)
    const ppi = parseFloat(ppiStr)
    if (isNaN(p) || isNaN(ppi) || p <= 0 || ppi <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const inches = p / ppi
    const cm = inches * 2.54
    return { error: null, inches, cm }
  }, [pixelsStr, ppiStr])

  return (
    <FormCalculatorShell title="Print Size Calculator" subtitle="Solve output print dimensions from DPI/PPI resolutions" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Pixels Count" value={pixelsStr} onChange={setPixelsStr} id="pr-p" />
          <RetroInput label="DPI / PPI value" value={ppiStr} onChange={setPPIStr} id="pr-ppi" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Width (inches)" value={results.inches.toFixed(2)} large />
              <ResultDisplay label="Width (cm)" value={results.cm.toFixed(2)} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
