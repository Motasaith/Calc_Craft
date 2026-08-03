'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PaverCalculator() {
  const [areaStr, setAreaStr] = useState('200') // sq ft
  const [paverWStr, setPaverWStr] = useState('4') // inches
  const [paverLStr, setPaverLStr] = useState('8') // inches

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, count: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const pw = parseFloat(paverWStr)
    const pl = parseFloat(paverLStr)
    if (isNaN(a) || isNaN(pw) || isNaN(pl) || a <= 0 || pw <= 0 || pl <= 0) return { ...defaultObj, error: 'Please enter valid positive dimensions.' }
    const paverSqFt = (pw * pl) / 144
    const count = a / paverSqFt
    return {
      error: null,
      count: Math.ceil(count),
      steps: [
        `One Paver Area = (${pw} × ${pl}) / 144 = ${paverSqFt.toFixed(4)} sq ft`,
        `Total Pavers Needed = Area / Paver Area = ${Math.ceil(count)} pavers`
      ]
    }
  }, [areaStr, paverWStr, paverLStr])

  return (
    <FormCalculatorShell title="Patio Paver Solver" subtitle="Calculate pavers needed for patios and walkways" badge="LANDSCAPING">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Patio Area (sq ft)" value={areaStr} onChange={setAreaStr} id="pav-a" />
          <RetroInput label="Paver Width (inches)" value={paverWStr} onChange={setPaverWStr} id="pav-w" />
          <RetroInput label="Paver Length (inches)" value={paverLStr} onChange={setPaverLStr} id="pav-l" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Pavers Needed" value={results.count.toString()} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
