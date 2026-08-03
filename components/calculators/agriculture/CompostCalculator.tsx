'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function CompostCalculator() {
  const [brownsStr, setBrownsStr] = useState('30') // dry leaves, cardboard (parts)
  const [greensStr, setGreensStr] = useState('10') // kitchen waste, fresh grass (parts)

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, ratio: '', feedback: '', steps: [] as string[] }
    const b = parseFloat(brownsStr)
    const g = parseFloat(greensStr)
    if (isNaN(b) || isNaN(g) || b <= 0 || g <= 0) return { ...defaultObj, error: 'Please enter valid positive weights/ratios.' }
    const ratioVal = b / g
    let feedback = 'Excellent compost balance! Carbon-nitrogen ratio is optimal.'
    if (ratioVal > 4) feedback = 'Too dry/brown. Add more greens (nitrogen) to speed up composting.'
    else if (ratioVal < 2) feedback = 'Too wet/green. Add more browns (carbon) to prevent odors and soggy piles.'
    return {
      error: null,
      ratio: `${ratioVal.toFixed(1)} : 1`,
      feedback,
      steps: [
        `Target Carbon-to-Nitrogen (C:N) ratio is 25:1 to 30:1 in raw atoms, roughly 3:1 in volume terms.`,
        `Input Browns-to-Greens ratio = ${b} / ${g} = ${ratioVal.toFixed(1)} : 1`
      ]
    }
  }, [brownsStr, greensStr])

  return (
    <FormCalculatorShell title="Compost Carbon:Nitrogen Solver" subtitle="Optimize the brown and green organic matter ratio in compost piles" badge="AGRICULTURE">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Browns (Carbon) - dry leaves, straw (volume)" value={brownsStr} onChange={setBrownsStr} id="comp-b" />
          <RetroInput label="Greens (Nitrogen) - fruit peels, fresh grass (volume)" value={greensStr} onChange={setGreensStr} id="comp-g" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultDisplay label="Browns:Greens Ratio" value={results.ratio} large />
                <ResultDisplay label="Soil Recommendation" value={results.feedback} />
              </div>
            </>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
