'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function HayYieldCalculator() {
  const [balesCountStr, setBalesCountStr] = useState('50')
  const [baleWeightStr, setBaleWeightStr] = useState('60') // lbs

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, totalTons: 0, steps: [] as string[] }
    const bc = parseFloat(balesCountStr)
    const bw = parseFloat(baleWeightStr)
    if (isNaN(bc) || isNaN(bw) || bc <= 0 || bw <= 0) return { ...defaultObj, error: 'Please enter valid positive values.' }
    const totalLbs = bc * bw
    const totalTons = totalLbs / 2000
    return {
      error: null,
      totalTons,
      steps: [
        `Total lbs = Bales count × Bale weight = ${bc} × ${bw} = ${totalLbs} lbs`,
        `Total Tons = Total lbs / 2000 = ${totalTons.toFixed(2)} tons`
      ]
    }
  }, [balesCountStr, baleWeightStr])

  return (
    <FormCalculatorShell title="Hay Yield Solver" subtitle="Calculate total hay tons harvested" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Bales Count" value={balesCountStr} onChange={setBalesCountStr} id="hay-bc" />
          <RetroInput label="Average Bale Weight (lbs)" value={baleWeightStr} onChange={setBaleWeightStr} id="hay-bw" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <ResultDisplay label="Total Harvest (Tons)" value={results.totalTons.toFixed(2)} large />
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
