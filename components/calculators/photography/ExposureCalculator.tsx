'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function ExposureCalculator() {
  const [apertureStr, setApertureStr] = useState('8')
  const [shutterStr, setShutterStr] = useState('0.008') // 1/125s
  const [isoStr, setIsoStr] = useState('100')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ev: 0 }
    const n = parseFloat(apertureStr)
    const t = parseFloat(shutterStr)
    const s = parseFloat(isoStr)
    if (isNaN(n) || isNaN(t) || isNaN(s) || n <= 0 || t <= 0 || s <= 0) {
      return { ...defaultObj, error: 'Please enter valid positive values.' }
    }
    // EV100 = log2(N^2 / t) - log2(S / 100)
    const ev = Math.log2((n * n) / t) - Math.log2(s / 100)
    return { error: null, ev }
  }, [apertureStr, shutterStr, isoStr])

  return (
    <FormCalculatorShell title="Exposure Value EV Calculator" subtitle="Solve ISO, shutter speed, and aperture balances" badge="PHOTOGRAPHY">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Aperture (f-number)" value={apertureStr} onChange={setApertureStr} id="exp-n" />
          <RetroInput label="Shutter Speed (sec)" value={shutterStr} onChange={setShutterStr} id="exp-t" />
          <RetroInput label="ISO Speed" value={isoStr} onChange={setIsoStr} id="exp-s" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Exposure Value (EV100)" value={results.ev.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
