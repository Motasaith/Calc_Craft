'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function PesticideCalculator() {
  const [areaStr, setAreaStr] = useState('1000') // sq ft
  const [dilutionStr, setDilutionStr] = useState('2') // oz per gallon
  const [waterRateStr, setWaterRateStr] = useState('1') // gallons water per 1000 sq ft

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, chemicalNeeded: 0, steps: [] as string[] }
    const a = parseFloat(areaStr)
    const d = parseFloat(dilutionStr)
    const w = parseFloat(waterRateStr)
    if (isNaN(a) || isNaN(d) || isNaN(w) || a <= 0 || d <= 0 || w <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const totalWater = (a / 1000) * w
    const chemicalNeeded = totalWater * d
    return {
      error: null,
      chemicalNeeded,
      steps: [
        `Water Required = (Area / 1000) × Water Rate = ${totalWater.toFixed(2)} gallons`,
        `Chemical Concentrate Needed = Water Required × Dilution Rate = ${chemicalNeeded.toFixed(2)} fl oz`
      ]
    }
  }, [areaStr, dilutionStr, waterRateStr])

  return (
    <FormCalculatorShell title="Pesticide Dilution Solver" subtitle="Calculate chemical concentrate volume for field spraying" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Spray Area (sq ft)" value={areaStr} onChange={setAreaStr} id="pest-a" />
          <RetroInput label="Concentrate Rate (oz per Gallon)" value={dilutionStr} onChange={setDilutionStr} id="pest-d" />
          <RetroInput label="Water spray rate (gallons per 1000 sq ft)" value={waterRateStr} onChange={setWaterRateStr} id="pest-w" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Concentrate Needed (fl oz)" value={results.chemicalNeeded.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
