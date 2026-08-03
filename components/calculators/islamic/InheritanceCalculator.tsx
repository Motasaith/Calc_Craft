'use client'
import React, { useMemo, useState } from 'react'
import FormCalculatorShell, { RetroInput, ResultDisplay } from '../shared/FormCalculatorShell'

export default function InheritanceCalculator() {
  const [estateStr, setEstateStr] = useState('100000')

  const results = useMemo(() => {
    const defaultObj = { error: null as string | null, wifeShare: 0, childrenShare: 0 }
    const estate = parseFloat(estateStr)
    if (isNaN(estate) || estate <= 0) return { ...defaultObj, error: 'Please enter valid estate values.' }
    // Simple Shariah case: Wife gets 1/8 (12.5%), children split the rest
    const wifeShare = estate * 0.125
    const childrenShare = estate * 0.875
    return { error: null, wifeShare, childrenShare }
  }, [estateStr])

  return (
    <FormCalculatorShell title="Islamic Inheritance Shares Solver" subtitle="Estimate basic Shariah inheritance portions for surviving wife and children" badge="ISLAMIC">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[5fr_7fr] lg:gap-8">
        <div className="space-y-4">
          <RetroInput label="Total Net Estate Value ($)" value={estateStr} onChange={setEstateStr} id="inh-e" />
        </div>
        <div className="min-h-[440px] space-y-4">
          {!results.error ? (
            <div className="grid grid-cols-2 gap-3">
              <ResultDisplay label="Wife Share (1/8)" value={results.wifeShare.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} />
              <ResultDisplay label="Children Share (Residual)" value={results.childrenShare.toLocaleString(undefined, {style: 'currency', currency: 'USD'})} large />
            </div>
          ) : <div className="text-neutral-500 font-mono p-6 text-center">{results.error}</div>}
        </div>
      </div>
    </FormCalculatorShell>
  )
}
