'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ShoeSizeConverter() {
  const [usStr, setUsStr] = useState('9')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, uk: 0, eu: 0 }
    const us = parseFloat(usStr)
    if (isNaN(us) || us <= 0) return { ...defaultObj, error: 'Please enter a valid US size.' }
    // Simple men size mapping approximations
    const uk = us - 1
    const eu = us + 33 // approx
    return { error: null, uk, eu }
  }, [usStr])

  return (
    <FormCalculatorShell title="International Shoe Size Converter" subtitle="Convert US shoe sizes to European and UK standards" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="US Mens Size" value={usStr} onChange={setUsStr} id="ssc-us" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="UK Equivalent" value={results.uk.toString()} />
              <ResultDisplay label="EU Equivalent" value={results.eu.toString()} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
