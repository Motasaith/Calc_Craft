'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HeightConverter() {
  const [feetStr, setFeetStr] = useState('5')
  const [inchesStr, setInchesStr] = useState('9')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, cm: 0 }
    const f = parseFloat(feetStr)
    const i = parseFloat(inchesStr)

    if (isNaN(f) || isNaN(i) || f < 0 || i < 0) {
      return { ...defaultObj, error: 'Please enter valid heights.' }
    }

    const totalInches = f * 12 + i
    const cm = totalInches * 2.54

    return { error: null, cm }
  }, [feetStr, inchesStr])

  return (
    <FormCalculatorShell title="Height Converter (ft/in → cm)" subtitle="Convert heights to metric centimeter formats" badge="EVERYDAY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <RetroInput label="Feet" value={feetStr} onChange={setFeetStr} id="hc-f" />
            <RetroInput label="Inches" value={inchesStr} onChange={setInchesStr} id="hc-i" />
          </div>
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Height in Metric" value={`${results.cm.toFixed(1)} cm`} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
